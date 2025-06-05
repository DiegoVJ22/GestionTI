<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;
use App\Models\Incident;
use App\Models\Solution;
use Illuminate\Support\Facades\Log;

class OpenAIController extends Controller
{
    public function askOpenAI(Incident $incident): JsonResponse
    {
        Log::info("Entrando a askOpenAI con incidente ID: {$incident->id}");

        try {
            $apiKey = config('services.openai.api_key');
            if (!$apiKey) {
                return response()->json([
                    'error' => 'La clave de API de OpenAI no está configurada.'
                ], 500);
            }

            $prompt = "Incidente #{$incident->id}:\n"
                . "Título: {$incident->title}\n"
                . "Descripción: {$incident->description}\n"
                . "Prioridad: {$incident->priority}\n"
                . "Estado: {$incident->status}\n"
                . "Servicio ID: {$incident->service_id}\n"
                . "\n"
                . "Genera un procedimiento paso a paso para resolver este incidente, dirigido a un técnico de soporte TI. La respuesta debe:\n"
                . "- Ser una lista numerada clara y directa\n"
                . "- Incluir entre 5 y 7 pasos concretos\n"
                . "- No dar explicaciones ni justificaciones\n"
                . "- Evitar desarrollar subtítulos\n"
                . "- Cada paso debe ser una frase en imperativo, por ejemplo: 'Verifica conectividad VPN', 'Reinicia el servicio afectado', etc.\n"
                . "\n"
                . "Solo incluye los pasos. No agregues introducciones, resúmenes ni conclusiones.";

            // $response = Http::withHeaders([
            //         'Authorization' => 'Bearer ' . $apiKey,
            //         'Content-Type'  => 'application/json',
            //     ])
            //     ->timeout(30)
            //     ->post('https://api.openai.com/v1/chat/completions', [
            //         'model'    => 'gpt-3.5-turbo', // Puedes cambiar a 'gpt-4' u otro modelo si lo tienes disponible
            //         'messages' => [
            //             [
            //                 'role'    => 'system',
            //                 'content' => 'Eres un asistente experto en soporte TI. Ofreces pasos claros y concisos.'
            //             ],
            //             [
            //                 'role'    => 'user',
            //                 'content' => $prompt,
            //             ],
            //         ],
            //     ]);

            // OPCIÓN B: Especificar el archivo de certificados CA (recomendado)
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type'  => 'application/json',
            ])
            ->withOptions([
                'verify' => storage_path('app/public/cacert.pem'), // Ruta al archivo de certificados
            ])
            ->timeout(30)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model'    => 'gpt-3.5-turbo',
                'messages' => [
                    [
                        'role'    => 'system',
                        'content' => 'Eres un asistente experto en soporte TI. Ofrece pasos claros y concisos.'
                    ],
                    [
                        'role'    => 'user',
                        'content' => $prompt,
                    ],
                ],
            ]);

            Log::info("Respuesta de OpenAI:", $response->json());

            if ($response->failed()) {
                Log::error("Falló la llamada a OpenAI", ['response' => $response->body()]);
                return response()->json([
                    'error'   => 'Error al comunicarse con OpenAI.',
                    'details' => $response->json(),
                ], 500);
            }

            $body = $response->json();

            $recommendation = trim(
                $body['choices'][0]['message']['content']
                    ?? ''
            );

            // Extraer palabras clave (keywords) de la recomendación
            $keywords = $this->extractKeywords($recommendation);

            $solution = Solution::create([
                'incident_id' => $incident->id,
                'steps'       => $recommendation,
                'source'      => 'IA',
                'keywords'    => $keywords,
            ]);

            Log::info("Solución guardada con ID: {$solution->id}");

            $incident = Incident::findOrFail($incident->id);
            $incident->status = 'En Proceso';
            $incident->save();
            Log::info("Estado del incidente actualizado a 'En Proceso' para ID: {$incident->id}");

            return response()->json([
                'solution_id'    => $solution->id,
                'recommendation' => $recommendation,
                'already_exists' => false,
            ]);

        } catch (\Throwable $e) {
            Log::error("Error inesperado en el servidor", ['exception' => $e]);
            return response()->json([
                'error' => 'Error inesperado en el servidor.',
                'details' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Extrae palabras clave de un texto dado.
     *
     * @param string $text
     * @return string
     */
    private function extractKeywords(string $text): string
    {
        // Convertir el texto a minúsculas
        $text = strtolower($text);

        // Eliminar signos de puntuación
        $text = preg_replace('/[^\p{L}\p{N}\s]/u', '', $text);

        // Dividir el texto en palabras
        $words = preg_split('/\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);

        // Eliminar palabras comunes (stop words)
        $stopWords = ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'de', 'del', 'al', 'en', 'y', 'o', 'a', 'que', 'con', 'por', 'para', 'es', 'su', 'se', 'no', 'lo', 'como'];
        $filteredWords = array_diff($words, $stopWords);

        // Contar la frecuencia de cada palabra
        $wordCounts = array_count_values($filteredWords);

        // Ordenar las palabras por frecuencia en orden descendente
        arsort($wordCounts);

        // Tomar las 5 palabras más frecuentes como palabras clave
        $topKeywords = array_slice(array_keys($wordCounts), 0, 5);

        // Devolver las palabras clave como una cadena separada por comas
        return implode(', ', $topKeywords);
    }
}

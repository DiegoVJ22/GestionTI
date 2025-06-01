<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;
use App\Models\Incident;
use App\Models\Solution;
use Illuminate\Support\Facades\Log;

class DeepSeekController extends Controller
{
    public function askChatGPT(Incident $incident): JsonResponse
    {
        Log::info("Entrando a askChatGPT con incidente ID: {$incident->id}");

        try {
            $apiKey = config('services.deepseek.api_key');
            if (!$apiKey) {
                return response()->json([
                    'error' => 'La clave de API de DeepSeek no está configurada.'
                ], 500);
            }

            $prompt = "Incidente #{$incident->id}:\n"
                . "Título: {$incident->title}\n"
                . "Descripción: {$incident->description}\n"
                . "Prioridad: {$incident->priority}\n"
                . "Estado: {$incident->status}\n"
                . "Servicio ID: {$incident->service_id}\n"
                . "\n"
                . "Por favor, genera un procedimiento paso a paso y conciso para resolver este incidente, dirigido a un técnico de soporte TI. La respuesta debe ser directa, sin explicaciones extendidas, y estructurada como una lista numerada con los siguientes puntos principales, adaptando el contenido a cada uno según el incidente:\n"
                . "1. Verificar conectividad VPN\n"
                . "2. Revisar estadísticas de rendimiento\n"
                . "3. Optimizar configuración de almacenamiento\n"
                . "4. Verificar capacidad de procesamiento\n"
                . "5. Optimizar tareas de backup\n"
                . "6. Monitorizar rendimientos\n"
                . "7. Realizar pruebas de rendimiento";

            $response = Http::withHeaders([
                    'Authorization' => 'Bearer ' . $apiKey,
                    'Content-Type'  => 'application/json',
                ])
                ->timeout(30)
                ->post('https://api.deepseek.com/chat/completions', [
                    'model'    => 'deepseek-chat',
                    'messages' => [
                        [
                            'role'    => 'system',
                            'content' => 'Eres un asistente experto en soporte TI. Ofreces pasos claros y concisos.'
                        ],
                        [
                            'role'    => 'user',
                            'content' => $prompt,
                        ],
                    ],
                ]);

            Log::info("Respuesta de DeepSeek:", $response->json());

            if ($response->failed()) {
                Log::error("Falló la llamada a DeepSeek", ['response' => $response->body()]);
                return response()->json([
                    'error'   => 'Error al comunicarse con DeepSeek.',
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

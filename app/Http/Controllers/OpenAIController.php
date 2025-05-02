<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Incident;
use App\Models\Solution;
use GuzzleHttp\Client;
use Illuminate\Http\JsonResponse;

class OpenAIController extends Controller
{

    public function index()
    {
        return view('chat');
    }

    public function askChatGPT(Incident $incident): JsonResponse
    {

        $prompt = "Incidente #{$incident->id}:\n"
            . "Título: {$incident->title}\n"
            . "Descripción: {$incident->description}\n"
            . "Prioridad: {$incident->priority}\n"
            . "Estado: {$incident->status}\n"
            . "Servicio ID: {$incident->service_id}\n"
            . "SLA deadline: {$incident->sla_deadline}\n";

        $client = new Client();
        $response = $client->post('https://api.openai.com/v1/chat/completions', [
            'headers' => [
                'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
                'Content-Type' => 'application/json',
            ],
            'json' => [
                'model' => 'gpt-3.5-turbo',
                'messages' => [
                    ['role' => 'system', 'content' => 'You are an expert IT support assistant. It offers clear and concise steps.'],
                    ['role' => 'user', 'content' =>  $prompt],
                ],
            ],
        ]);
    
        $body = json_decode($response->getBody()->getContents(), true);
        $recommendation = trim($body['choices'][0]['message']['content'] ?? $body['choices'][0]['text'] ?? '');

        $solution = Solution::create([
            'incident_id' => $incident->id,
            'steps'       => $recommendation,
            'source'      => 'IA',
        ]);

        return response()->json([
            'solution_id'    => $solution->id,
            'recommendation' => $recommendation,
        ]);
    }
}

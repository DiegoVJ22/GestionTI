<?php

use App\Http\Controllers\IncidentController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SlaController;
use App\Http\Controllers\OpenAIController;
use App\Http\Controllers\SolutionController;
use App\Models\Service;
use App\Notifications\ServiceCritical;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // ServiceController routes
    Route::get('/services', [ServiceController::class, 'index']);
    Route::get('/services/create', [ServiceController::class, 'create']);
    Route::post('/services', [ServiceController::class, 'store']);
    Route::get('/services/{service_id}', [ServiceController::class, 'show']);

    // IncidentController routes
    Route::get('/incidents', [IncidentController::class, 'index']);
    Route::get('/incidents/create', [IncidentController::class, 'create']);
    Route::post('/incidents', [IncidentController::class, 'store']);
    Route::post('/incidents/{incident_id}/solutions', [IncidentController::class, 'solutions']);

    // SlaController routes
    Route::get('/slas', [SlaController::class, 'index']);
    Route::get('/services/{service_id}/sla', [SlaController::class, 'show']);

    // SolutionController routes
    Route::get('/solutions', [SolutionController::class, 'index']);
    Route::post('/solutions', [SolutionController::class, 'store']); // Aún no funcional

    // OpenAIController routes
    Route::get('/chat', [OpenAIController::class, 'index']); // Aún no funcional+
    Route::post('/ask/{incident}', [OpenAIController::class, 'askChatGPT'])->whereNumber('incident');

    /**
     * Rutas para ser consumidas en el frontend:
     * Métricas simuladas del servidor
     * Estado de los servicios
     */

    Route::get('/server-metrics', function () {
        return response()->json([
            'cpu_usage' => rand(60, 100),
            'memory_usage' => rand(70, 95),
            'disk_space' => rand(20, 100) . '%',
        ]);
    });

    Route::get('/services-status', function () {
        $services = Service::withCount('incidents')->get();
        return response()->json($services);
    });
});

/*
*   Ruta de testeo de notificaciones (envío de email)
*/
Route::get('/test-notification', function() {
    $service = Service::first();
    $service->notify(new ServiceCritical($service));
    return "Notificación enviada por el servicio {$service->name}";
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

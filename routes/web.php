<?php

use App\Http\Controllers\IncidentController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\SlaController;
use App\Http\Controllers\DeepSeekController;
use App\Http\Controllers\SolutionController;
use App\Models\Service;
use App\Models\Incident;
use App\Notifications\ServiceCritical;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Carbon\Carbon;

Route::get('/', function () {
    return Inertia::render('auth/login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $totalIncidentsThisMonth = Incident::whereMonth('created_at', now()->month)
                                           ->whereYear('created_at', now()->year)
                                           ->count();

        $criticalServices = Service::where('status', 'Crítico')->count();
        $operationalServices = Service::where('status', 'Operativo')->count();

        $criticalServicesByMonth = collect(range(1, 12))->map(function ($month) {
            return [
                'month' => Carbon::create()->month($month)->format('F'),
                'count' => Service::where('status', 'Crítico')
                                  ->whereMonth('created_at', $month)
                                  ->whereYear('created_at', now()->year)
                                  ->count(),
            ];
        });

        return Inertia::render('dashboard', [
            'totalIncidentsThisMonth' => $totalIncidentsThisMonth,
            'criticalServices' => $criticalServices,
            'operationalServices' => $operationalServices,
            'criticalServicesByMonth' => $criticalServicesByMonth,
        ]);
    })->name('dashboard');

    Route::resource('incidents', IncidentController::class);
    Route::resource('services', ServiceController::class);

    // DeepSeekController routes
    Route::post('/incidents/{incident}/solve', [DeepSeekController::class, 'askChatGPT'])->name('incidents.solve');

    // OpenAIController routes
    Route::post('/incidents/{incident}/solve-openai', [App\Http\Controllers\OpenAIController::class, 'askOpenAI'])->name('incidents.solve-openai');
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

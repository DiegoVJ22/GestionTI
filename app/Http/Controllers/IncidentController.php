<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth; // Añadir esta importación
use Inertia\Inertia;
use Inertia\Response;

class IncidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $query = Incident::with(['service', 'solutions'])
            ->select(['id', 'title', 'priority', 'status', 'service_id', 'resolved_at', 'created_at'])
            ->latest();

        // Filtros
        $filters = $request->only(['priority', 'status', 'month', 'year']);
        
        if ($filters['priority'] ?? false) {
            $query->where('priority', $filters['priority']);
        }
        
        if ($filters['status'] ?? false) {
            $query->where('status', $filters['status']);
        }
        
        if ($filters['month'] ?? false) {
            $query->whereMonth('created_at', $filters['month']);
        }
        
        if ($filters['year'] ?? false) {
            $query->whereYear('created_at', $filters['year']);
        }

        return Inertia::render('incidents/index', [
            'incidents' => $query->get()->map(function ($incident) {
                $incident->steps = $incident->solutions->pluck('steps')->last();
                return $incident;
            }),
            'services' => Service::all(),
            'filters' => $filters,
            'years' => Incident::selectRaw('YEAR(created_at) as year')
                ->distinct()
                ->orderBy('year', 'desc')
                ->pluck('year'),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'service_id' => 'required|exists:services,id',
            'category' => 'required|string|in:Red,Servidor,Aplicación,Seguridad,Base de Datos', // Añadir validación para category
        ]);
        
        $user_id = Auth::id(); // Obtener el ID del usuario autenticado
        $service = Service::findOrFail($validated['service_id']); // Obtener el objeto Service

        $priority = $this->determineIncidentPriority(
            $validated['title'],
            $validated['description'],
            $service
        );

        // Crear el incidente con los campos adicionales
        $incident = Incident::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'service_id' => $service->id,
            'user_id' => $user_id, // Asignar el user_id
            'priority' => $priority, // Asignar la prioridad determinada
            'status' => 'Abierto', // Asignar estado por defecto
            'category' => $validated['category'], // Guardar la categoría
        ]);
        
        return to_route('incidents.index')->with('success', 'El incidente fue creado correctamente.');
    }

    public function solutions($id) {
        $incident = Incident::findOrFail($id);
        return $incident->solutions;
    }

    // Nuevo método para determinar la prioridad del incidente
    private function determineIncidentPriority(string $title, string $description, Service $service): string
    {
        $text = strtolower($title . ' ' . $description);
        $incidentPriority = 'Baja'; // Prioridad por defecto del incidente

        // Palabras clave para Alta prioridad del incidente
        $highKeywords = ['caído', 'inaccesible', 'no disponible', 'urgente', 'crítico', 'pérdida de datos', 'vulnerabilidad grave', 'no responde', 'imposible acceder', 'seguridad comprometida', 'sistema abajo'];
        foreach ($highKeywords as $keyword) {
            if (str_contains($text, $keyword)) {
                $incidentPriority = 'Alta';
                break;
            }
        }

        // Palabras clave para Media prioridad del incidente (solo si no es ya Alta)
        if ($incidentPriority !== 'Alta') {
            $mediumKeywords = ['lento', 'intermitente', 'error', 'problema', 'falla', 'degradado', 'funcionalidad rota', 'parcialmente funciona', 'dificultad para usar'];
            foreach ($mediumKeywords as $keyword) {
                if (str_contains($text, $keyword)) {
                    $incidentPriority = 'Media';
                    break;
                }
            }
        }

        // Definir criticidad de servicios
        $serviceNameLower = strtolower($service->name); // Comparar en minúsculas

        $highCriticalityServices = ['correo corporativo', 'red', 'internet', 'erp', 'crm', 'ciberseguridad', 'vpn', 'servidores en producción', 'backups', 'autenticación', 'servidor web principal', 'api de autenticación', 'plataforma de pagos', 'base de datos mysql'];
        $mediumCriticalityServices = ['apps internas no críticas', 'impresoras compartidas', 'updates no urgentes', 'soporte usuario', 'videollamadas', 'entorno qa'];

        $serviceCriticalityLevel = 'Baja'; // Por defecto
        foreach ($highCriticalityServices as $critService) {
            if (str_contains($serviceNameLower, $critService)) {
                $serviceCriticalityLevel = 'Alta';
                break;
            }
        }
        if ($serviceCriticalityLevel !== 'Alta') {
            foreach ($mediumCriticalityServices as $medService) {
                if (str_contains($serviceNameLower, $medService)) {
                    $serviceCriticalityLevel = 'Media';
                    break;
                }
            }
        }

        // Ajustar prioridad del incidente basada en la criticidad del servicio
        if ($serviceCriticalityLevel === 'Alta') {
            if ($incidentPriority === 'Media') $incidentPriority = 'Alta';
            elseif ($incidentPriority === 'Baja') $incidentPriority = 'Media';
        } elseif ($serviceCriticalityLevel === 'Media') {
            if ($incidentPriority === 'Baja') $incidentPriority = 'Media';
        }

        return $incidentPriority;
    }

    /**
     * Display the specified resource.
     */
    public function show(Incident $incident)
    {
        
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Incident $incident)
    {
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Incident $incident)
    {
        
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Incident $incident)
    {
        $incident = Incident::findOrFail($incident->id);
        $incident->status = "Cerrado";
        $incident->resolved_at = now();
        $incident->save();
        return to_route('incidents.index')->with('success', 'El incidente fue cerrado correctamente.');
    }
}

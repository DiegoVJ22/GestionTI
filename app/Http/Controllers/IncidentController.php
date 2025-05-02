<?php

namespace App\Http\Controllers;

use App\Models\Incident;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class IncidentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
{
    return Inertia::render('incidents/index', [
        'incidents' => Incident::with(['service', 'solutions'])
            ->select(['id', 'title', 'priority', 'status', 'service_id', 'sla_deadline', 'resolved_at', 'created_at'])
            ->latest()
            ->get()
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $services = Service::all(); // Servicios a los que se registrarán los incidentes en la vista
        return view('incidents.create', compact('services'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'title' => 'required|string',
            'description' => 'required|string',
            'priority' => 'required|string|in:Abierto,En progreso,Cerrado',
            'service_id' => 'required|exists:services,id',
            'user_id' => 'required|string|exists:user,id',
            'sla_deadline' => 'required'
        ]);
        
        if($validated->fails()) {
            return redirect()->route('incidents.create')->with('errors', $validated->errors());
        }

        $service_affected = Service::findOrFail($request->service_id);
        Incident::create($validated);
        
        return redirect()->route('incidents.index')->with('success', "Incidente '{$request->title}' del servicio {$service_affected->name} registrado exitosamente.");
    }

    public function solutions($id) {
        $incident = Incident::findOrFail($id);
        return $incident->solutions;
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
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Incident $incident)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Incident $incident)
    {
        //
    }
}

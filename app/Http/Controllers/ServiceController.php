<?php

namespace App\Http\Controllers;

use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class ServiceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
{
    return Inertia::render('services/index', [
        'services' => Service::select(['id', 'name', 'status', 'last_checked_at', 'created_at'])
            ->latest()
            ->get()
    ]);
}

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('services.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required|string',
            'status' => 'required|in:Operativo, Inestable, Crítico',
        ]);

        if($validated->fails()) {
            return redirect()->route('services.create')->with('errors', $validated->errors());
        }

        Service::create([
            'name' => $request->name,
            'status' => $request->status
        ]);

        return redirect()->route('services.index')->with('success', "Servicio '{$request->name}' creado exitosamente.");
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $service = Service::findOrFail($id);
        return view('services.show', compact('service'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Service $service)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Service $service)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Service $service)
    {
        //
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Service;
use App\Models\Sla;
use Illuminate\Http\Request;

class SlaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $SLAs = Sla::all();
        return view('slas.index', compact('SLAs'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $service = Service::findOrFail($id);
        $service_sla = $service->sla;
        return view('slas.show', compact('service_sla'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Sla $sla)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Sla $sla)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Sla $sla)
    {
        //
    }
}

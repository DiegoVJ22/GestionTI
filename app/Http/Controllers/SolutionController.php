<?php

namespace App\Http\Controllers;

use App\Models\Solution;
use Illuminate\Http\Request;

class SolutionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $solutions = Solution::with('incident')->paginate(10);
        return view('solutions.index', compact('solutions'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // return view('solutions.create') esto si se crean soluciones manuales
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Creación de soluciones con IA o manuales
    }

    /**
     * Display the specified resource.
     */
    public function show(Solution $solution)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Solution $solution)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Solution $solution)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Solution $solution)
    {
        //
    }
}

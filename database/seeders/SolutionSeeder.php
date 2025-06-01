<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Solution; // Asegúrate de importar el modelo Solution

class SolutionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear un número de soluciones usando el SolutionFactory
        Solution::factory()->count(50)->create();
    }
}

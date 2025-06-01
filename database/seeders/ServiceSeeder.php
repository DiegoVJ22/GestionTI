<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
// use Illuminate\Support\Carbon; // Ya no es necesario si solo usamos el factory

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        // Crear un número de servicios usando el ServicesFactory
        Service::factory()->count(20)->create();
    }
}

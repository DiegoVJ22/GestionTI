<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            ['name' => 'Servidor Web Principal'],
            ['name' => 'Base de Datos MySQL'],
            ['name' => 'API de Autenticación'],
            ['name' => 'Servicio de Correos'],
            ['name' => 'Plataforma de Pagos'],
            ['name' => 'Firewall Corporativo'],
            ['name' => 'Balanceador de Carga'],
            ['name' => 'Almacenamiento en Nube'],
            ['name' => 'Servidor VPN'],
            ['name' => 'Monitorización IT'],
            ['name' => 'Backups Automáticos'],
            ['name' => 'CDN de Contenidos'],
            ['name' => 'Servidor DNS'],
            ['name' => 'Plataforma CI/CD'],
            ['name' => 'Servicio de Logs'],
            ['name' => 'Kubernetes Cluster'],
            ['name' => 'Redis Cache'],
            ['name' => 'Servidor FTP'],
            ['name' => 'Analítica Web'],
            ['name' => 'Motor de Búsqueda']
        ];

        foreach ($services as $service) {
            $status = $this->determineStatus();
            
            Service::create([
                'name' => $service['name'],
                'status' => $status,
                'last_checked_at' => $this->generateLastChecked($status),
                'created_at' => Carbon::now()->subMonths(rand(1, 12)),
                'updated_at' => Carbon::now()
            ]);
        }
    }

    private function determineStatus(): string
    {
        $weights = [
            'Operativo' => 60,  // 60% de probabilidad
            'Inestable' => 30,  // 30% de probabilidad
            'Crítico' => 10      // 10% de probabilidad
        ];

        return $this->weightedRandom($weights);
    }

    private function generateLastChecked(string $status): Carbon
    {
        return match($status) {
            'Crítico' => Carbon::now()->subMinutes(rand(5, 60)),
            'Inestable' => Carbon::now()->subHours(rand(1, 12)),
            default => Carbon::now()->subDays(rand(1, 7))
        };
    }

    private function weightedRandom(array $weights) {
        $total = array_sum($weights);
        $random = rand(1, $total);
        
        foreach ($weights as $key => $weight) {
            $random -= $weight;
            if ($random <= 0) {
                return $key;
            }
        }
    }
}
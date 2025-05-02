<?php

namespace Database\Factories;

use App\Models\Service;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class IncidentFactory extends Factory
{
    private $itKeywords = [
        'Latencia', 'Timeout', 'Conexión', 'Autenticación', 'Firewall', 
        'DNS', 'HTTP 500', 'SSL', 'CPU Load', 'Memory Leak', 'Query',
        'Replicación', 'Backup', 'RAID', 'Apache', 'Nginx', 'Kubernetes',
        'Docker', 'VPN', 'LDAP', 'SSH', 'SFTP', 'API', 'Microservicio'
    ];

    public function definition(): array
    {
        $service = Service::inRandomOrder()->first();
        
        return [
            'title' => $this->generateIncidentTitle($service->name),
            'description' => $this->generateIncidentDescription(),
            'priority' => $this->faker->randomElement(['Alta', 'Media', 'Baja']),
            'status' => 'Cerrado',
            'service_id' => $service->id,
            'user_id' => User::inRandomOrder()->first()->id,
        ];
    }

    private function generateIncidentTitle(string $serviceName): string
    {
        $templates = [
            "Fallo en {$serviceName}: {issue}",
            "Incidencia de {component} en {$serviceName}",
            "Error {code} en {$serviceName}",
            "Problema de {protocol} con {$serviceName}",
            "Degradación de rendimiento en {$serviceName}"
        ];

        return $this->faker->randomElement($templates);
    }

    private function generateIncidentDescription(): string
    {
        $components = [
            'servidor' => ['CPU al 100%', 'Disco lleno', 'Memoria agotada'],
            'red' => ['Paquetes perdidos', 'Conexiones inestables', 'Latencia elevada'],
            'seguridad' => ['Intento de intrusión', 'Certificado expirado', 'Fallo de autenticación'],
            'aplicación' => ['Error en base de datos', 'Excepción no controlada', 'Deadlock detectado'],
            'almacenamiento' => ['RAID degradado', 'LUN inaccesible', 'IOPS excedidos']
        ];

        $type = $this->faker->randomElement(array_keys($components));
        $details = $components[$type];
        
        return $this->buildTechnicalDescription($type, $details);
    }

    private function buildTechnicalDescription(string $type, array $details): string
    {
        $timestamp = now()->subMinutes(rand(5, 120))->format('Y-m-d H:i:s');
        
        return implode("\n\n", [
            "**Reporte Técnico**",
            "Tipo de fallo: ".ucfirst($type),
            "Primera detección: {$timestamp}",
            "Síntomas:",
            "- ".$this->faker->randomElement($details),
            "- ".$this->faker->randomElement($this->itKeywords),
            "Impacto: ".$this->faker->randomElement([
                'Interrupción del servicio principal',
                'Degradación del rendimiento',
                'Pérdida de datos temporales',
                'Inaccesibilidad parcial'
            ]),
            "Logs relevantes:",
            "[".$timestamp."] ERROR: ".$this->generateLogEntry()
        ]);
    }

    private function generateLogEntry(): string
    {
        $entries = [
            'Could not establish database connection',
            'Certificate verify failed: self signed certificate',
            'kernel: RAID1 conf printout: 1 disks missing',
            'ssh_exchange_identification: Connection closed by remote host',
            'oom-killer: Killed process 12345 (java)',
            'Task timed out after 300.03 seconds',
            'Too many open files in system',
            'Invalid CSRF token detected',
            'POST /api/v1/payments 504 Gateway Timeout',
            'CPU temperature above threshold (82°C)'
        ];

        return $this->faker->randomElement($entries);
    }
}
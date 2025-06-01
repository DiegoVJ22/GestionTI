<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Service;

class ServiceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Service::class;

    // Lista de nombres de servicios más realistas
    private $serviceNames = [
        'Servidor Web Apache', 'Servidor Web Nginx', 'Base de Datos MySQL', 'Base de Datos PostgreSQL', 
        'API de Clientes', 'API de Productos', 'Firewall Perimetral', 'Servicio de Autenticación OAuth2', 
        'Plataforma E-commerce', 'Sistema ERP Dynamics', 'Sistema CRM Salesforce', 'Red Corporativa LAN', 
        'VPN Acceso Remoto GlobalProtect', 'Almacenamiento Cloud AWS S3', 'Servidor DNS Primario BIND', 
        'Cluster Kubernetes EKS', 'Cache Redis ElastiCache', 'Servicio de Correo Exchange Online', 
        'Balanceador de Carga F5', 'Monitorización Nagios', 'Sistema de Backups Veeam', 
        'Plataforma CI/CD Jenkins', 'Servidor FTP ProFTPD', 'Gestor Documental Alfresco'
    ];
    // Para asegurar nombres únicos en una sola ejecución del seeder
    private static $usedServiceNames = []; 

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Generar nombre de servicio único de la lista
        $availableNames = array_diff($this->serviceNames, self::$usedServiceNames);
        if (empty($availableNames)) { // Si se agotan los nombres, usar faker con sufijo
            $name = $this->faker->company() . ' Service ' . $this->faker->unique()->randomNumber(2);
        } else {
            $name = $this->faker->randomElement($availableNames);
            self::$usedServiceNames[] = $name;
        }
        
        // Estados ponderados: 50% Operativo, 20% Inestable, 30% Crítico
        $weightedStatuses = [
            'Operativo', 'Operativo', 'Operativo', 'Operativo', 'Operativo', 
            'Inestable', 'Inestable', 
            'Crítico', 'Crítico', 'Crítico'
        ];
        $status = $this->faker->randomElement($weightedStatuses);

        $lastCheckedAt = match($status) {
            'Crítico' => $this->faker->dateTimeBetween('-60 minutes', 'now'),
            'Inestable' => $this->faker->dateTimeBetween('-12 hours', 'now'),
            default => $this->faker->dateTimeBetween('-7 days', 'now'), // Operativo
        };

        return [
            'name' => $name,
            'status' => $status,
            'last_checked_at' => $lastCheckedAt,
        ];
    }

    // Resetear nombres usados para cada ejecución de seeder si es necesario (opcional)
    // Se podría llamar desde ServiceSeeder si se ejecutan múltiples factories.
    public static function resetUsedServiceNames() {
        self::$usedServiceNames = [];
    }
}

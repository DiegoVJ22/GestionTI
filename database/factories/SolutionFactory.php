<?php

namespace Database\Factories;

use App\Models\Incident; // Importar el modelo Incident
use Illuminate\Database\Eloquent\Factories\Factory;

class SolutionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'incident_id' => Incident::inRandomOrder()->first()->id, // Añadir incident_id
            'steps' => $this->generateSteps(),
            'source' => $this->faker->randomElement(['Predefinida', 'IA']),
            'keywords' => $this->generateKeywords(),
        ];
    }

    private function generateSteps(): string
    {
        $incidentTypes = [
            'server' => [
                '1. Verificar estado del servidor en el panel de monitorización',
                '2. Revisar logs del sistema en /var/log/syslog',
                '3. Comprobar uso de recursos (CPU, Memoria, Disco)',
                '4. Reiniciar servicios críticos afectados',
                '5. Aplicar parches de seguridad si corresponde',
                '6. Verificar conectividad de red del servidor'
            ],
            'network' => [
                '1. Verificar estado de los enlaces de red',
                '2. Comprobar configuración de firewall',
                '3. Testear conectividad con ping y traceroute',
                '4. Revisar tablas de enrutamiento',
                '5. Resetear puertos del switch afectados',
                '6. Verificar certificados SSL/TLS'
            ],
            'security' => [
                '1. Aislar el sistema afectado de la red',
                '2. Cambiar credenciales comprometidas',
                '3. Analizar registros de acceso sospechosos',
                '4. Escanear en busca de malware',
                '5. Aplicar políticas de seguridad actualizadas',
                '6. Notificar al equipo de ciberseguridad'
            ],
            'application' => [
                '1. Revisar logs de la aplicación',
                '2. Verificar conexión a base de datos',
                '3. Probar endpoints críticos con Postman',
                '4. Revertir a última versión estable',
                '5. Optimizar consultas SQL problemáticas',
                '6. Validar configuración de entorno'
            ],
            'database' => [
                '1. Verificar estado de la replicación',
                '2. Optimizar tablas fragmentadas',
                '3. Ejecutar backup de emergencia',
                '4. Reconstruir índices dañados',
                '5. Ajustar parámetros de configuración',
                '6. Liberar espacio en tablespaces'
            ]
        ];

        $type = array_rand($incidentTypes);
        $steps = $incidentTypes[$type];
        $count = rand(3, 6);

        // Seleccionar pasos aleatorios manteniendo el orden
        $selectedSteps = array_slice($steps, 0, $count);

        // Agregar paso final común
        $selectedSteps[] = ($count + 1) . ". Documentar solución en el sistema de gestión";

        return implode("\n", $selectedSteps);
    }

    private function generateKeywords(): string
    {
        $keywords = [
            'servidor' => ['Apache', 'Nginx', 'Load Balancer', 'Virtualización'],
            'red' => ['Firewall', 'DNS', 'VPN', 'Ancho de banda'],
            'seguridad' => ['Autenticación', 'Encriptación', 'IDS/IPS', 'OWASP'],
            'aplicación' => ['Microservicios', 'API REST', 'Latencia', 'Escalabilidad'],
            'base de datos' => ['Replicación', 'Sharding', 'NoSQL', 'Transacciones']
        ];

        $type = array_rand($keywords);
        return implode(',', $this->faker->randomElements($keywords[$type], rand(2, 4)));
    }
}

<?php

namespace App\Console\Commands;

use App\Models\Service;
use App\Notifications\ServiceCritical;
use Illuminate\Console\Command;

class UpdateServicesStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'update:services-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = "Update the status of services based on recent incidents";

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // FLUJO:
        /**
         * Obtener la colección de servicios
         * Para cada servicio analizar el número de incidentes que presenta
         * Actualizar estados
         * Notificar por correo (ServiceCritical) 
         */
        
        $services = Service::with('incidents')->get();

        foreach ($services as $service) {
            $incidentsCount = 
                $service
                ->incidents()
                ->where(
                    // Incidentes registrados la última hora
                    'created_at', '>=', now()->subHour()
                )->count();

            /**
             * $table->enum('status', ['Operativo', 'Inestable', 'Crítico']);
            */

            $newStatus = match(true) {
                $incidentsCount >= 10 => 'Crítico',
                $incidentsCount >= 5 => 'Inestable',
                default => 'Operativo'
            };

            if ($service->status !== $newStatus) {
                $service->update([
                    'status' => $newStatus,
                    'last_checked_at' => now()
                ]);

                if($newStatus === 'Crítico') {
                    // Enviar notificación de servicio en estado crítico
                    $service->notify(new ServiceCritical($service));
                }
            } else {
                $service->update(['last_checked_at' => now()]);
            }
        }
        $this->info('Service status successfully updated.');
    }
}

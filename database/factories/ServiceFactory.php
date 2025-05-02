<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Service>
 */
class ServiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement(['Servidor de Pagos', 'Base de Datos', 'API Auth']),
            'status' => fake()->randomElement(['Operativo', 'Inestable', 'Crítico']),
            'last_checked_at' => fake()->dateTimeThisMonth(),
        ];
    }
}

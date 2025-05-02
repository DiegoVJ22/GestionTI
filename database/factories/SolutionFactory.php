<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Solution>
 */
class SolutionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'steps' => $this->generateSteps(),
            'source' => $this->faker->randomElement(['Predefinida', 'IA']),
            'keywords' => $this->generateKeywords(),
        ];
    }

    private function generateSteps(): string
    {
        $steps = [];
        $count = rand(3, 6);
        
        for ($i = 0; $i < $count; $i++) {
            $steps[] = ($i + 1) . '. ' . $this->faker->sentence;
        }
        
        return implode("\n", $steps);
    }

    private function generateKeywords(): string
    {
        $keywords = [
            'servidor', 'red', 'aplicación', 'seguridad', 
            'base de datos', 'rendimiento', 'hardware', 'software'
        ];
        
        return collect($keywords)
            ->random(rand(2, 4))
            ->implode(',');
    }
}

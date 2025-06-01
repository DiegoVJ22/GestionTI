<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Incident;
use App\Models\Solution;
use Carbon\Carbon;

class IncidentSeeder extends Seeder
{
    public function run(): void
    {
        $years = [2023, 2024, 2025];
        $currentYear = now()->year;
        $currentMonth = now()->month;

        foreach ($years as $year) {
            $startMonth = 1;
            $endMonth = ($year == $currentYear) ? $currentMonth : 12;

            if ($year > $currentYear) continue;

            for ($month = $startMonth; $month <= $endMonth; $month++) {
                $this->createIncidentsForMonth($year, $month);
            }
        }
    }

    private function createIncidentsForMonth(int $year, int $month): void
    {
        $startDate = Carbon::create($year, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();

        Incident::factory()
            ->count(rand(30, 50)) // Aumentar el rango
            ->create([
                'created_at' => $this->randomDateInRange($startDate, $endDate),
                'updated_at' => $this->randomDateInRange($startDate, $endDate)
            ])
            ->each(function ($incident) {
                // Solo crear solución si el incidente está cerrado y tiene resolved_at
                if ($incident->status === 'Cerrado' && $incident->resolved_at) {
                    $this->createSolution($incident);
                }
            });
    }

    private function randomDateInRange(Carbon $start, Carbon $end): Carbon
    {
        return $start->copy()->addDays(rand(0, $end->diffInDays($start)))
                    ->addHours(rand(0, 23))
                    ->addMinutes(rand(0, 59));
    }

    private function createSolution(Incident $incident): void
    {
        Solution::factory()->create([
            'incident_id' => $incident->id,
            'created_at' => $incident->resolved_at,
            'updated_at' => $incident->resolved_at
        ]);
    }
}

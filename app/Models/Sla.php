<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Sla extends Model
{
    use HasFactory;

    protected $fillable = [
        'service_id',
        'priority',
        'max_resolution_time',
    ];

    // Relaciones
    public function service()
    {
        return $this->belongsTo(Service::class);
    }
}

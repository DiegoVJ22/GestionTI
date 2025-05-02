<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Solution extends Model
{
    use HasFactory;

    protected $fillable = [
        'incident_id',
        'steps',
        'source',
        'keywords',
    ];

    // Relaciones
    public function incident()
    {
        return $this->belongsTo(Incident::class);
    }
}

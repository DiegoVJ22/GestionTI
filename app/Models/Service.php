<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Notifications\Notification;

class Service extends Model
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'status',
        'last_checked_at',
    ];

    protected $casts = [
        'last_checked_at' => 'datetime',
    ];

    // Relaciones
    public function incidents()
    {
        return $this->hasMany(Incident::class);
    }

    public function sla()
    {
        return $this->hasOne(Sla::class);
    }

    /**
     * Route notifications for the mail channel.
     *
     * @return  array<string, string>|string
     */

    public function routeNotificationForMail(Notification $notification): array|string
    {
        // Retornar una dirección de email fija para pruebas
        return "equipo.tecnico@empresa.com";
    }
}

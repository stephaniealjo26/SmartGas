<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FuelEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'fuel_station_id',
        'station_name',
        'fuel_type',
        'price_per_liter',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function fuelStation(): BelongsTo
    {
        return $this->belongsTo(FuelStation::class);
    }
}

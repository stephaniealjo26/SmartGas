<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FuelEntry extends Model
{
    protected $fillable = [
        'user_id',
        'station_name',
        'fuel_type',
        'price_per_liter',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
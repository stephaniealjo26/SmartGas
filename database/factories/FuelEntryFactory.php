<?php

namespace Database\Factories;

use App\Models\FuelEntry;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class FuelEntryFactory extends Factory
{
    protected $model = FuelEntry::class;

    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'station_name' => $this->faker->company(),
            'fuel_type' => $this->faker->randomElement(['Diesel', 'Unleaded', 'Premium']),
            'price_per_liter' => $this->faker->randomFloat(2, 70, 150),
            'created_at' => $this->faker->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
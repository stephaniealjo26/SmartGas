<?php

namespace Database\Seeders;

use App\Models\FuelEntry;
use App\Models\User;
use Illuminate\Database\Seeder;

class FuelEntrySeeder extends Seeder
{
    public function run(): void
    {
        // Create 5 users each with 3-8 fuel entries
        User::factory(5)
            ->has(FuelEntry::factory()->count(rand(3, 8)), 'fuelEntries')
            ->create();

        // Add extra entries for the existing test user (ID 1)
        if ($user = User::find(1)) {
            FuelEntry::factory(10)->create(['user_id' => $user->id]);
        }
    }
}
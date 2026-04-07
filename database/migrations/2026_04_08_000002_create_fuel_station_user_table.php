<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fuel_station_user', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fuel_station_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['fuel_station_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fuel_station_user');
    }
};

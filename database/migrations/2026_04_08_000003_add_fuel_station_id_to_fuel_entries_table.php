<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fuel_entries', function (Blueprint $table) {
            $table->foreignId('fuel_station_id')
                ->nullable()
                ->after('user_id')
                ->constrained()
                ->nullOnDelete();
        });

        DB::table('fuel_entries')
            ->select('id', 'station_name')
            ->orderBy('id')
            ->get()
            ->each(function (object $entry): void {
                $stationId = DB::table('fuel_stations')->where('name', $entry->station_name)->value('id');

                if (! $stationId) {
                    $stationId = DB::table('fuel_stations')->insertGetId([
                        'name' => $entry->station_name,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }

                DB::table('fuel_entries')
                    ->where('id', $entry->id)
                    ->update(['fuel_station_id' => $stationId]);
            });

        DB::table('fuel_entries')
            ->select('fuel_station_id', 'user_id')
            ->whereNotNull('fuel_station_id')
            ->distinct()
            ->orderBy('fuel_station_id')
            ->orderBy('user_id')
            ->get()
            ->each(function (object $pair): void {
                DB::table('fuel_station_user')->updateOrInsert(
                    [
                        'fuel_station_id' => $pair->fuel_station_id,
                        'user_id' => $pair->user_id,
                    ],
                    [
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                );
            });
    }

    public function down(): void
    {
        Schema::table('fuel_entries', function (Blueprint $table) {
            $table->dropConstrainedForeignId('fuel_station_id');
        });
    }
};

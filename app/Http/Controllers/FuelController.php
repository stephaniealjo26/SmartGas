<?php

namespace App\Http\Controllers;

use App\Models\FuelEntry;
use App\Models\FuelStation;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class FuelController extends Controller
{
    public function index(Request $request): Response
    {
        $entries = $request->user()->fuelEntries()
            ->with('fuelStation:id,name')
            ->latest()
            ->get();

        $stations = $request->user()->fuelStations()
            ->orderBy('fuel_stations.name')
            ->get(['fuel_stations.id', 'fuel_stations.name']);

        return Inertia::render('Dashboard', [
            'entries' => $entries,
            'stations' => $stations,
        ]);
    }

    public function store(Request $request)
    {
        $request->merge([
            'station_name' => Str::squish((string) $request->input('station_name')),
        ]);

        $validated = $request->validate([
            'station_name'    => ['required', 'string', 'max:255'],
            'fuel_type'       => ['required', 'in:Diesel,Unleaded,Premium'],
            'price_per_liter' => ['required', 'numeric', 'gt:0'],
        ]);

        $station = FuelStation::firstOrCreate([
            'name' => $validated['station_name'],
        ]);

        $request->user()->fuelStations()->syncWithoutDetaching([$station->id]);

        FuelEntry::create([
            'user_id'         => $request->user()->id,
            'fuel_station_id' => $station->id,
            'station_name'    => $station->name,
            'fuel_type'       => $validated['fuel_type'],
            'price_per_liter' => $validated['price_per_liter'],
        ]);

        return redirect()->route('dashboard')->with('success', 'Price logged successfully!');
    }

    public function destroy(Request $request, FuelEntry $fuelEntry)
    {
        abort_unless($fuelEntry->user_id === $request->user()->id, 403);
        $fuelEntry->delete();

        return redirect()->route('dashboard')->with('success', 'Entry deleted successfully!');
    }
}

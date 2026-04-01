<?php

namespace App\Http\Controllers;

use App\Models\FuelEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FuelController extends Controller
{
    public function index(Request $request)
    {
        $entries = FuelEntry::where('user_id', $request->user()->id)
            ->latest()
            ->get();

        return Inertia::render('Dashboard', [
            'entries' => $entries,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'station_name'    => ['required', 'string', 'max:255'],
            'fuel_type'       => ['required', 'in:Diesel,Unleaded,Premium'],
            'price_per_liter' => ['required', 'numeric', 'gt:0'],
        ]);

        FuelEntry::create([
            'user_id'         => $request->user()->id,
            'station_name'    => $validated['station_name'],
            'fuel_type'       => $validated['fuel_type'],
            'price_per_liter' => $validated['price_per_liter'],
        ]);

        return redirect()->route('dashboard');
    }

    public function destroy(Request $request, FuelEntry $fuelEntry)
    {
        abort_unless($fuelEntry->user_id === $request->user()->id, 403);
        $fuelEntry->delete();

        return redirect()->route('dashboard');
    }
}
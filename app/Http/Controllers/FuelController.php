<?php

namespace App\Http\Controllers;

use App\Models\FuelEntry;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FuelController extends Controller
{
    public function index()
    {
        $entries = FuelEntry::where('user_id', auth()->id())
            ->latest()
            ->get();

        return Inertia::render('Dashboard', [
            'entries' => $entries,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'station_name'    => 'required|string|max:255',
            'fuel_type'       => 'required|in:Diesel,Unleaded,Premium',
            'price_per_liter' => 'required|numeric|min:0.01',
        ]);

        FuelEntry::create([
            'user_id'         => auth()->id(),
            'station_name'    => $request->station_name,
            'fuel_type'       => $request->fuel_type,
            'price_per_liter' => $request->price_per_liter,
        ]);

        return redirect()->route('dashboard');
    }

    public function destroy($id)
    {
        $entry = FuelEntry::where('id', $id)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        $entry->delete();

        return redirect()->route('dashboard');
    }
}
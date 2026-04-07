import { useForm, Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from 'react';

export default function Dashboard({ entries, stations = [] }) {
    const { flash } = usePage().props;
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (flash?.success) {
            setNotification({ type: 'success', message: flash.success });
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
        if (flash?.error) {
            setNotification({ type: 'error', message: flash.error });
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [flash]);

    const { data, setData, post, processing, errors, reset } = useForm({
        station_name: '',
        fuel_type: 'Diesel',
        price_per_liter: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('fuel.store'), {
            onSuccess: () => reset(),
        });
    };

    const getPriceColor = (price) => {
        return parseFloat(price) > 90.00
            ? 'text-red-600 font-bold'
            : 'text-green-600 font-bold';
    };

    const getStationName = (entry) => entry.fuel_station?.name ?? entry.station_name;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    SmartGas — Fuel Price Tracker
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-6 sm:py-12">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">

                    {/* ── FLASH NOTIFICATION ── */}
                    {notification && (
                        <div
                            className={`rounded-md p-4 text-sm font-medium shadow ${
                                notification.type === 'success'
                                    ? 'bg-green-50 text-green-800 border border-green-200'
                                    : 'bg-red-50 text-red-800 border border-red-200'
                            }`}
                        >
                            {notification.message}
                        </div>
                    )}

                    {/* ── FORM CARD ── */}
                    <div className="bg-white p-4 sm:p-6 shadow rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Log a Fuel Price
                        </h3>

                        <form onSubmit={submit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            {/* Station Name */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Station Name
                                </label>
                                <input
                                    type="text"
                                    value={data.station_name}
                                    onChange={(e) => setData('station_name', e.target.value)}
                                    list="station-suggestions"
                                    placeholder="e.g. Petron EDSA"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                <datalist id="station-suggestions">
                                    {stations.map((station) => (
                                        <option key={station.id} value={station.name} />
                                    ))}
                                </datalist>
                                {stations.length > 0 && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        Choose one of your tracked stations or type a new station name.
                                    </p>
                                )}
                                {errors.station_name && (
                                    <p className="text-red-500 text-xs mt-1">{errors.station_name}</p>
                                )}
                            </div>

                            {/* Fuel Type Dropdown */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Fuel Type
                                </label>
                                <select
                                    value={data.fuel_type}
                                    onChange={(e) => setData('fuel_type', e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="Diesel">Diesel</option>
                                    <option value="Unleaded">Unleaded</option>
                                    <option value="Premium">Premium</option>
                                </select>
                                {errors.fuel_type && (
                                    <p className="text-red-500 text-xs mt-1">{errors.fuel_type}</p>
                                )}
                            </div>

                            {/* Price Per Liter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price per Liter (₱)
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0.01"
                                    value={data.price_per_liter}
                                    onChange={(e) => setData('price_per_liter', e.target.value)}
                                    placeholder="e.g. 68.50"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                                {errors.price_per_liter && (
                                    <p className="text-red-500 text-xs mt-1">{errors.price_per_liter}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="sm:col-span-2">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md text-sm transition"
                                >
                                    {processing ? 'Saving...' : 'Log Fuel Price'}
                                </button>
                            </div>

                        </form>
                    </div>

                    {/* ── HISTORY TABLE ── */}
                    <div className="bg-white p-4 sm:p-6 shadow rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Fuel Price History
                        </h3>

                        {entries && entries.length > 0 ? (
                            <>
                                {/* Desktop table */}
                                <div className="hidden sm:block overflow-x-auto">
                                    <table className="w-full text-sm text-left">
                                        <thead>
                                            <tr className="border-b text-gray-500 text-xs uppercase">
                                                <th className="py-2 pr-4">Station</th>
                                                <th className="py-2 pr-4">Fuel Type</th>
                                                <th className="py-2 pr-4">Price/Liter</th>
                                                <th className="py-2 pr-4">Date</th>
                                                <th className="py-2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {entries.map((entry) => (
                                                <tr key={entry.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-2 pr-4">{getStationName(entry)}</td>
                                                    <td className="py-2 pr-4">{entry.fuel_type}</td>
                                                    <td className={`py-2 pr-4 ${getPriceColor(entry.price_per_liter)}`}>
                                                        ₱{parseFloat(entry.price_per_liter).toFixed(2)}
                                                    </td>
                                                    <td className="py-2 pr-4 text-gray-400">
                                                        {new Date(entry.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="py-2">
                                                        <button
                                                            onClick={() => {
                                                                if (confirm('Delete this entry?')) {
                                                                    router.delete(route('fuel.destroy', entry.id));
                                                                }
                                                            }}
                                                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Mobile cards */}
                                <div className="sm:hidden space-y-3">
                                    {entries.map((entry) => (
                                        <div key={entry.id} className="border rounded-lg p-3 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-gray-800">{getStationName(entry)}</p>
                                                    <p className="text-xs text-gray-500">{entry.fuel_type}</p>
                                                </div>
                                                <span className={`text-lg ${getPriceColor(entry.price_per_liter)}`}>
                                                    ₱{parseFloat(entry.price_per_liter).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center pt-1">
                                                <span className="text-xs text-gray-400">
                                                    {new Date(entry.created_at).toLocaleDateString()}
                                                </span>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Delete this entry?')) {
                                                            router.delete(route('fuel.destroy', entry.id));
                                                        }
                                                    }}
                                                    className="text-red-500 hover:text-red-700 text-xs font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>
                        ) : (
                            <p className="text-gray-400 text-sm">No fuel entries yet. Log your first one above!</p>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}

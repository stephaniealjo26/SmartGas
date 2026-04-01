import { useForm, Head, usePage, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';


export default function Dashboard({ entries }) {
    const { auth } = usePage().props;

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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    SmartGas — Fuel Price Tracker
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">

                    {/* ── FORM CARD ── */}
                    <div className="bg-white p-6 shadow rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Log a Fuel Price
                        </h3>

                        <form onSubmit={submit} className="space-y-4">

                            {/* Station Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Station Name
                                </label>
                                <input
                                    type="text"
                                    value={data.station_name}
                                    onChange={(e) => setData('station_name', e.target.value)}
                                    placeholder="e.g. Petron EDSA"
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
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
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-md text-sm transition"
                            >
                                {processing ? 'Saving...' : 'Log Fuel Price'}
                            </button>

                        </form>
                    </div>

                    {/* ── HISTORY TABLE ── */}
                    <div className="bg-white p-6 shadow rounded-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-4">
                            Fuel Price History
                        </h3>

                        {entries && entries.length > 0 ? (
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
                                            <td className="py-2 pr-4">{entry.station_name}</td>
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
                        ) : (
                            <p className="text-gray-400 text-sm">No fuel entries yet. Log your first one above!</p>
                        )}
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
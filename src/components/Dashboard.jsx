import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TABS = ['Place Order', 'Records', 'Wallet', 'Drivers', 'Rewards'];

const VEHICLES = [
  { label: 'Motorcycle', capacity: '', emoji: '🛵' },
  { label: '200 kg Sedan', capacity: '', emoji: '🚗' },
  { label: '300 kg Small Crossover SUV', capacity: '', emoji: '🚙' },
  { label: '600 kg 7-seater SUV/Minivan', capacity: '', emoji: '🚐' },
  { label: '1000 kg Truck', capacity: '', emoji: '🚚' },
];

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('Place Order');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [stops, setStops] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [vehicleStart, setVehicleStart] = useState(0);

  const addStop = () => {
    if (stops.length < 18) setStops([...stops, '']);
  };

  const updateStop = (i, val) => {
    const updated = [...stops];
    updated[i] = val;
    setStops(updated);
  };

  const removeStop = (i) => setStops(stops.filter((_, idx) => idx !== i));

  const visibleVehicles = VEHICLES.slice(vehicleStart, vehicleStart + 4);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white font-['Rubik']">

      {/* Top Navbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f36f21]">
            <span className="text-xs font-black text-white">LL</span>
          </div>
          {/* Tabs */}
          <nav className="flex items-center gap-1">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition rounded-sm ${
                  activeTab === tab
                    ? 'border-b-2 border-[#f36f21] text-[#f36f21]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            🛍 Link with Shopify
          </button>
          <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100">⚙️</button>
          <button className="rounded p-1.5 text-slate-500 hover:bg-slate-100">❓</button>
          <button
            onClick={onLogout}
            className="rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
          >
            Log out
          </button>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Panel */}
        <aside className="flex w-[440px] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white p-5">

          {/* Import Addresses */}
          <div className="mb-4 flex justify-end">
            <button className="flex items-center gap-1 rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
              Import Addresses ▾
            </button>
          </div>

          {/* Route */}
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Route (max. 20 stops)
          </p>

          {/* Pickup */}
          <div className="mb-2 flex items-center gap-2">
            <span className="text-slate-300">○</span>
            <input
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
              placeholder="Pick-up location"
              className="flex-1 border-b border-slate-200 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f36f21]"
            />
          </div>

          {/* Extra stops */}
          {stops.map((s, i) => (
            <div key={i} className="mb-2 flex items-center gap-2">
              <span className="text-slate-300">○</span>
              <input
                value={s}
                onChange={(e) => updateStop(i, e.target.value)}
                placeholder={`Stop ${i + 1}`}
                className="flex-1 border-b border-slate-200 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f36f21]"
              />
              <button onClick={() => removeStop(i)} className="text-slate-300 hover:text-red-400">✕</button>
            </div>
          ))}

          {/* Dropoff */}
          <div className="mb-3 flex items-center gap-2">
            <span className="text-[#f36f21]">📍</span>
            <input
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
              placeholder="Drop-off location"
              className="flex-1 border-b border-slate-200 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f36f21]"
            />
          </div>

          {/* Add Stop */}
          {stops.length < 18 && (
            <button
              onClick={addStop}
              className="mb-5 flex items-center gap-1 text-sm font-medium text-[#f36f21] hover:underline"
            >
              + Add Stop
            </button>
          )}

          <hr className="mb-5 border-slate-100" />

          {/* Vehicle Type */}
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Vehicle Type</p>
            <button className="text-xs text-[#f36f21]">ⓘ Which vehicle to select?</button>
          </div>

          <div className="relative flex items-center gap-2">
            {vehicleStart > 0 && (
              <button
                onClick={() => setVehicleStart(vehicleStart - 1)}
                className="absolute -left-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white shadow text-slate-500 hover:bg-slate-50"
              >‹</button>
            )}

            <div className="grid grid-cols-4 gap-2 w-full">
              {visibleVehicles.map((v, i) => {
                const realIdx = vehicleStart + i;
                return (
                  <button
                    key={realIdx}
                    onClick={() => setSelectedVehicle(realIdx)}
                    className={`flex flex-col items-center rounded-lg border p-3 transition ${
                      selectedVehicle === realIdx
                        ? 'border-[#f36f21] bg-orange-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-3xl">{v.emoji}</span>
                    <span className="mt-2 text-center text-[11px] leading-tight text-slate-700">{v.label}</span>
                  </button>
                );
              })}
            </div>

            {vehicleStart + 4 < VEHICLES.length && (
              <button
                onClick={() => setVehicleStart(vehicleStart + 1)}
                className="absolute -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white shadow text-slate-500 hover:bg-slate-50"
              >›</button>
            )}
          </div>

          {/* Order Button */}
          <button className="mt-6 h-11 w-full rounded-lg bg-[#f36f21] text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-105">
            Place Order
          </button>
        </aside>

        {/* Map */}
        <div className="relative flex-1">
          <div className="absolute right-4 top-4 z-[999] rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow">
            Manila NCR and South Luzon
          </div>
          <MapContainer
            center={[14.5995, 120.9842]}
            zoom={10}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[14.5995, 120.9842]}>
              <Popup>Manila, Philippines</Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

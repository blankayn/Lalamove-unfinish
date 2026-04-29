import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const TABS = ['Place Order', 'Records', 'Wallet', 'Drivers', 'Rewards'];
const VEHICLES = [
  { label: 'Motorcycle', emoji: '🛵' },
  { label: '200 kg Sedan', emoji: '🚗' },
  { label: '300 kg Small Crossover SUV', emoji: '🚙' },
  { label: '600 kg 7-seater SUV/Minivan', emoji: '🚐' },
  { label: '1000 kg Truck', emoji: '🚚' },
];

/* ── Empty state illustration placeholder ── */
const EmptyIllustration = ({ emoji, size = 80 }) => (
  <div className="flex flex-col items-center justify-center py-16">
    <span style={{ fontSize: size }}>{emoji}</span>
  </div>
);

/* ══════════════════════════════════════════
   RECORDS TAB
══════════════════════════════════════════ */
function RecordsTab() {
  const [search, setSearch] = useState('');
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-800">Records</h1>
      <div className="mb-6 flex items-center justify-between">
        <div className="relative w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by delivery info"
            className="h-10 w-full rounded border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-[#f36f21]"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded border border-slate-300 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
            Show Filters
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded border border-slate-300 text-slate-500 hover:bg-slate-50">‹</button>
          <button className="flex h-9 w-9 items-center justify-center rounded border border-slate-300 text-slate-500 hover:bg-slate-50">›</button>
        </div>
      </div>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20">
        <div className="mb-4 text-7xl">📦</div>
        <p className="text-sm text-slate-500">Your records list is so empty. :( Start by placing your first order!</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   WALLET TAB
══════════════════════════════════════════ */
function WalletTab() {
  const [walletSection, setWalletSection] = useState('Transaction History');
  const walletNav = ['Transaction History', 'Coupons', 'Payment Methods'];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-slate-200 p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Wallet</p>
        {walletNav.map((item) => (
          <button
            key={item}
            onClick={() => setWalletSection(item)}
            className={`mb-1 flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition ${
              walletSection === item ? 'bg-orange-50 font-medium text-[#f36f21]' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item === 'Transaction History' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
            )}
            {item === 'Coupons' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>
            )}
            {item === 'Payment Methods' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
            )}
            {item}
          </button>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {walletSection === 'Transaction History' && (
          <>
            {/* Balance card */}
            <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <p className="mb-1 text-xs text-slate-500">Balance</p>
                <p className="text-2xl font-bold text-slate-800">₱0.00</p>
              </div>
              <button className="rounded bg-[#f36f21] px-5 py-2 text-sm font-bold text-white hover:brightness-105">
                Top Up
              </button>
            </div>

            {/* Transaction history */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Transaction History</h2>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600">
                  <span>30-03-2026</span>
                  <span className="mx-1 text-slate-400">→</span>
                  <span>29-04-2026</span>
                  <svg className="ml-1" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                </div>
                <span className="text-xs text-slate-500">Viewing 0 - 0 of 0</span>
                <button className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 text-slate-400 hover:bg-slate-50">‹</button>
                <button className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 text-slate-400 hover:bg-slate-50">›</button>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-4 border-b border-slate-200 pb-2 text-xs font-medium text-slate-400">
              <span>Trans. Type</span>
              <span>Date</span>
              <span>Order ID</span>
              <span>Amount</span>
            </div>

            {/* Empty state */}
            <div className="flex flex-col items-center justify-center py-16">
              <div className="mb-4 text-6xl">🚧</div>
              <p className="text-sm text-slate-500">You have no transactions for the selected time period.</p>
            </div>
          </>
        )}

        {walletSection === 'Coupons' && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="mb-4 text-6xl">🎟️</div>
            <p className="text-base font-semibold text-slate-700">No coupons available</p>
            <p className="mt-1 text-sm text-slate-400">Check back later for promotions and discounts.</p>
          </div>
        )}

        {walletSection === 'Payment Methods' && (
          <div>
            <h2 className="mb-6 text-lg font-bold text-slate-800">Payment Methods</h2>
            <button className="flex items-center gap-2 rounded border border-dashed border-slate-300 px-4 py-3 text-sm text-[#f36f21] hover:bg-orange-50">
              + Add Payment Method
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   DRIVERS TAB
══════════════════════════════════════════ */
function DriversTab() {
  const [driverSection, setDriverSection] = useState('Favorites');
  const driverNav = ['Favorites', 'Blocked'];

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-52 shrink-0 border-r border-slate-200 p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Drivers</p>
        {driverNav.map((item) => (
          <button
            key={item}
            onClick={() => setDriverSection(item)}
            className={`mb-1 flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition ${
              driverSection === item ? 'bg-orange-50 font-medium text-[#f36f21]' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {item === 'Favorites' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            )}
            {item === 'Blocked' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            )}
            {item}
          </button>
        ))}
      </aside>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {driverSection === 'Favorites' && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Favorites</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Viewing 0 - 0 of 0</span>
                <button className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 hover:bg-slate-50">‹</button>
                <button className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 hover:bg-slate-50">›</button>
              </div>
            </div>

            {/* Table header */}
            <div className="grid grid-cols-3 border-b border-slate-200 pb-2 text-xs font-medium text-slate-400">
              <span>Name</span>
              <span>Vehicle Type</span>
              <span>Avg. Ratings</span>
            </div>

            {/* Empty state */}
            <div className="flex flex-col items-center justify-center py-14">
              <div className="mb-4 text-6xl">⭐</div>
              <p className="text-base font-semibold text-slate-700">No favorite drivers yet</p>
              <p className="mt-1 max-w-xs text-center text-sm text-slate-400">
                Favorite drivers after completing an order, and they'll have priority to receive your future orders.
              </p>
            </div>
          </>
        )}

        {driverSection === 'Blocked' && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Blocked</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>Viewing 0 - 0 of 0</span>
                <button className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 hover:bg-slate-50">‹</button>
                <button className="flex h-7 w-7 items-center justify-center rounded border border-slate-300 hover:bg-slate-50">›</button>
              </div>
            </div>
            <div className="grid grid-cols-3 border-b border-slate-200 pb-2 text-xs font-medium text-slate-400">
              <span>Name</span>
              <span>Vehicle Type</span>
              <span>Avg. Ratings</span>
            </div>
            <div className="flex flex-col items-center justify-center py-14">
              <div className="mb-4 text-6xl">🚫</div>
              <p className="text-sm text-slate-500">No blocked drivers.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   REWARDS TAB
══════════════════════════════════════════ */
function RewardsTab() {
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-800">Rewards</h1>
      <p className="mb-8 text-sm text-slate-500">Earn points with every delivery and redeem exciting rewards.</p>

      {/* Points card */}
      <div className="mb-6 flex items-center gap-6 rounded-xl border border-slate-200 bg-gradient-to-r from-orange-50 to-white p-6 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f36f21] text-3xl text-white">
          🏆
        </div>
        <div>
          <p className="text-xs text-slate-500">Total Points</p>
          <p className="text-3xl font-black text-[#f36f21]">0 pts</p>
          <p className="mt-1 text-xs text-slate-400">Place your first order to start earning points!</p>
        </div>
      </div>

      {/* Tiers */}
      <h2 className="mb-3 text-sm font-semibold text-slate-700">Membership Tiers</h2>
      <div className="grid grid-cols-3 gap-4">
        {[
          { tier: 'Silver', pts: '0 - 999 pts', color: '#94a3b8', emoji: '🥈' },
          { tier: 'Gold', pts: '1,000 - 4,999 pts', color: '#f59e0b', emoji: '🥇' },
          { tier: 'Platinum', pts: '5,000+ pts', color: '#6366f1', emoji: '💎' },
        ].map((t) => (
          <div key={t.tier} className="rounded-lg border border-slate-200 p-4 text-center">
            <div className="mb-2 text-3xl">{t.emoji}</div>
            <p className="font-bold" style={{ color: t.color }}>{t.tier}</p>
            <p className="mt-1 text-xs text-slate-400">{t.pts}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   PLACE ORDER TAB
══════════════════════════════════════════ */
function PlaceOrderTab() {
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [stops, setStops] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(0);
  const [vehicleStart, setVehicleStart] = useState(0);

  const addStop = () => { if (stops.length < 18) setStops([...stops, '']); };
  const updateStop = (i, val) => { const u = [...stops]; u[i] = val; setStops(u); };
  const removeStop = (i) => setStops(stops.filter((_, idx) => idx !== i));
  const visibleVehicles = VEHICLES.slice(vehicleStart, vehicleStart + 4);

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left panel */}
      <aside className="flex w-[440px] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white p-5">
        <div className="mb-4 flex justify-end">
          <button className="flex items-center gap-1 rounded border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            Import Addresses ▾
          </button>
        </div>

        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Route (max. 20 stops)</p>

        <div className="mb-2 flex items-center gap-2">
          <span className="text-slate-300">○</span>
          <input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Pick-up location"
            className="flex-1 border-b border-slate-200 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
        </div>

        {stops.map((s, i) => (
          <div key={i} className="mb-2 flex items-center gap-2">
            <span className="text-slate-300">○</span>
            <input value={s} onChange={e => updateStop(i, e.target.value)} placeholder={`Stop ${i + 1}`}
              className="flex-1 border-b border-slate-200 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
            <button onClick={() => removeStop(i)} className="text-slate-300 hover:text-red-400">✕</button>
          </div>
        ))}

        <div className="mb-3 flex items-center gap-2">
          <span className="text-[#f36f21]">📍</span>
          <input value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Drop-off location"
            className="flex-1 border-b border-slate-200 py-1.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
        </div>

        {stops.length < 18 && (
          <button onClick={addStop} className="mb-5 flex items-center gap-1 text-sm font-medium text-[#f36f21] hover:underline">
            + Add Stop
          </button>
        )}

        <hr className="mb-5 border-slate-100" />

        <div className="mb-3 flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Vehicle Type</p>
          <button className="text-xs text-[#f36f21]">ⓘ Which vehicle to select?</button>
        </div>

        <div className="relative">
          {vehicleStart > 0 && (
            <button onClick={() => setVehicleStart(vehicleStart - 1)}
              className="absolute -left-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow text-slate-500 hover:bg-slate-50">‹</button>
          )}
          <div className="grid grid-cols-4 gap-2">
            {visibleVehicles.map((v, i) => {
              const realIdx = vehicleStart + i;
              return (
                <button key={realIdx} onClick={() => setSelectedVehicle(realIdx)}
                  className={`flex flex-col items-center rounded-lg border p-3 transition ${selectedVehicle === realIdx ? 'border-[#f36f21] bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}>
                  <span className="text-3xl">{v.emoji}</span>
                  <span className="mt-2 text-center text-[11px] leading-tight text-slate-700">{v.label}</span>
                </button>
              );
            })}
          </div>
          {vehicleStart + 4 < VEHICLES.length && (
            <button onClick={() => setVehicleStart(vehicleStart + 1)}
              className="absolute -right-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow text-slate-500 hover:bg-slate-50">›</button>
          )}
        </div>

        <button className="mt-6 h-11 w-full rounded-lg bg-[#f36f21] text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-105">
          Place Order
        </button>
      </aside>

      {/* Map */}
      <div className="relative flex-1">
        <div className="absolute right-4 top-4 z-[999] rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow">
          Manila NCR and South Luzon
        </div>
        <MapContainer center={[14.5995, 120.9842]} zoom={10} className="h-full w-full">
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
  );
}

/* ══════════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════════ */
export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('Place Order');

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white font-['Rubik']">

      {/* Navbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f36f21]">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
              <path d="M28 12l-6 4-2-4-4 2 3 5-7 9h6l3-4 4 2 5-8-2-6z" fill="white"/>
            </svg>
          </div>
          <nav className="flex items-center">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-4 text-sm font-medium transition border-b-2 ${
                  activeTab === tab ? 'border-[#f36f21] text-[#f36f21]' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            🛍 Link with Shopify
          </button>
          <button className="rounded p-2 text-slate-400 hover:bg-slate-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 010 14.14M4.93 4.93a10 10 0 000 14.14"/></svg>
          </button>
          <button className="rounded p-2 text-slate-400 hover:bg-slate-100">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          </button>
          <button onClick={onLogout} className="rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            Log out
          </button>
        </div>
      </header>

      {/* Tab content */}
      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'Place Order' && <PlaceOrderTab />}
        {activeTab === 'Records'     && <RecordsTab />}
        {activeTab === 'Wallet'      && <WalletTab />}
        {activeTab === 'Drivers'     && <DriversTab />}
        {activeTab === 'Rewards'     && <RewardsTab />}
      </div>
    </div>
  );
}

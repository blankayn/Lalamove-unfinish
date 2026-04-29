import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import SettingsPanel from './SettingsPanel';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const API = 'http://localhost/lalamove-api';

// Static demo orders for Vercel preview
const DEMO_ORDERS = [
  { Dlvry_Id: 1001, Dlvry_CustId: 1, Dlvry_DrvId: 1, Dlvry_Pick: 'Makati City', Dlvry_Drop: 'BGC, Taguig', Dlvry_Item: 'Documents', Dlvry_Dist: 3.5, Dlvry_Fee: 175, Dlvry_Stat: 'Completed', Dlvry_Time: '2026-04-20 10:00:00', driver_name: 'Pedro Santos', driver_phone: '09181234567' },
  { Dlvry_Id: 1002, Dlvry_CustId: 1, Dlvry_DrvId: null, Dlvry_Pick: 'Quezon City', Dlvry_Drop: 'Pasig City', Dlvry_Item: 'Groceries', Dlvry_Dist: 5.2, Dlvry_Fee: 260, Dlvry_Stat: 'Pending', Dlvry_Time: '2026-04-27 14:30:00', driver_name: null, driver_phone: null },
  { Dlvry_Id: 1003, Dlvry_CustId: 1, Dlvry_DrvId: 1, Dlvry_Pick: 'Mandaluyong', Dlvry_Drop: 'Marikina City', Dlvry_Item: 'Clothes', Dlvry_Dist: 4.1, Dlvry_Fee: 205, Dlvry_Stat: 'Ongoing', Dlvry_Time: '2026-04-29 09:15:00', driver_name: 'Pedro Santos', driver_phone: '09181234567' },
];

const DEMO_PAYMENTS = [
  { Pay_Id: 1, Pay_DlvryId: 1001, Pay_CustPaymeth: 'GCash', Pay_Amt: 175, Pay_Stat: 'Paid', Pay_Date: '2026-04-20 11:00:00', Dlvry_Pick: 'Makati City', Dlvry_Drop: 'BGC, Taguig', Dlvry_Stat: 'Completed' },
];
const TABS = ['Place Order', 'Records', 'Wallet', 'Drivers', 'Rewards'];
const VEHICLES = [
  { label: 'Motorcycle', emoji: '🛵', fee: 50 },
  { label: '200 kg Sedan', emoji: '🚗', fee: 100 },
  { label: '300 kg Small Crossover SUV', emoji: '🚙', fee: 150 },
  { label: '600 kg 7-seater SUV/Minivan', emoji: '🚐', fee: 200 },
  { label: '1000 kg Truck', emoji: '🚚', fee: 300 },
];

const STATUS_COLOR = {
  Pending:   'bg-yellow-100 text-yellow-700',
  Ongoing:   'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

/* ── Place Order ── */
function PlaceOrderTab({ user }) {
  const [pickup, setPickup]   = useState('');
  const [dropoff, setDropoff] = useState('');
  const [item, setItem]       = useState('');
  const [dist, setDist]       = useState('');
  const [selVeh, setSelVeh]   = useState(0);
  const [vehStart, setVehStart] = useState(0);
  const [payment, setPayment] = useState('Cash');
  const [msg, setMsg]         = useState('');
  const [loading, setLoading] = useState(false);

  const fee = dist ? (parseFloat(dist) * VEHICLES[selVeh].fee).toFixed(2) : '0.00';
  const visible = VEHICLES.slice(vehStart, vehStart + 4);

  const handleOrder = async (e) => {
    e.preventDefault();
    setMsg(''); setLoading(true);
    try {
      const res  = await fetch(`${API}/place_order.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cust_id: user.id, pickup, dropoff, item, dist: parseFloat(dist) || 0, fee: parseFloat(fee), payment_method: payment }),
      });
      const data = await res.json();
      setMsg(data.message);
      if (data.success) { setPickup(''); setDropoff(''); setItem(''); setDist(''); }
    } catch { setMsg('Cannot connect to server.'); }
    setLoading(false);
  };

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="flex w-[440px] shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white p-5">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Route</p>
        <form onSubmit={handleOrder} className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="text-slate-300">○</span>
            <input value={pickup} onChange={e => setPickup(e.target.value)} placeholder="Pick-up location" required
              className="flex-1 border-b border-slate-200 py-1.5 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#f36f21]">📍</span>
            <input value={dropoff} onChange={e => setDropoff(e.target.value)} placeholder="Drop-off location" required
              className="flex-1 border-b border-slate-200 py-1.5 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
          </div>
          <input value={item} onChange={e => setItem(e.target.value)} placeholder="Item description" required
            className="border-b border-slate-200 py-1.5 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
          <input type="number" value={dist} onChange={e => setDist(e.target.value)} placeholder="Distance (km)" min="0" step="0.1"
            className="border-b border-slate-200 py-1.5 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />

          <hr className="border-slate-100" />
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">Vehicle Type</p>
          </div>
          <div className="relative">
            {vehStart > 0 && (
              <button type="button" onClick={() => setVehStart(vehStart - 1)}
                className="absolute -left-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow text-slate-500">‹</button>
            )}
            <div className="grid grid-cols-4 gap-2">
              {visible.map((v, i) => {
                const idx = vehStart + i;
                return (
                  <button type="button" key={idx} onClick={() => setSelVeh(idx)}
                    className={`flex flex-col items-center rounded-lg border p-2 transition ${selVeh === idx ? 'border-[#f36f21] bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <span className="text-2xl">{v.emoji}</span>
                    <span className="mt-1 text-center text-[10px] leading-tight text-slate-700">{v.label}</span>
                    <span className="text-[10px] text-[#f36f21]">₱{v.fee}/km</span>
                  </button>
                );
              })}
            </div>
            {vehStart + 4 < VEHICLES.length && (
              <button type="button" onClick={() => setVehStart(vehStart + 1)}
                className="absolute -right-3 top-1/2 z-10 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white shadow text-slate-500">›</button>
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-orange-50 px-4 py-2">
            <span className="text-sm text-slate-600">Estimated Fee</span>
            <span className="text-lg font-bold text-[#f36f21]">₱{fee}</span>
          </div>

          <div>
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Payment Method</p>
            <div className="flex gap-2">
              {['Cash', 'GCash', 'Card'].map(p => (
                <button type="button" key={p} onClick={() => setPayment(p)}
                  className={`flex-1 rounded border py-2 text-xs font-medium transition ${payment === p ? 'border-[#f36f21] bg-orange-50 text-[#f36f21]' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {msg && <p className={`text-xs ${msg.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}

          <button type="submit" disabled={loading}
            className="h-11 w-full rounded-lg bg-[#f36f21] text-sm font-bold uppercase tracking-wide text-white hover:brightness-105 disabled:opacity-60">
            {loading ? 'Placing...' : 'Place Order'}
          </button>
        </form>
      </aside>
      <div className="relative flex-1">
        <div className="absolute right-4 top-4 z-[999] rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow">
          Manila NCR and South Luzon
        </div>
        <MapContainer center={[14.5995, 120.9842]} zoom={10} className="h-full w-full">
          <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[14.5995, 120.9842]}><Popup>Manila</Popup></Marker>
        </MapContainer>
      </div>
    </div>
  );
}

/* ── Records ── */
function RecordsTab({ user }) {
  const [orders, setOrders]   = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);
  const [rating, setRating]   = useState({ open: false, order: null, score: 5, comment: '' });
  const [rateMsg, setRateMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API}/get_orders.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'customer', user_id: user.id }),
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
      else setOrders(DEMO_ORDERS);
    } catch { setOrders(DEMO_ORDERS); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o =>
    o.Dlvry_Pick.toLowerCase().includes(search.toLowerCase()) ||
    o.Dlvry_Drop.toLowerCase().includes(search.toLowerCase()) ||
    o.Dlvry_Item.toLowerCase().includes(search.toLowerCase())
  );

  const submitRating = async () => {
    setRateMsg('');
    try {
      const res  = await fetch(`${API}/rate_driver.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_id: rating.order.Dlvry_Id, cust_id: user.id, driver_id: rating.order.Dlvry_DrvId, score: rating.score, comment: rating.comment }),
      });
      const data = await res.json();
      setRateMsg(data.message);
      if (data.success) setTimeout(() => setRating({ open: false, order: null, score: 5, comment: '' }), 1200);
    } catch { setRateMsg('Error submitting rating.'); }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="mb-5 text-2xl font-bold text-slate-800">Records</h1>
      <div className="mb-5 flex items-center justify-between">
        <div className="relative w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by delivery info"
            className="h-10 w-full rounded border border-slate-300 pl-9 pr-3 text-sm outline-none focus:border-[#f36f21]" />
        </div>
        <button onClick={load} className="rounded border border-slate-300 px-3 py-2 text-xs text-slate-600 hover:bg-slate-50">↻ Refresh</button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-slate-400">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="mb-4 text-7xl">📦</div>
          <p className="text-sm text-slate-500">No records yet. Start by placing your first order!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(o => (
            <div key={o.Dlvry_Id} className="rounded-lg border border-slate-200 p-4 hover:border-slate-300">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-slate-400">Order #{o.Dlvry_Id} · {new Date(o.Dlvry_Time).toLocaleDateString()}</p>
                  <p className="mt-1 font-medium text-slate-800">{o.Dlvry_Item}</p>
                  <p className="text-xs text-slate-500">📍 {o.Dlvry_Pick} → {o.Dlvry_Drop}</p>
                  {o.driver_name && <p className="mt-1 text-xs text-slate-500">🚗 Driver: {o.driver_name} · {o.driver_phone}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[o.Dlvry_Stat] || 'bg-slate-100 text-slate-600'}`}>{o.Dlvry_Stat}</span>
                  <span className="text-sm font-bold text-[#f36f21]">₱{parseFloat(o.Dlvry_Fee).toFixed(2)}</span>
                  {o.Dlvry_Stat === 'Completed' && o.Dlvry_DrvId && (
                    <button onClick={() => setRating({ open: true, order: o, score: 5, comment: '' })}
                      className="rounded border border-[#f36f21] px-2 py-1 text-xs text-[#f36f21] hover:bg-orange-50">
                      ⭐ Rate Driver
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rating modal */}
      {rating.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-bold text-slate-800">Rate your driver</h3>
            <div className="mb-3 flex justify-center gap-2">
              {[1,2,3,4,5].map(s => (
                <button key={s} onClick={() => setRating(r => ({ ...r, score: s }))}
                  className={`text-2xl transition ${s <= rating.score ? 'text-yellow-400' : 'text-slate-300'}`}>★</button>
              ))}
            </div>
            <textarea value={rating.comment} onChange={e => setRating(r => ({ ...r, comment: e.target.value }))}
              placeholder="Leave a comment (optional)" rows={3}
              className="w-full rounded border border-slate-300 p-2 text-sm outline-none focus:border-[#f36f21]" />
            {rateMsg && <p className="mt-2 text-xs text-green-600">{rateMsg}</p>}
            <div className="mt-4 flex gap-2">
              <button onClick={() => setRating({ open: false, order: null, score: 5, comment: '' })}
                className="flex-1 rounded border border-slate-300 py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={submitRating}
                className="flex-1 rounded bg-[#f36f21] py-2 text-sm font-bold text-white hover:brightness-105">Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Wallet ── */
function WalletTab({ user }) {
  const [section, setSection]   = useState('Transaction History');
  const [payments, setPayments] = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/get_payments.php`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cust_id: user.id }),
        });
        const data = await res.json();
        if (data.success) { setPayments(data.payments); setTotal(data.total_spent); }
        else { setPayments(DEMO_PAYMENTS); setTotal(175); }
      } catch { setPayments(DEMO_PAYMENTS); setTotal(175); }
      setLoading(false);
    })();
  }, []);

  const navItems = ['Transaction History', 'Coupons', 'Payment Methods'];

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-52 shrink-0 border-r border-slate-200 p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Wallet</p>
        {navItems.map(item => (
          <button key={item} onClick={() => setSection(item)}
            className={`mb-1 flex w-full items-center gap-2 rounded px-3 py-2 text-sm transition ${section === item ? 'bg-orange-50 font-medium text-[#f36f21]' : 'text-slate-600 hover:bg-slate-50'}`}>
            {item}
          </button>
        ))}
      </aside>
      <div className="flex-1 overflow-y-auto p-8">
        {section === 'Transaction History' && (
          <>
            <div className="mb-6 flex items-center justify-between rounded-lg border border-slate-200 p-5 shadow-sm">
              <div>
                <p className="mb-1 text-xs text-slate-500">Total Spent</p>
                <p className="text-2xl font-bold text-slate-800">₱{parseFloat(total).toFixed(2)}</p>
              </div>
              <button className="rounded bg-[#f36f21] px-5 py-2 text-sm font-bold text-white hover:brightness-105">Top Up</button>
            </div>
            <h2 className="mb-4 text-lg font-bold text-slate-800">Transaction History</h2>
            <div className="grid grid-cols-4 border-b border-slate-200 pb-2 text-xs font-medium text-slate-400">
              <span>Type</span><span>Date</span><span>Order ID</span><span>Amount</span>
            </div>
            {loading ? <div className="py-10 text-center text-slate-400">Loading...</div>
              : payments.length === 0 ? (
                <div className="flex flex-col items-center py-16">
                  <div className="mb-3 text-5xl">🚧</div>
                  <p className="text-sm text-slate-500">No transactions yet.</p>
                </div>
              ) : payments.map(p => (
                <div key={p.Pay_Id} className="grid grid-cols-4 border-b border-slate-100 py-3 text-sm text-slate-700">
                  <span>{p.Pay_CustPaymeth}</span>
                  <span>{new Date(p.Pay_Date).toLocaleDateString()}</span>
                  <span>#{p.Pay_DlvryId}</span>
                  <span className="font-medium text-[#f36f21]">₱{parseFloat(p.Pay_Amt).toFixed(2)}</span>
                </div>
              ))
            }
          </>
        )}
        {section === 'Coupons' && (
          <div className="flex flex-col items-center py-20">
            <div className="mb-4 text-6xl">🎟️</div>
            <p className="font-semibold text-slate-700">No coupons available</p>
          </div>
        )}
        {section === 'Payment Methods' && (
          <div>
            <h2 className="mb-4 text-lg font-bold text-slate-800">Payment Methods</h2>
            <div className="mb-2 rounded-lg border border-slate-200 p-4">
              <p className="text-sm font-medium text-slate-700">Preferred: <span className="text-[#f36f21]">{user.payment || 'Cash'}</span></p>
            </div>
            <button className="rounded border border-dashed border-slate-300 px-4 py-3 text-sm text-[#f36f21] hover:bg-orange-50">+ Add Payment Method</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Drivers ── */
function DriversTab() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-52 shrink-0 border-r border-slate-200 p-4">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">Drivers</p>
        <button className="mb-1 flex w-full items-center gap-2 rounded bg-orange-50 px-3 py-2 text-sm font-medium text-[#f36f21]">⭐ Favorites</button>
        <button className="mb-1 flex w-full items-center gap-2 rounded px-3 py-2 text-sm text-slate-600 hover:bg-slate-50">🚫 Blocked</button>
      </aside>
      <div className="flex-1 p-8">
        <h2 className="mb-4 text-xl font-bold text-slate-800">Favorites</h2>
        <div className="grid grid-cols-3 border-b border-slate-200 pb-2 text-xs font-medium text-slate-400">
          <span>Name</span><span>Vehicle Type</span><span>Avg. Ratings</span>
        </div>
        <div className="flex flex-col items-center py-14">
          <div className="mb-4 text-6xl">⭐</div>
          <p className="font-semibold text-slate-700">No favorite drivers yet</p>
          <p className="mt-1 max-w-xs text-center text-sm text-slate-400">Favorite drivers after completing an order.</p>
        </div>
      </div>
    </div>
  );
}

/* ── Rewards ── */
function RewardsTab({ orders }) {
  const completed = orders?.filter(o => o.Dlvry_Stat === 'Completed').length || 0;
  const points    = completed * 100;
  return (
    <div className="flex-1 overflow-y-auto p-8">
      <h1 className="mb-2 text-2xl font-bold text-slate-800">Rewards</h1>
      <p className="mb-6 text-sm text-slate-500">Earn 100 points per completed delivery.</p>
      <div className="mb-6 flex items-center gap-6 rounded-xl border border-slate-200 bg-gradient-to-r from-orange-50 to-white p-6 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f36f21] text-3xl">🏆</div>
        <div>
          <p className="text-xs text-slate-500">Total Points</p>
          <p className="text-3xl font-black text-[#f36f21]">{points} pts</p>
          <p className="mt-1 text-xs text-slate-400">{completed} completed deliveries</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[{ tier: 'Silver', pts: '0–999', color: '#94a3b8', emoji: '🥈' },
          { tier: 'Gold', pts: '1,000–4,999', color: '#f59e0b', emoji: '🥇' },
          { tier: 'Platinum', pts: '5,000+', color: '#6366f1', emoji: '💎' }].map(t => (
          <div key={t.tier} className={`rounded-lg border p-4 text-center ${points >= (t.tier === 'Gold' ? 1000 : t.tier === 'Platinum' ? 5000 : 0) ? 'border-[#f36f21]' : 'border-slate-200'}`}>
            <div className="mb-2 text-3xl">{t.emoji}</div>
            <p className="font-bold" style={{ color: t.color }}>{t.tier}</p>
            <p className="mt-1 text-xs text-slate-400">{t.pts} pts</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Main Customer Dashboard ── */
export default function CustomerDashboard({ user, onLogout }) {
  const [activeTab, setActiveTab]   = useState('Place Order');
  const [showSettings, setShowSettings] = useState(false);
  const [orders, setOrders]         = useState([]);

  useEffect(() => {
    fetch(`${API}/get_orders.php`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'customer', user_id: user.id }),
    }).then(r => r.json()).then(d => { if (d.success) setOrders(d.orders); }).catch(() => {});
  }, [activeTab]);

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white font-['Rubik']">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f36f21]">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none"><path d="M28 12l-6 4-2-4-4 2 3 5-7 9h6l3-4 4 2 5-8-2-6z" fill="white"/></svg>
          </div>
          <nav className="flex items-center">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-4 py-4 text-sm font-medium transition ${activeTab === tab ? 'border-[#f36f21] text-[#f36f21]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                {tab}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">👤 {user.name}</span>
          <button onClick={() => setShowSettings(true)}
            className="flex items-center gap-1 rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            ⚙️ Settings
          </button>
          <button onClick={onLogout} className="rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            Log out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {activeTab === 'Place Order' && <PlaceOrderTab user={user} />}
        {activeTab === 'Records'     && <RecordsTab user={user} />}
        {activeTab === 'Wallet'      && <WalletTab user={user} />}
        {activeTab === 'Drivers'     && <DriversTab />}
        {activeTab === 'Rewards'     && <RewardsTab orders={orders} />}
      </div>

      {showSettings && <SettingsPanel user={user} role="customer" onClose={() => setShowSettings(false)} onLogout={onLogout} />}
    </div>
  );
}

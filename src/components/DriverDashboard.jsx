import { useState, useEffect } from 'react';

const API = 'http://localhost/lalamove-api';

const DEMO_DRIVER_ORDERS = [
  { Dlvry_Id: 2001, Dlvry_DrvId: null, Dlvry_Pick: 'Cubao, QC', Dlvry_Drop: 'Ortigas, Pasig', Dlvry_Item: 'Electronics', Dlvry_Dist: 4.8, Dlvry_Fee: 240, Dlvry_Stat: 'Pending', Dlvry_Time: '2026-04-29 10:00:00', customer_name: 'Maria Santos', customer_phone: '09171111111' },
  { Dlvry_Id: 2002, Dlvry_DrvId: null, Dlvry_Pick: 'Alabang, Muntinlupa', Dlvry_Drop: 'Las Pinas City', Dlvry_Item: 'Food Package', Dlvry_Dist: 2.3, Dlvry_Fee: 115, Dlvry_Stat: 'Pending', Dlvry_Time: '2026-04-29 11:30:00', customer_name: 'Jose Reyes', customer_phone: '09172222222' },
];

const STATUS_COLOR = {
  Pending: 'bg-yellow-100 text-yellow-700',
  Ongoing: 'bg-blue-100 text-blue-700',
  Completed: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function DriverDashboard({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Orders');
  const [msg, setMsg] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/get_orders.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'driver', user_id: user.id }),
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
      else setOrders(DEMO_DRIVER_ORDERS);
    } catch { setOrders(DEMO_DRIVER_ORDERS); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (deliveryId, status) => {
    setMsg('');
    try {
      const res = await fetch(`${API}/update_status.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_id: deliveryId, driver_id: user.id, status }),
      });
      const data = await res.json();
      setMsg(data.message);
      if (data.success) load();
    } catch { setMsg('Error updating status.'); }
  };

  const pending = orders.filter(o => o.Dlvry_Stat === 'Pending');
  const ongoing = orders.filter(o => o.Dlvry_Stat === 'Ongoing' && String(o.Dlvry_DrvId) === String(user.id));
  const completed = orders.filter(o => o.Dlvry_Stat === 'Completed' && String(o.Dlvry_DrvId) === String(user.id));

  const TABS = ['Orders', 'My Deliveries', 'History'];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white font-['Rubik']">
      {/* Navbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f36f21]">
            <svg width="18" height="18" viewBox="0 0 40 40" fill="none"><path d="M28 12l-6 4-2-4-4 2 3 5-7 9h6l3-4 4 2 5-8-2-6z" fill="white" /></svg>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-xs font-medium text-green-700">{user.status || 'Available'}</span>
          </div>
          <nav className="flex items-center">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-4 py-4 text-sm font-medium transition ${activeTab === tab ? 'border-[#f36f21] text-[#f36f21]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                {tab}
                {tab === 'Orders' && pending.length > 0 && (
                  <span className="ml-1 rounded-full bg-[#f36f21] px-1.5 py-0.5 text-[10px] text-white">{pending.length}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">🚗 {user.name}</span>
          <button onClick={onLogout} className="rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            Log out
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {msg && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700">{msg}</div>
        )}

        {/* Available Orders */}
        {activeTab === 'Orders' && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">Available Orders</h1>
              <button onClick={load} className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">↻ Refresh</button>
            </div>
            {loading ? <div className="py-20 text-center text-slate-400">Loading...</div>
              : pending.length === 0 ? (
                <div className="flex flex-col items-center py-20">
                  <div className="mb-4 text-7xl">🚗</div>
                  <p className="text-sm text-slate-500">No pending orders right now. Check back soon!</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {pending.map(o => (
                    <div key={o.Dlvry_Id} className="rounded-xl border border-slate-200 p-5 shadow-sm hover:border-[#f36f21] transition">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Order #{o.Dlvry_Id}</p>
                          <p className="font-semibold text-slate-800">{o.Dlvry_Item}</p>
                        </div>
                        <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">Pending</span>
                      </div>
                      <div className="mb-3 space-y-1 text-sm text-slate-600">
                        <p>📍 <span className="font-medium">From:</span> {o.Dlvry_Pick}</p>
                        <p>🏁 <span className="font-medium">To:</span> {o.Dlvry_Drop}</p>
                        <p>👤 <span className="font-medium">Customer:</span> {o.customer_name} · {o.customer_phone}</p>
                        <p>📏 {o.Dlvry_Dist} km · <span className="font-bold text-[#f36f21]">₱{parseFloat(o.Dlvry_Fee).toFixed(2)}</span></p>
                      </div>
                      <button onClick={() => updateStatus(o.Dlvry_Id, 'Ongoing')}
                        className="w-full rounded-lg bg-[#f36f21] py-2 text-sm font-bold text-white hover:brightness-105">
                        Accept Order
                      </button>
                    </div>
                  ))}
                </div>
              )
            }
          </>
        )}

        {/* My Active Deliveries */}
        {activeTab === 'My Deliveries' && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">My Deliveries</h1>
              <button onClick={load} className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">↻ Refresh</button>
            </div>
            {ongoing.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="mb-4 text-7xl">📦</div>
                <p className="text-sm text-slate-500">No active deliveries. Accept an order to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {ongoing.map(o => (
                  <div key={o.Dlvry_Id} className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Order #{o.Dlvry_Id}</p>
                        <p className="font-semibold text-slate-800">{o.Dlvry_Item}</p>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Ongoing</span>
                    </div>
                    <div className="mb-4 space-y-1 text-sm text-slate-600">
                      <p>📍 <span className="font-medium">From:</span> {o.Dlvry_Pick}</p>
                      <p>🏁 <span className="font-medium">To:</span> {o.Dlvry_Drop}</p>
                      <p>👤 <span className="font-medium">Customer:</span> {o.customer_name} · {o.customer_phone}</p>
                      <p>📏 {o.Dlvry_Dist} km · <span className="font-bold text-[#f36f21]">₱{parseFloat(o.Dlvry_Fee).toFixed(2)}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(o.Dlvry_Id, 'Completed')}
                        className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-bold text-white hover:brightness-105">
                        ✓ Mark Completed
                      </button>
                      <button onClick={() => updateStatus(o.Dlvry_Id, 'Cancelled')}
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* History */}
        {activeTab === 'History' && (
          <>
            <h1 className="mb-5 text-2xl font-bold text-slate-800">Delivery History</h1>
            {completed.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="mb-4 text-7xl">📋</div>
                <p className="text-sm text-slate-500">No completed deliveries yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completed.map(o => (
                  <div key={o.Dlvry_Id} className="rounded-lg border border-slate-200 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Order #{o.Dlvry_Id} · {new Date(o.Dlvry_Time).toLocaleDateString()}</p>
                        <p className="font-medium text-slate-800">{o.Dlvry_Item}</p>
                        <p className="text-xs text-slate-500">📍 {o.Dlvry_Pick} → {o.Dlvry_Drop}</p>
                      </div>
                      <div className="text-right">
                        <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Completed</span>
                        <p className="mt-1 text-sm font-bold text-[#f36f21]">₱{parseFloat(o.Dlvry_Fee).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

    </div>
  );
}

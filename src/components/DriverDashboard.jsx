import { useState, useEffect } from 'react';

const API = 'http://localhost/lalamove-api';

const DEMO_DRIVER_ORDERS = [
  { Dlvry_Id: 2001, Dlvry_DrvId: null, Dlvry_Pick: 'Cubao, QC', Dlvry_Drop: 'Ortigas, Pasig', Dlvry_Item: 'Electronics', Dlvry_Dist: 4.8, Dlvry_Fee: 240, Dlvry_Stat: 'Pending', Dlvry_Time: '2026-04-29 10:00:00', customer_name: 'Maria Santos', customer_phone: '09171111111' },
  { Dlvry_Id: 2002, Dlvry_DrvId: null, Dlvry_Pick: 'Alabang, Muntinlupa', Dlvry_Drop: 'Las Pinas City', Dlvry_Item: 'Food Package', Dlvry_Dist: 2.3, Dlvry_Fee: 115, Dlvry_Stat: 'Pending', Dlvry_Time: '2026-04-29 11:30:00', customer_name: 'Jose Reyes', customer_phone: '09172222222' },
];

const DEMO_REVIEWS = [
  { delivery_id: 1998, customer: 'Maria Santos', score: 5, comment: 'Smooth pickup and very careful handling.', date: '2026-04-27 09:30:00' },
  { delivery_id: 1995, customer: 'Jose Reyes', score: 4, comment: 'On time and easy to contact.', date: '2026-04-24 16:10:00' },
  { delivery_id: 1991, customer: 'Ana Cruz', score: 5, comment: 'Super bilis and friendly driver.', date: '2026-04-20 12:45:00' },
];

function StarRow({ score }) {
  return (
    <div className="flex items-center gap-1 text-sm">
      {[1, 2, 3, 4, 5].map(star => (
        <span key={star} className={star <= score ? 'text-yellow-400' : 'text-slate-300'}>★</span>
      ))}
    </div>
  );
}

export default function DriverDashboard({ user, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Orders');
  const [msg, setMsg] = useState({ text: '', success: true });

  const showMsg = (text, success = true) => {
    setMsg({ text, success });
    setTimeout(() => setMsg({ text: '', success: true }), 4000);
  };

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/get_orders.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: 'driver', user_id: user.id }),
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
      else setOrders(DEMO_DRIVER_ORDERS);
    } catch {
      setOrders(DEMO_DRIVER_ORDERS);
    }
    setLoading(false);
  };

  const loadReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`${API}/get_driver_profile.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driver_id: user.id }),
      });
      const data = await res.json();
      if (data.success) setReviews(data.reviews || []);
      else setReviews(DEMO_REVIEWS);
    } catch {
      setReviews(DEMO_REVIEWS);
    }
    setReviewsLoading(false);
  };

  useEffect(() => {
    loadOrders();
    loadReviews();
  }, []);

  const updateStatus = async (deliveryId, status) => {
    showMsg('', true);
    try {
      const res = await fetch(`${API}/update_status.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delivery_id: deliveryId, driver_id: user.id, status }),
      });
      const data = await res.json();
      showMsg(data.message, data.success);
      if (data.success) loadOrders();
    } catch {
      showMsg('Error updating status.', false);
    }
  };

  const pending = orders.filter(order => order.Dlvry_Stat === 'Pending');
  const ongoing = orders.filter(order => order.Dlvry_Stat === 'Ongoing' && String(order.Dlvry_DrvId) === String(user.id));
  const completed = orders.filter(order => order.Dlvry_Stat === 'Completed' && String(order.Dlvry_DrvId) === String(user.id));
  const reviewsByDelivery = new Map(reviews.map(review => [String(review.delivery_id), review]));
  const reviewCount = reviews.length;
  const avgRating = reviewCount
    ? (reviews.reduce((sum, review) => sum + Number(review.score || 0), 0) / reviewCount).toFixed(1)
    : '0.0';
  const commentedCount = reviews.filter(review => review.comment && review.comment.trim()).length;

  const TABS = ['Orders', 'My Deliveries', 'History', 'Ratings'];

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-white font-['Rubik']">
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
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`border-b-2 px-4 py-4 text-sm font-medium transition ${activeTab === tab ? 'border-[#f36f21] text-[#f36f21]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
              >
                {tab}
                {tab === 'Orders' && pending.length > 0 && (
                  <span className="ml-1 rounded-full bg-[#f36f21] px-1.5 py-0.5 text-[10px] text-white">{pending.length}</span>
                )}
                {tab === 'Ratings' && reviewCount > 0 && (
                  <span className="ml-1 rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] text-white">{reviewCount}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600">Driver {user.name}</span>
          <button onClick={onLogout} className="rounded border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50">
            Log out
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-8">
        {msg.text && (
          <div className={`mb-4 rounded-lg px-4 py-2 text-sm ${msg.success ? 'bg-green-50 text-green-700' : 'border border-red-200 bg-red-50 text-red-700'}`}>
            {msg.text}
          </div>
        )}

        {activeTab === 'Orders' && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">Available Orders</h1>
              <button onClick={loadOrders} className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">Refresh</button>
            </div>
            {loading ? (
              <div className="py-20 text-center text-slate-400">Loading...</div>
            ) : pending.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="mb-4 text-7xl">🚗</div>
                <p className="text-sm text-slate-500">No pending orders right now. Check back soon!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {pending.map(order => (
                  <div key={order.Dlvry_Id} className="rounded-xl border border-slate-200 p-5 shadow-sm transition hover:border-[#f36f21]">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Order #{order.Dlvry_Id}</p>
                        <p className="font-semibold text-slate-800">{order.Dlvry_Item}</p>
                      </div>
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">Pending</span>
                    </div>
                    <div className="mb-3 space-y-1 text-sm text-slate-600">
                      <p><span className="font-medium">From:</span> {order.Dlvry_Pick}</p>
                      <p><span className="font-medium">To:</span> {order.Dlvry_Drop}</p>
                      <p><span className="font-medium">Customer:</span> {order.customer_name} · {order.customer_phone}</p>
                      <p>{order.Dlvry_Dist} km · <span className="font-bold text-[#f36f21]">PHP {parseFloat(order.Dlvry_Fee).toFixed(2)}</span></p>
                    </div>
                    <button
                      onClick={() => updateStatus(order.Dlvry_Id, 'Ongoing')}
                      className="w-full rounded-lg bg-[#f36f21] py-2 text-sm font-bold text-white hover:brightness-105"
                    >
                      Accept Order
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'My Deliveries' && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-slate-800">My Deliveries</h1>
              <button onClick={loadOrders} className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">Refresh</button>
            </div>
            {ongoing.length === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="mb-4 text-7xl">📦</div>
                <p className="text-sm text-slate-500">No active deliveries. Accept an order to get started!</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {ongoing.map(order => (
                  <div key={order.Dlvry_Id} className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
                    <div className="mb-3 flex items-start justify-between">
                      <div>
                        <p className="text-xs text-slate-400">Order #{order.Dlvry_Id}</p>
                        <p className="font-semibold text-slate-800">{order.Dlvry_Item}</p>
                      </div>
                      <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">Ongoing</span>
                    </div>
                    <div className="mb-4 space-y-1 text-sm text-slate-600">
                      <p><span className="font-medium">From:</span> {order.Dlvry_Pick}</p>
                      <p><span className="font-medium">To:</span> {order.Dlvry_Drop}</p>
                      <p><span className="font-medium">Customer:</span> {order.customer_name} · {order.customer_phone}</p>
                      <p>{order.Dlvry_Dist} km · <span className="font-bold text-[#f36f21]">PHP {parseFloat(order.Dlvry_Fee).toFixed(2)}</span></p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => updateStatus(order.Dlvry_Id, 'Completed')}
                        className="flex-1 rounded-lg bg-green-500 py-2 text-sm font-bold text-white hover:brightness-105"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => updateStatus(order.Dlvry_Id, 'Cancelled')}
                        className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

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
                {completed.map(order => {
                  const review = reviewsByDelivery.get(String(order.Dlvry_Id));

                  return (
                    <div key={order.Dlvry_Id} className="rounded-lg border border-slate-200 p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-xs text-slate-400">Order #{order.Dlvry_Id} · {new Date(order.Dlvry_Time).toLocaleDateString()}</p>
                          <p className="font-medium text-slate-800">{order.Dlvry_Item}</p>
                          <p className="text-xs text-slate-500">{order.Dlvry_Pick} to {order.Dlvry_Drop}</p>
                        </div>
                        <div className="text-right">
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">Completed</span>
                          <p className="mt-1 text-sm font-bold text-[#f36f21]">PHP {parseFloat(order.Dlvry_Fee).toFixed(2)}</p>
                        </div>
                      </div>

                      {review && (
                        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-wide text-amber-700">Customer Rating</p>
                              <p className="mt-1 text-sm font-medium text-slate-700">{review.customer}</p>
                            </div>
                            <div className="text-right">
                              <StarRow score={Number(review.score || 0)} />
                              <p className="mt-1 text-xs text-slate-500">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            {review.comment?.trim() || 'No written comment left for this order.'}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === 'Ratings' && (
          <>
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Customer Ratings</h1>
                <p className="mt-1 text-sm text-slate-500">See the scores and comments customers left on your completed deliveries.</p>
              </div>
              <button onClick={loadReviews} className="rounded border border-slate-300 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">Refresh</button>
            </div>

            {reviewsLoading ? (
              <div className="py-20 text-center text-slate-400">Loading ratings...</div>
            ) : reviewCount === 0 ? (
              <div className="flex flex-col items-center py-20">
                <div className="mb-4 text-7xl">★</div>
                <p className="text-sm text-slate-500">No customer ratings yet.</p>
              </div>
            ) : (
              <>
                <div className="mb-6 grid gap-4 md:grid-cols-3">
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Average Rating</p>
                    <div className="mt-3 flex items-center gap-3">
                      <p className="text-3xl font-bold text-slate-800">{avgRating}</p>
                      <StarRow score={Math.round(Number(avgRating))} />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Total Ratings</p>
                    <p className="mt-3 text-3xl font-bold text-slate-800">{reviewCount}</p>
                  </div>
                  <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Comments Left</p>
                    <p className="mt-3 text-3xl font-bold text-slate-800">{commentedCount}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {reviews.map(review => (
                    <div key={`${review.delivery_id}-${review.date}`} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs text-slate-400">Order #{review.delivery_id}</p>
                          <p className="mt-1 font-semibold text-slate-800">{review.customer}</p>
                        </div>
                        <div className="text-right">
                          <StarRow score={Number(review.score || 0)} />
                          <p className="mt-1 text-xs text-slate-500">{new Date(review.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">
                        {review.comment?.trim() || 'No written comment left for this rating.'}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

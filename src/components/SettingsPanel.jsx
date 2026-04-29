import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API = 'http://localhost/lalamove-api';

const NAV = [
  { id: 'profile',      label: 'Profile',             icon: '👤' },
  { id: 'notifications',label: 'Notifications',        icon: '🔔' },
  { id: 'terms',        label: 'Terms & Conditions',   icon: '📄' },
];

export default function SettingsPanel({ user, role, onClose, onLogout }) {
  const [section, setSection] = useState('profile');

  // Profile state
  const [name, setName]       = useState(user.name    || '');
  const [phone, setPhone]     = useState(user.phone   || '');
  const [address, setAddress] = useState(user.address || '');
  const [payment, setPayment] = useState(user.payment || 'Cash');
  const [saveMsg, setSaveMsg] = useState('');
  const [saving, setSaving]   = useState(false);

  // Notification toggles
  const [notifs, setNotifs] = useState({
    orderUpdates:  true,
    promotions:    false,
    driverArrival: true,
    sms:           false,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveMsg(''); setSaving(true);
    try {
      const res  = await fetch(`${API}/update_profile.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, user_id: user.id, name, phone, address, payment }),
      });
      const data = await res.json();
      setSaveMsg(data.message);
    } catch { setSaveMsg('Cannot connect to server.'); }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 280 }}
        className="relative ml-auto flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-800">Settings</h2>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar nav */}
          <aside className="w-44 shrink-0 border-r border-slate-100 p-3">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setSection(n.id)}
                className={`mb-1 flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition ${
                  section === n.id ? 'bg-orange-50 font-medium text-[#f36f21]' : 'text-slate-600 hover:bg-slate-50'
                }`}>
                <span>{n.icon}</span>{n.label}
              </button>
            ))}

            <div className="mt-4 border-t border-slate-100 pt-4">
              <button onClick={() => { onClose(); onLogout(); }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-50">
                🚪 Log out
              </button>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Profile */}
            {section === 'profile' && (
              <div>
                <h3 className="mb-4 text-base font-bold text-slate-800">My Profile</h3>

                {/* Avatar */}
                <div className="mb-5 flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f36f21] text-2xl text-white font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${role === 'driver' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                      {role === 'driver' ? '🚗 Driver' : '👤 Customer'}
                    </span>
                  </div>
                </div>

                <form onSubmit={handleSave} className="space-y-3">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">Full Name</label>
                    <input value={name} onChange={e => setName(e.target.value)} required
                      className="h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-[#f36f21]" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">Email</label>
                    <input value={user.email} disabled
                      className="h-10 w-full rounded border border-slate-200 bg-slate-50 px-3 text-sm text-slate-400 outline-none" />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-500">Phone Number</label>
                    <input value={phone} onChange={e => setPhone(e.target.value)} required
                      className="h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-[#f36f21]" />
                  </div>
                  {role === 'customer' && (
                    <>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">Address</label>
                        <input value={address} onChange={e => setAddress(e.target.value)}
                          className="h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-[#f36f21]" />
                      </div>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-slate-500">Preferred Payment</label>
                        <select value={payment} onChange={e => setPayment(e.target.value)}
                          className="h-10 w-full rounded border border-slate-300 px-3 text-sm outline-none focus:border-[#f36f21]">
                          <option>Cash</option>
                          <option>GCash</option>
                          <option>Card</option>
                        </select>
                      </div>
                    </>
                  )}
                  {saveMsg && (
                    <p className={`text-xs ${saveMsg.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-500'}`}>{saveMsg}</p>
                  )}
                  <button type="submit" disabled={saving}
                    className="h-10 w-full rounded bg-[#f36f21] text-sm font-bold text-white hover:brightness-105 disabled:opacity-60">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications */}
            {section === 'notifications' && (
              <div>
                <h3 className="mb-4 text-base font-bold text-slate-800">Notifications</h3>
                <div className="space-y-4">
                  {[
                    { key: 'orderUpdates',  label: 'Order Updates',   desc: 'Get notified when your order status changes' },
                    { key: 'driverArrival', label: 'Driver Arrival',   desc: 'Alert when driver is nearby' },
                    { key: 'promotions',    label: 'Promotions',       desc: 'Receive deals and discount notifications' },
                    { key: 'sms',           label: 'SMS Notifications',desc: 'Receive updates via SMS' },
                  ].map(n => (
                    <div key={n.key} className="flex items-center justify-between rounded-lg border border-slate-200 p-3">
                      <div>
                        <p className="text-sm font-medium text-slate-700">{n.label}</p>
                        <p className="text-xs text-slate-400">{n.desc}</p>
                      </div>
                      <button onClick={() => setNotifs(prev => ({ ...prev, [n.key]: !prev[n.key] }))}
                        className={`relative h-6 w-11 rounded-full transition-colors ${notifs[n.key] ? 'bg-[#f36f21]' : 'bg-slate-200'}`}>
                        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${notifs[n.key] ? 'translate-x-5' : 'translate-x-0.5'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Terms */}
            {section === 'terms' && (
              <div>
                <h3 className="mb-4 text-base font-bold text-slate-800">Terms & Conditions</h3>
                <div className="space-y-4 text-sm text-slate-600">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="mb-2 font-semibold text-slate-800">1. Service Agreement</p>
                    <p>By using Lalamove, you agree to use the platform for lawful delivery purposes only. All deliveries must comply with local regulations.</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="mb-2 font-semibold text-slate-800">2. User Responsibilities</p>
                    <p>Customers are responsible for accurate pickup and drop-off information. Drivers must maintain valid licenses and vehicle registration.</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="mb-2 font-semibold text-slate-800">3. Payment Policy</p>
                    <p>Fees are calculated based on distance and vehicle type. Payments must be settled upon delivery completion.</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="mb-2 font-semibold text-slate-800">4. Privacy Policy</p>
                    <p>Your personal data is protected and will not be shared with third parties without your consent.</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <p className="mb-2 font-semibold text-slate-800">5. Cancellation Policy</p>
                    <p>Orders may be cancelled before a driver accepts. Cancellations after acceptance may incur a fee.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

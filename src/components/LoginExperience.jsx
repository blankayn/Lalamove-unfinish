import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerDashboard from './CustomerDashboard';
import DriverDashboard from './DriverDashboard';
import vehiclesBg from '../assets/bgremove.png';

const EASE = [0.2, 0.8, 0.2, 1];

// ── Static demo accounts (no XAMPP needed) ──
const DEMO_ACCOUNTS = [
  { role: 'customer', email: 'customer@demo.com', password: '123456', user: { id: 1, name: 'Juan Dela Cruz', email: 'customer@demo.com', phone: '09171234567', address: 'Makati City, Metro Manila', payment: 'GCash' } },
  { role: 'driver',   email: 'driver@demo.com',   password: '123456', user: { id: 1, name: 'Pedro Santos',   email: 'driver@demo.com',   phone: '09181234567', status: 'Available' } },
];

export default function LoginExperience() {
  const [loggedIn, setLoggedIn]   = useState(false);
  const [user, setUser]           = useState(null);
  const [role, setRole]           = useState('customer');
  const [isRegister, setIsRegister] = useState(false);

  // Login state
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  // Register state
  const [regName, setRegName]       = useState('');
  const [regEmail, setRegEmail]     = useState('');
  const [regPhone, setRegPhone]     = useState('');
  const [regPass, setRegPass]       = useState('');
  const [regAddr, setRegAddr]       = useState('');
  const [regLic, setRegLic]         = useState('');
  const [regMsg, setRegMsg]         = useState('');

  const handleLogout = () => { setLoggedIn(false); setUser(null); setEmail(''); setPassword(''); };

  if (loggedIn && role === 'customer') return <CustomerDashboard user={user} onLogout={handleLogout} />;
  if (loggedIn && role === 'driver')   return <DriverDashboard   user={user} onLogout={handleLogout} />;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);

    // Check static demo accounts first
    const match = DEMO_ACCOUNTS.find(a => a.role === role && a.email === email && a.password === password);
    if (match) {
      setTimeout(() => { setUser(match.user); setLoggedIn(true); setLoading(false); }, 500);
      return;
    }

    // Fall back to XAMPP if running locally
    try {
      const res  = await fetch(`http://localhost/lalamove-api/login.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email, password }),
      });
      const data = await res.json();
      if (data.success) { setUser(data.user); setLoggedIn(true); }
      else setError(data.message);
    } catch {
      setError('Invalid email or password.');
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegMsg('');
    try {
      const res  = await fetch(`http://localhost/lalamove-api/register.php`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, name: regName, email: regEmail, phone: regPhone, password: regPass, address: regAddr, license: regLic }),
      });
      const data = await res.json();
      setRegMsg(data.message);
      if (data.success) setTimeout(() => { setIsRegister(false); setRegMsg(''); }, 1500);
    } catch {
      setRegMsg('Registration requires local XAMPP setup. Use demo account to explore.');
    }
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden font-['Rubik']" style={{ background: '#edecea' }}>
      <img src={vehiclesBg} alt="" className="pointer-events-none absolute bottom-0 left-0 h-[90%] w-auto select-none object-contain" />

      <div className="relative z-10 flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="w-full max-w-[380px] rounded-xl bg-white p-8 shadow-[0_4px_32px_rgba(0,0,0,0.10)]"
        >
          {/* Logo */}
          <div className="mb-5 flex items-center justify-center gap-2">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <path d="M20 2C10 2 2 10 2 20s8 18 18 18 18-8 18-18S30 2 20 2z" fill="#f36f21"/>
              <path d="M28 12l-6 4-2-4-4 2 3 5-7 9h6l3-4 4 2 5-8-2-6z" fill="white"/>
            </svg>
            <span className="text-xl font-black uppercase tracking-tight text-[#f36f21]">LALAMOVE</span>
          </div>

          {/* Role toggle */}
          <div className="mb-5 flex rounded-lg border border-slate-200 p-1">
            {['customer', 'driver'].map(r => (
              <button key={r} onClick={() => { setRole(r); setError(''); setRegMsg(''); }}
                className={`flex-1 rounded-md py-2 text-sm font-semibold capitalize transition ${
                  role === r ? 'bg-[#f36f21] text-white shadow' : 'text-slate-500 hover:text-slate-700'
                }`}>
                {r === 'customer' ? '👤 Customer' : '🚗 Driver'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!isRegister ? (
              <motion.form key="login" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }} onSubmit={handleLogin} className="space-y-3">
                <input type="text" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required
                  className="h-11 w-full rounded border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required
                    className="h-11 w-full rounded border border-slate-300 px-3 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    }
                  </button>
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <div className="text-right"><span className="cursor-pointer text-xs text-[#f36f21] hover:underline">Forgot password?</span></div>
                <button type="submit" disabled={loading}
                  className="h-11 w-full rounded bg-[#f36f21] text-sm font-bold text-white hover:brightness-105 disabled:opacity-60">
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
                <div className="flex items-center gap-3"><div className="flex-1 border-t border-slate-200"/><span className="text-xs text-slate-400">Or</span><div className="flex-1 border-t border-slate-200"/></div>
                <button type="button" className="flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 text-sm font-medium text-[#1877f2] hover:bg-slate-50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  Continue with Facebook
                </button>
                <button type="button" className="flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Continue with Google
                </button>
                <p className="text-center text-xs text-slate-500">
                  New to Lalamove?{' '}
                  <span onClick={() => { setIsRegister(true); setError(''); }} className="cursor-pointer font-semibold text-[#f36f21] hover:underline">Create a free account</span>
                </p>
                {/* Demo hint */}
                <div className="rounded-lg border border-orange-200 bg-orange-50 p-3 text-xs text-slate-600">
                  <p className="mb-1 font-semibold text-[#f36f21]">Demo Accounts</p>
                  <p>👤 Customer: <span className="font-mono">customer@demo.com</span></p>
                  <p>🚗 Driver: <span className="font-mono">driver@demo.com</span></p>
                  <p className="mt-1 text-slate-400">Password: <span className="font-mono">123456</span></p>
                </div>
              </motion.form>
            ) : (
              <motion.form key="register" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }} onSubmit={handleRegister} className="space-y-2.5">
                <input type="text" placeholder="Full name" value={regName} onChange={e => setRegName(e.target.value)} required
                  className="h-11 w-full rounded border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
                <input type="email" placeholder="Email address" value={regEmail} onChange={e => setRegEmail(e.target.value)} required
                  className="h-11 w-full rounded border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
                <input type="text" placeholder="Phone number" value={regPhone} onChange={e => setRegPhone(e.target.value)} required
                  className="h-11 w-full rounded border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
                {role === 'customer' && (
                  <input type="text" placeholder="Address" value={regAddr} onChange={e => setRegAddr(e.target.value)} required
                    className="h-11 w-full rounded border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
                )}
                {role === 'driver' && (
                  <input type="text" placeholder="Driver license number" value={regLic} onChange={e => setRegLic(e.target.value)} required
                    className="h-11 w-full rounded border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
                )}
                <input type="password" placeholder="Password (min 6 characters)" value={regPass} onChange={e => setRegPass(e.target.value)} required
                  className="h-11 w-full rounded border border-slate-300 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21]" />
                {regMsg && <p className={`text-xs ${regMsg.toLowerCase().includes('success') || regMsg.toLowerCase().includes('created') ? 'text-green-600' : 'text-red-500'}`}>{regMsg}</p>}
                <button type="submit" className="h-11 w-full rounded bg-[#f36f21] text-sm font-bold text-white hover:brightness-105">
                  Create Account
                </button>
                <p className="text-center text-xs text-slate-500">
                  Already have an account?{' '}
                  <span onClick={() => { setIsRegister(false); setRegMsg(''); }} className="cursor-pointer font-semibold text-[#f36f21] hover:underline">Log In</span>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="absolute bottom-5 inset-x-0 z-10 flex justify-center gap-4 text-xs text-slate-400">
        <span className="cursor-pointer hover:text-[#f36f21]">Terms &amp; Conditions</span>
        <span>·</span>
        <span className="cursor-pointer hover:text-[#f36f21]">Privacy Notice</span>
      </div>
    </div>
  );
}

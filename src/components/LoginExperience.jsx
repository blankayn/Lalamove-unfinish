import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CustomerDashboard from './CustomerDashboard';
import DriverDashboard from './DriverDashboard';
import vehiclesBg from '../assets/bgremove.png';

const EASE = [0.2, 0.8, 0.2, 1];

const INITIAL_DEMO_ACCOUNTS = [
  { role: 'customer', email: 'customer@demo.com', password: '123456', user: { id: 1, name: 'Juan Dela Cruz', email: 'customer@demo.com', phone: '09171234567', address: 'Makati City, Metro Manila', payment: 'GCash' } },
  { role: 'driver', email: 'driver@demo.com', password: '123456', user: { id: 1, name: 'Pedro Santos', email: 'driver@demo.com', phone: '09181234567', status: 'Available', vehicle_type: 'Motorcycle' } },
];

const DRIVER_VEHICLE_OPTIONS = [
  'Motorcycle',
  '200 kg Sedan',
  '300 kg Small Crossover SUV',
  '600 kg 7-seater SUV/Minivan',
  '1000 kg Truck',
];

const API = 'http://localhost/lalamove-api';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_REGEX = /^[a-zA-ZÀ-ÿ\s'-]+$/u;
const PHONE_REGEX = /^[0-9+\-\s]{7,15}$/;

async function parseJsonResponse(res, fallbackMessage) {
  const raw = await res.text();
  let data = {};

  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(fallbackMessage);
  }

  if (!res.ok) {
    throw new Error(data.message || fallbackMessage);
  }

  return data;
}

export default function LoginExperience({ onBack }) {
  const [demoAccounts, setDemoAccounts] = useState(INITIAL_DEMO_ACCOUNTS);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState('customer');
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loginErrors, setLoginErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [regFname, setRegFname] = useState('');
  const [regLname, setRegLname] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirmPass, setRegConfirmPass] = useState('');
  const [regAddr, setRegAddr] = useState('');
  const [regLic, setRegLic] = useState('');
  const [regPlate, setRegPlate] = useState('');
  const [regVehicleType, setRegVehicleType] = useState(DRIVER_VEHICLE_OPTIONS[0]);
  const [vehicleOptions, setVehicleOptions] = useState(DRIVER_VEHICLE_OPTIONS);
  const [regMsg, setRegMsg] = useState('');
  const [regErrors, setRegErrors] = useState({});
  const [regLoading, setRegLoading] = useState(false);

  const [isForgotPass, setIsForgotPass] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotNewPass, setForgotNewPass] = useState('');
  const [forgotConfirmPass, setForgotConfirmPass] = useState('');
  const [forgotMsg, setForgotMsg] = useState('');
  const [forgotErrors, setForgotErrors] = useState({});
  const [forgotLoading, setForgotLoading] = useState(false);

  const handleLogout = () => {
    setLoggedIn(false);
    setUser(null);
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    fetch(`${API}/get_vehicle_types.php`)
      .then(res => res.json())
      .then(data => {
        if (!data.success || !Array.isArray(data.vehicles) || data.vehicles.length === 0) return;
        const names = data.vehicles.map(vehicle => vehicle.name);
        setVehicleOptions(names);
        setRegVehicleType(current => (names.includes(current) ? current : names[0]));
      })
      .catch(() => {});
  }, []);

  if (loggedIn && role === 'customer') return <CustomerDashboard user={user} onLogout={handleLogout} />;
  if (loggedIn && role === 'driver') return <DriverDashboard user={user} onLogout={handleLogout} />;

  const handleLogin = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(email.trim())) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';

    if (Object.keys(errs).length > 0) {
      setLoginErrors(errs);
      setLoading(false);
      return;
    }
    setLoginErrors({});

    try {
      const res = await fetch(`${API}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, email: email.trim(), password }),
      });
      const data = await parseJsonResponse(res, 'Login failed. Please try again.');

      if (data.success) {
        setUser(data.user);
        setLoggedIn(true);
      } else {
        const match = demoAccounts.find(a => a.role === role && a.email === email.trim() && a.password === password);
        if (match) {
          setTimeout(() => {
            setUser(match.user);
            setLoggedIn(true);
          }, 500);
        } else {
          setError(data.message || 'Invalid email or password.');
        }
      }
    } catch (err) {
      const match = demoAccounts.find(a => a.role === role && a.email === email.trim() && a.password === password);
      if (match) {
        setTimeout(() => {
          setUser(match.user);
          setLoggedIn(true);
        }, 500);
      } else {
        setError(err.message || 'Cannot connect to the server. Make sure XAMPP MySQL and Apache are running.');
      }
    }

    setLoading(false);
  };

  const handleRegister = async e => {
    e.preventDefault();
    setRegMsg('');
    setRegLoading(true);

    const errs = {};
    if (!regFname.trim()) errs.fname = 'First name is required.';
    else if (!NAME_REGEX.test(regFname.trim())) errs.fname = 'First name must contain letters only.';
    if (!regLname.trim()) errs.lname = 'Last name is required.';
    else if (!NAME_REGEX.test(regLname.trim())) errs.lname = 'Last name must contain letters only.';
    if (!regEmail.trim()) errs.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(regEmail.trim())) errs.email = 'Enter a valid email address.';
    if (!regPhone.trim()) errs.phone = 'Phone number is required.';
    else if (!PHONE_REGEX.test(regPhone.trim())) errs.phone = 'Enter a valid phone number.';
    if (role === 'customer' && !regAddr.trim()) errs.addr = 'Address is required.';
    if (role === 'driver' && !regLic.trim()) errs.lic = 'License number is required.';
    if (role === 'driver' && !regPlate.trim()) errs.plate = 'Plate number is required.';
    if (!regPass) errs.pass = 'Password is required.';
    else if (regPass.length < 6) errs.pass = 'Password must be at least 6 characters.';
    if (!regConfirmPass) errs.confirmPass = 'Please confirm your password.';
    else if (regPass !== regConfirmPass) errs.confirmPass = 'Passwords do not match.';

    if (Object.keys(errs).length > 0) {
      setRegErrors(errs);
      setRegLoading(false);
      return;
    }
    setRegErrors({});

    try {
      const res = await fetch(`${API}/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          name: `${regFname.trim()} ${regLname.trim()}`,
          fname: regFname.trim(),
          lname: regLname.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          password: regPass,
          address: regAddr.trim(),
          license: regLic.trim(),
          plate: regPlate.trim(),
          vehicle_type: regVehicleType,
        }),
      });
      const data = await parseJsonResponse(res, 'Registration failed. Please try again.');
      setRegMsg(data.message);

      if (data.success) {
        setTimeout(() => {
          setIsRegister(false);
          setRegMsg('');
          setRegFname('');
          setRegLname('');
          setRegEmail('');
          setRegPhone('');
          setRegPass('');
          setRegConfirmPass('');
          setRegAddr('');
          setRegLic('');
          setRegPlate('');
        }, 1500);
      }
    } catch (err) {
      setRegMsg(err.message || 'Registration requires local XAMPP setup. Use demo account to explore.');
    }

    setRegLoading(false);
  };

  const handleForgotPassword = async e => {
    e.preventDefault();
    setForgotMsg('');
    setForgotLoading(true);

    const errs = {};
    if (!forgotEmail.trim()) errs.email = 'Email is required.';
    else if (!EMAIL_REGEX.test(forgotEmail.trim())) errs.email = 'Enter a valid email address.';
    if (!forgotPhone.trim()) errs.phone = 'Phone number is required.';
    else if (!PHONE_REGEX.test(forgotPhone.trim())) errs.phone = 'Enter a valid phone number.';
    if (!forgotNewPass) errs.newPassword = 'New password is required.';
    else if (forgotNewPass.length < 6) errs.newPassword = 'New password must be at least 6 characters.';
    if (!forgotConfirmPass) errs.confirmPassword = 'Please confirm your new password.';
    else if (forgotNewPass !== forgotConfirmPass) errs.confirmPassword = 'Passwords do not match.';

    if (Object.keys(errs).length > 0) {
      setForgotErrors(errs);
      setForgotLoading(false);
      return;
    }
    setForgotErrors({});

    try {
      const res = await fetch(`${API}/forgot_password.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role,
          email: forgotEmail.trim(),
          phone: forgotPhone.trim(),
          new_password: forgotNewPass,
        }),
      });
      const data = await parseJsonResponse(res, 'Password reset failed. Please try again.');
      setForgotMsg(data.message);

      if (data.success) {
        setTimeout(() => {
          setIsForgotPass(false);
          setForgotMsg('');
          setForgotEmail('');
          setForgotPhone('');
          setForgotNewPass('');
          setForgotConfirmPass('');
          setForgotErrors({});
        }, 1500);
      }
    } catch (err) {
      const demoMatch = demoAccounts.find(
        account =>
          account.role === role &&
          account.email === forgotEmail.trim() &&
          account.user.phone === forgotPhone.trim()
      );

      if (demoMatch) {
        setDemoAccounts(current =>
          current.map(account =>
            account.role === role &&
            account.email === forgotEmail.trim() &&
            account.user.phone === forgotPhone.trim()
              ? { ...account, password: forgotNewPass }
              : account
          )
        );
        setForgotMsg('Password updated successfully. You can now log in.');
        setTimeout(() => {
          setIsForgotPass(false);
          setForgotMsg('');
          setForgotEmail('');
          setForgotPhone('');
          setForgotNewPass('');
          setForgotConfirmPass('');
          setForgotErrors({});
        }, 1500);
      } else {
        setForgotMsg(err.message || 'Cannot connect. Make sure XAMPP is running.');
      }
    }

    setForgotLoading(false);
  };

  return (
    <div className="relative h-screen w-screen overflow-hidden font-['Rubik']" style={{ background: '#edecea' }}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="absolute left-5 top-5 z-20 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-white"
        >
          Back to landing
        </button>
      )}

      <img src={vehiclesBg} alt="" className="pointer-events-none absolute bottom-0 left-0 h-[90%] w-auto select-none object-contain" />

      <div className="relative z-10 flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="w-full max-w-[380px] rounded-xl bg-white p-8 shadow-[0_4px_32px_rgba(0,0,0,0.10)]"
        >
          <div className="mb-5 flex items-center justify-center gap-2">
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <path d="M20 2C10 2 2 10 2 20s8 18 18 18 18-8 18-18S30 2 20 2z" fill="#f36f21" />
              <path d="M28 12l-6 4-2-4-4 2 3 5-7 9h6l3-4 4 2 5-8-2-6z" fill="white" />
            </svg>
            <span className="text-xl font-black uppercase tracking-tight text-[#f36f21]">LALAMOVE</span>
          </div>

          <div className="mb-5 flex rounded-lg border border-slate-200 p-1">
            {['customer', 'driver'].map(r => (
              <button
                key={r}
                onClick={() => {
                  setRole(r);
                  setError('');
                  setRegMsg('');
                  setForgotMsg('');
                  setLoginErrors({});
                  setRegErrors({});
                  setForgotErrors({});
                }}
                className={`flex-1 rounded-md py-2 text-sm font-semibold capitalize transition ${role === r ? 'bg-[#f36f21] text-white shadow' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {r === 'customer' ? 'Customer' : 'Driver'}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {!isRegister && !isForgotPass ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleLogin}
                className="space-y-3"
              >
                <div>
                  <input
                    type="text"
                    placeholder="Email address"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      setError('');
                      setLoginErrors(current => ({ ...current, email: '' }));
                    }}
                    className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${loginErrors.email ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  {loginErrors.email && <p className="mt-0.5 text-[10px] text-red-500">{loginErrors.email}</p>}
                </div>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Password"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                      setError('');
                      setLoginErrors(current => ({ ...current, password: '' }));
                    }}
                    className={`h-11 w-full rounded border px-3 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${loginErrors.password ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPass
                      ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                      : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                    }
                  </button>
                  {loginErrors.password && <p className="mt-0.5 text-[10px] text-red-500">{loginErrors.password}</p>}
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <div className="text-right"><span onClick={() => { setIsForgotPass(true); setError(''); setLoginErrors({}); }} className="cursor-pointer text-xs text-[#f36f21] hover:underline">Forgot password?</span></div>
                <button type="submit" disabled={loading} className="h-11 w-full rounded bg-[#f36f21] text-sm font-bold text-white hover:brightness-105 disabled:opacity-60">
                  {loading ? 'Logging in...' : 'Log In'}
                </button>
                <div className="flex items-center gap-3"><div className="flex-1 border-t border-slate-200" /><span className="text-xs text-slate-400">Or</span><div className="flex-1 border-t border-slate-200" /></div>
                <button type="button" className="flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 text-sm font-medium text-[#1877f2] hover:bg-slate-50">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877f2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                  Continue with Facebook
                </button>
                <button type="button" className="flex h-10 w-full items-center justify-center gap-2 rounded border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                  Continue with Google
                </button>
                <p className="text-center text-xs text-slate-500">
                  New to Lalamove?{' '}
                  <span onClick={() => { setIsRegister(true); setError(''); }} className="cursor-pointer font-semibold text-[#f36f21] hover:underline">Create a free account</span>
                </p>
              </motion.form>
            ) : isForgotPass ? (
              <motion.form
                key="forgot"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleForgotPassword}
                className="space-y-3"
              >
                <div className="mb-2">
                  <h3 className="text-base font-bold text-slate-800">Reset Password</h3>
                  <p className="mt-1 text-xs text-slate-500">Enter your email and phone number on file to verify your account.</p>
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={forgotEmail}
                    onChange={e => {
                      setForgotEmail(e.target.value);
                      setForgotMsg('');
                      setForgotErrors(current => ({ ...current, email: '' }));
                    }}
                    className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${forgotErrors.email ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  {forgotErrors.email && <p className="mt-0.5 text-[10px] text-red-500">{forgotErrors.email}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={forgotPhone}
                    onChange={e => {
                      setForgotPhone(e.target.value);
                      setForgotMsg('');
                      setForgotErrors(current => ({ ...current, phone: '' }));
                    }}
                    className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${forgotErrors.phone ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  {forgotErrors.phone && <p className="mt-0.5 text-[10px] text-red-500">{forgotErrors.phone}</p>}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="New password (min 6 characters)"
                    value={forgotNewPass}
                    onChange={e => {
                      setForgotNewPass(e.target.value);
                      setForgotMsg('');
                      setForgotErrors(current => ({ ...current, newPassword: '' }));
                    }}
                    className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${forgotErrors.newPassword ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  {forgotErrors.newPassword && <p className="mt-0.5 text-[10px] text-red-500">{forgotErrors.newPassword}</p>}
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={forgotConfirmPass}
                    onChange={e => {
                      setForgotConfirmPass(e.target.value);
                      setForgotMsg('');
                      setForgotErrors(current => ({ ...current, confirmPassword: '' }));
                    }}
                    className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${forgotErrors.confirmPassword ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  {forgotErrors.confirmPassword && <p className="mt-0.5 text-[10px] text-red-500">{forgotErrors.confirmPassword}</p>}
                </div>
                {forgotMsg && (
                  <div className={`rounded-lg px-3 py-2 text-xs ${forgotMsg.toLowerCase().includes('success') || forgotMsg.toLowerCase().includes('can now log in') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-500'}`}>
                    {forgotMsg}
                  </div>
                )}
                <button type="submit" disabled={forgotLoading} className="h-11 w-full rounded bg-[#f36f21] text-sm font-bold text-white hover:brightness-105 disabled:opacity-60">
                  {forgotLoading ? 'Updating...' : 'Update Password'}
                </button>
                <p className="text-center text-xs text-slate-500">
                  Remembered your password?{' '}
                  <span onClick={() => { setIsForgotPass(false); setForgotMsg(''); setForgotEmail(''); setForgotPhone(''); setForgotNewPass(''); setForgotConfirmPass(''); setForgotErrors({}); }} className="cursor-pointer font-semibold text-[#f36f21] hover:underline">Back to Login</span>
                </p>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleRegister}
                className="space-y-2.5"
              >
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="First name"
                      value={regFname}
                      onChange={e => {
                        setRegFname(e.target.value);
                        setRegMsg('');
                        setRegErrors(current => ({ ...current, fname: '' }));
                      }}
                      className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${regErrors.fname ? 'border-red-400' : 'border-slate-300'}`}
                    />
                    {regErrors.fname && <p className="mt-0.5 text-[10px] text-red-500">{regErrors.fname}</p>}
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Last name"
                      value={regLname}
                      onChange={e => {
                        setRegLname(e.target.value);
                        setRegMsg('');
                        setRegErrors(current => ({ ...current, lname: '' }));
                      }}
                      className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${regErrors.lname ? 'border-red-400' : 'border-slate-300'}`}
                    />
                    {regErrors.lname && <p className="mt-0.5 text-[10px] text-red-500">{regErrors.lname}</p>}
                  </div>
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email address"
                    value={regEmail}
                    onChange={e => {
                      setRegEmail(e.target.value);
                      setRegMsg('');
                      setRegErrors(current => ({ ...current, email: '' }));
                    }}
                    className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${regErrors.email ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  {regErrors.email && <p className="mt-0.5 text-[10px] text-red-500">{regErrors.email}</p>}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Phone number"
                    value={regPhone}
                    onChange={e => {
                      setRegPhone(e.target.value);
                      setRegMsg('');
                      setRegErrors(current => ({ ...current, phone: '' }));
                    }}
                    className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${regErrors.phone ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  {regErrors.phone && <p className="mt-0.5 text-[10px] text-red-500">{regErrors.phone}</p>}
                </div>

                {role === 'customer' && (
                  <div>
                    <input
                      type="text"
                      placeholder="Address"
                      value={regAddr}
                      onChange={e => {
                        setRegAddr(e.target.value);
                        setRegMsg('');
                        setRegErrors(current => ({ ...current, addr: '' }));
                      }}
                      className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${regErrors.addr ? 'border-red-400' : 'border-slate-300'}`}
                    />
                    {regErrors.addr && <p className="mt-0.5 text-[10px] text-red-500">{regErrors.addr}</p>}
                  </div>
                )}

                {role === 'driver' && (
                  <>
                    <div>
                      <input
                        type="text"
                        placeholder="Driver license number"
                        value={regLic}
                        onChange={e => {
                          setRegLic(e.target.value);
                          setRegMsg('');
                          setRegErrors(current => ({ ...current, lic: '' }));
                        }}
                        className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${regErrors.lic ? 'border-red-400' : 'border-slate-300'}`}
                      />
                      {regErrors.lic && <p className="mt-0.5 text-[10px] text-red-500">{regErrors.lic}</p>}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Plate number"
                        value={regPlate}
                        onChange={e => {
                          setRegPlate(e.target.value.toUpperCase());
                          setRegMsg('');
                          setRegErrors(current => ({ ...current, plate: '' }));
                        }}
                        className={`h-11 w-full rounded border px-3 text-sm uppercase outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${regErrors.plate ? 'border-red-400' : 'border-slate-300'}`}
                      />
                      {regErrors.plate && <p className="mt-0.5 text-[10px] text-red-500">{regErrors.plate}</p>}
                    </div>
                    <select value={regVehicleType} onChange={e => setRegVehicleType(e.target.value)} required className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none focus:border-[#f36f21]">
                      {vehicleOptions.map(option => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </>
                )}

                <div>
                  <input
                    type="password"
                    placeholder="Password (min 6 characters)"
                    value={regPass}
                    onChange={e => {
                      setRegPass(e.target.value);
                      setRegMsg('');
                      setRegErrors(current => ({ ...current, pass: '' }));
                    }}
                    className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${regErrors.pass ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  {regErrors.pass && <p className="mt-0.5 text-[10px] text-red-500">{regErrors.pass}</p>}
                </div>

                <div>
                  <input
                    type="password"
                    placeholder="Confirm password"
                    value={regConfirmPass}
                    onChange={e => {
                      setRegConfirmPass(e.target.value);
                      setRegMsg('');
                      setRegErrors(current => ({ ...current, confirmPass: '' }));
                    }}
                    className={`h-11 w-full rounded border px-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#f36f21] ${regErrors.confirmPass ? 'border-red-400' : 'border-slate-300'}`}
                  />
                  {regErrors.confirmPass && <p className="mt-0.5 text-[10px] text-red-500">{regErrors.confirmPass}</p>}
                </div>

                {regMsg && <p className={`text-xs ${regMsg.toLowerCase().includes('success') || regMsg.toLowerCase().includes('created') ? 'text-green-600' : 'text-red-500'}`}>{regMsg}</p>}
                <button type="submit" disabled={regLoading} className="h-11 w-full rounded bg-[#f36f21] text-sm font-bold text-white hover:brightness-105 disabled:opacity-60">
                  {regLoading ? 'Creating Account...' : 'Create Account'}
                </button>
                <p className="text-center text-xs text-slate-500">
                  Already have an account?{' '}
                  <span onClick={() => { setIsRegister(false); setRegMsg(''); setRegErrors({}); }} className="cursor-pointer font-semibold text-[#f36f21] hover:underline">Log In</span>
                </p>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <div className="absolute bottom-5 inset-x-0 z-10 flex justify-center gap-4 text-xs text-slate-400">
        <span className="cursor-pointer hover:text-[#f36f21]">Terms &amp; Conditions</span>
        <span>&middot;</span>
        <span className="cursor-pointer hover:text-[#f36f21]">Privacy Notice</span>
      </div>
    </div>
  );
}

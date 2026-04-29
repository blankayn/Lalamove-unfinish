import { useState } from 'react';
import { motion } from 'framer-motion';
import Dashboard from './Dashboard';
import IsometricVehicles from './IsometricVehicles';

const EASE = [0.2, 0.8, 0.2, 1];

export default function LoginExperience() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showPass, setShowPass] = useState(false);

  if (loggedIn) {
    return <Dashboard onLogout={() => setLoggedIn(false)} />;
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden font-['Rubik']" style={{ background: '#f0eeeb' }}>

      {/* Isometric vehicle illustration — left side */}
      <IsometricVehicles />

      {/* Center login card */}
      <div className="relative z-10 flex h-full items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="w-full max-w-[360px] rounded-xl bg-white p-8 shadow-[0_4px_32px_rgba(0,0,0,0.10)]"
        >
          {/* Logo */}
          <div className="mb-6 flex items-center justify-center gap-2">
            {/* Lalamove bird icon */}
            <svg width="30" height="30" viewBox="0 0 40 40" fill="none">
              <path d="M20 2C10 2 2 10 2 20s8 18 18 18 18-8 18-18S30 2 20 2z" fill="#f36f21"/>
              <path d="M28 12l-6 4-2-4-4 2 3 5-7 9h6l3-4 4 2 5-8-2-6z" fill="white"/>
            </svg>
            <span className="text-[22px] font-black uppercase tracking-tight text-[#f36f21]">LALAMOVE</span>
          </div>

          {/* Country + phone row */}
          <div className="mb-3 flex gap-2">
            <div className="relative shrink-0">
              <select className="h-11 w-[130px] appearance-none rounded border border-slate-300 bg-white pl-3 pr-7 text-sm text-slate-700 outline-none focus:border-[#f36f21]">
                <option>Philippines</option>
                <option>Singapore</option>
                <option>Malaysia</option>
                <option>Hong Kong</option>
              </select>
              <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">▾</span>
            </div>
            <input
              type="text"
              placeholder="Phone number or email"
              className="h-11 flex-1 rounded border border-slate-300 px-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#f36f21]"
            />
          </div>

          {/* Password */}
          <div className="relative mb-1">
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              className="h-11 w-full rounded border border-slate-300 px-3 pr-10 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-[#f36f21]"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              aria-label="Toggle password visibility"
            >
              {showPass ? (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              ) : (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
              )}
            </button>
          </div>

          {/* Forgot password */}
          <div className="mb-4 text-right">
            <span className="cursor-pointer text-sm text-[#f36f21] hover:underline">Forgot password?</span>
          </div>

          {/* Log In */}
          <button
            onClick={() => setLoggedIn(true)}
            className="mb-4 h-11 w-full rounded bg-[#f36f21] text-sm font-bold text-white transition hover:brightness-105 active:scale-95"
          >
            Log In
          </button>

          {/* Divider */}
          <div className="mb-4 flex items-center gap-3">
            <div className="flex-1 border-t border-slate-200" />
            <span className="text-xs text-slate-400">Or</span>
            <div className="flex-1 border-t border-slate-200" />
          </div>

          {/* Facebook */}
          <button className="mb-2 flex h-11 w-full items-center justify-center gap-3 rounded border border-slate-300 bg-white text-sm font-semibold text-[#1877f2] transition hover:bg-slate-50">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877f2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>

          {/* Google */}
          <button className="flex h-11 w-full items-center justify-center gap-3 rounded border border-slate-300 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign up */}
          <p className="mt-5 text-center text-sm text-slate-500">
            New to Lalamove?{' '}
            <span className="cursor-pointer font-semibold text-[#f36f21] hover:underline">Create a free account</span>
          </p>
        </motion.div>
      </div>

      {/* Bottom footer */}
      <div className="absolute bottom-5 inset-x-0 z-10 flex justify-center gap-4 text-xs text-slate-400">
        <span className="cursor-pointer hover:text-[#f36f21]">Terms &amp; Conditions</span>
        <span>·</span>
        <span className="cursor-pointer hover:text-[#f36f21]">Privacy Notice</span>
      </div>
    </div>
  );
}

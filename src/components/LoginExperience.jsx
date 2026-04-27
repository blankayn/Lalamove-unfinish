import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import Dashboard from './Dashboard';

const EASE = [0.2, 0.8, 0.2, 1];

export default function LoginExperience() {
  const [showLogin, setShowLogin] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return <Dashboard onLogout={() => setLoggedIn(false)} />;
  }

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-[#0a0d12] font-['Rubik']">

      {/* Spline 3D background */}
      <spline-viewer
        url="https://prod.spline.design/Cvr5wRDAZJctmVPj/scene.splinecode"
        className="absolute inset-0 h-full w-full"
      />

      {/* Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />

      {/* Navbar */}
      <nav className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-8 py-5">
        <span className="text-2xl font-black italic uppercase tracking-tight text-[#f36f21]">
          Lalamove
        </span>
        <button
          onClick={() => setShowLogin(true)}
          className="rounded-full bg-[#f36f21] px-6 py-2 text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-110 active:scale-95"
        >
          Log In
        </button>
      </nav>

      {/* Footer */}
      <footer className="absolute inset-x-0 bottom-0 z-40 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-4">
          <p className="text-xs text-white/60">© 2026 Lalamove. All rights reserved.</p>
          <nav className="flex gap-5 text-xs text-white/70">
            <a href="#" className="transition hover:text-[#f36f21]">Services</a>
            <a href="#" className="transition hover:text-[#f36f21]">Pricing</a>
            <a href="#" className="transition hover:text-[#f36f21]">Contact</a>
            <a href="#" className="transition hover:text-[#f36f21]">Privacy</a>
          </nav>
        </div>
      </footer>

      {/* Login modal */}
      <AnimatePresence>
        {showLogin && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 z-40 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowLogin(false)}
            />

            {/* Card */}
            <motion.section
              key="login"
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.96 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="absolute inset-0 z-50 m-auto h-fit w-full max-w-[380px] rounded-2xl border border-slate-200/60 bg-white p-7 shadow-[0_30px_90px_rgba(0,0,0,0.45)]"
              style={{ top: 0, bottom: 0, left: 0, right: 0, position: 'absolute', margin: 'auto' }}
            >
              {/* Close */}
              <button
                onClick={() => setShowLogin(false)}
                className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>

              <h1 className="text-center text-3xl font-black italic uppercase tracking-tight text-[#f36f21]">
                Lalamove
              </h1>

              <form
                className="mt-6 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setShowLogin(false);
                  setLoggedIn(true);
                }}
              >
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <select className="h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#f36f21]">
                    <option>Philippines</option>
                    <option>Singapore</option>
                    <option>Malaysia</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Phone number or email"
                    className="h-11 rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none transition focus:border-[#f36f21]"
                  />
                </div>

                <input
                  type="password"
                  placeholder="Password"
                  className="h-11 w-full rounded-lg border border-slate-200 px-3 text-sm text-slate-800 outline-none transition focus:border-[#f36f21]"
                />

                <div className="text-right text-sm text-[#f36f21] cursor-pointer">Forgot password?</div>

                <button
                  type="submit"
                  className="h-11 w-full rounded-lg bg-[#f36f21] text-sm font-bold uppercase tracking-wide text-white transition hover:brightness-105"
                >
                  Log In
                </button>
              </form>

              <div className="my-4 text-center text-sm text-slate-400">Or</div>

              <div className="space-y-2">
                <button
                  onClick={() => { setShowLogin(false); setLoggedIn(true); }}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-[#4267B2] transition hover:bg-slate-50"
                >
                  Continue with Facebook
                </button>
                <button
                  onClick={() => { setShowLogin(false); setLoggedIn(true); }}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  Continue with Google
                </button>
              </div>

              <p className="mt-5 text-center text-sm text-slate-500">
                New to Lalamove?{' '}
                <span className="font-semibold text-[#f36f21] cursor-pointer">Create a free account</span>
              </p>
            </motion.section>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}

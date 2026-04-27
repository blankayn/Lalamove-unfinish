import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SCENE_URL = 'https://prod.spline.design/Cvr5wRDAZJctmVPj/scene.splinecode';

export default function LoginSplinePage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-[#121212] font-['Rubik']"
      onPointerDown={() => setShowLogin(true)}
    >
      <spline-viewer url={SCENE_URL} className="absolute inset-0 h-full w-full" />

      <div className="pointer-events-none absolute inset-0 bg-black/25" />

      <AnimatePresence>
        {!showLogin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6"
          >
            <div className="rounded-full bg-white/90 px-5 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#1a1a1a] shadow-xl">
              Click anywhere to open login
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLogin && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.98 }}
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="absolute inset-0 z-30 flex items-center justify-center px-4"
          >
            <div className="w-full max-w-md rounded-md bg-[#f5f5f5] p-7 shadow-[0_24px_70px_rgba(0,0,0,0.45)]">
              <div className="mb-6 text-center text-4xl font-black uppercase tracking-tight text-[#f36f21]">
                Lalamove
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-[110px_1fr] gap-2">
                  <select className="h-11 rounded border border-slate-300 bg-white px-2 text-sm text-slate-700 outline-none">
                    <option>Philippines</option>
                    <option>Singapore</option>
                    <option>Malaysia</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Phone number or email"
                    className="h-11 rounded border border-slate-300 bg-white px-3 text-sm outline-none placeholder:text-slate-400"
                  />
                </div>
                <input
                  type="password"
                  placeholder="Password"
                  className="h-11 w-full rounded border border-slate-300 bg-white px-3 text-sm outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="mt-3 text-right text-sm text-[#f36f21]">Forgot password?</div>

              <button className="mt-5 h-11 w-full rounded bg-[#f36f21] text-base font-semibold text-white transition hover:bg-[#e16217]">
                Log In
              </button>

              <div className="my-4 text-center text-sm text-slate-500">Or</div>

              <button className="mb-2 h-10 w-full rounded border border-slate-300 bg-white text-sm font-medium text-[#4267B2]">
                Continue with Facebook
              </button>
              <button className="h-10 w-full rounded border border-slate-300 bg-white text-sm font-medium text-slate-700">
                Continue with Google
              </button>

              <div className="mt-5 text-center text-sm text-slate-600">
                New to Lalamove? <span className="font-semibold text-[#f36f21]">Create a free account</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}


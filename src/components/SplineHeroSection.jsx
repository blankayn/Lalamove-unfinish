import { motion } from 'framer-motion';

// Use the Spline public embed page directly (iframe export).
const SPLINE_PUBLIC_URL = 'https://my.spline.design/pushittothelimit-mB6Z2JgBBzm8NXW0WNdbJf2U/';

export default function SplineHeroSection() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black font-['Rubik']">
      <div className="absolute inset-0">
        <iframe
          title="Spline scene"
          src={SPLINE_PUBLIC_URL}
          className="h-full w-full"
          allow="autoplay; fullscreen; xr-spatial-tracking"
          loading="lazy"
          referrerPolicy="no-referrer"
          style={{ border: 0 }}
        />
      </div>

      {/* subtle readability overlay (kept minimal so the Spline stays true) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/35 via-black/0 to-black/45" />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col items-center px-6 pb-10 pt-10">
        <div className="pointer-events-auto">
          <motion.div
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.45 }}
            className="rounded-full bg-white/95 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0b0f18] shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
          >
            Push it to the limit
          </motion.div>
        </div>
      </div>
    </section>
  );
}


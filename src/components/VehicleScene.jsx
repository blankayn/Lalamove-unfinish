import { motion } from 'framer-motion';

/* ── Inline SVG vehicles ── */

const Motorcycle = ({ color = '#f36f21' }) => (
  <svg width="80" height="50" viewBox="0 0 80 50" fill="none">
    <ellipse cx="15" cy="38" rx="10" ry="10" stroke={color} strokeWidth="3" fill="none"/>
    <ellipse cx="65" cy="38" rx="10" ry="10" stroke={color} strokeWidth="3" fill="none"/>
    <path d="M15 38 L28 20 L45 18 L60 28 L65 38" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M45 18 L50 8 L58 8" stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
    <circle cx="50" cy="8" r="4" fill={color}/>
    <path d="M28 20 L35 20" stroke={color} strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const Sedan = ({ color = '#f36f21' }) => (
  <svg width="120" height="60" viewBox="0 0 120 60" fill="none">
    <rect x="5" y="30" width="110" height="22" rx="4" fill={color}/>
    <path d="M20 30 L30 12 L85 12 L100 30Z" fill={color}/>
    <rect x="32" y="15" width="20" height="13" rx="2" fill="#c8e6ff" opacity="0.8"/>
    <rect x="58" y="15" width="20" height="13" rx="2" fill="#c8e6ff" opacity="0.8"/>
    <circle cx="28" cy="52" r="9" fill="#333"/>
    <circle cx="28" cy="52" r="5" fill="#666"/>
    <circle cx="92" cy="52" r="9" fill="#333"/>
    <circle cx="92" cy="52" r="5" fill="#666"/>
    <rect x="2" y="36" width="8" height="5" rx="1" fill="#ffe066"/>
    <rect x="110" y="36" width="8" height="5" rx="1" fill="#ff4444"/>
  </svg>
);

const Van = ({ color = '#f36f21' }) => (
  <svg width="150" height="70" viewBox="0 0 150 70" fill="none">
    <rect x="5" y="20" width="135" height="38" rx="5" fill={color}/>
    <path d="M5 20 L5 35 L30 35 L30 20Z" fill={color} opacity="0.8"/>
    <rect x="8" y="23" width="18" height="10" rx="2" fill="#c8e6ff" opacity="0.8"/>
    <rect x="38" y="23" width="25" height="14" rx="2" fill="#c8e6ff" opacity="0.8"/>
    <rect x="70" y="23" width="25" height="14" rx="2" fill="#c8e6ff" opacity="0.8"/>
    <circle cx="32" cy="58" r="10" fill="#333"/>
    <circle cx="32" cy="58" r="5" fill="#666"/>
    <circle cx="112" cy="58" r="10" fill="#333"/>
    <circle cx="112" cy="58" r="5" fill="#666"/>
    <rect x="2" y="28" width="10" height="6" rx="1" fill="#ffe066"/>
    <rect x="138" y="28" width="10" height="6" rx="1" fill="#ff4444"/>
    <text x="55" y="46" fontSize="10" fill="white" fontWeight="bold" fontFamily="sans-serif">LALAMOVE</text>
  </svg>
);

const Truck = ({ color = '#f36f21' }) => (
  <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
    {/* Cargo box */}
    <rect x="50" y="10" width="140" height="52" rx="3" fill={color}/>
    <rect x="52" y="12" width="136" height="48" rx="2" fill={color} opacity="0.85"/>
    {/* Cab */}
    <rect x="5" y="25" width="50" height="37" rx="4" fill={color}/>
    <rect x="8" y="28" width="22" height="16" rx="2" fill="#c8e6ff" opacity="0.85"/>
    <circle cx="30" cy="68" r="11" fill="#333"/>
    <circle cx="30" cy="68" r="6" fill="#666"/>
    <circle cx="100" cy="68" r="11" fill="#333"/>
    <circle cx="100" cy="68" r="6" fill="#666"/>
    <circle cx="160" cy="68" r="11" fill="#333"/>
    <circle cx="160" cy="68" r="6" fill="#666"/>
    <rect x="2" y="32" width="10" height="7" rx="1" fill="#ffe066"/>
    <rect x="188" y="32" width="10" height="7" rx="1" fill="#ff4444"/>
    <text x="80" y="42" fontSize="11" fill="white" fontWeight="bold" fontFamily="sans-serif">LALAMOVE</text>
  </svg>
);

/* ── Road markings ── */
const Road = () => (
  <div className="absolute bottom-16 left-0 right-0 h-24 bg-[#e8e8e8]">
    {/* Road lines */}
    <div className="absolute top-1/2 left-0 right-0 flex -translate-y-1/2 gap-8 overflow-hidden">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="h-2 w-16 shrink-0 bg-white/60 rounded" />
      ))}
    </div>
    {/* Animated dashes */}
    <motion.div
      className="absolute top-1/2 left-0 flex -translate-y-1/2 gap-8"
      animate={{ x: [0, -160] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
    >
      {[...Array(30)].map((_, i) => (
        <div key={i} className="h-2 w-16 shrink-0 rounded bg-[#ccc]" />
      ))}
    </motion.div>
  </div>
);

/* ── Background buildings / city silhouette ── */
const CityBg = () => (
  <div className="pointer-events-none absolute bottom-40 left-0 right-0 flex items-end gap-3 px-8 opacity-10">
    {[60,90,50,110,70,80,45,100,65,55,95,75].map((h, i) => (
      <div key={i} className="shrink-0 w-10 bg-[#f36f21] rounded-t" style={{ height: h }} />
    ))}
  </div>
);

/* ── Individual animated vehicle lane ── */
const Lane = ({ children, duration, delay, bottom, direction = 1 }) => (
  <motion.div
    className="absolute"
    style={{ bottom }}
    initial={{ x: direction > 0 ? '-220px' : '110vw' }}
    animate={{ x: direction > 0 ? '110vw' : '-220px' }}
    transition={{ duration, delay, repeat: Infinity, ease: 'linear', repeatDelay: 0 }}
  >
    {children}
  </motion.div>
);

export default function VehicleScene() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#f7f4f0]">
      <CityBg />

      {/* Sun / sky gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fff8f0] via-[#fdebd0] to-[#f7f4f0]" />

      {/* Road */}
      <Road />

      {/* Vehicles — multiple lanes at different speeds */}
      <Lane duration={6} delay={0} bottom={52}>
        <Van />
      </Lane>
      <Lane duration={4.5} delay={1.5} bottom={52}>
        <Sedan />
      </Lane>
      <Lane duration={8} delay={0.5} bottom={52}>
        <Truck />
      </Lane>
      <Lane duration={3.5} delay={2} bottom={56}>
        <Motorcycle />
      </Lane>
      <Lane duration={5} delay={3} bottom={52}>
        <Sedan color="#e05a10" />
      </Lane>
      <Lane duration={7} delay={4} bottom={52}>
        <Van color="#c94f0a" />
      </Lane>
      <Lane duration={4} delay={5} bottom={56}>
        <Motorcycle color="#c94f0a" />
      </Lane>
    </div>
  );
}

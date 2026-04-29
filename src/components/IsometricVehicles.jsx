// Static isometric-style vehicle illustration for the left side of the landing page

export default function IsometricVehicles() {
  return (
    <div className="absolute bottom-0 left-0 w-[420px] h-full pointer-events-none select-none flex items-end pb-12 pl-4">
      <svg
        viewBox="0 0 420 480"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* ── Large Van (bottom-left, biggest) ── */}
        <g transform="translate(10, 290) skewX(-8)">
          {/* body */}
          <rect x="0" y="20" width="160" height="70" rx="6" fill="#f36f21"/>
          {/* roof */}
          <rect x="10" y="0" width="140" height="28" rx="4" fill="#e05a10"/>
          {/* windows */}
          <rect x="14" y="4" width="32" height="20" rx="3" fill="#c8e6ff" opacity="0.85"/>
          <rect x="54" y="4" width="32" height="20" rx="3" fill="#c8e6ff" opacity="0.85"/>
          <rect x="94" y="4" width="32" height="20" rx="3" fill="#c8e6ff" opacity="0.85"/>
          {/* wheels */}
          <ellipse cx="30" cy="90" rx="18" ry="18" fill="#2a2a2a"/>
          <ellipse cx="30" cy="90" rx="10" ry="10" fill="#555"/>
          <ellipse cx="130" cy="90" rx="18" ry="18" fill="#2a2a2a"/>
          <ellipse cx="130" cy="90" rx="10" ry="10" fill="#555"/>
          {/* headlight */}
          <rect x="0" y="35" width="10" height="8" rx="2" fill="#ffe066"/>
          {/* text */}
          <text x="30" y="58" fontSize="11" fill="white" fontWeight="bold" fontFamily="sans-serif" opacity="0.9">LALAMOVE</text>
        </g>

        {/* ── Truck (middle-left) ── */}
        <g transform="translate(60, 190) skewX(-6)">
          {/* cargo */}
          <rect x="40" y="0" width="130" height="60" rx="4" fill="#f36f21"/>
          {/* cab */}
          <rect x="0" y="10" width="46" height="50" rx="5" fill="#e05a10"/>
          {/* cab window */}
          <rect x="4" y="14" width="26" height="18" rx="3" fill="#c8e6ff" opacity="0.85"/>
          {/* wheels */}
          <ellipse cx="22" cy="62" rx="14" ry="14" fill="#2a2a2a"/>
          <ellipse cx="22" cy="62" rx="7" ry="7" fill="#555"/>
          <ellipse cx="90" cy="62" rx="14" ry="14" fill="#2a2a2a"/>
          <ellipse cx="90" cy="62" rx="7" ry="7" fill="#555"/>
          <ellipse cx="150" cy="62" rx="14" ry="14" fill="#2a2a2a"/>
          <ellipse cx="150" cy="62" rx="7" ry="7" fill="#555"/>
          {/* headlight */}
          <rect x="0" y="24" width="8" height="6" rx="1" fill="#ffe066"/>
          <text x="58" y="36" fontSize="10" fill="white" fontWeight="bold" fontFamily="sans-serif" opacity="0.9">LALAMOVE</text>
        </g>

        {/* ── Sedan (upper-left) ── */}
        <g transform="translate(30, 120) skewX(-5)">
          {/* body */}
          <rect x="0" y="22" width="120" height="40" rx="5" fill="#f36f21"/>
          {/* roof */}
          <path d="M18 22 L30 4 L90 4 L108 22Z" fill="#e05a10"/>
          {/* windows */}
          <rect x="32" y="7" width="24" height="13" rx="2" fill="#c8e6ff" opacity="0.85"/>
          <rect x="62" y="7" width="24" height="13" rx="2" fill="#c8e6ff" opacity="0.85"/>
          {/* wheels */}
          <ellipse cx="24" cy="62" rx="13" ry="13" fill="#2a2a2a"/>
          <ellipse cx="24" cy="62" rx="7" ry="7" fill="#555"/>
          <ellipse cx="96" cy="62" rx="13" ry="13" fill="#2a2a2a"/>
          <ellipse cx="96" cy="62" rx="7" ry="7" fill="#555"/>
          {/* headlight */}
          <rect x="0" y="30" width="8" height="6" rx="1" fill="#ffe066"/>
        </g>

        {/* ── Small crossover (right of sedan) ── */}
        <g transform="translate(170, 140) skewX(-5)">
          <rect x="0" y="18" width="110" height="42" rx="5" fill="#e8621c"/>
          <path d="M14 18 L26 2 L84 2 L100 18Z" fill="#d45510"/>
          <rect x="28" y="5" width="20" height="11" rx="2" fill="#c8e6ff" opacity="0.85"/>
          <rect x="54" y="5" width="20" height="11" rx="2" fill="#c8e6ff" opacity="0.85"/>
          <ellipse cx="22" cy="60" rx="12" ry="12" fill="#2a2a2a"/>
          <ellipse cx="22" cy="60" rx="6" ry="6" fill="#555"/>
          <ellipse cx="88" cy="60" rx="12" ry="12" fill="#2a2a2a"/>
          <ellipse cx="88" cy="60" rx="6" ry="6" fill="#555"/>
          <rect x="0" y="26" width="7" height="5" rx="1" fill="#ffe066"/>
        </g>

        {/* ── Motorcycle (front, small) ── */}
        <g transform="translate(200, 310)">
          {/* wheels */}
          <ellipse cx="14" cy="38" rx="13" ry="13" fill="#2a2a2a"/>
          <ellipse cx="14" cy="38" rx="7" ry="7" fill="#555"/>
          <ellipse cx="66" cy="38" rx="13" ry="13" fill="#2a2a2a"/>
          <ellipse cx="66" cy="38" rx="7" ry="7" fill="#555"/>
          {/* frame */}
          <path d="M14 38 L26 18 L50 16 L66 28 L66 38" stroke="#f36f21" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          {/* handlebar */}
          <path d="M50 16 L54 6 L62 6" stroke="#e05a10" strokeWidth="3" strokeLinecap="round"/>
          {/* seat */}
          <rect x="28" y="14" width="22" height="6" rx="3" fill="#e05a10"/>
          {/* rider */}
          <circle cx="52" cy="4" r="6" fill="#f36f21"/>
          <rect x="46" y="10" width="12" height="14" rx="3" fill="#f36f21"/>
        </g>

        {/* ── Delivery person standing (between van and motorcycle) ── */}
        <g transform="translate(155, 295)">
          {/* legs */}
          <rect x="8" y="30" width="6" height="18" rx="2" fill="#333"/>
          <rect x="16" y="30" width="6" height="18" rx="2" fill="#333"/>
          {/* body */}
          <rect x="4" y="12" width="22" height="20" rx="4" fill="#f36f21"/>
          {/* arms */}
          <rect x="0" y="14" width="5" height="14" rx="2" fill="#f36f21"/>
          <rect x="25" y="14" width="5" height="14" rx="2" fill="#f36f21"/>
          {/* head */}
          <circle cx="15" cy="7" r="7" fill="#f5c5a3"/>
          {/* helmet */}
          <path d="M8 7 Q8 0 15 0 Q22 0 22 7Z" fill="#f36f21"/>
          {/* package */}
          <rect x="26" y="20" width="16" height="14" rx="2" fill="#fff" stroke="#f36f21" strokeWidth="1.5"/>
          <line x1="34" y1="20" x2="34" y2="34" stroke="#f36f21" strokeWidth="1"/>
          <line x1="26" y1="27" x2="42" y2="27" stroke="#f36f21" strokeWidth="1"/>
        </g>

        {/* ── Ground shadow ── */}
        <ellipse cx="200" cy="460" rx="190" ry="14" fill="#00000010"/>
      </svg>
    </div>
  );
}

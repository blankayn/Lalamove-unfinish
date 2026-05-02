import { useState } from 'react';

const API = 'http://localhost/lalamove-api';

// Demo reviews fallback
const DEMO_REVIEWS = [
  { customer: 'Juan dela Cruz', score: 5, comment: 'Very fast and careful with my package!', date: '2026-04-20 10:00:00' },
  { customer: 'Maria Santos',   score: 4, comment: 'Good driver, arrived on time.',           date: '2026-04-18 14:30:00' },
  { customer: 'Ana Reyes',      score: 5, comment: 'Very professional and friendly.',          date: '2026-04-15 09:00:00' },
  { customer: 'Carlo Bautista', score: 3, comment: 'Okay lang, medyo late.',                  date: '2026-04-10 16:45:00' },
];

function StarRow({ score }) {
  return (
    <span className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <span key={s} className={s <= score ? 'text-yellow-400' : 'text-slate-200'}>★</span>
      ))}
    </span>
  );
}

/* ── Profile Modal ── */
function DriverProfileModal({ driver, onClose }) {
  const [reviews, setReviews]   = useState(null);
  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);

  // Fetch on mount
  useState(() => {
    (async () => {
      try {
        const res  = await fetch(`${API}/get_driver_profile.php`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ driver_id: driver.id }),
        });
        const data = await res.json();
        if (data.success) {
          setProfile(data.driver);
          setReviews(data.reviews);
        } else {
          setProfile(driver);
          setReviews(DEMO_REVIEWS);
        }
      } catch {
        setProfile(driver);
        setReviews(DEMO_REVIEWS);
      }
      setLoading(false);
    })();
  }, []);

  const info = profile || driver;
  const avgScore = reviews
    ? reviews.length > 0
      ? (reviews.reduce((s, r) => s + r.score, 0) / reviews.length).toFixed(1)
      : info.avg_rating
    : info.avg_rating;

  const getInitials = (name) =>
    name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* Header */}
        <div className="relative bg-gradient-to-r from-[#f36f21] to-orange-400 p-6 text-white rounded-t-2xl">
          <button onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 text-lg">
            ✕
          </button>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#f36f21] text-xl font-black shadow">
              {getInitials(info.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold">{info.name}</h2>
              <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${info.status === 'Available' ? 'bg-green-400/30 text-white' : 'bg-yellow-400/30 text-white'}`}>
                {info.status}
              </span>
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-white/20 py-2">
              <p className="text-lg font-black">{avgScore}</p>
              <p className="text-[10px] opacity-80">Avg Rating</p>
            </div>
            <div className="rounded-lg bg-white/20 py-2">
              <p className="text-lg font-black">{info.total_deliveries}</p>
              <p className="text-[10px] opacity-80">Deliveries</p>
            </div>
            <div className="rounded-lg bg-white/20 py-2">
              <p className="text-lg font-black">{info.completion_rate ?? 95}%</p>
              <p className="text-[10px] opacity-80">Completion</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Driver info */}
          <div className="mb-5 space-y-2 rounded-lg border border-slate-100 bg-slate-50 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-2">Driver Info</p>
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <span className="text-base">🚗</span>
              <span>{info.vehicle_emoji} {info.vehicle_type}</span>
            </div>
            {info.email && (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="text-base">✉️</span>
                <span>{info.email}</span>
              </div>
            )}
            {info.phone && info.phone !== 'N/A' && (
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <span className="text-base">📞</span>
                <span>{info.phone}</span>
              </div>
            )}
          </div>

          {/* Reviews */}
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Customer Reviews {reviews ? `(${reviews.length})` : ''}
          </p>

          {loading ? (
            <div className="py-8 text-center text-slate-400 text-sm">Loading reviews...</div>
          ) : !reviews || reviews.length === 0 ? (
            <div className="flex flex-col items-center py-8">
              <p className="text-4xl mb-2">💬</p>
              <p className="text-sm text-slate-500">No reviews yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((r, i) => (
                <div key={i} className="rounded-lg border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-[#f36f21] text-xs font-bold shrink-0">
                        {r.customer.split(' ').map(p => p[0]).slice(0,2).join('').toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{r.customer}</p>
                        <p className="text-[10px] text-slate-400">
                          {r.date ? new Date(r.date).toLocaleDateString('en-PH', { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                        </p>
                      </div>
                    </div>
                    <StarRow score={r.score} />
                  </div>
                  {r.comment && (
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">"{r.comment}"</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Driver Card ── */
export default function DriverCard({ driver, onFavoriteToggle, onBlockToggle }) {
  const [isFavorite, setIsFavorite] = useState(driver.is_favorite || false);
  const [isBlocked,  setIsBlocked]  = useState(driver.is_blocked  || false);
  const [showProfile, setShowProfile] = useState(false);

  const getInitials = (name) =>
    name.split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase();

  const handleFavorite = () => {
    const next = !isFavorite;
    setIsFavorite(next);
    onFavoriteToggle(driver.id, next);
  };

  const handleBlock = () => {
    const next = !isBlocked;
    setIsBlocked(next);
    onBlockToggle(driver.id, next);
  };

  return (
    <>
      <div className="rounded-xl border border-slate-200 p-5 hover:border-[#f36f21] transition bg-white">
        {/* Top row */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-100 text-[#f36f21] font-bold text-sm">
              {getInitials(driver.name)}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{driver.name}</p>
              <span className={`text-xs font-medium ${driver.status === 'Available' ? 'text-green-600' : 'text-yellow-600'}`}>
                ● {driver.status}
              </span>
            </div>
          </div>
          <div className="flex gap-1">
            {!isBlocked && (
              <button onClick={handleFavorite}
                className={`rounded-full p-1.5 transition text-lg ${isFavorite ? 'text-yellow-400' : 'text-slate-300 hover:text-yellow-300'}`}>
                {isFavorite ? '⭐' : '☆'}
              </button>
            )}
            {!isFavorite && (
              <button onClick={handleBlock}
                className={`rounded-full p-1.5 transition text-base ${isBlocked ? 'text-red-400' : 'text-slate-300 hover:text-red-300'}`}>
                🚫
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">{driver.vehicle_emoji} {driver.vehicle_type}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <StarRow score={Math.round(driver.avg_rating)} />
            <span className="font-semibold text-slate-700 ml-1">{driver.avg_rating}</span>
            <span className="text-slate-400 text-xs">({driver.total_deliveries} deliveries)</span>
          </div>
          <div className="text-xs text-slate-500">
            ✓ {driver.completion_rate}% completion rate
          </div>
        </div>

        {/* View Profile */}
        <button onClick={() => setShowProfile(true)}
          className="mt-4 w-full rounded-lg border border-[#f36f21] py-2 text-sm font-medium text-[#f36f21] hover:bg-orange-50 transition">
          View Profile
        </button>
      </div>

      {showProfile && (
        <DriverProfileModal driver={driver} onClose={() => setShowProfile(false)} />
      )}
    </>
  );
}

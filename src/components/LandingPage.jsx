import { motion } from 'framer-motion';
import heroImage from '../assets/landingpageimg.png';

const audienceCards = [
  {
    title: 'Business Delivery',
    description: 'Dispatch urgent shipments, retail orders, and scheduled drop-offs with real-time visibility.',
  },
  {
    title: 'Personal Delivery',
    description: 'Book same-day rides for documents, groceries, gifts, and everyday essentials in a few taps.',
  },
  {
    title: 'Driver Partner',
    description: 'Accept jobs, stay active on the road, and manage deliveries from one reliable platform.',
  },
];

const valuePoints = [
  'Fast booking flow with real-time delivery updates',
  'Multiple vehicle options for light and heavy loads',
  'Clear order tracking for customers and driver partners',
  'Built for same-day delivery and local city operations',
];

const vehicleOptions = [
  'Motorcycle for small and urgent items',
  'Sedan and pickup for medium parcel delivery',
  'Van and minivan for bulk or multi-stop orders',
  'Truck for larger commercial shipments',
];

const stats = [
  { value: '24/7', label: 'Booking access' },
  { value: '4', label: 'Vehicle classes' },
  { value: 'Live', label: 'Order tracking' },
];

const EASE = [0.2, 0.8, 0.2, 1];

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12h14" />
      <path d="M13 5l7 7-7 7" />
    </svg>
  );
}

function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2l8 4.5v11L12 22l-8-4.5v-11L12 2z" />
      <path d="M12 22V11" />
      <path d="M20 6.5l-8 4.5-8-4.5" />
    </svg>
  );
}

export default function LandingPage({ onLogin }) {
  return (
    <div className="min-h-screen bg-[#fff8f3] text-slate-950">
      <section className="relative isolate overflow-hidden text-white">
        <img
          src={heroImage}
          alt="Lalamove delivery vehicles in the city"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(23,13,8,0.9)_0%,rgba(64,30,11,0.72)_34%,rgba(92,48,19,0.42)_62%,rgba(92,48,19,0.2)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(10,10,10,0.48),rgba(10,10,10,0.1)_34%,rgba(10,10,10,0.18)_100%)]" />

        <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-md bg-white/12 backdrop-blur">
              <BoxIcon />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-white/70">Delivery Platform</p>
              <h1 className="text-2xl font-black tracking-tight">LALAMOVE</h1>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-white/82 lg:flex">
            <a href="#services" className="transition hover:text-white">Services</a>
            <a href="#why-us" className="transition hover:text-white">Why Us</a>
            <a href="#vehicles" className="transition hover:text-white">Vehicles</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onLogin}
              className="hidden rounded-full border border-white/28 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10 lg:inline-flex"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onLogin}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-[#d95f15] transition hover:bg-[#fff2e8]"
            >
              Sign up
              <ArrowIcon />
            </button>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid min-h-[calc(100vh-92px)] w-full max-w-7xl items-end gap-10 px-6 pb-14 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-2xl pb-6 lg:pb-14"
          >
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.32em] text-[#ffd3b3]">
              On-demand delivery platform
            </p>
            <h2 className="max-w-[12ch] text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              Deliver anything, anytime, anywhere.
            </h2>
            <p className="mt-6 max-w-xl text-base leading-7 text-white/86 sm:text-lg">
              Built for customers, businesses, and drivers who need a dependable same-day delivery
              experience with live tracking, flexible vehicle choices, and fast booking.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onLogin}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17120f] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-black"
              >
                Get Started
                <ArrowIcon />
              </button>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-full border border-white/28 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explore services
              </a>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {stats.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/14 bg-white/10 px-4 py-4 backdrop-blur">
                  <p className="text-2xl font-black">{item.value}</p>
                  <p className="mt-1 text-sm text-white/72">{item.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.12, ease: EASE }}
            className="hidden lg:block"
          />
        </div>
      </section>

      <main>
        <section id="services" className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
          <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d95f15]">Services</p>
              <h3 className="mt-3 max-w-xl text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                One delivery platform for every type of rider, shipper, and order.
              </h3>
            </div>
            <p className="max-w-lg text-sm leading-7 text-slate-600">
              Book city deliveries, manage urgent shipments, and connect customers with drivers
              through one fast local delivery platform.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-3">
            {audienceCards.map((card) => (
              <article key={card.title} className="rounded-[8px] border border-[#f1d5c3] bg-white px-6 py-7 shadow-[0_18px_50px_rgba(33,16,7,0.06)]">
                <div className="mb-5 grid h-12 w-12 place-items-center rounded-[8px] bg-[#fff1e7] text-[#d95f15]">
                  <BoxIcon />
                </div>
                <h4 className="text-xl font-bold text-slate-950">{card.title}</h4>
                <p className="mt-3 text-sm leading-7 text-slate-600">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="why-us" className="bg-[#1b120d] text-white">
          <div className="mx-auto grid w-full max-w-7xl gap-14 px-6 py-20 lg:grid-cols-[0.95fr_1.05fr] lg:px-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#ff9c5b]">Why Lalamove</p>
              <h3 className="mt-3 max-w-md text-3xl font-black tracking-tight sm:text-4xl">
                Fast booking, clear tracking, and flexible transport options.
              </h3>
            </div>
            <div className="grid gap-4">
              {valuePoints.map((point) => (
                <div key={point} className="flex items-start gap-4 border-b border-white/10 pb-4 last:border-b-0 last:pb-0">
                  <div className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#f36f21] text-white">
                    <ArrowIcon />
                  </div>
                  <p className="text-base leading-7 text-white/80">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="vehicles" className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.95fr]">
            <div className="rounded-[8px] bg-[linear-gradient(135deg,#f36f21,#ffb57a)] px-8 py-10 text-white shadow-[0_20px_60px_rgba(243,111,33,0.25)]">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-white/72">Vehicle options</p>
              <h3 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Choose the right vehicle for every booking.
              </h3>
              <div className="mt-8 grid gap-4">
                {vehicleOptions.map((vehicle) => (
                  <div key={vehicle} className="rounded-[8px] border border-white/18 bg-white/10 px-4 py-4 backdrop-blur">
                    <p className="text-sm font-medium leading-6 text-white">{vehicle}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#d95f15]">Next step</p>
              <h3 className="mt-3 max-w-md text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                When users press sign up or login, they move straight into your existing auth screen.
              </h3>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
                Start from the homepage, then continue into account access for customers and
                drivers when it is time to place orders, manage deliveries, or track activity.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={onLogin}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f36f21] px-6 py-3.5 text-sm font-bold text-white transition hover:brightness-105"
                >
                  Open Login Experience
                  <ArrowIcon />
                </button>
                <a
                  href="#services"
                  className="inline-flex items-center justify-center rounded-full border border-slate-300 px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Review features
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#ead7ca] bg-[#fff8f3]">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-3 px-6 py-6 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p className="font-medium text-slate-700">Lalamove Local Delivery Platform</p>
          <div className="flex flex-wrap items-center gap-4">
            <a href="#services" className="transition hover:text-[#d95f15]">Services</a>
            <a href="#why-us" className="transition hover:text-[#d95f15]">Why Us</a>
            <a href="#vehicles" className="transition hover:text-[#d95f15]">Vehicles</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const FEATURES = [
  {
    title: 'Fast Dispatch',
    description: 'Book same-day delivery in minutes with a streamlined dispatch flow.',
  },
  {
    title: 'Real-Time Tracking',
    description: 'Track each order from pickup to drop-off with precise live updates.',
  },
  {
    title: 'Flexible Fleet',
    description: 'Choose the right vehicle size, from bike to van, based on your cargo.',
  },
];

const FeaturesSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#f36f21]">Why Lalamove</p>
        <h2 className="mt-3 text-4xl font-bold text-[#161a20] md:text-5xl">Built for Urban Delivery</h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-slate-200 p-7 shadow-sm">
              <h3 className="text-2xl font-bold text-[#21346e]">{feature.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-slate-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

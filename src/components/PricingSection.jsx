const PLANS = [
  {
    name: 'Starter',
    price: 'RM19',
    note: 'Best for personal deliveries',
    perks: ['Up to 3 deliveries/day', 'Standard support', 'Basic tracking'],
  },
  {
    name: 'Business',
    price: 'RM79',
    note: 'For growing stores and teams',
    perks: ['Up to 25 deliveries/day', 'Priority dispatch', 'Advanced tracking'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    note: 'For high-volume logistics',
    perks: ['Unlimited deliveries', 'Dedicated account manager', 'Custom API support'],
  },
];

const PricingSection = () => {
  return (
    <section className="bg-[#f8faff] py-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-[#f36f21]">Pricing</p>
        <h2 className="mt-3 text-4xl font-bold text-[#161a20] md:text-5xl">Simple Plans, Flexible Scale</h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <article key={plan.name} className="rounded-2xl bg-white p-8 shadow-lg ring-1 ring-slate-200">
              <h3 className="text-2xl font-bold text-[#21346e]">{plan.name}</h3>
              <p className="mt-3 text-4xl font-extrabold text-[#161a20]">{plan.price}</p>
              <p className="mt-2 text-sm text-slate-500">{plan.note}</p>
              <ul className="mt-5 space-y-2 text-slate-700">
                {plan.perks.map((perk) => (
                  <li key={perk}>- {perk}</li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-xl bg-[#21346e] px-4 py-3 font-semibold text-white transition hover:bg-[#1a2a5a]">
                Choose Plan
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;

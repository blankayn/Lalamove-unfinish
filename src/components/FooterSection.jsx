const FooterSection = () => {
  return (
    <footer className="bg-[#111a33] py-10 text-white">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-4 px-6 md:flex-row md:items-center">
        <div>
          <p className="text-2xl font-black italic text-[#f36f21]">LALAMOVE</p>
          <p className="mt-1 text-sm text-slate-300">Deliver faster. Grow smarter.</p>
        </div>
        <nav className="flex gap-6 text-sm text-slate-200">
          <a href="#" className="transition hover:text-[#f36f21]">
            Services
          </a>
          <a href="#" className="transition hover:text-[#f36f21]">
            Pricing
          </a>
          <a href="#" className="transition hover:text-[#f36f21]">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  );
};

export default FooterSection;

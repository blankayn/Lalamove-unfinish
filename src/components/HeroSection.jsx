import React from 'react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-[#21346e] font-['Rubik']">
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute bottom-0 h-1/4 w-full bg-[#1a2a5a]" />

        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: '100vw' }}
            animate={{ x: '-100vw' }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.4,
              ease: 'linear',
            }}
            className="absolute h-[2px] w-64 bg-white/10"
            style={{ top: `${60 + i * 8}%` }}
          />
        ))}

        <motion.div
          initial={{ x: -200 }}
          animate={{ x: '110vw' }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute bottom-[10%] z-10"
        >
          <div className="relative h-24 w-48 rounded-lg bg-[#f36f21] shadow-2xl">
            <div className="absolute right-2 top-2 h-10 w-10 rounded-sm bg-[#21346e]" />
            <div className="absolute -bottom-3 left-6 h-8 w-8 rounded-full border-4 border-gray-600 bg-black" />
            <div className="absolute -bottom-3 right-6 h-8 w-8 rounded-full border-4 border-gray-600 bg-black" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-black italic tracking-tighter text-white">DELIVERY</span>
            </div>
          </div>

          <motion.div
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
            className="absolute -left-8 bottom-0 h-6 w-6 rounded-full bg-white/20"
          />
        </motion.div>
      </div>

      <div className="relative z-20 mx-auto w-full max-w-7xl px-6 pt-32 lg:pt-48">
        <h1 className="flex flex-col text-6xl font-bold uppercase leading-[0.98] tracking-[-2px] text-white md:text-8xl lg:text-[100px] lg:tracking-[-4px]">
          <span>New Era</span>
          <span>Of Design</span>
          <span>Starts Now</span>
        </h1>

        <div className="mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative flex h-[65px] w-[184px] items-center justify-center focus:outline-none"
          >
            <svg
              className="absolute inset-0 h-full w-full drop-shadow-lg"
              viewBox="0 0 184 65"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 10C0 4.47715 4.47715 0 10 0H174C179.523 0 184 4.47715 184 10V55C184 60.5228 179.523 65 174 65H10C4.47715 65 0 60.5228 0 55V10Z"
                fill="white"
              />
            </svg>
            <span className="relative z-10 text-[20px] font-bold uppercase text-[#161a20]">Get Started</span>
          </motion.button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-[#21346e]/50 to-transparent" />
    </section>
  );
};

export default HeroSection;

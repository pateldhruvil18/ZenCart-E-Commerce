import { motion } from 'framer-motion';
import { Link } from '@tanstack/react-router';

export const PromoBanner = () => {
  return (
    <motion.section 
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
      className="section pb-24"
    >
      <div className="relative h-[400px] bg-black rounded-[3rem] overflow-hidden flex flex-col items-center justify-center text-center p-8 space-y-6">
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-[0.9]">
          Join the Digital Elite. <br />
          <span className="text-white/20">Exclusive Rewards await.</span>
        </h2>
        <Link 
          to="/register" 
          className="inline-flex h-14 px-10 bg-white !text-black hover:bg-white/90 rounded-2xl font-black uppercase tracking-widest text-xs items-center justify-center transition-transform hover:scale-105 shadow-xl shadow-white/5 border-none"
        >
          Unlock Access
        </Link>
      </div>
    </motion.section>
  );
};

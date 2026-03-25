import { motion } from 'framer-motion';

const BRANDS = [
  'APPLE', 'SONY', 'NIKON', 'CANON', 'SAMSUNG', 'LG', 'DELL', 'RAZER', 'LOGITECH', 'BOSE'
];

export const BrandSlider = () => {
  return (
    <div className="py-20 border-y border-border/50 bg-white overflow-hidden select-none">
      <div className="section mb-10 text-center">
         <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-40">Trusted by Industry Leaders</h3>
      </div>
      <div className="flex overflow-hidden relative">
        <motion.div 
          className="flex whitespace-nowrap gap-24 items-center"
          animate={{ x: [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        >
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <span key={i} className="text-4xl md:text-6xl font-black tracking-tighter text-black/5 hover:text-black transition-all duration-700 cursor-default">
              {brand}
            </span>
          ))}
        </motion.div>
        
        {/* Gradients to fade edges */}
        <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-white to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-white to-transparent z-10" />
      </div>
    </div>
  );
};

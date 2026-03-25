import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from '@tanstack/react-router';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const fallbackSlides = [
  {
    id: 1,
    title: "Sony WH-1000XM5",
    subtitle: "Industry-leading noise cancellation. Elevated full-spectrum design.",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    cta: "Shop Audio",
    link: "/products"
  },
  {
    id: 2,
    title: "Leica Q2 Monochrom",
    subtitle: "Pure black and white photography. Uncompromising quality.",
    image: "https://images.unsplash.com/photo-1516724562728-afc824a36e84?auto=format&fit=crop&q=80&w=2000",
    cta: "Shop Cameras",
    link: "/products"
  },
  {
    id: 3,
    title: "Minimalist Chronograph",
    subtitle: "Precision engineering meets timeless, elevated aesthetics.",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=2000",
    cta: "Explore Watches",
    link: "/products"
  }
];

export const HeroSection = ({ products = [] }: { products?: any[] }) => {
  const slides = products.length >= 3 
    ? products.slice(0, 4).map((p, i) => ({
        id: p._id,
        title: p.name,
        subtitle: p.description?.slice(0, 100) || "Experience digital luxury and cutting-edge design.",
        image: p.images?.[0] || fallbackSlides[i % 3].image,
        cta: "Shop Release",
        link: `/products/${p._id}`
    })) 
    : fallbackSlides;

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full h-screen min-h-[600px] bg-black overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {/* Image with grayscale filter for B&W theme */}
          <img 
            src={slides[current].image}
            alt={slides[current].title}
            className="absolute inset-0 w-full h-full object-cover object-center grayscale contrast-125 brightness-75 transition-all"
            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/2000x1000/eeeeee/999999.png?text=ZenCart+Exclusive'; }}
          />
          {/* Gradient overlay for text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex items-center section pt-20">
        <div className="max-w-3xl space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center rounded-full border border-white/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.3em] bg-white/5 backdrop-blur-md text-white/80">
                <span className="flex h-1.5 w-1.5 rounded-full bg-white mr-3 animate-pulse"></span>
                Featured Arrivals
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white uppercase tracking-tighter leading-[0.9]">
                {slides[current].title}
              </h1>
              <p className="text-lg md:text-xl text-white/70 font-medium tracking-wide leading-relaxed max-w-xl">
                {slides[current].subtitle}
              </p>
              <div className="pt-6">
                <Link to={slides[current].link} className="inline-flex h-14 px-10 bg-white !text-black hover:bg-white/90 rounded-2xl font-black uppercase tracking-[0.2em] text-xs items-center justify-center transition-transform hover:scale-105 shadow-2xl shadow-white/10 border-none">
                  {slides[current].cta} <ArrowRight className="ml-3 h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute right-8 bottom-32 md:bottom-1/2 md:-translate-y-1/2 flex md:flex-col gap-4 z-20">
        <button 
          onClick={prevSlide}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all active:scale-95"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button 
          onClick={nextSlide}
          className="w-12 h-12 flex items-center justify-center rounded-full border border-white/20 bg-black/50 backdrop-blur-md text-white hover:bg-white hover:text-black transition-all active:scale-95"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="absolute bottom-12 left-0 right-0 flex justify-center gap-3 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`transition-all duration-300 rounded-full ${
              idx === current 
                ? "w-10 h-1.5 bg-white" 
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

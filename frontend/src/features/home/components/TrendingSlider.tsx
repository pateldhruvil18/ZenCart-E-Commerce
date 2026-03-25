import React, { useState, useEffect } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAddToCart } from '../../cart/hooks/useCart';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
}

interface TrendingSliderProps {
  products: Product[];
  isLoading?: boolean;
}

export const TrendingSlider: React.FC<TrendingSliderProps> = ({ products, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { mutate: addToCart, isPending } = useAddToCart();

  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [products]);

  const handleAddToCart = (productId: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () => {
          toast.success('Added to cart');
        },
        onError: () => {
          toast.error('Failed to add to cart');
        }
      }
    );
  };

  if (isLoading || products.length === 0) {
    return <div className="h-[400px] w-full bg-muted rounded-3xl animate-pulse" />;
  }

  const activeProduct = products[currentIndex];

  return (
    <section className="section py-24">
      <div className="relative min-h-[500px] h-auto lg:h-[500px] w-full rounded-[3rem] overflow-hidden bg-white shadow-2xl border border-border shadow-slate-200/50">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_0%_0%,_rgba(240,240,240,1),_rgba(255,255,255,0))]" />
        
        <div className="relative z-10 h-full flex flex-col-reverse lg:flex-row items-center">
          <div className="flex-1 p-8 lg:p-20 space-y-6 flex flex-col justify-center text-center lg:text-left h-full pb-20 lg:pb-20">
            <div className="inline-flex items-center justify-center lg:justify-start gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
              <span className="w-10 h-[2px] bg-primary"></span>
              Trending Now
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight leading-tight uppercase line-clamp-2">
              {activeProduct.name}
            </h2>
            
            <p className="text-sm lg:text-lg text-muted-foreground font-medium italic opacity-60">
              Limited Edition Release. Experience premium craftsmanship at its best.
            </p>

            <div className="text-3xl lg:text-4xl font-black tracking-tighter text-foreground">
              ₹{activeProduct.price.toLocaleString('en-IN')}
            </div>

            <div className="flex gap-4 pt-4 justify-center lg:justify-start">
              <Link to="/products/$productId" params={{ productId: activeProduct._id }}>
                <button className="h-14 px-8 lg:px-10 bg-black text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all">
                  Shop Release
                </button>
              </Link>
              <button 
                onClick={() => handleAddToCart(activeProduct._id)}
                disabled={isPending}
                className="h-14 w-14 border-2 border-border flex items-center justify-center rounded-2xl hover:bg-black hover:text-white transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div className="flex-1 w-full h-64 lg:h-full p-8 lg:p-20 flex items-center justify-center relative">
             <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-slate-100/50 via-white to-white opacity-40 pointer-events-none" />
             <img 
               src={activeProduct.images?.[0] || 'https://placehold.co/600x600/eeeeee/999999.png?text=ZenCart'} 
               alt={activeProduct.name}
               className="h-full w-full object-contain drop-shadow-2xl animate-float"
               onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eeeeee/999999.png?text=Unavailable'; }}
             />
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 lg:bottom-10 lg:left-12 lg:-translate-x-0 flex gap-3 z-30">
          {products.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 transition-all duration-700 rounded-full ${i === currentIndex ? 'w-12 bg-black' : 'w-4 bg-muted'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

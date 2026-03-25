import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Loader2 } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { useAddToCart } from '../../cart/hooks/useCart';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../../wishlist/hooks/useWishlist';
import toast from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
}

interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: Product[];
  isLoading?: boolean;
}

export const ProductCarousel: React.FC<ProductCarouselProps> = ({ title, subtitle, products, isLoading }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { mutate: addToCart, isPending } = useAddToCart();
  const { data: wishlistData } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isProductWishlisted = (productId: string) => {
    return (wishlistData as any)?.products?.some((p: any) => p._id === productId) || 
           (wishlistData as any)?.data?.products?.some((p: any) => p._id === productId);
  };

  const toggleWishlist = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (isProductWishlisted(productId)) {
      removeFromWishlist.mutate(productId);
    } else {
      addToWishlist.mutate(productId);
    }
  };

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault(); // Prevent navigating to product details
    e.stopPropagation();
    
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 section">
        <div className="h-8 bg-muted rounded w-48 mb-6 animate-pulse" />
        <div className="flex gap-6 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="min-w-[300px] aspect-[3/4] bg-muted rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className="py-24 group">
      <div className="section flex items-end justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-2 uppercase">{title}</h2>
          {subtitle && <p className="text-muted-foreground font-medium text-sm tracking-wide uppercase opacity-60">{subtitle}</p>}
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => scroll('left')}
            className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-8 overflow-x-auto px-[5%] scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product) => (
          <div key={product._id} className="min-w-[280px] md:min-w-[350px] snap-start mb-4">
            <Link 
              to="/products/$productId" 
              params={{ productId: product._id }}
              className="block group/card relative"
            >
              <div className="aspect-[4/5] bg-muted rounded-[2rem] overflow-hidden border border-border/50 relative">
                <img 
                  src={product.images?.[0] || 'https://placehold.co/400x500/eeeeee/999999.png?text=ZenCart'} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700"
                  onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x500/eeeeee/999999.png?text=Unavailable'; }}
                />
                
                {/* Overlay actions */}
                <div className="absolute top-6 right-6 flex flex-col gap-3 translate-x-12 opacity-0 group-hover/card:translate-x-0 group-hover/card:opacity-100 transition-all duration-300">
                  <button 
                    onClick={(e) => toggleWishlist(e, product._id)}
                    disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                    className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl transition-colors
                      ${isProductWishlisted(product._id) ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
                  >
                    <Heart className={`w-4 h-4 ${isProductWishlisted(product._id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="absolute bottom-6 left-6 right-6 translate-y-12 opacity-0 group-hover/card:translate-y-0 group-hover/card:opacity-100 transition-all duration-500">
                  <button 
                    onClick={(e) => handleAddToCart(e, product._id)}
                    disabled={isPending}
                    className="w-full h-12 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ShoppingBag className="w-4 h-4" /> Quick Add</>}
                  </button>
                </div>
              </div>

              <div className="mt-6 space-y-1 text-center">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">{product.category}</div>
                <h3 className="text-xl font-bold tracking-tight">{product.name}</h3>
                <div className="text-lg font-black tracking-tight text-foreground/80">₹{product.price.toLocaleString('en-IN')}</div>
              </div>
            </Link>
          </div>
        ))}
        {/* Padding for scroll behavior */}
        <div className="min-w-[5%] h-full" />
      </div>
    </section>
  );
};

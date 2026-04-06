import { Link, useNavigate } from '@tanstack/react-router';
import { Heart, Star, TrendingUp } from 'lucide-react';
import { useAuthStore } from '../../../store/authStore';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../../wishlist/hooks/useWishlist';
import { useAddToCart } from '../../cart/hooks/useCart';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: any;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { isAuthenticated } = useAuthStore();
  const { data: wishlistData } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { mutate: addToCart, isPending: isAddingCart } = useAddToCart();
  const navigate = useNavigate();

  const isWishlisted = (wishlistData as any)?.products?.some((p: any) => p._id === product._id) || (wishlistData as any)?.data?.products?.some((p: any) => p._id === product._id);

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      removeFromWishlist.mutate(product._id);
    } else {
      addToWishlist.mutate(product._id);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      toast.error('Please login to checkout');
      navigate({ to: '/login' });
      return;
    }

    navigate({ to: '/checkout', search: { productId: product._id, quantity: 1 } });
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart(
      { productId: product._id, quantity: 1 },
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

  return (
    <Link
      to="/products/$productId"
      params={{ productId: product._id }}
      className="group flex flex-col rounded-2xl border border-transparent bg-white overflow-hidden hover:border-border hover:shadow-2xl transition-all duration-300 relative"
    >
      <div className="aspect-[4/5] bg-slate-50 overflow-hidden relative rounded-2xl">
        <img
          src={product.images?.[0] || `https://placehold.co/600x800/eeeeee/999999.png?text=Product`}
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://placehold.co/600x800/eeeeee/999999.png?text=Image+Unavailable';
          }}
        />
        
        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          disabled={addToWishlist.isPending || removeFromWishlist.isPending}
          className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-all z-10 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 duration-300
            ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white text-black hover:bg-black hover:text-white'}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="text-[9px] bg-black text-white px-2 py-1 rounded-sm font-black uppercase tracking-widest shadow-lg">
              Featured
            </span>
          )}
          {product.isTrending && (
            <span className='text-[9px] bg-white text-black px-2 py-1 rounded-sm font-black uppercase tracking-widest shadow-lg border border-border flex items-center gap-1'><TrendingUp className='w-3 h-3 fill-black text-black'/>Trending Now</span>
          )}
          {product.rating > 4.5 && (
            <span className="text-[9px] bg-white text-black px-2 py-1 rounded-sm font-black uppercase tracking-widest shadow-lg border border-border flex items-center gap-1">
               <Star className="w-3 h-3 fill-black text-black" /> Top Rated
            </span>
          )}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1 gap-1">
        <p className="text-[9px] text-muted-foreground uppercase tracking-[0.2em] font-black">{product.category}</p>
        <h3 className="text-sm font-bold tracking-tight leading-tight line-clamp-2 min-h-[2.5rem] mt-1 pr-6 hover:text-primary transition-colors">{product.name}</h3>
        
        <div className="mt-auto pt-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-black text-lg tracking-tighter">₹{product.price.toLocaleString('en-IN')}</span>
            <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
              <Star className="w-3 h-3 fill-muted-foreground" /> {product.rating?.toFixed(1) || '0.0'}
            </div>
          </div>
          
          <div className="flex gap-2 w-full mt-1">
            <button 
              onClick={handleAddToCart}
              disabled={isAddingCart}
              className="flex-1 h-10 border border-border rounded-lg text-[9px] font-black uppercase tracking-widest hover:border-black hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button 
              onClick={handleBuyNow}
              className="flex-1 h-10 bg-black text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-[1.03] transition-transform disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

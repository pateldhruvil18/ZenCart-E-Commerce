import { useWishlist } from '../hooks/useWishlist';
import { ProductCard } from '../../products/components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '../../../components/base/Button';

export const Wishlist = () => {
  const { data: wishlistData, isLoading } = useWishlist();
  
  const products = wishlistData?.data?.products || [];

  if (isLoading) {
    return (
      <div className="section py-12 text-center animate-pulse">
        <Heart className="h-12 w-12 mx-auto text-muted mb-4" />
        <p className="text-muted-foreground">Loading your wishlist...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="section py-20 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
          <Heart className="h-10 w-10 text-muted-foreground opacity-20" />
        </div>
        <h2 className="text-2xl font-black mb-2 tracking-tight">Your Wishlist is Empty</h2>
        <p className="text-muted-foreground mb-8 max-w-xs mx-auto text-sm">Save items you love to your wishlist and they'll show up here.</p>
        <Link to="/products">
          <Button className="rounded-xl font-black uppercase tracking-widest px-8">Start Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="section py-12">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1">My Wishlist</h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">{products.length} items saved</p>
        </div>
        <Link to="/products">
          <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-widest flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product: any) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

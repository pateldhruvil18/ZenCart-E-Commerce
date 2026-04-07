import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useProductDetails } from '../hooks/useProducts';
import { useAddToCart } from '../../cart/hooks/useCart';
import { useAuthStore } from '../../../store/authStore';
import { ShoppingCart, Star, ArrowLeft, Package, Tag, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useWishlist, useAddToWishlist, useRemoveFromWishlist } from '../../wishlist/hooks/useWishlist';
import toast from 'react-hot-toast';
import { Button } from '@/components/base/Button';

export const ProductDetail = () => {
  const { productId } = useParams({ strict: false });
  const { data, isLoading, isError } = useProductDetails(productId || '');
  const addToCart = useAddToCart();
  const { isAuthenticated } = useAuthStore();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: wishlistData } = useWishlist();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  if (isLoading) {
    return (
      <div className="section py-12">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-muted rounded-md" />
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 bg-muted rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !data?.data?.product) {
    return (
      <div className="section py-20 text-center">
        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-semibold mb-2">Product not found</h2>
        <p className="text-muted-foreground mb-6">This product may have been removed or the link is invalid.</p>
        <Link to="/products">
          <Button variant="outline">Browse Products</Button>
        </Link>
      </div>
    );
  }

  const { product, reviews } = data.data;
  
  // Hydrate selectedImage properly once product loads
  useEffect(() => {
    if (product?.images?.length > 0 && !selectedImage) {
      setSelectedImage(product.images[0]);
    }
  }, [product, selectedImage]);

  const isWishlisted = wishlistData?.data?.products?.some((p: any) => p._id === product._id);
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart.mutate(
      { productId: product._id, quantity: qty },
      {
        onSuccess: () => {
          navigate({ to: '/cart' });
        },
      }
    );
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to checkout directly');
      navigate({ to: '/login' });
      return;
    }
    navigate({ to: '/checkout', search: { productId: product._id, quantity: qty } });
  };

  const toggleWishlist = () => {
    if (isWishlisted) {
      removeFromWishlist.mutate(product._id);
    } else {
      addToWishlist.mutate(product._id);
    }
  };

  return (
    <div className="section py-8">
      {/* Breadcrumb & Wishlist Toggle */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
        <button
          onClick={toggleWishlist}
          disabled={addToWishlist.isPending || removeFromWishlist.isPending}
          className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-xs font-bold uppercase tracking-wider
            ${isWishlisted 
              ? 'bg-red-500 border-red-500 text-white shadow-lg shadow-red-200' 
              : 'bg-white border-border text-muted-foreground hover:border-red-500 hover:text-red-500'}`}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Product Image Gallery */}
        <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
          {/* Mobile Horizontal / Desktop Vertical Thumbnails */}
          {product.images?.length > 1 && (
            <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto w-full md:w-20 shrink-0 pb-2 md:pb-0 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
              {product.images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`relative aspect-square w-20 md:w-full flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-300 
                    ${selectedImage === img 
                      ? 'border-black ring-2 ring-black/10 scale-[0.98]' 
                      : 'border-border hover:border-black/50 opacity-60 hover:opacity-100'}`}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/eeeeee/999999.png?text=Error'; }}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Main Large Image */}
          <div className="flex-1 aspect-square rounded-2xl overflow-hidden border border-border bg-slate-50 shadow-sm group relative">
            <img
              src={selectedImage || product.images?.[0] || 'https://placehold.co/600x600/eeeeee/999999.png?text=ZenCart'}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-[1.12] transition-transform duration-500 ease-out cursor-crosshair"
              onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/600x600/eeeeee/999999.png?text=Unavailable'; }}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground border border-border px-2.5 py-1 rounded bg-muted/20">
              {product.category}
            </span>
            {product.isFeatured && (
              <span className="text-[10px] bg-black text-white px-2.5 py-1 rounded font-black uppercase tracking-widest">Featured</span>
            )}
          </div>

          <h1 className="text-3xl font-black mb-2 tracking-tight text-foreground">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex items-center gap-0.5 text-yellow-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="h-4 w-4"
                  fill={s <= Math.round(product.rating || 0) ? 'currentColor' : 'none'}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground font-bold">
              {product.rating?.toFixed(1) || '0.0'} <span className="font-normal opacity-60">({product.numReviews || 0} reviews)</span>
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-4xl font-black text-black">₹{product.price.toLocaleString('en-IN')}</span>
            {product.originalPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through opacity-50">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-xs bg-green-500 text-white px-2 py-1 rounded font-black uppercase">{discount}% OFF</span>
              </>
            )}
          </div>

          <div className="p-4 bg-slate-50 border-l-4 border-black mb-8 rounded-r-lg">
             <p className="text-muted-foreground text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest
              ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              <Package className="h-4 w-4" />
              {product.stock > 0 ? `${product.stock} Units left` : 'Out of stock'}
            </div>
          </div>

          {/* Tags */}
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map((tag: string) => (
                <span key={tag} className="flex items-center gap-1.5 text-[10px] font-black uppercase border border-border px-3 py-1.5 rounded-full bg-white text-muted-foreground shadow-sm">
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Add to Cart */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto border-t border-border pt-8">
            <div className="w-full sm:w-32">
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="w-full h-14 border border-border rounded-xl px-4 text-xs tracking-widest bg-white font-black uppercase focus:border-black focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer"
              >
                {[1, 2, 3, 4, 5, 10].map((n) => (
                  <option key={n} value={n}>Qty: {n}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1 flex gap-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || addToCart.isPending}
                className="flex-1 h-14 border-2 border-border text-black flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest rounded-xl hover:border-black hover:bg-slate-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0} // Removed addToCart.isPending as it's no longer used for buy now
                className="flex-1 h-14 bg-black text-white flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest rounded-xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Package className="h-4 w-4" />
                {product.stock === 0 ? 'Sold Out' : 'Buy Now'}
              </button>
            </div>
          </div>

          {!isAuthenticated && (
            <p className="mt-6 text-[10px] text-muted-foreground text-center font-bold uppercase tracking-widest">
              <Link to="/login" className="text-black underline underline-offset-4 hover:text-muted-foreground transition-colors">Sign in</Link> to save items and checkout
            </p>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 border-t border-border pt-12">
        <div className="flex flex-col gap-12">
          
          {/* Review List */}
          <div className="w-full">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black tracking-tight">Community Reviews</h2>
              <div className="text-sm font-bold text-muted-foreground uppercase tracking-widest">{reviews?.length || 0} reviews</div>
            </div>
            
            {reviews?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {reviews.map((review: any) => (
                  <div key={review._id} className="border border-border rounded-xl p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-sm uppercase">
                          {review.user?.name?.[0] || 'C'}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm tracking-tight">{review.user?.name || 'Verified Buyer'}</span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-green-600">✓ Verified Purchase</span>
                        </div>
                      </div>
                      <div className="flex text-yellow-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className="h-4 w-4" fill={s <= review.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-foreground/80 leading-relaxed italic border-l-2 border-border pl-4 ml-1">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center border border-dashed border-border rounded-xl bg-slate-50">
                <Star className="w-8 h-8 text-muted-foreground opacity-20 mb-3" />
                <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase">No Reviews Yet</p>
                <p className="text-[10px] text-muted-foreground/60 w-1/2 text-center mt-2 leading-relaxed font-medium">Be the first to share your experience with this product after purchase.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

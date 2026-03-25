import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart, useUpdateCartItem, useRemoveFromCart } from '../hooks/useCart';
import { Link } from '@tanstack/react-router';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { data: cartData, isLoading } = useCart();
  const { mutate: updateQuantity, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCart();

  // Handle body scroll locking
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const items = (cartData as any)?.items || (cartData as any)?.data?.cart?.items || (cartData as any)?.data?.items || [];
  const isEmpty = items.length === 0;

  const handleUpdateQuantity = (productId: string, currentQty: number, change: number) => {
    const newQty = currentQty + change;
    if (newQty < 1) {
      removeItem(productId);
      return;
    }
    updateQuantity({ productId, quantity: newQty });
  };

  // Calculate Subtotal safely
  const subtotal = items.reduce((acc: number, item: any) => {
    const price = item.product?.price || 0;
    return acc + (price * item.quantity);
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[210] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" /> 
                Your Cart
                <span className="bg-black text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full ml-2">
                  {items.length}
                </span>
              </h2>
              <button 
                onClick={onClose}
                className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Cart Items Area */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
              {isLoading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-24 h-24 bg-muted rounded-2xl" />
                      <div className="flex-1 space-y-3 py-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/4" />
                        <div className="h-8 bg-muted rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : isEmpty ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 text-muted-foreground opacity-60">
                  <ShoppingBag className="w-16 h-16" />
                  <p className="text-sm font-bold uppercase tracking-widest max-w-[200px]">Your cart is currently empty</p>
                  <button onClick={onClose} className="h-12 px-8 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                    Start Shopping
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item: any) => (
                    <div key={item.product?._id} className="flex gap-5 group">
                      <Link 
                        to="/products/$productId" 
                        params={{ productId: item.product?._id }}
                        onClick={onClose}
                        className="w-24 h-24 bg-muted rounded-2xl overflow-hidden flex-shrink-0 border border-border/50 block"
                      >
                        <img 
                          src={item.product?.images?.[0] || 'https://placehold.co/400x400/eeeeee/999999.png?text=Product'} 
                          alt={item.product?.name}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover hover:scale-110 transition-transform" 
                          onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/eeeeee/999999.png?text=Unavailable'; }}
                        />
                      </Link>
                      <div className="flex flex-col justify-between flex-1 py-1">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <Link 
                              to="/products/$productId" 
                              params={{ productId: item.product?._id }}
                              onClick={onClose}
                              className="font-bold text-sm tracking-tight line-clamp-1 hover:text-primary transition-colors hover:underline underline-offset-4"
                            >
                              {item.product?.name}
                            </Link>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60 mt-1">
                              {item.product?.category || 'Category'}
                            </p>
                          </div>
                          <button 
                            onClick={() => removeItem(item.product?._id)}
                            disabled={isRemoving}
                            className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          {/* Quantity Selector */}
                          <div className="flex items-center bg-muted/50 rounded-xl border border-border/50">
                            <button 
                              onClick={() => handleUpdateQuantity(item.product?._id, item.quantity, -1)}
                              disabled={isUpdating}
                              className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white rounded-l-xl transition-colors disabled:opacity-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                            <button 
                              onClick={() => handleUpdateQuantity(item.product?._id, item.quantity, 1)}
                              disabled={isUpdating}
                              className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white rounded-r-xl transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="font-black text-sm tracking-tighter">
                            ₹{(item.product?.price * item.quantity).toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer / Checkout */}
            {!isEmpty && (
              <div className="p-6 bg-slate-50 border-t border-border">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm font-bold text-muted-foreground">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-muted-foreground">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-xl font-black tracking-tighter pt-4 border-t border-border">
                    <span>Total</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <Link to="/checkout" onClick={onClose} className="w-full">
                  <button className="w-full h-14 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-slate-300 hover:scale-[1.02] active:scale-95 transition-all">
                    Proceed to Checkout <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
                
                <p className="text-center text-[9px] font-bold uppercase tracking-widest text-muted-foreground mt-4 flex items-center justify-center gap-1 opacity-60">
                  Secure Checkout By Stripe
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

import { useCart, useUpdateCartItem, useRemoveFromCart } from '../hooks/useCart';
import { Button } from '../../../components/base/Button';
import { Link } from '@tanstack/react-router';
import { Trash2, Minus, Plus } from 'lucide-react';

export const CartProvider = () => {
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveFromCart();

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading Cart...</div>;

  const items = cart?.items || [];
  const total = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4">
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <span className="text-4xl text-muted-foreground">🛒</span>
        </div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-muted-foreground max-w-sm">Looks like you haven't added anything to your cart yet. Let's change that.</p>
        <Link to="/products">
          <Button className="mt-4">Explore Premium Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold mb-6 tracking-tight">Shopping Cart</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-4">
          {items.map((item: any) => (
            <div key={item.product._id} className="glass-panel flex gap-4 p-4 rounded-xl items-center shadow-sm hover:shadow-md transition-shadow">
              <Link to="/products/$productId" params={{ productId: item.product._id }} className="shrink-0 block">
                <img 
                  src={item.product.images?.[0] || 'https://via.placeholder.com/150'} 
                  alt={item.product.name} 
                  className="w-24 h-24 object-cover rounded-lg bg-muted hover:opacity-80 transition-opacity"
                />
              </Link>
              <div className="flex-1 space-y-1">
                <Link to={`/products/$productId`} params={{ productId: item.product._id }} className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1">
                  {item.product.name}
                </Link>
                <div className="text-muted-foreground text-sm">{item.product.category}</div>
                <div className="font-bold text-lg">₹{item.price.toLocaleString('en-IN')}</div>
              </div>
              
              <div className="flex items-center gap-2 bg-secondary rounded-full p-1 border">
                <button 
                  onClick={() => updateItem.mutate({ productId: item.product._id, quantity: item.quantity - 1 })}
                  disabled={item.quantity <= 1 || updateItem.isPending}
                  className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-full transition-colors disabled:opacity-50"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-4 text-center text-sm font-medium">{item.quantity}</span>
                <button 
                  onClick={() => updateItem.mutate({ productId: item.product._id, quantity: item.quantity + 1 })}
                  disabled={item.quantity >= item.product.stock || updateItem.isPending}
                  className="w-8 h-8 flex items-center justify-center hover:bg-background rounded-full transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              
              <button 
                onClick={() => removeItem.mutate(item.product._id)}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-full transition-colors"
                disabled={removeItem.isPending}
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 rounded-xl flex flex-col h-fit sticky top-24 border-primary/20 shadow-lg">
          <h3 className="font-semibold text-xl mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm border-b pb-4 mb-4">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
              <span className="font-medium">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Shipping</span>
              <span>Free</span>
            </div>
          </div>
          <div className="flex justify-between font-bold text-2xl mb-6">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          
          <Link to="/checkout" className="w-full">
            <Button className="w-full py-6 text-lg tracking-wide rounded-xl shadow-md hover:shadow-xl hover:-translate-y-0.5 transition-all">
              Proceed to Checkout
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

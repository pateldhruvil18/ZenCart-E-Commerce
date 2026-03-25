import React, { useState, useEffect } from 'react';
import { useCart } from '../../cart/hooks/useCart';
import { useAddresses, useAddAddress, useCreateOrder, useVerifyPayment } from '../hooks/useCheckout';
import { useProductDetails } from '../../products/hooks/useProducts';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { CheckoutStepper } from './CheckoutStepper';
import { ArrowRight, Lock, MapPin, Truck, Plus, ShoppingBag, Banknote, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const Checkout = () => {
  const { data: cart, isLoading: isCartLoading } = useCart();
  const { data: addresses, isLoading: isAddressLoading } = useAddresses();
  const addAddress = useAddAddress();
  const createOrder = useCreateOrder();
  const verifyPayment = useVerifyPayment();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY' | 'COD'>('RAZORPAY');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: ''
  });

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const searchParams = useSearch({ from: '/protected/checkout' });
  const directProductId = searchParams.productId;
  const directQuantity = searchParams.quantity || 1;

  const { data: directProductData, isLoading: isDirectProductLoading } = useProductDetails(directProductId as string);
  const directProduct = directProductData?.data?.product;

  useEffect(() => {
    if (addresses?.length > 0 && !selectedAddressId) {
      setSelectedAddressId(addresses[0]._id);
    }
  }, [addresses, selectedAddressId]);

  const items = directProductId && directProduct 
    ? [{ product: directProduct, quantity: directQuantity, price: directProduct.price }]
    : ((cart as any)?.items || (cart as any)?.data?.cart?.items || (cart as any)?.data?.items || []);
    
  const totalAmount = items.reduce((sum: number, item: any) => sum + (item.price || item.product?.price || 0) * item.quantity, 0);

  if ((!directProductId && isCartLoading) || (directProductId && isDirectProductLoading) || isAddressLoading) {
    return (
      <div className="section py-20 flex flex-col items-center justify-center space-y-6 animate-pulse">
        <div className="w-12 h-12 bg-muted rounded-full" />
        <div className="h-4 bg-muted rounded w-48" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="section py-32 flex flex-col items-center justify-center space-y-6 text-center">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="w-10 h-10 text-muted-foreground opacity-60" />
        </div>
        <h2 className="text-3xl font-black uppercase tracking-tighter">Your cart is empty</h2>
        <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase max-w-sm">
          Add items to your cart before proceeding to checkout.
        </p>
        <button 
          onClick={() => navigate({ to: '/products' })}
          className="mt-6 h-12 px-8 bg-black text-white font-black uppercase text-[10px] tracking-widest rounded-xl hover:scale-105 transition-all"
        >
          Explore Collection
        </button>
      </div>
    );
  }

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    addAddress.mutate(addressForm, {
      onSuccess: () => {
        setShowAddressForm(false);
        setAddressForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' });
      }
    });
  };

  const proceedToReview = () => {
    if (!selectedAddressId) return alert('Please select a delivery address');
    setStep(2);
  };

  const handlePayment = async () => {
    try {
      const directItemsPayload = directProductId ? [{ product: directProductId, quantity: directQuantity }] : undefined;
      const res = await createOrder.mutateAsync({ addressId: selectedAddressId, paymentMethod, directItems: directItemsPayload });
      
      if (res.bypassRazorpay) {
        toast.success(`Order placed successfully via Cash on Delivery`);
        navigate({ to: '/profile' });
        return;
      }
      
      const { razorpayOrderId, amount, keyId } = res;

      const options = {
        key: keyId,
        amount: amount,
        currency: 'INR',
        name: 'ZenCart',
        description: 'Premium E-Commerce Checkout',
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            await verifyPayment.mutateAsync({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              isDirectPurchase: res.isDirectPurchase
            });
            toast.success('Payment successful!');
            navigate({ to: '/profile' });
          } catch (err: any) {
            toast.error(err.message || 'Payment verification failed');
          }
        },
        prefill: {
          name: 'ZenCart User',
          email: 'user@zencart.com',
          contact: '9999999999'
        },
        theme: { color: '#000000' }
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err: any) {
      toast.error(err.message || 'Failed to initiate payment');
    }
  };

  return (
    <div className="section min-h-screen py-12">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-3xl font-black uppercase tracking-tighter mb-12 text-center">Secure Checkout</h1>
        
        <div className="px-8 sm:px-16 mb-16">
           <CheckoutStepper currentStep={step} steps={['Address', 'Review & Payment']} />
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Select Delivery Address
                  </h2>
                </div>
                
                {addresses?.length > 0 && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {addresses.map((address: any) => (
                      <div 
                        key={address._id} 
                        onClick={() => setSelectedAddressId(address._id)}
                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 relative overflow-hidden
                          ${selectedAddressId === address._id 
                            ? 'border-black bg-slate-50 shadow-md' 
                            : 'border-border hover:border-black/30 bg-white'}`}
                      >
                        {selectedAddressId === address._id && (
                           <div className="absolute top-0 right-0 w-8 h-8 bg-black flex items-center justify-center rounded-bl-xl">
                              <MapPin className="w-3 h-3 text-white" />
                           </div>
                        )}
                        <h3 className="font-black text-sm tracking-tight mb-1">{address.fullName}</h3>
                        <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase mb-3">{address.phone}</p>
                        <p className="text-xs font-medium text-muted-foreground leading-relaxed line-clamp-3">
                          {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {showAddressForm ? (
                  <form onSubmit={handleAddressSubmit} className="p-6 rounded-2xl border border-border bg-slate-50 space-y-5 animate-in fade-in zoom-in-95 duration-300">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">New Address Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input required placeholder="Full Name" value={addressForm.fullName} onChange={e => setAddressForm({...addressForm, fullName: e.target.value})} className="w-full h-12 border border-border rounded-xl px-4 text-xs font-medium focus:border-black outline-none transition-all" />
                      <input required placeholder="Phone Number" value={addressForm.phone} onChange={e => setAddressForm({...addressForm, phone: e.target.value})} className="w-full h-12 border border-border rounded-xl px-4 text-xs font-medium focus:border-black outline-none transition-all" />
                    </div>
                    <input required placeholder="Address Line 1" value={addressForm.addressLine1} onChange={e => setAddressForm({...addressForm, addressLine1: e.target.value})} className="w-full h-12 border border-border rounded-xl px-4 text-xs font-medium focus:border-black outline-none transition-all" />
                    <input placeholder="Address Line 2 (Optional)" value={addressForm.addressLine2} onChange={e => setAddressForm({...addressForm, addressLine2: e.target.value})} className="w-full h-12 border border-border rounded-xl px-4 text-xs font-medium focus:border-black outline-none transition-all" />
                    <div className="grid grid-cols-3 gap-4">
                      <input required placeholder="City" value={addressForm.city} onChange={e => setAddressForm({...addressForm, city: e.target.value})} className="w-full h-12 border border-border rounded-xl px-4 text-xs font-medium focus:border-black outline-none transition-all" />
                      <input required placeholder="State" value={addressForm.state} onChange={e => setAddressForm({...addressForm, state: e.target.value})} className="w-full h-12 border border-border rounded-xl px-4 text-xs font-medium focus:border-black outline-none transition-all" />
                      <input required placeholder="Pincode" value={addressForm.pincode} onChange={e => setAddressForm({...addressForm, pincode: e.target.value})} className="w-full h-12 border border-border rounded-xl px-4 text-xs font-medium focus:border-black outline-none transition-all" />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                      <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 h-12 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-colors">Cancel</button>
                      <button type="submit" disabled={addAddress.isPending} className="px-8 h-12 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                        {addAddress.isPending ? 'Saving...' : 'Save Address'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <button 
                    onClick={() => setShowAddressForm(true)}
                    className="w-full h-14 border-2 border-dashed border-border rounded-2xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:border-black hover:text-black transition-all group"
                  >
                    <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Add New Delivery Address
                  </button>
                )}

                {!showAddressForm && addresses?.length > 0 && (
                  <div className="pt-6 border-t border-border flex justify-end">
                     <button 
                       onClick={proceedToReview}
                       disabled={!selectedAddressId}
                       className="h-14 px-10 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center gap-3 shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                     >
                       Continue to Payment <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Order Review
                  </h2>
                  <button onClick={() => setStep(1)} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest underline underline-offset-4 hover:text-black">
                    Change Address
                  </button>
                </div>

                {/* Review Items */}
                <div className="space-y-4">
                  {items.map((item: any) => (
                    <div key={item.product?._id} className="flex gap-4 p-4 rounded-2xl border border-border bg-white group hover:border-black/20 transition-colors">
                      <div className="w-20 h-20 bg-muted rounded-xl bg-cover bg-center shrink-0 border border-border/50" style={{ backgroundImage: `url(${item.product?.images?.[0]})` }} />
                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div>
                           <h4 className="font-black text-sm tracking-tight">{item.product?.name || item.name}</h4>
                           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="font-black text-sm">
                           ₹{((item.price || item.product?.price) * item.quantity).toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Payment Method Selector */}
                <div className="pt-8 mt-8 border-t border-border">
                  <h2 className="text-sm font-black uppercase tracking-widest mb-4">Select Payment Method</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPaymentMethod('COD')}
                      className={`h-16 rounded-xl border-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'COD' ? 'border-black bg-black text-white shadow-xl' : 'border-border hover:border-black/30'}`}
                    >
                      <Banknote className="w-4 h-4" /> Cash on Delivery
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('RAZORPAY')}
                      className={`h-16 rounded-xl border-2 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === 'RAZORPAY' ? 'border-black bg-[#02042B] text-white shadow-xl' : 'border-border hover:border-[#02042B]/30 text-[#02042B]'}`}
                    >
                      <ShieldCheck className="w-4 h-4" /> Online Payment
                    </button>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Sidebar Area: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-slate-50 rounded-3xl p-8 sticky top-24 border border-border/50">
              <h3 className="text-sm font-black uppercase tracking-widest mb-6">Payment Details</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-black">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-green-600 font-black uppercase tracking-widest">Free</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>Taxes</span>
                  <span className="text-black">Calculated below</span>
                </div>
              </div>
              
              <div className="pt-6 border-t border-border/50">
                <div className="flex justify-between items-end mb-8">
                  <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total</span>
                  <span className="text-3xl font-black tracking-tighter">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                
                {step === 2 && (
                  <button 
                    className="w-full h-16 bg-black text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handlePayment} 
                    disabled={createOrder.isPending || verifyPayment.isPending}
                  >
                    {createOrder.isPending || verifyPayment.isPending ? 'Processing...' : <><Lock className="w-4 h-4" /> Place Order</>}
                  </button>
                )}

                {step === 1 && (
                  <div className="text-center">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest max-w-[200px] mx-auto leading-relaxed">
                      Please select a delivery address to proceed to secure payment.
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-center mt-6 text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center justify-center gap-1.5 opacity-60">
              <Lock className="w-3 h-3" /> Encrypted & Secure Checkout by Razorpay
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

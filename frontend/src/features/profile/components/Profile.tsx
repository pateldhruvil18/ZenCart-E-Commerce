import React, { useState, useEffect } from 'react';
import { useProfile, useUpdateProfile, useMyOrders } from '../hooks/useProfile';
import { useWishlist } from '../../wishlist/hooks/useWishlist';
import { Package, User, Heart, ShoppingBag, LogOut } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { OrderTracker } from './OrderTracker';
import { ReviewModal } from './ReviewModal';
import { useAuthStore } from '../../../store/authStore';
import toast from 'react-hot-toast';

export const Profile = () => {
  const { data: profileData, isLoading } = useProfile();
  const { data: ordersData, isLoading: isLoadingOrders } = useMyOrders();
  const { data: wishlistData } = useWishlist();
  const updateProfile = useUpdateProfile();
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({ name: '', phone: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState({ id: '', name: '' });

  const openReview = (id: string, name: string) => {
    setReviewProduct({ id, name });
    setReviewModalOpen(true);
  };

  useEffect(() => {
    if (profileData?.data) {
      setFormData({ name: profileData.data.name, phone: profileData.data.phone || '' });
    }
  }, [profileData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile.mutate(formData, {
      onSuccess: () => {
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || err.message || 'Failed to update profile');
      }
    });
  };

  if (isLoading) return (
    <div className="section py-12">
      <div className="animate-pulse space-y-8">
        <div className="h-10 bg-muted rounded w-1/4" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="h-64 bg-muted rounded-xl" />
          <div className="md:col-span-2 h-96 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );

  const orders = ordersData?.data || [];
  const wishlistCount = wishlistData?.data?.products?.length || 0;

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  return (
    <>
      <ReviewModal 
        isOpen={reviewModalOpen} 
        onClose={() => setReviewModalOpen(false)}
        productId={reviewProduct.id}
        productName={reviewProduct.name}
      />
      
      <div className="section min-h-screen py-12">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border pb-8 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">My Account</h1>
            <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px]">Manage your profile and track orders</p>
          </div>
          <div className="flex gap-4">
             <Link to="/products">
               <button className="h-10 px-6 border border-border rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-black hover:text-white transition-colors">Shop Collection</button>
             </Link>
          </div>
        </header>

        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1 space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'orders' ? 'bg-black text-white shadow-xl' : 'text-muted-foreground hover:bg-muted hover:text-black'}`}
            >
              <Package className="w-4 h-4" /> Order History
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest ${activeTab === 'profile' ? 'bg-black text-white shadow-xl' : 'text-muted-foreground hover:bg-muted hover:text-black'}`}
            >
              <User className="w-4 h-4" /> Profile Details
            </button>
            <div className="my-6 border-b border-border" />
            <Link to="/wishlist" className="w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-black group">
              <span className="flex items-center gap-3"><Heart className="w-4 h-4" /> Wishlist</span>
              {wishlistCount > 0 && <span className="text-[9px] bg-black text-white px-2 py-0.5 rounded-full">{wishlistCount}</span>}
            </Link>
            <Link to="/cart" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest text-muted-foreground hover:bg-muted hover:text-black">
              <ShoppingBag className="w-4 h-4" /> Shopping Cart
            </Link>
            <div className="my-6 border-b border-border" />
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-black text-xs uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-3">
            
            {activeTab === 'profile' && (
              <div className="bg-slate-50 border border-border rounded-3xl p-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-6 mb-10 pb-8 border-b border-border">
                  <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white shadow-2xl">
                    <User className="w-10 h-10" />
                  </div>
                  <div>
                    <h2 className="font-black text-2xl tracking-tight uppercase">{profileData?.data?.name}</h2>
                    <div className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mt-1">{profileData?.data?.email}</div>
                    <div className="mt-3 inline-block bg-black/5 px-3 py-1 rounded text-[9px] font-black uppercase tracking-widest">{profileData?.data?.role}</div>
                  </div>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                      <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full h-12 border border-border rounded-xl px-4 text-xs font-bold focus:border-black outline-none transition-all" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Phone Number</label>
                      <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full h-12 border border-border rounded-xl px-4 text-xs font-bold focus:border-black outline-none transition-all" />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setIsEditing(false)} className="flex-1 h-12 border border-border rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-black hover:border-black transition-colors">Cancel</button>
                      <button type="submit" disabled={updateProfile.isPending} className="flex-1 h-12 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform disabled:opacity-50">Save Changes</button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-8">
                    <div className="grid sm:grid-cols-2 gap-6">
                       <div className="p-4 bg-white rounded-2xl border border-border/50">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Phone Number</p>
                          <p className="font-bold text-sm">{profileData?.data?.phone || 'Not set'}</p>
                       </div>
                       <div className="p-4 bg-white rounded-2xl border border-border/50">
                          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground mb-1">Account Status</p>
                          <p className="font-bold text-sm text-green-600">Active</p>
                       </div>
                    </div>
                    <button onClick={() => setIsEditing(true)} className="w-full h-12 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] shadow-xl transition-transform">
                      Update Profile
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="font-black text-xl tracking-tight uppercase flex items-center gap-3">
                    Recent Orders
                  </h2>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    {orders.length} total
                  </span>
                </div>
                
                {isLoadingOrders ? (
                  <div className="animate-pulse space-y-6">
                    {[1,2,3].map(i => <div key={i} className="h-40 bg-muted rounded-2xl" />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-32 text-center rounded-3xl border border-border bg-slate-50">
                    <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mb-6">
                      <Package className="w-8 h-8 text-black opacity-40" />
                    </div>
                    <h3 className="font-black uppercase tracking-tighter text-xl mb-2">No orders placed yet</h3>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground max-w-sm mx-auto leading-relaxed">
                      Your order history will appear here once you make your first purchase.
                    </p>
                    <Link to="/products">
                       <button className="h-12 px-8 bg-black text-white rounded-xl font-black uppercase text-[10px] tracking-widest mt-6 hover:scale-105 transition-all">Start Shopping</button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {orders.map((order: any) => (
                      <div key={order._id} className="border border-border p-6 rounded-3xl bg-white hover:border-black/30 transition-colors">
                        {/* Order Header */}
                        <div className="flex flex-wrap sm:flex-nowrap gap-4 justify-between items-start mb-6">
                          <div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                              <span>Order #{order._id.slice(-6).toUpperCase()}</span>
                              <span className="w-1 h-1 bg-border rounded-full" />
                              <span>{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </div>
                            <div className="font-black text-xl mt-2 tracking-tight">₹{order.totalAmount.toLocaleString('en-IN')}</div>
                          </div>
                          <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border
                            ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                              order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                              'bg-slate-50 text-slate-700 border-slate-200'}`}>
                            {order.orderStatus}
                          </div>
                        </div>

                        {/* Order Tracker Line */}
                        <div className="py-4 mb-6 border-y border-border/50 bg-slate-50/50 -mx-6 px-6">
                           <OrderTracker status={order.orderStatus} />
                        </div>

                        {/* Order Items Preview */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex-shrink-0 flex items-center gap-3 pr-6 border-r border-border last:border-0 last:pr-0">
                               <div className="w-12 h-12 rounded-xl bg-muted bg-cover bg-center border border-border/50" style={{ backgroundImage: `url(${item.product?.images?.[0] || 'https://via.placeholder.com/150'})` }} />
                               <div>
                                 <p className="text-xs font-bold max-w-[120px] truncate">{item.product?.name || 'Product Detail Unavailable'}</p>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-0.5">Qty: {item.quantity}</p>
                               </div>
                               
                               {order.orderStatus === 'delivered' && item.product?._id && (
                                 <button 
                                   onClick={() => openReview(item.product._id, item.product.name)}
                                   className="ml-auto px-4 py-1.5 border border-border font-black text-[9px] uppercase tracking-widest rounded-lg hover:bg-black hover:text-white transition-colors flex-shrink-0"
                                 >
                                   Write Review
                                 </button>
                               )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
    </>
  );
};

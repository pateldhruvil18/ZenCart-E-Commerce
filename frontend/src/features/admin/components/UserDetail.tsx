import { useParams, Link } from '@tanstack/react-router';
import { useAdminUserDetail, useUpdateUser } from '../hooks/useAdmin';
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  Package, 
  Star, 
  ChevronLeft, 
  ShieldCheck, 
  UserX, 
  UserCheck,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

export const UserDetail = () => {
  const { userId } = useParams({ from: '/admin/users/$userId' });
  const { data: userData, isLoading } = useAdminUserDetail(userId);
  const updateUser = useUpdateUser();

  if (isLoading) return (
    <div className="p-12 text-center animate-pulse text-sm font-bold text-muted-foreground uppercase tracking-widest">
      Loading User Profile...
    </div>
  );

  const { user, orders, reviews } = userData?.data || {};

  const handleStatusToggle = () => {
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    updateUser.mutate({ id: user._id, data: { status: newStatus } }, {
       onSuccess: () => toast.success(`User ${newStatus === 'active' ? 'unblocked' : 'blocked'} successfully`)
    });
  };

  const handleRoleToggle = () => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    updateUser.mutate({ id: user._id, data: { role: newRole } }, {
       onSuccess: () => toast.success(`User role updated to ${newRole}`)
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Breadcrumbs/Back */}
      <Link 
        to="/admin" 
        search={{ tab: 'users' }}
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-black transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to users
      </Link>

      {/* Profile Header */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/3 space-y-6">
          <div className="glass-panel bg-white p-8 rounded-[2rem] border border-border/50 shadow-xl shadow-slate-200/50 text-center">
            <div className="w-32 h-32 rounded-full bg-slate-100 border-4 border-white shadow-lg mx-auto mb-6 flex items-center justify-center text-slate-300 overflow-hidden">
               {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon className="w-12 h-12" />}
            </div>
            <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
            <div className="flex items-center justify-center gap-2 text-muted-foreground mt-1 mb-6">
              <Mail className="w-3.5 h-3.5" />
              <span className="text-sm font-medium">{user.email}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Account</div>
                  <div className={`text-[10px] font-black uppercase ${user.status === 'blocked' ? 'text-red-500' : 'text-green-500'}`}>
                    {user.status || 'Active'}
                  </div>
               </div>
               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Role</div>
                  <div className={`text-[10px] font-black uppercase ${user.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
                    {user.role}
                  </div>
               </div>
            </div>
          </div>

          <div className="glass-panel bg-white p-6 rounded-[2rem] border border-border/50 shadow-xl shadow-slate-200/50 space-y-6">
             <h3 className="text-xs font-black uppercase tracking-widest px-2">Administrative Actions</h3>
             <div className="space-y-3">
                <button 
                  onClick={handleRoleToggle}
                  disabled={updateUser.isPending}
                  className="w-full h-12 px-6 rounded-xl border-2 border-slate-200 text-[10px] font-black uppercase tracking-widest flex items-center justify-between hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-blue-500" />
                    <span>{user.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}</span>
                  </div>
                </button>
                <button 
                  onClick={handleStatusToggle}
                  disabled={updateUser.isPending}
                  className={`w-full h-12 px-6 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest flex items-center justify-between transition-all active:scale-95 disabled:opacity-50
                    ${user.status === 'blocked' ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100' : 'border-red-200 bg-red-50 text-red-700 hover:bg-red-100'}`}
                >
                  <div className="flex items-center gap-3">
                    {user.status === 'blocked' ? <UserCheck className="w-4 h-4" /> : <UserX className="w-4 h-4" />}
                    <span>{user.status === 'blocked' ? 'Unblock User' : 'Block User'}</span>
                  </div>
                </button>
             </div>
          </div>
        </div>

        <div className="flex-1 space-y-8">
           {/* Section: Overview */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-panel bg-white p-6 rounded-[2rem] border border-border/50 shadow-lg flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center">
                    <Package className="w-6 h-6" />
                 </div>
                 <div>
                    <div className="text-2xl font-black tracking-tight">{orders.length}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Orders</div>
                 </div>
              </div>
              <div className="glass-panel bg-white p-6 rounded-[2rem] border border-border/50 shadow-lg flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-yellow-50 text-yellow-500 flex items-center justify-center">
                    <Star className="w-6 h-6" />
                 </div>
                 <div>
                    <div className="text-2xl font-black tracking-tight">{reviews.length}</div>
                    <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Reviews Posted</div>
                 </div>
              </div>
           </div>

           {/* Section: Order History */}
           <div className="glass-panel bg-white rounded-[2rem] border border-border/50 shadow-xl overflow-hidden">
             <div className="px-8 py-6 border-b border-border/50 flex justify-between items-center">
                <h3 className="text-sm font-black uppercase tracking-widest">Order History</h3>
             </div>
             <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-border/50">
                    <tr>
                      <th className="px-8 py-4">ID</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4">Amount</th>
                      <th className="px-8 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {orders.length === 0 ? (
                      <tr><td colSpan={4} className="px-8 py-12 text-center text-muted-foreground font-medium italic">No orders found for this user.</td></tr>
                    ) : orders.map((order: any) => (
                      <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-4 font-black text-[11px] tracking-widest">#{order._id.slice(-6).toUpperCase()}</td>
                        <td className="px-8 py-4 text-muted-foreground flex items-center gap-2">
                           <Clock className="w-3.5 h-3.5" /> {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-8 py-4 font-black">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="px-8 py-4 text-right">
                           <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border
                            ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                            {order.orderStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
             </div>
           </div>

           {/* Section: Reviews */}
           <div className="glass-panel bg-white rounded-[2rem] border border-border/50 shadow-xl overflow-hidden">
             <div className="px-8 py-6 border-b border-border/50">
                <h3 className="text-sm font-black uppercase tracking-widest">Product Reviews</h3>
             </div>
             <div className="p-8 space-y-6">
                {reviews.length === 0 ? (
                  <p className="text-center text-muted-foreground font-medium italic">User hasn't posted any reviews yet.</p>
                ) : reviews.map((review: any) => (
                  <div key={review._id} className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 group">
                     <img src={review.product?.images?.[0]} className="w-20 h-20 object-cover rounded-xl shadow-md border border-white" />
                     <div className="flex-1 space-y-2">
                        <div className="flex justify-between items-start">
                           <h4 className="font-bold text-sm leading-tight text-primary hover:underline cursor-pointer">{review.product?.name}</h4>
                           <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'}`} />
                              ))}
                           </div>
                        </div>
                        <p className="text-xs text-muted-foreground italic leading-relaxed">"{review.comment}"</p>
                        <div className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-50 flex items-center gap-2">
                           <Calendar className="w-3 h-3" /> {new Date(review.createdAt).toLocaleDateString()}
                        </div>
                     </div>
                  </div>
                ))}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};

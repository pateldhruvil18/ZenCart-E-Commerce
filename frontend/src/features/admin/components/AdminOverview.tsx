import { useAdminDashboard, useAdminOrders } from '../hooks/useAdmin';
import { Package, Users, Tag, DollarSign, ArrowRight } from 'lucide-react';

export const AdminOverview = ({ setTab }: { setTab: (t: string) => void }) => {
  const { data: dashboard, isLoading: dashLoading } = useAdminDashboard();
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders(1);

  if (dashLoading) return <div className="p-8 text-center animate-pulse">Loading Analytics...</div>;

  const stats = [
    { title: 'Total Revenue', value: `₹${dashboard?.data?.totalRevenue?.toLocaleString('en-IN') || 0}`, icon: DollarSign },
    { title: 'Total Orders', value: dashboard?.data?.totalOrders || 0, icon: Package },
    { title: 'Products', value: dashboard?.data?.totalProducts || 0, icon: Tag },
    { title: 'Customers', value: dashboard?.data?.totalUsers || 0, icon: Users },
  ];

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="glass-panel p-6 rounded-3xl flex items-center gap-5 hover-lift shadow-xl shadow-slate-200/50 border border-border/50 group bg-white">
            <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-black tracking-widest text-muted-foreground mb-1">{stat.title}</p>
              <h3 className="text-2xl font-black tracking-tighter">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 glass-panel rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-border/50 bg-white">
          <div className="p-8 border-b border-border/50 flex justify-between items-center bg-slate-50/50">
            <h2 className="text-xl font-black uppercase tracking-tight">Recent Orders</h2>
            <button onClick={() => setTab('orders')} className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity">
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-muted-foreground uppercase text-[10px] font-black tracking-widest border-b border-border">
                <tr>
                  <th className="px-8 py-5">Order</th>
                  <th className="px-8 py-5">Customer</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {ordersLoading ? (
                  <tr><td colSpan={4} className="text-center py-12">Loading...</td></tr>
                ) : ordersData?.data?.orders?.slice(0, 5).map((order: any) => (
                  <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5 font-black text-xs tracking-widest">#{order._id.slice(-6).toUpperCase()}</td>
                    <td className="px-8 py-5">
                      <div className="font-bold text-sm tracking-tight">{order.userId?.name || 'Unknown'}</div>
                    </td>
                    <td className="px-8 py-5 font-black text-sm">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border
                        ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                          order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                          'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Help Card */}
        <div className="glass-panel p-10 rounded-3xl bg-black text-white space-y-6 flex flex-col justify-center items-center text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[100px] -mt-10 -mr-10" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-tr-[80px] -mb-8 -ml-8" />
          
          <div className="bg-white/10 p-5 rounded-3xl mb-2 backdrop-blur-md">
            <Package className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-black uppercase tracking-tight">Manage Your Store</h3>
          <p className="opacity-70 text-xs font-bold uppercase tracking-widest leading-relaxed max-w-[200px]">
            Add new products or check your recent customers.
          </p>
          <div className="flex flex-col w-full gap-3 pt-4 relative z-10">
            <button onClick={() => setTab('products')} className="w-full h-12 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] transition-transform">
              Manage Products
            </button>
            <button onClick={() => setTab('users')} className="w-full h-12 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors">
              Manage Users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

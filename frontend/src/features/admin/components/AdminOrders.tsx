import { useState } from 'react';
import { useAdminOrders, useUpdateOrderStatus } from '../hooks/useAdmin';

export const AdminOrders = () => {
  const [page, setPage] = useState(1);
  const { data: ordersData, isLoading: ordersLoading } = useAdminOrders(page);
  const updateStatus = useUpdateOrderStatus();

  if (ordersLoading) return <div className="p-8 text-center animate-pulse">Loading Orders...</div>;

  const totalPages = ordersData?.data?.totalPages || 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-border/50 pb-6 mb-8">
        <div>
           <h2 className="text-3xl font-black uppercase tracking-tighter">Orders</h2>
           <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Manage all customer orders</p>
        </div>
      </div>
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-border/50 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-muted-foreground uppercase text-[10px] font-black tracking-widest border-b border-border/50">
              <tr>
                <th className="px-8 py-5">Order ID</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Amount</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right bg-slate-50">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {ordersData?.data?.orders?.map((order: any) => (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-8 py-5 font-black text-xs tracking-widest">#{order._id.slice(-6).toUpperCase()}</td>
                  <td className="px-8 py-5">
                    <div className="font-bold text-sm tracking-tight">{order.userId?.name || 'Unknown'}</div>
                    <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{order.userId?.email}</div>
                  </td>
                  <td className="px-8 py-5 font-black text-sm tracking-tight">₹{order.totalAmount.toLocaleString('en-IN')}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border
                      ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' : 
                        order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 
                        'bg-slate-100 text-slate-700 border-slate-200'}`}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <select 
                      value={order.orderStatus}
                      onChange={(e) => updateStatus.mutate({ id: order._id, status: e.target.value })}
                      disabled={updateStatus.isPending || order.orderStatus === 'cancelled'}
                      className="bg-white border-2 border-border/50 rounded-xl px-3 py-2 text-[10px] font-black uppercase tracking-widest focus:border-black outline-none transition-all cursor-pointer min-w-[140px] appearance-none text-right disabled:opacity-50 hover:border-black/30"
                    >
                      <option value="processing">Processing</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="p-6 border-t border-border/50 flex justify-between items-center bg-slate-50/50">
            <button 
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-6 h-10 border border-border rounded-xl disabled:opacity-50 hover:bg-white hover:border-black/30 bg-white text-[10px] font-black tracking-widest uppercase transition-colors"
            >
              Previous
            </button>
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">Page {page} of {totalPages}</span>
            <button 
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="px-6 h-10 border border-border rounded-xl disabled:opacity-50 hover:bg-white hover:border-black/30 bg-white text-[10px] font-black tracking-widest uppercase transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

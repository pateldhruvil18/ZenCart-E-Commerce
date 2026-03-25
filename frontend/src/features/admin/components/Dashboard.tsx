import { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingBag, Users, ClipboardList, Settings } from 'lucide-react';
import { useSearch } from '@tanstack/react-router';
import { AdminOverview } from './AdminOverview';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminUsers } from './AdminUsers';
import { AdminSettings } from './AdminSettings';

export const AdminDashboard = () => {
  const search: any = useSearch({ from: '/admin' });
  const [activeTab, setActiveTab] = useState(search.tab || 'overview');

  // Update activeTab if URL search param changes
  useEffect(() => {
    if (search.tab) setActiveTab(search.tab);
  }, [search.tab]);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: ShoppingBag },
    { id: 'orders', label: 'Orders', icon: ClipboardList },
    { id: 'users', label: 'Customers', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return <AdminOverview setTab={setActiveTab} />;
      case 'products': return <AdminProducts />;
      case 'orders': return <AdminOrders />;
      case 'users': return <AdminUsers />;
      case 'settings': return <AdminSettings />;
      default: return <AdminOverview setTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 
        Use pt-24 or similar to clear the sticky navbar from MainLayout.
        The MainLayout navbar is fixed, so we need top padding here.
      */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row min-h-screen pt-16 lg:pt-20 pb-12 px-4 sm:px-6 lg:px-8 gap-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
          <div className="hidden lg:block px-4">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-60">Management</h2>
          </div>
          
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 scrollbar-hide">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-3 px-5 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap
                  ${activeTab === item.id 
                    ? 'bg-black text-white shadow-xl shadow-slate-200' 
                    : 'text-muted-foreground hover:bg-muted hover:text-black'}`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-8 mt-auto hidden lg:block border-t border-border">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-5 py-4 w-full rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300
                ${activeTab === 'settings' 
                  ? 'bg-black text-white shadow-xl shadow-slate-200' 
                  : 'text-muted-foreground hover:bg-muted hover:text-black'}`}
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 bg-white border border-border shadow-2xl shadow-slate-100 rounded-[2rem] p-8 lg:p-12 min-h-[600px]">
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

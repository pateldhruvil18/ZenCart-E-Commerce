import { useState, useEffect } from 'react';
import { useAdminUsers } from '../hooks/useAdmin';
import { Calendar, User as UserIcon, Shield, Search, X, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';

export const AdminUsers = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: usersData, isLoading } = useAdminUsers(page, searchTerm.trim() || undefined);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const users = usersData?.data?.users || [];
  const totalPages = usersData?.data?.totalPages || 0;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  if (isLoading && page === 1) return (
    <div className="p-12 text-center animate-pulse text-sm font-bold text-muted-foreground uppercase tracking-widest">
      Loading Users...
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-border/50 pb-6">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Customers</h2>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
            Manage your user community and permissions
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="glass-panel bg-white rounded-2xl p-4 border border-border/50 shadow-md flex gap-3 items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchInput}
            onChange={handleSearchChange}
            className="w-full h-10 pl-9 pr-4 border-2 border-border/50 rounded-xl text-sm font-medium bg-white focus:border-black outline-none transition-all"
          />
        </div>
        {searchInput && (
          <button
            onClick={() => setSearchInput('')}
            className="h-10 px-4 border border-border/50 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-black hover:border-black/30 transition-colors flex items-center gap-2"
          >
            <X className="w-3 h-3" /> Clear
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-3xl overflow-hidden shadow-xl shadow-slate-200/50 border border-border/50 bg-white">
        <div className="overflow-x-auto">
          {users.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <UserIcon className="w-8 h-8 mx-auto text-muted-foreground/40" />
              <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No users found</p>
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 text-muted-foreground uppercase text-[10px] font-black tracking-widest border-b border-border/50">
                <tr>
                  <th className="px-8 py-5">User Profile</th>
                  <th className="px-8 py-5">Verification</th>
                  <th className="px-8 py-5">Account Status</th>
                  <th className="px-8 py-5">Joined Date</th>
                  <th className="px-8 py-5">Role</th>
                  <th className="px-8 py-5 text-right">actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {users.map((user: any) => (
                  <tr 
                    key={user._id} 
                    className="hover:bg-slate-50 transition-colors group cursor-pointer"
                    onClick={() => {
                        navigate({ to: '/admin/users/$userId', params: { userId: user._id } });
                    }}
                  >
                    <td className="px-8 py-5">
                      <Link 
                        to="/admin/users/$userId" 
                        params={{ userId: user._id }}
                        className="flex items-center gap-4 group/link"
                      >
                        <div className="w-12 h-12 rounded-full bg-slate-100 border border-border/50 flex items-center justify-center text-slate-400 group-hover/link:bg-black group-hover/link:text-white transition-colors overflow-hidden">
                          {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <UserIcon className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="font-bold tracking-tight text-sm group-hover/link:text-primary transition-colors">{user.name}</div>
                          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{user.email}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${user.isVerified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'}`}>
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                       <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${user.status === 'blocked' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {user.status || 'active'}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-muted-foreground font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1.5">
                        {user.role === 'admin' && <Shield className="w-3.5 h-3.5 text-red-500" />}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'text-red-500' : 'text-blue-500'}`}>
                          {user.role}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                       <Link 
                        to="/admin/users/$userId" 
                        params={{ userId: user._id }}
                        className="p-2 inline-flex hover:bg-black hover:text-white rounded-lg transition-all border border-transparent hover:border-black/10 group-hover:translate-x-1"
                       >
                         <ChevronRight className="w-4 h-4" />
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-6 border-t border-border/50 flex justify-between items-center bg-slate-50/50">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="px-6 h-10 border border-border rounded-xl disabled:opacity-50 hover:bg-white hover:border-black/30 bg-white text-[10px] font-black tracking-widest uppercase transition-colors"
            >
              Previous
            </button>
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              Page {page} of {totalPages}
            </span>
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

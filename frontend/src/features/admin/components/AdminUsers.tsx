import { useAdminUsers } from '../hooks/useAdmin';
import { Calendar, User as UserIcon, Shield } from 'lucide-react';

export const AdminUsers = () => {
  const { data: usersData, isLoading } = useAdminUsers(1);

  if (isLoading) return <div className="p-8 text-center animate-pulse">Loading Users...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">User Management</h2>
      <div className="glass-panel rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {usersData?.data?.users?.map((user: any) => (
                <tr key={user._id} className="hover:bg-accent/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${user.isVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 uppercase text-xs font-bold tracking-tight">
                    <div className="flex items-center gap-1">
                      {user.role === 'admin' && <Shield className="w-3.5 h-3.5 text-red-500" />}
                      <span className={user.role === 'admin' ? 'text-red-500' : 'text-blue-500'}>{user.role}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

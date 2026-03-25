import { Shield, Bell, Database } from 'lucide-react';
import { Button } from '../../../components/base/Button';

export const AdminSettings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-black tracking-tight">System Settings</h2>
        <Button className="rounded-xl font-bold uppercase tracking-widest text-xs px-6">Save All Changes</Button>
      </div>

      <div className="grid gap-6">
        <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Security Settings</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
              <div>
                <div className="text-sm font-bold">Two-Factor Authentication</div>
                <div className="text-xs text-muted-foreground">Add an extra layer of security to admin accounts.</div>
              </div>
              <div className="w-12 h-6 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl opacity-60">
              <div>
                <div className="text-sm font-bold">IP Whitelisting</div>
                <div className="text-xs text-muted-foreground">Restrict admin access to specific IP addresses.</div>
              </div>
              <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-not-allowed">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
              <Bell className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Notification Preferences</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              <div>
                <div className="text-sm font-bold">New Order Alerts</div>
                <div className="text-xs text-muted-foreground">Receive desktop notifications for every new order.</div>
              </div>
            </label>
            <label className="flex items-center gap-3 p-4 bg-muted/20 rounded-xl cursor-pointer hover:bg-muted/30 transition-colors">
              <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary" />
              <div>
                <div className="text-sm font-bold">Low Inventory Warnings</div>
                <div className="text-xs text-muted-foreground">Get notified when products have less than 5 units left.</div>
              </div>
            </label>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl bg-white shadow-sm space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold">Database & Maintenance</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-widest border-2">Backup Database</Button>
            <Button variant="outline" className="rounded-xl font-bold text-xs uppercase tracking-widest border-2 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-100">Clear System Cache</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

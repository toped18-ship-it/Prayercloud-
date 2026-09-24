
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Palette, 
  Home, 
  Users, 
  Shield, 
  Globe, 
  MessageSquare, 
  Mic2, 
  Heart, 
  Calendar, 
  Library, 
  Bell, 
  BarChart3, 
  Lock, 
  Mail, 
  Zap, 
  Database, 
  History, 
  Settings,
  Menu,
  X,
  Search,
  BellRing,
  MapPin
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useAuth } from '../../lib/AuthContext';
import { toast } from 'sonner';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { label: 'Branding', icon: Palette, href: '/admin/branding' },
  { label: 'Homepage', icon: Home, href: '/admin/homepage' },
  { label: 'Users', icon: Users, href: '/admin/users' },
  { label: 'Roles & Permissions', icon: Shield, href: '/admin/roles' },
  { label: 'Countries', icon: Globe, href: '/admin/countries' },
  { label: 'Unreached Places', icon: MapPin, href: '/admin/unreached' },
  { label: 'Missionary Hub', icon: Zap, href: '/admin/hub' },
  { label: 'Chat Moderation', icon: MessageSquare, href: '/admin/chat' },
  { label: 'Recordings', icon: Mic2, href: '/admin/recordings' },
  { label: 'Prayer Requests', icon: Heart, href: '/admin/prayer' },
  { label: 'Events', icon: Calendar, href: '/admin/events' },
  { label: 'Resources', icon: Library, href: '/admin/resources' },
  { label: 'Notifications', icon: Bell, href: '/admin/notifications' },
  { label: 'Analytics', icon: BarChart3, href: '/admin/analytics' },
  { label: 'Security', icon: Lock, href: '/admin/security' },
  { label: 'Email/SMTP', icon: Mail, href: '/admin/email' },
  { label: 'API Integrations', icon: Settings, href: '/admin/api' },
  { label: 'Backups', icon: Database, href: '/admin/backups' },
  { label: 'Audit Logs', icon: History, href: '/admin/audit' },
];


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState([
    { id: '1', title: 'New Missionary Registration', time: '5m ago', read: false, type: 'info' },
    { id: '2', title: 'Automated Snapshot Created', time: '1h ago', read: false, type: 'success' },
    { id: '3', title: 'Suspicious IP Blocked (185.122.4.91)', time: '3h ago', read: true, type: 'warning' },
  ]);
  const location = useLocation();
  const { user } = useAuth();

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    toast.success('All notifications marked as read');
  };

  const clearNotifications = () => {
    setNotifications([]);
    setNotificationsOpen(false);
    toast.info('Notifications cleared');
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-50",
          sidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shrink-0">
              P
            </div>
            {sidebarOpen && <span className="font-display font-bold text-xl text-slate-900 tracking-tight">PRAYERCLOUD</span>}
          </div>
        </div>

        <ScrollArea className="flex-1 px-3 py-4">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors group relative",
                    isActive 
                      ? "bg-primary text-white shadow-md shadow-primary/20" 
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  )}
                >
                  <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                  {sidebarOpen && <span>{item.label}</span>}
                  {!sidebarOpen && isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="p-4 border-t border-slate-200">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-slate-500"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="h-4 w-4 mr-2" /> : <Menu className="h-4 w-4 mx-auto" />}
            {sidebarOpen && "Collapse Menu"}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-40">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-max max-w-md hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input 
                placeholder="Search resources, users, or logs..." 
                className="pl-10 h-10 w-80 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 relative">
              <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-none">
                PROD
              </Badge>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative hover:bg-slate-100"
                title="System Notifications"
              >
                <BellRing className="h-5 w-5 text-slate-500" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </Button>

              {notificationsOpen && (
                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900">System Alerts</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      {unreadCount} new
                    </span>
                  </div>

                  <div className="py-2 space-y-2 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No active notifications</p>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`p-2.5 rounded-xl border text-xs transition-colors ${
                            notif.read ? 'bg-slate-50/50 border-slate-100 text-slate-500' : 'bg-blue-50/40 border-blue-100 text-slate-800 font-medium'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span>{notif.title}</span>
                            <span className="text-[10px] text-slate-400 shrink-0">{notif.time}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {notifications.length > 0 && (
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-7 text-blue-600 hover:text-blue-700">
                        Mark all read
                      </Button>
                      <Button variant="ghost" size="sm" onClick={clearNotifications} className="text-xs h-7 text-rose-500 hover:text-rose-600">
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">{user?.fullName}</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wider mt-1">{user?.role}</p>
              </div>
              <Avatar className="h-9 w-9 border-2 border-primary/10">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {user?.fullName?.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto bg-slate-50/50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

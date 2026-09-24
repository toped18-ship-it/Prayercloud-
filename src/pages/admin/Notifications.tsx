import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Bell, Send, Trash2, Search, CheckCircle, Plus } from 'lucide-react';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  target: string;
  channels: string[];
  date: string;
  status: 'Sent' | 'Draft' | 'Scheduled';
}

const initialNotifications: NotificationItem[] = [
  { id: '1', title: 'System Maintenance', message: 'We will be performing maintenance on Sunday...', target: 'All Users', channels: ['App', 'Email'], date: '2026-05-10', status: 'Sent' },
  { id: '2', title: 'Update: New Security Features', message: 'Read about our new 2FA options...', target: 'Missionaries', channels: ['App'], date: '2026-05-09', status: 'Draft' },
  { id: '3', title: 'Prayer Alert: Global Day of Action', message: 'Join us for a global prayer event...', target: 'All Users', channels: ['App', 'Push', 'Email'], date: '2026-05-08', status: 'Scheduled' },
];

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newTarget, setNewTarget] = useState('All Users');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotifications = notifications.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.target.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTestBroadcast = async () => {
    setIsBroadcasting(true);
    try {
      const response = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Broadcast',
          body: 'This is a test notification from the admin panel.',
          icon: '/pwa-192x192.png'
        })
      });
      const data = await response.json();
      toast.success(data.message || 'Broadcast initiated!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to initiate broadcast');
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleCreateNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) {
      toast.error('Please enter both title and message');
      return;
    }
    const item: NotificationItem = {
      id: String(Date.now()),
      title: newTitle.trim(),
      message: newMessage.trim(),
      target: newTarget,
      channels: ['App', 'Push'],
      date: new Date().toISOString().slice(0, 10),
      status: 'Sent',
    };
    setNotifications([item, ...notifications]);
    setShowNewModal(false);
    setNewTitle('');
    setNewMessage('');
    toast.success(`Notification "${item.title}" dispatched to ${item.target}!`);
  };

  const handleDelete = (id: string, title: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    toast.success(`Notification "${title}" deleted.`);
  };

  const handleResend = (notif: NotificationItem) => {
    toast.success(`Re-dispatching notification "${notif.title}" to ${notif.target}...`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Notification Management</h1>
          <p className="text-slate-500">Create and manage global announcements and targeted messages.</p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={handleTestBroadcast} disabled={isBroadcasting} className="cursor-pointer">
             {isBroadcasting ? 'Broadcasting...' : 'Test Broadcast'}
           </Button>
           <Button 
            onClick={() => setShowNewModal(true)} 
            className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
           >
             <Send className="w-4 h-4 mr-2" /> New Notification
           </Button>
        </div>
      </div>

      {showNewModal && (
        <Card className="p-5 border-blue-200 bg-blue-50/50 shadow-sm">
          <form onSubmit={handleCreateNotification} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Send Notification Broadcast</h3>
              <button 
                type="button" 
                onClick={() => setShowNewModal(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Subject / Title"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
              <select
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                value={newTarget}
                onChange={e => setNewTarget(e.target.value)}
              >
                <option value="All Users">All Intercessors & Missionaries</option>
                <option value="Missionaries">Active Missionaries Only</option>
                <option value="Prayer Warriors">Prayer Warriors Only</option>
                <option value="Leadership">Leadership & Pastors</option>
              </select>
            </div>
            <textarea
              placeholder="Notification Message body..."
              rows={3}
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              required
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowNewModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Send Broadcast Now
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                      <CardTitle className="text-sm font-medium">Deliverability</CardTitle>
                  </div>
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">98.2%</div>
                  <p className="text-xs text-slate-500">+0.4% from last month</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                      <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
                  </div>
                  <Bell className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">64.5%</div>
                  <p className="text-xs text-slate-500">Above sector average</p>
              </CardContent>
          </Card>
          <Card>
              <CardHeader className="flex flex-row items-center space-y-0 pb-2">
                  <div className="flex-1">
                      <CardTitle className="text-sm font-medium">Auto-Reports</CardTitle>
                  </div>
                  <Plus className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">2.4k</div>
                  <p className="text-xs text-slate-500">Automated triggers active</p>
              </CardContent>
          </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Sent & Scheduled Notifications</CardTitle>
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input 
                  placeholder="Search messages..." 
                  className="pl-10 h-10" 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredNotifications.map((notif) => (
            <div key={notif.id} className="p-4 border rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    <Bell className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900">{notif.title}</h4>
                      <Badge variant={notif.status === 'Sent' ? 'secondary' : notif.status === 'Scheduled' ? 'outline' : 'default'} className="text-[10px]">
                        {notif.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mt-1 line-clamp-1">{notif.message}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Target: {notif.target}</span>
                      <div className="flex gap-1">
                        {notif.channels.map(channel => (
                           <Badge key={channel} variant="secondary" className="text-[8px] px-1 h-4">{channel}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-auto">
                    <span className="text-xs text-slate-400">{notif.date}</span>
                    <div className="flex gap-2">
                        <Button 
                          onClick={() => handleResend(notif)}
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 cursor-pointer"
                          title="Re-broadcast"
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(notif.id, notif.title)}
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Delete notification"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

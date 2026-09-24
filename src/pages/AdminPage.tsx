
import React from 'react';
import { ShieldCheck, Users, Globe, Database, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';

export default function AdminPage() {
  const adminStats = [
    { label: 'System Health', value: 'Optimal', icon: Server, color: 'text-emerald-600' },
    { label: 'Total Users', value: '2,408', icon: Users, color: 'text-blue-600' },
    { label: 'Database Load', value: '14%', icon: Database, color: 'text-sky-600' },
    { label: 'Global Nodes', value: '12', icon: Globe, color: 'text-indigo-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-blue-900 tracking-tight">Mission Control</h1>
          <p className="text-slate-500">System administration and global platform management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        {adminStats.map((stat, i) => (
          <Card key={i} className="glass-card">
            <CardHeader className="p-6 pb-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <p className="text-2xl font-black text-blue-900">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Manage roles and permissions for missionaries worldwide.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Sarah Jenkins', role: 'Regional Director', status: 'Active' },
                { name: 'Marcus Wong', role: 'Field Missionary', status: 'Active' },
                { name: 'Elena Petrova', role: 'Intercessor', status: 'Pending Review' }
              ].map((user, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                     </div>
                     <div>
                       <p className="text-sm font-black text-slate-800">{user.name}</p>
                       <p className="text-[10px] text-slate-500 font-bold uppercase">{user.role}</p>
                     </div>
                   </div>
                   <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${user.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                     {user.status}
                   </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel">
          <CardHeader>
            <CardTitle>Security Logs</CardTitle>
            <CardDescription>Real-time monitoring of sensitive data access.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { event: 'Encryption Key Rotation', time: '12m ago', severity: 'Info' },
                { event: 'Bulk Export Attempt', time: '2h ago', severity: 'Warning' },
                { event: 'New Admin Assigned', time: '5h ago', severity: 'Critical' }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white">
                   <div>
                     <p className="text-sm font-black text-slate-800">{log.event}</p>
                     <p className="text-[10px] text-slate-500">{log.time}</p>
                   </div>
                   <span className={`text-[10px] font-bold uppercase tracking-widest ${
                     log.severity === 'Critical' ? 'text-rose-600' : 
                     log.severity === 'Warning' ? 'text-amber-600' : 'text-blue-600'
                   }`}>
                     {log.severity}
                   </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

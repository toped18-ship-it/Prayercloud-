
import React, { Suspense, lazy } from 'react';
import { 
  Users, 
  Globe, 
  Heart, 
  MessageSquare, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ChartSkeleton } from '../../components/ui/SkeletonLoader';
import { cn } from '../../lib/utils';

const DashboardActivityChart = lazy(() => import('../../components/charts/DashboardActivityChart'));

const data = [
  { name: 'Mon', users: 400, prayer: 240, messages: 2400 },
  { name: 'Tue', users: 300, prayer: 139, messages: 2210 },
  { name: 'Wed', users: 200, prayer: 980, messages: 2290 },
  { name: 'Thu', users: 278, prayer: 390, messages: 2000 },
  { name: 'Fri', users: 189, prayer: 480, messages: 2181 },
  { name: 'Sat', users: 239, prayer: 380, messages: 2500 },
  { name: 'Sun', users: 349, prayer: 430, messages: 2100 },
];

const stats = [
  { label: 'Total Users', value: '14,208', growth: '+12%', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
  { label: 'Prayer Reqs', value: '42,400', growth: '+5%', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-100' },
  { label: 'Active States', value: '192', growth: '+0%', icon: Globe, color: 'text-emerald-600', bg: 'bg-emerald-100' },
  { label: 'MSGs/Day', value: '8.4k', growth: '-2%', icon: MessageSquare, color: 'text-amber-600', bg: 'bg-amber-100' },
];

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Executive Overview</h1>
        <p className="text-slate-500">Real-time telemetry and mission status for PRAYERCLOUD.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <Badge variant="outline" className={cn(
                  "border-none flex items-center gap-1",
                  stat.growth.startsWith('+') ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
                )}>
                  {stat.growth.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {stat.growth}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">last 30d</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader>
            <CardTitle>Global Activity Trends</CardTitle>
            <CardDescription>User engagement and prayer frequency across all regions.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <Suspense fallback={<ChartSkeleton height={310} />}>
              <DashboardActivityChart data={data} />
            </Suspense>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
            <CardDescription>Server health and latency metrics.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-slate-700">CPU Usage</p>
                <p className="text-sm font-bold text-slate-900">24%</p>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full w-[24%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-slate-700">Storage Capacity</p>
                <p className="text-sm font-bold text-slate-900">1.2 TB / 5 TB</p>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full w-[35%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-medium text-slate-700">API Response Time</p>
                <p className="text-sm font-bold text-slate-900">142ms</p>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full w-[15%]" />
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl border border-rose-100">
                <ShieldAlert className="h-5 w-5 text-rose-600" />
                <div>
                  <p className="text-xs font-bold text-rose-900">Unusual login attempts in Turkey</p>
                  <p className="text-[10px] text-rose-600">3 failed attempts from 185.x.x.x</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-xs font-bold text-blue-900">System backup scheduled</p>
                  <p className="text-[10px] text-blue-600">Estimated duration: 15 minutes</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Audit Logs</CardTitle>
              <CardDescription>Latest administrative actions.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/admin/audit-logs')}>View All</Button>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {[
                { user: 'Admin Sarah', action: 'Updated Site Branding', time: '12m ago', color: 'bg-indigo-100 text-indigo-600' },
                { user: 'Sys Ops', action: 'Rotated API Keys', time: '1h ago', color: 'bg-slate-100 text-slate-600' },
                { user: 'Admin Wong', action: 'Suspended user @hackerX', time: '3h ago', color: 'bg-rose-100 text-rose-600' },
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0", log.color)}>
                      {log.user.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{log.action}</p>
                      <p className="text-xs text-slate-500">by {log.user} • {log.time}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Security Overview</CardTitle>
              <CardDescription>Authentication and access health.</CardDescription>
            </div>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none px-3">Secure</Badge>
          </CardHeader>
          <CardContent className="pt-0 flex flex-col justify-center h-full min-h-[300px]">
             <div className="flex justify-center mb-8">
                <div className="relative h-40 w-40">
                  <svg className="h-full w-full" viewBox="0 0 100 100">
                    <circle className="text-slate-100" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <circle className="text-primary" strokeWidth="10" strokeDasharray="251.2" strokeDashoffset="50.24" strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-3xl font-black text-slate-900">92%</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Health</p>
                  </div>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">MFA Enabled</p>
                  <p className="text-xl font-black text-slate-900">84%</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl text-center">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">IP Filtered</p>
                  <p className="text-xl font-black text-slate-900">1,240</p>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

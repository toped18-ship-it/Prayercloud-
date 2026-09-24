import React, { Suspense, lazy } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Download, TrendingUp, Users, Heart, Globe } from 'lucide-react';
import { ChartSkeleton } from '../../components/ui/SkeletonLoader';

const AnalyticsTrendChart = lazy(() => import('../../components/charts/AnalyticsTrendChart'));

const data = [
  { name: 'Jan', users: 400, prayers: 240, missionaries: 20 },
  { name: 'Feb', users: 300, prayers: 139, missionaries: 27 },
  { name: 'Mar', users: 200, prayers: 980, missionaries: 35 },
  { name: 'Apr', users: 278, prayers: 390, missionaries: 42 },
  { name: 'May', users: 189, prayers: 480, missionaries: 50 },
  { name: 'Jun', users: 239, prayers: 380, missionaries: 55 },
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analytics Dashboard</h1>
          <p className="text-slate-500">In-depth telemetry and platform growth metrics.</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" /> Export PDF Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Users', value: '48,294', change: '+12.5%', icon: Users },
          { label: 'Prayer Points', value: '1.2M', change: '+4.2%', icon: Heart },
          { label: 'Missionaries', value: '12,402', change: '+8.1%', icon: TrendingUp },
          { label: 'Countries', value: '112', change: '+2', icon: Globe },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 text-primary opacity-20" />
              </div>
              <p className="text-xs font-bold text-emerald-500 mt-2 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" /> {stat.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Suspense fallback={
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartSkeleton height={300} title="User Growth" />
            <ChartSkeleton height={300} title="Prayer Engagement" />
          </div>
          <ChartSkeleton height={300} title="Retention Cohorts" />
        </div>
      }>
        <AnalyticsTrendChart data={data} />
      </Suspense>
    </div>
  );
}

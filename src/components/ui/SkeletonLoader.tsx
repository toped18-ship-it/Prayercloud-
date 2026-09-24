import React from 'react';
import { Skeleton } from './skeleton';
import { Card, CardContent, CardHeader } from './card';

/**
 * High-fidelity Skeleton Loader for Dashboard views
 * Maintains 1:1 layout consistency with src/pages/Dashboard.tsx
 */
export function DashboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Top Banner / Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="space-y-2">
          <Skeleton className="h-7 w-64 rounded-lg" />
          <Skeleton className="h-4 w-96 max-w-full rounded-md" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-xl" />
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="border-slate-100 shadow-sm">
            <CardContent className="p-5 flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-xl shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-3 w-20 rounded" />
                <Skeleton className="h-6 w-28 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid: Chart & Prayer Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Activity & Map Preview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <Skeleton className="h-5 w-48 rounded" />
                  <Skeleton className="h-3.5 w-64 rounded" />
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-64 w-full rounded-xl" />
              <div className="grid grid-cols-3 gap-4 pt-2">
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
                <Skeleton className="h-12 rounded-lg" />
              </div>
            </CardContent>
          </Card>

          {/* Secondary card */}
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-40 rounded" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="flex items-center justify-between p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-lg" />
                    <div className="space-y-1.5">
                      <Skeleton className="h-4 w-44 rounded" />
                      <Skeleton className="h-3 w-28 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-20 rounded-lg" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Prayer Requests Feed */}
        <div className="space-y-6">
          <Card className="border-slate-100 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-4 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-24 rounded-full" />
                    <Skeleton className="h-3 w-16 rounded" />
                  </div>
                  <Skeleton className="h-4 w-5/6 rounded" />
                  <Skeleton className="h-3 w-full rounded" />
                  <div className="flex items-center justify-between pt-1">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-8 w-24 rounded-lg" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

/**
 * High-fidelity Skeleton Loader for Grid views (Countries, Hub, Resources)
 */
export function CardsGridSkeleton({ count = 8, title }: { count?: number; title?: string }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      {/* Header & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            {title ? (
              <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
            ) : (
              <Skeleton className="h-7 w-60 rounded-lg" />
            )}
            <Skeleton className="h-4 w-80 rounded" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-28 rounded-xl" />
          </div>
        </div>

        {/* Filter / Search input */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Skeleton className="h-11 w-full sm:flex-1 rounded-xl" />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-11 w-28 rounded-xl" />
            <Skeleton className="h-11 w-28 rounded-xl" />
            <Skeleton className="h-11 w-28 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <Card key={i} className="border-slate-100 shadow-sm overflow-hidden flex flex-col">
            <CardContent className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="h-8 w-10 rounded-md" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-28 rounded" />
                      <Skeleton className="h-3 w-16 rounded" />
                    </div>
                  </div>
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs">
                    <Skeleton className="h-3 w-20 rounded" />
                    <Skeleton className="h-3 w-12 rounded" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>

                <div className="space-y-1.5 pt-1">
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-4/5 rounded" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Skeleton className="h-9 w-20 rounded-lg" />
                <Skeleton className="h-9 w-28 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * High-fidelity Skeleton Loader for Table/List Views (Admin tables, Users, Audit logs)
 */
export function TableSkeleton({ rows = 6, title }: { rows?: number; title?: string }) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          {title ? (
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">{title}</h2>
          ) : (
            <Skeleton className="h-7 w-48 rounded-lg" />
          )}
          <Skeleton className="h-4 w-72 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-32 rounded-lg" />
          <Skeleton className="h-9 w-28 rounded-lg" />
        </div>
      </div>

      <Card className="border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-72 max-w-full rounded-lg" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-10 w-24 rounded-lg" />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {/* Table Header */}
          <div className="grid grid-cols-12 p-4 bg-slate-50/60 text-xs font-semibold">
            <Skeleton className="col-span-4 h-4 w-32 rounded" />
            <Skeleton className="col-span-3 h-4 w-24 rounded" />
            <Skeleton className="col-span-3 h-4 w-20 rounded" />
            <Skeleton className="col-span-2 h-4 w-16 ml-auto rounded" />
          </div>

          {/* Table Rows */}
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="grid grid-cols-12 p-4 items-center gap-4">
              <div className="col-span-4 flex items-center gap-3">
                <Skeleton className="h-9 w-9 rounded-full shrink-0" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              </div>
              <div className="col-span-3">
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <div className="col-span-3">
                <Skeleton className="h-3.5 w-28 rounded" />
              </div>
              <div className="col-span-2 flex items-center justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

/**
 * Skeleton Loader for Country or Entity Detail Page
 */
export function DetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      {/* Back Link */}
      <Skeleton className="h-5 w-36 rounded" />

      {/* Hero Header Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-20 rounded-xl" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-8 w-60 rounded-lg" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-5 w-24 rounded-full" />
              </div>
            </div>
          </div>
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-4 w-5/6 rounded" />
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-1">
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-6 w-20 rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* Action / Prayer Chain Card */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
          <Skeleton className="h-6 w-40 rounded" />
          <Skeleton className="h-4 w-full rounded" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <Skeleton className="h-10 w-full rounded-xl" />
        </div>
      </div>

      {/* Unreached People Groups Grid */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-52 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm space-y-3">
              <Skeleton className="h-5 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-8 w-24 rounded-lg pt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Loader for Chat / Realtime Messaging View
 */
export function ChatSkeleton() {
  return (
    <div className="h-[calc(100vh-64px)] flex animate-in fade-in duration-300">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 bg-slate-50 p-4 space-y-6 hidden md:block">
        <div className="space-y-3">
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
          <Skeleton className="h-9 w-full rounded-lg" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-5 w-32 rounded" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-2.5 p-2">
              <Skeleton className="h-7 w-7 rounded-full" />
              <Skeleton className="h-4 w-24 rounded" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Chat Header */}
        <div className="h-16 border-b border-slate-100 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-32 rounded" />
              <Skeleton className="h-3 w-20 rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-6 space-y-5 overflow-hidden">
          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1.5 max-w-sm">
              <Skeleton className="h-3 w-20 rounded" />
              <Skeleton className="h-12 w-64 rounded-2xl rounded-tl-sm" />
            </div>
          </div>

          <div className="flex items-start gap-3 flex-row-reverse">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1.5 max-w-sm items-end">
              <Skeleton className="h-14 w-72 rounded-2xl rounded-tr-sm ml-auto" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
            <div className="space-y-1.5 max-w-sm">
              <Skeleton className="h-3 w-24 rounded" />
              <Skeleton className="h-16 w-80 rounded-2xl rounded-tl-sm" />
            </div>
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100">
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

/**
 * Skeleton Loader for Chart Widgets (Recharts wrappers)
 */
export function ChartSkeleton({ height = 280, title }: { height?: number; title?: string }) {
  return (
    <div className="w-full space-y-4 animate-in fade-in duration-300">
      {title && (
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-44 rounded" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      )}
      <div 
        className="w-full rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between p-4 relative overflow-hidden"
        style={{ height }}
      >
        <div className="flex justify-between">
          <Skeleton className="h-3 w-12 rounded" />
          <Skeleton className="h-3 w-12 rounded" />
        </div>
        
        {/* Animated pulsating wave simulation */}
        <div className="flex items-end justify-between gap-2 h-36 px-4">
          {[40, 65, 30, 85, 55, 95, 70, 45, 80, 60, 90, 75].map((pct, i) => (
            <div
              key={i}
              className="flex-1 bg-slate-200/70 rounded-t-md animate-pulse"
              style={{
                height: `${pct}%`,
                animationDelay: `${i * 100}ms`
              }}
            />
          ))}
        </div>

        <div className="flex justify-between pt-2 border-t border-slate-200/50">
          <Skeleton className="h-3 w-8 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
      </div>
    </div>
  );
}

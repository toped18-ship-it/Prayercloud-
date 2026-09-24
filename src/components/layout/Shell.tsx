import React from 'react';
import Navbar from './Navbar';
import { Toaster } from '../../components/ui/sonner';

export default function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f0f9ff]">
      {/* Decorative blurred backgrounds */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-400/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-sky-300/30 rounded-full blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-white rounded-full blur-[80px]" />
      </div>
      
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 pt-16 pb-20">
          {children}
        </main>
        <footer className="h-10 glass-nav flex items-center justify-between px-8 shrink-0 text-[10px] font-bold text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Server Status: Stable</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-primary">© 2024 PRAYERCLOUD Global Missionary Alliance</span>
          </div>
        </footer>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}

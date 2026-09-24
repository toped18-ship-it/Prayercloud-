import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Globe, Heart, Shield, ArrowRight, Users } from 'lucide-react';
import { cn } from '../lib/utils';
import { buttonVariants } from '../components/ui/button';

export default function LandingPage() {
  return (
    <div className="relative isolate">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/40 backdrop-blur-md border border-white/60 text-blue-600 text-xs font-black uppercase tracking-wider mb-8 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span>7,000+ Unreached Groups Tracked</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black font-display tracking-tight text-blue-900 mb-8 leading-[1.05]">
              Strategic Missions <br />
              <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent">In the Cloud</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-12 leading-relaxed font-medium">
              A unified glass-interface for missionaries, intercessors, and pastors. 
              Real-time unreached people group data and secure global coordination.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                to="/register"
                className={cn(buttonVariants({ size: "lg", className: "h-16 px-10 text-lg rounded-2xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/20 font-bold" }))}
              >
                Launch Platform <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                to="/countries"
                className={cn(buttonVariants({ size: "lg", variant: "outline", className: "h-16 px-10 text-lg rounded-2xl border-white bg-white/50 backdrop-blur-md hover:bg-white/80 transition-all font-bold text-slate-700" }))}
              >
                Browse Nations
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-24 relative mx-auto max-w-5xl"
          >
            <div className="glass-panel p-4 shadow-[0_20px_50px_rgba(37,99,235,0.1)]">
              <div className="rounded-[24px] overflow-hidden aspect-video bg-slate-900 relative">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                  <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 mb-6">
                    <Globe className="h-10 w-10 text-white animate-pulse" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2">The Mission Matrix</h3>
                  <p className="text-blue-100/60 max-w-sm text-center">Live heatmap of kingdom activity and unreached territory advancement.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Stats */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Unreached Groups', value: '7,412', icon: Users, color: 'blue' },
              { label: 'Active Missionaries', value: '12.4k', icon: Shield, color: 'sky' },
              { label: 'Prayer Coverage', value: '24/7', icon: Heart, color: 'rose' },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-10 flex flex-col items-center text-center group">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <stat.icon className={`h-8 w-8 text-${stat.color}-500`} />
                </div>
                <div className="text-5xl font-black text-blue-900 mb-2">{stat.value}</div>
                <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

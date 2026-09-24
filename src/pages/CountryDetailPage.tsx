import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Globe2, 
  Users2, 
  ShieldAlert, 
  Heart, 
  History, 
  MapPin, 
  Sparkles,
  ChevronRight,
  Info,
  Check
} from 'lucide-react';
import { COUNTRIES_SEED, MOCK_UPGS } from '../lib/mockData';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';
import { DetailSkeleton } from '../components/ui/SkeletonLoader';

export default function CountryDetailPage() {
  const { isLoading } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const country = COUNTRIES_SEED.find(c => c.id === id);
  const upgs = MOCK_UPGS.filter(u => u.countryId === id);
  const [hasCommitted, setHasCommitted] = useState(false);
  const [intercessorCount, setIntercessorCount] = useState(148);

  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (!country) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Country not found</h2>
        <Button asChild>
          <Link to="/countries">Back to Nations</Link>
        </Button>
      </div>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Extreme': return 'bg-rose-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Moderate': return 'bg-amber-500 text-white';
      case 'Low': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Navigation */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-8"
      >
        <Link to="/countries" className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Global Nations
        </Link>
      </motion.div>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 glass-panel p-8 md:p-12 flex flex-col justify-center relative overflow-hidden"
        >
          {/* Decorative background element */}
          <div className="absolute top-0 right-0 -m-8 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-6 mb-6">
              <span className="text-7xl md:text-8xl drop-shadow-sm">{country.flag}</span>
              <div>
                <Badge className={getRiskColor(country.riskLevel)}>{country.riskLevel} Security Risk</Badge>
                <h1 className="text-4xl md:text-6xl font-black text-blue-900 mt-2 tracking-tight">
                  {country.name}
                </h1>
              </div>
            </div>
            <p className="text-xl text-slate-500 max-w-2xl leading-relaxed">
              Tracking mission status, gospel advancement, and prayer needs for the people of {country.name}.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-8 flex flex-col items-center justify-center text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
            <Globe2 className="h-8 w-8 text-blue-600" />
          </div>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Main Religion</h3>
          <p className="text-3xl font-black text-blue-900">{country.religion}</p>
          <Separator className="my-6 bg-blue-100" />
          <div className="grid grid-cols-2 gap-8 w-full">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">UPG groups</p>
              <p className="text-2xl font-black text-slate-800 text-center">{country.unreachedGroupsCount}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 text-center">Christianity</p>
              <p className="text-2xl font-black text-blue-600 text-center">{country.christianPercentage}%</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Historical Context */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <History className="h-5 w-5 text-amber-600" />
              </div>
              <h2 className="text-2xl font-black text-blue-900">Historical Context</h2>
            </div>
            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 text-lg leading-relaxed italic border-l-4 border-amber-200 pl-6 py-2">
                {country.historicalContext || "Historical records for this region focus on its strategic position and cultural development over the centuries."}
              </p>
            </div>
          </motion.section>

          {/* Unreached People Groups */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Users2 className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-2xl font-black text-blue-900">Unreached People Groups</h2>
              </div>
              <Badge variant="outline" className="bg-white/50">{upgs.length} Groups Identified</Badge>
            </div>

            {upgs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upgs.map((upg) => (
                  <div key={upg.id} className="p-5 bg-white/80 rounded-2xl border border-white hover:border-blue-200 transition-all group">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-black text-slate-800 text-lg group-hover:text-blue-600 transition-colors">{upg.name}</h4>
                      <Badge className="bg-rose-50 text-rose-600 border-rose-100">{upg.status}</Badge>
                    </div>
                    <div className="space-y-2 text-sm text-slate-500">
                      <div className="flex justify-between">
                        <span>Population</span>
                        <span className="font-bold text-slate-700">{(upg.population / 1000).toFixed(0)}k</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Language</span>
                        <span className="font-bold text-slate-700">{upg.language}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Major Religion</span>
                        <span className="font-bold text-slate-700">{upg.religion}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <Info className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium">Detailed UPG records for this nation are currently being migrated.</p>
              </div>
            )}
          </motion.section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Prayer Needs */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/60 backdrop-blur-2xl border border-white rounded-[32px] p-8 flex flex-col shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-blue-900 tracking-tight">Specific Prayer Needs</h3>
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                <Heart className="h-4 w-4 text-rose-500" />
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {country.prayerPoints.map((point, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs group-hover:scale-110 transition-transform">
                    {i + 1}
                  </div>
                  <p className="text-sm font-medium text-slate-700 leading-relaxed pt-1">
                    {point}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
              <span>Intercessors Standing in Gap:</span>
              <span className="font-bold text-blue-600">{intercessorCount}</span>
            </div>

            <Button 
              onClick={() => {
                const next = !hasCommitted;
                setHasCommitted(next);
                setIntercessorCount(prev => next ? prev + 1 : prev - 1);
                if (next) {
                  toast.success(`Committed to pray for ${country.name}!`, {
                    description: 'Your intercession pledge has been registered.'
                  });
                } else {
                  toast.info(`Removed prayer commitment for ${country.name}`);
                }
              }}
              className={`w-full h-14 rounded-2xl font-bold shadow-lg transition-all ${
                hasCommitted 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              {hasCommitted ? (
                <span className="flex items-center"><Check className="mr-2 h-5 w-5" /> Prayer Commitment Active ✓</span>
              ) : (
                <span className="flex items-center"><Heart className="mr-2 h-5 w-5" /> Commit to Pray</span>
              )}
            </Button>
          </motion.section>

          {/* Logistics / Missions */}
          <motion.section 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-panel p-8"
          >
            <h3 className="text-xl font-black text-blue-900 mb-6">Missions Snapshot</h3>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Church Planting</p>
                  <p className="text-sm font-black text-slate-700">Moderate Momentum</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bible Access</p>
                  <p className="text-sm font-black text-slate-700">Available in {country.name === 'India' ? '22' : 'Major'} Languages</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Threats</p>
                  <p className="text-sm font-black text-slate-700">{country.riskLevel} Monitoring</p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate('/missionary-hub')}
              className="mt-8 w-full h-12 bg-white/50 border border-blue-50 rounded-2xl text-[10px] font-black uppercase text-blue-600 tracking-widest hover:bg-blue-50 cursor-pointer"
            >
              In-Country Training Hub <ChevronRight className="ml-2 h-3 w-3" />
            </Button>
          </motion.section>
        </div>
      </div>
    </div>
  );
}

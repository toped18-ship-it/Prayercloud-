import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Globe, Shield, Heart, Users, MapPin, Activity, X, ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Separator } from '../components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface RegionData {
  name: string;
  prayerChainCount: number;
  unreachedGroups: number;
  missionaries: number;
  urgency: 'Extreme' | 'High' | 'Critical';
}

const REGION_INFO: Record<string, RegionData> = {
  'Middle East': { name: 'Middle East', prayerChainCount: 1420, unreachedGroups: 312, missionaries: 85, urgency: 'Extreme' },
  'Southeast Asia': { name: 'Southeast Asia', prayerChainCount: 2104, unreachedGroups: 520, missionaries: 210, urgency: 'High' },
  'North Africa': { name: 'North Africa', prayerChainCount: 980, unreachedGroups: 195, missionaries: 42, urgency: 'Critical' },
  'Central Asia': { name: 'Central Asia', prayerChainCount: 760, unreachedGroups: 140, missionaries: 36, urgency: 'Extreme' },
};

export default function MapPage() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<string>('Middle East');
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [clearanceModalOpen, setClearanceModalOpen] = useState(false);
  const [intercessors, setIntercessors] = useState(4281);
  const [hasJoinedChain, setHasJoinedChain] = useState(false);

  const currentRegion = REGION_INFO[selectedRegion] || REGION_INFO['Middle East'];

  const handleRegionClick = (regionName: string) => {
    setSelectedRegion(regionName);
    toast.info(`Focused on ${regionName}`, {
      description: `${REGION_INFO[regionName]?.unreachedGroups || 200} unreached groups monitored.`
    });
  };

  const handleSupportClick = () => {
    setSupportModalOpen(true);
  };

  const handleTaskForceClick = () => {
    toast.success(`Joining ${selectedRegion} Joint Task Force...`);
    setTimeout(() => {
      navigate('/missionary-hub');
    }, 600);
  };

  const handleClearanceUpgrade = () => {
    setClearanceModalOpen(true);
  };

  const handleToggleChain = () => {
    const next = !hasJoinedChain;
    setHasJoinedChain(next);
    setIntercessors(prev => next ? prev + 1 : prev - 1);
    if (next) {
      toast.success('Joined Global 24/7 Prayer Chain!', {
        description: 'You are now counted among the active global watchmen.'
      });
    } else {
      toast.info('Stepped down from active prayer chain turn.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-display text-slate-900">Interactive World Map</h1>
          <p className="text-slate-500">Live heatmap of mission activity and unreached regions.</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 md:mt-0">
          <Badge className="bg-rose-100 text-rose-600 border-none shrink-0 py-1 px-3">
            <span className="relative flex h-2 w-2 mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
            Live Updates
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Map Container */}
        <Card className="lg:col-span-3 border-slate-200 overflow-hidden bg-slate-900 relative min-h-[600px] flex items-center justify-center group">
          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
          
          <div className="relative z-10 text-center space-y-6 px-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="inline-flex p-4 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md"
              >
                <Globe className="h-16 w-16 text-primary" />
              </motion.div>
              <h2 className="text-4xl font-bold font-display text-white tracking-tight">Real-Time Mission Matrix</h2>
              <p className="text-slate-400 max-w-md mx-auto text-lg">
                Click on any region below to inspect logistics, prayer coverage, and unreached group statistics.
              </p>
              
              {/* Floating region buttons */}
              <div className="flex flex-wrap justify-center gap-4 pt-8">
                {['Middle East', 'Southeast Asia', 'North Africa', 'Central Asia'].map((region, i) => {
                  const isSelected = selectedRegion === region;
                  return (
                    <motion.button
                      key={region}
                      type="button"
                      onClick={() => handleRegionClick(region)}
                      animate={{ y: isSelected ? -6 : [0, -4, 0] }}
                      transition={{ duration: 3, repeat: isSelected ? 0 : Infinity, delay: i * 0.5 }}
                      className={`backdrop-blur-md border rounded-xl px-4 py-3 flex items-center space-x-3 cursor-pointer transition-all ${
                        isSelected 
                          ? 'bg-blue-600/90 border-blue-400 shadow-lg shadow-blue-500/40 text-white scale-105 ring-2 ring-blue-300' 
                          : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      <MapPin className={`h-4 w-4 ${isSelected ? 'text-white' : 'text-primary'}`} />
                      <span className="font-semibold text-sm">{region}</span>
                    </motion.button>
                  );
                })}
              </div>
          </div>

          {/* Stats overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-wrap gap-4">
              <button 
                type="button"
                onClick={handleToggleChain}
                className="bg-black/70 backdrop-blur-xl border border-white/20 hover:border-rose-400/50 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer transition-all text-left group/chain"
              >
                  <div className="h-10 w-10 rounded-full bg-rose-500/20 group-hover/chain:bg-rose-500/30 flex items-center justify-center">
                      <Activity className="h-5 w-5 text-rose-500" />
                  </div>
                  <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">
                        {hasJoinedChain ? 'Active Intercessor ✓' : 'Active Prayer Chain (Click to Join)'}
                      </p>
                      <p className="text-md font-bold text-white">{intercessors.toLocaleString()} Intercessors</p>
                  </div>
              </button>
          </div>
        </Card>

        {/* Legend / Sidebar */}
        <div className="space-y-6">
            <Card className="border-slate-200">
                <CardContent className="p-6 space-y-6">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-3">Map Legend</h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="h-4 w-4 rounded-full bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                            <span className="text-sm text-slate-600 font-medium">Critical Need / UPG Hub</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="h-4 w-4 rounded-full bg-emerald-500" />
                            <span className="text-sm text-slate-600 font-medium">Strong Christian Presence</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <div className="h-4 w-4 rounded-full bg-blue-500" />
                            <span className="text-sm text-slate-600 font-medium">Active Mission Front</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-4 pt-2">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          Active Region: {selectedRegion}
                        </h4>
                        <Button 
                          onClick={handleSupportClick}
                          className="w-full justify-start h-12 bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                        >
                            <Heart className="mr-3 h-4 w-4 text-rose-500" /> Support {selectedRegion}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleTaskForceClick}
                          className="w-full justify-start h-12 border-slate-200 hover:bg-blue-50 text-slate-700 cursor-pointer"
                        >
                            <Users className="mr-3 h-4 w-4 text-primary" /> Joint Task Force
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className="border-slate-200 bg-primary shadow-xl shadow-primary/20">
                <CardContent className="p-6">
                    <Shield className="h-8 w-8 text-white/40 mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2 leading-tight">Secured Communication Required</h3>
                    <p className="text-white/70 text-xs mb-4 leading-relaxed">
                        Access to high-risk regions requires a verified Missionary account and 2FA authentication.
                    </p>
                    <Button 
                      onClick={handleClearanceUpgrade}
                      className="w-full bg-white text-primary hover:bg-slate-50 font-bold border-none h-10 cursor-pointer"
                    >
                        Upgrade Clearance
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>

      {/* Support Region Modal */}
      {supportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Support {currentRegion.name}</h3>
              <button onClick={() => setSupportModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4 mb-6 text-sm text-slate-600">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">UPG Count</p>
                  <p className="text-lg font-black text-slate-900">{currentRegion.unreachedGroups}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400">Missionaries</p>
                  <p className="text-lg font-black text-blue-600">{currentRegion.missionaries}</p>
                </div>
              </div>
              <p>Choose an action to empower kingdom workers in this territory:</p>
            </div>
            <div className="space-y-3">
              <Button 
                onClick={() => {
                  setSupportModalOpen(false);
                  toast.success(`Pledged daily prayer for ${currentRegion.name}!`);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11"
              >
                <Heart className="h-4 w-4 mr-2" /> Adopt in Daily Intercession
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setSupportModalOpen(false);
                  navigate('/missionary-hub');
                }}
                className="w-full h-11 font-semibold"
              >
                View Regional Field Teams
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Clearance Upgrade Modal */}
      {clearanceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Request Clearance</h3>
              </div>
              <button onClick={() => setClearanceModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-slate-500 mb-6">
              Clearance upgrade grants authorized missionaries access to encrypted field communications, secure coordinates, and sensitive threat alerts.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Sending Agency / Organization</label>
                <input 
                  defaultValue="PRAYERCLOUD Global Outreach" 
                  className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="pt-2 flex items-center justify-end gap-3">
                <Button variant="ghost" onClick={() => setClearanceModalOpen(false)}>Cancel</Button>
                <Button 
                  onClick={() => {
                    setClearanceModalOpen(false);
                    toast.success('Clearance Request Submitted!', {
                      description: 'Security leads will review credentials within 24 hours.'
                    });
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  Submit Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

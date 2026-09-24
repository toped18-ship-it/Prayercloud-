import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Filter, Globe2, Users2, Heart, ArrowRight, ExternalLink, Check, Bell, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { COUNTRIES_SEED } from '../lib/mockData';
import { Country } from '../types';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';
import { CardsGridSkeleton } from '../components/ui/SkeletonLoader';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet";

export default function CountriesPage() {
  const { isLoading } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<string>('All');
  const [selectedReligion, setSelectedReligion] = useState<string>('All');
  const [joinedChains, setJoinedChains] = useState<Record<string, boolean>>({});
  const [subscribedCountries, setSubscribedCountries] = useState<Record<string, boolean>>({});
  const [sponsorModalOpen, setSponsorModalOpen] = useState(false);
  const [sponsorAmount, setSponsorAmount] = useState('50');

  const filteredCountries = COUNTRIES_SEED.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.religion.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = selectedRisk === 'All' || c.riskLevel.toLowerCase() === selectedRisk.toLowerCase();
    const matchesReligion = selectedReligion === 'All' || c.religion.toLowerCase().includes(selectedReligion.toLowerCase());
    return matchesSearch && matchesRisk && matchesReligion;
  });

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Extreme': return 'bg-rose-500 text-white';
      case 'High': return 'bg-orange-500 text-white';
      case 'Moderate': return 'bg-amber-500 text-white';
      case 'Low': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const togglePrayerChain = (countryId: string, countryName: string) => {
    setJoinedChains(prev => {
      const current = !!prev[countryId];
      const next = !current;
      if (next) {
        toast.success(`Joined Prayer Chain for ${countryName}!`, {
          description: 'You will receive daily targeted intercession points.'
        });
      } else {
        toast.info(`Left Prayer Chain for ${countryName}`);
      }
      return { ...prev, [countryId]: next };
    });
  };

  const toggleSubscription = (countryId: string, countryName: string) => {
    setSubscribedCountries(prev => {
      const current = !!prev[countryId];
      const next = !current;
      if (next) {
        toast.success(`Subscribed to updates for ${countryName}!`);
      } else {
        toast.info(`Unsubscribed from updates for ${countryName}`);
      }
      return { ...prev, [countryId]: next };
    });
  };

  const handleSponsorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSponsorModalOpen(false);
    toast.success(`Thank you! Missionary sponsorship of $${sponsorAmount}/mo confirmed for ${selectedCountry?.name}.`, {
      description: 'Your partnership details have been logged and sent to your registered email.'
    });
  };

  if (isLoading) {
    return <CardsGridSkeleton count={8} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-bold font-display text-slate-900 mb-2">Global Nations</h1>
          <p className="text-slate-500">Explore the {COUNTRIES_SEED.length} nations and their mission status.</p>
        </div>
        
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search by name or religion..." 
              className="pl-10 h-11"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button 
            variant={showFilters ? "default" : "outline"} 
            size="icon" 
            className="h-11 w-11 shrink-0"
            onClick={() => setShowFilters(!showFilters)}
            title="Filter Nations"
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="mb-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase text-slate-700 tracking-wider">Filter Nations</h3>
            {(selectedRisk !== 'All' || selectedReligion !== 'All') && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => { setSelectedRisk('All'); setSelectedReligion('All'); }}
                className="text-xs text-blue-600 hover:text-blue-700 h-7"
              >
                Reset Filters
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Security Risk Level</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Extreme', 'High', 'Moderate', 'Low'].map((level) => (
                  <Button
                    key={level}
                    variant={selectedRisk === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedRisk(level)}
                    className="h-8 text-xs font-bold"
                  >
                    {level}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 mb-2 block">Primary Religion</label>
              <div className="flex flex-wrap gap-2">
                {['All', 'Islam', 'Hinduism', 'Buddhism', 'Christianity'].map((rel) => (
                  <Button
                    key={rel}
                    variant={selectedReligion === rel ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedReligion(rel)}
                    className="h-8 text-xs font-bold"
                  >
                    {rel}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredCountries.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200">
          <Globe2 className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-bold">No nations match your active filters.</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => { setSearch(''); setSelectedRisk('All'); setSelectedReligion('All'); }}
            className="mt-4"
          >
            Clear all filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCountries.map((country, index) => (
            <motion.div
              key={country.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.05, 0.8) }}
            >
              <Card className="group hover:shadow-xl transition-all duration-300 border-slate-200 overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-4xl" role="img" aria-label={country.name}>{country.flag}</span>
                    <Badge className={getRiskColor(country.riskLevel)}>{country.riskLevel} Risk</Badge>
                  </div>
                  <CardTitle className="text-2xl font-display group-hover:text-primary transition-colors">
                    {country.name}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-1">
                    <Globe2 className="h-3 w-3" />
                    <span>Main Religion: {country.religion}</span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">Unreached</p>
                      <p className="text-lg font-bold text-rose-600">{country.unreachedPercentage}%</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">UPG Count</p>
                      <p className="text-lg font-bold text-slate-700">{country.unreachedGroupsCount}</p>
                    </div>
                  </div>

                  <Sheet>
                    <SheetTrigger 
                      className="w-full bg-slate-900 hover:bg-slate-800 text-white group-hover:bg-primary transition-colors h-9 px-4 rounded-lg font-medium inline-flex items-center justify-center text-sm shadow-sm"
                      onClick={() => setSelectedCountry(country)}
                    >
                      Quick Overview <ArrowRight className="ml-2 h-4 w-4" />
                    </SheetTrigger>
                    <Link 
                      to={`/countries/${country.id}`}
                      className="mt-2 inline-flex w-full items-center justify-center p-3 text-xs font-black uppercase tracking-widest text-blue-600 bg-white/50 border border-blue-100 rounded-xl hover:bg-blue-50 transition-colors"
                    >
                      Dedicated Report Profile <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                    <SheetContent className="sm:max-w-xl overflow-y-auto">
                      {selectedCountry && (
                        <div className="py-6">
                          <SheetHeader className="mb-8">
                            <div className="flex items-center space-x-4 mb-4">
                              <span className="text-6xl">{selectedCountry.flag}</span>
                              <div>
                                <SheetTitle className="text-3xl font-display">{selectedCountry.name}</SheetTitle>
                                <Badge className={`mt-1 ${getRiskColor(selectedCountry.riskLevel)}`}>
                                  {selectedCountry.riskLevel} Security Risk
                                </Badge>
                              </div>
                            </div>
                            <SheetDescription className="text-lg">
                              Comprehensive mission data and strategic prayer points for {selectedCountry.name}.
                            </SheetDescription>
                          </SheetHeader>

                          <div className="space-y-8">
                            {/* Key Stats */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <Users2 className="h-5 w-5 text-primary mb-2" />
                                <p className="text-sm text-slate-500">Population</p>
                                <p className="text-xl font-bold">{(selectedCountry.population / 1000000).toFixed(1)}M</p>
                              </div>
                              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <Heart className="h-5 w-5 text-rose-500 mb-2" />
                                <p className="text-sm text-slate-500">Unreached</p>
                                <p className="text-xl font-bold text-rose-600">{selectedCountry.unreachedPercentage}%</p>
                              </div>
                            </div>

                            {/* Strategic Overview */}
                            <div className="space-y-3">
                              <h3 className="text-xl font-bold">Strategic Overview</h3>
                              <p className="text-slate-600 leading-relaxed">
                                {selectedCountry.overview}
                              </p>
                            </div>

                            {/* Critical Prayer Points */}
                            <div className="space-y-4">
                              <h3 className="text-xl font-bold flex items-center space-x-2">
                                <span>Critical Prayer Points</span>
                              </h3>
                              <div className="space-y-3">
                                {selectedCountry.prayerPoints.map((point, i) => (
                                  <div key={i} className="flex items-start space-x-3 p-4 rounded-lg border border-slate-100 bg-white shadow-sm">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                                      {i + 1}
                                    </div>
                                    <p className="text-slate-700 leading-relaxed">{point}</p>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Action Items */}
                            <div className="space-y-4">
                              <h3 className="text-xl font-bold">Recommended Actions</h3>
                              <div className="grid grid-cols-1 gap-3">
                                <Button 
                                  variant="outline" 
                                  onClick={() => setSponsorModalOpen(true)}
                                  className="justify-between h-14 text-slate-700 hover:border-primary hover:text-primary"
                                >
                                  <span className="flex items-center"><Users2 className="mr-3 h-5 w-5 text-primary" /> Sponsor a Missionary</span>
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => togglePrayerChain(selectedCountry.id, selectedCountry.name)}
                                  className={`justify-between h-14 transition-colors ${
                                    joinedChains[selectedCountry.id] 
                                      ? 'bg-rose-50 border-rose-200 text-rose-600' 
                                      : 'text-slate-700 hover:border-rose-300'
                                  }`}
                                >
                                  <span className="flex items-center">
                                    {joinedChains[selectedCountry.id] ? <Check className="mr-3 h-5 w-5 text-rose-600" /> : <Heart className="mr-3 h-5 w-5 text-rose-500" />}
                                    {joinedChains[selectedCountry.id] ? 'Joined Prayer Chain ✓' : 'Join Prayer Chain'}
                                  </span>
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  onClick={() => {
                                    window.open(`https://joshuaproject.net/countries/${selectedCountry.id}`, '_blank', 'noopener,noreferrer');
                                  }}
                                  className="justify-between h-14 text-slate-700 hover:text-blue-600"
                                >
                                  <span className="flex items-center"><ExternalLink className="mr-3 h-5 w-5 text-slate-400" /> Joshua Project Profile</span>
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex flex-col gap-3">
                              <Button asChild className="w-full h-12 bg-primary text-lg">
                                <Link to={`/countries/${selectedCountry.id}`}>
                                  View Detailed Country Report
                                </Link>
                              </Button>
                              <Button 
                                variant="ghost" 
                                onClick={() => toggleSubscription(selectedCountry.id, selectedCountry.name)}
                                className={`w-full ${subscribedCountries[selectedCountry.id] ? 'text-emerald-600 font-bold' : ''}`}
                              >
                                <Bell className="h-4 w-4 mr-2" />
                                {subscribedCountries[selectedCountry.id] ? 'Subscribed to Updates ✓' : 'Subscribe for Updates'}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </SheetContent>
                  </Sheet>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Sponsor a Missionary Modal */}
      {sponsorModalOpen && selectedCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Sponsor in {selectedCountry.name}</h3>
              <button onClick={() => setSponsorModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-slate-500 text-sm mb-6">
              Empower an active native evangelist or pioneer church planter in {selectedCountry.name}.
            </p>
            <form onSubmit={handleSponsorSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-2">Monthly Support Amount</label>
                <div className="grid grid-cols-3 gap-3">
                  {['25', '50', '100'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSponsorAmount(amt)}
                      className={`h-12 rounded-xl font-black text-base border transition-all ${
                        sponsorAmount === amt 
                          ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      ${amt}/mo
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <Button type="button" variant="ghost" onClick={() => setSponsorModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" className="bg-primary text-white font-bold px-6">
                  Confirm Support
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

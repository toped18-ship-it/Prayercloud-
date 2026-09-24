import React, { useState } from 'react';
import { 
    Heart,
    Bell,
    MapPin,
    Radio,
    Share2,
    Check,
    X,
    Plus,
    Calendar,
    Send
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../lib/AuthContext';
import { PermissionGate } from '../components/auth/PermissionGate';
import { subscribeToNotifications } from '../lib/pushNotifications';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { DashboardSkeleton } from '../components/ui/SkeletonLoader';

interface PrayerRequestItem {
  id: string;
  title: string;
  desc: string;
  tag: string;
  color: 'red' | 'blue' | 'amber';
  prayedCount: number;
}

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [viewMode, setViewMode] = useState<'Daily' | 'Weekly'>('Daily');

  const [prayerRequests, setPrayerRequests] = useState<PrayerRequestItem[]>([
    { id: 'HI', title: 'Medical supply needed: Northern Tribes', desc: 'Village elders seeking bridge Gospel contacts and basic anti-malarial aid.', tag: 'High Urgency', color: 'red', prayedCount: 84 },
    { id: 'MY', title: 'Myanmar Youth Summit', desc: 'Pray for safety, government travel clearances, and logistics of 40 local church planters.', tag: 'Global Body', color: 'blue', prayedCount: 142 },
    { id: 'TK', title: 'Bible translation team: Tok Pisin', desc: 'Wisdom and clarity for linguists finalizing the Epistles proofs.', tag: 'Resource', color: 'amber', prayedCount: 56 },
    { id: 'AF', title: 'Safe houses for displaced families', desc: 'Provision for 14 families sheltering amidst localized unrest in regional border.', tag: 'High Urgency', color: 'red', prayedCount: 92 },
  ]);

  const [selectedRequest, setSelectedRequest] = useState<PrayerRequestItem | null>(null);
  const [hasPrayedMap, setHasPrayedMap] = useState<Record<string, boolean>>({});
  const [viewAllModal, setViewAllModal] = useState(false);
  const [newRequestModal, setNewRequestModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTag, setNewTag] = useState<'High Urgency' | 'Global Body' | 'Resource'>('High Urgency');

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      await subscribeToNotifications();
      setIsSubscribed(true);
      toast.success('Mission alerts enabled!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to enable notifications. Please check site permissions.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handlePrayForRequest = (reqId: string) => {
    setHasPrayedMap(prev => {
      const already = !!prev[reqId];
      const next = !already;
      setPrayerRequests(list => list.map(r => {
        if (r.id === reqId) {
          return { ...r, prayedCount: next ? r.prayedCount + 1 : r.prayedCount - 1 };
        }
        return r;
      }));
      if (next) {
        toast.success('Your prayer has been recorded! Thank you for standing in the gap.');
      } else {
        toast.info('Prayer pledge updated.');
      }
      return { ...prev, [reqId]: next };
    });
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const colorMap: Record<string, 'red' | 'blue' | 'amber'> = {
      'High Urgency': 'red',
      'Global Body': 'blue',
      'Resource': 'amber'
    };
    const newReq: PrayerRequestItem = {
      id: newTitle.slice(0, 2).toUpperCase(),
      title: newTitle.trim(),
      desc: newDesc.trim() || 'Praying for breakthrough and divine provision.',
      tag: newTag,
      color: colorMap[newTag],
      prayedCount: 1
    };
    setPrayerRequests([newReq, ...prayerRequests]);
    setNewTitle('');
    setNewDesc('');
    setNewRequestModal(false);
    toast.success('Prayer request published globally!');
  };
  
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h1 className="text-3xl font-black text-blue-900 tracking-tight">
                  {user?.role === 'Intercessor' ? 'Intercessor Portal' : 'Missionary Dashboard'}
                </h1>
                <p className="text-slate-500 text-sm">
                  {user?.role === 'Intercessor' 
                    ? 'Global intercession and prayer movement overview.' 
                    : 'Real-time visibility of Gospel advancement across territories.'}
                </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {!isSubscribed && (
                  <Button 
                    onClick={handleSubscribe} 
                    disabled={isSubscribing}
                    className="h-10 bg-white border border-blue-200 text-blue-600 rounded-full px-4 text-xs font-bold shadow-sm hover:bg-blue-50 cursor-pointer"
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    {isSubscribing ? 'Configuring...' : 'Enable Mission Alerts'}
                  </Button>
                )}
                
                {/* Daily / Weekly View Switcher */}
                <button
                  type="button"
                  onClick={() => {
                    const next = viewMode === 'Daily' ? 'Weekly' : 'Daily';
                    setViewMode(next);
                    toast.info(`Switched to ${next} Analytics View`);
                  }}
                  className="px-3 py-1.5 bg-white/80 hover:bg-white text-slate-700 rounded-full text-xs font-bold border border-slate-200 shadow-sm flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  {viewMode} View
                </button>

                <PermissionGate permission="submit_reports">
                  <button
                    type="button"
                    onClick={() => navigate('/map')}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold shadow-lg shadow-blue-200 flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Radio className="h-3.5 w-3.5 animate-pulse" />
                    Live Markers
                  </button>
                </PermissionGate>
            </div>
        </div>

        {/* Status Panels */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div 
              onClick={() => navigate('/countries')}
              className="bg-white/50 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Active Countries</p>
                <p className="text-2xl font-black text-blue-900 group-hover:text-blue-600 transition-colors">195</p>
                <p className="text-[10px] text-emerald-500 font-bold flex items-center mt-1">+2 this month</p>
            </div>
            <div 
              onClick={() => navigate('/countries')}
              className="bg-white/50 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Unreached Groups</p>
                <p className="text-2xl font-black text-blue-900 group-hover:text-amber-600 transition-colors">7,392</p>
                <p className="text-[10px] text-amber-500 font-bold flex items-center mt-1">Strategic focus</p>
            </div>
            <PermissionGate permission="view_reports">
              <div 
                onClick={() => navigate('/missionary-hub')}
                className="bg-white/50 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Field Missionaries</p>
                  <p className="text-2xl font-black text-blue-900 group-hover:text-blue-600 transition-colors">12,402</p>
                  <p className="text-[10px] text-blue-500 font-bold flex items-center mt-1">Online now: 1,208</p>
              </div>
            </PermissionGate>
            <div 
              onClick={() => setViewAllModal(true)}
              className="bg-white/50 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group"
            >
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-1">Prayers Rising</p>
                <p className="text-2xl font-black text-blue-900 group-hover:text-purple-600 transition-colors">4.2M</p>
                <p className="text-[10px] text-purple-500 font-bold flex items-center mt-1">Global movement</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1">
            {/* Simulation of the Map Panel from theme */}
            <div className="lg:col-span-2 glass-panel p-8 relative flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-blue-900">Mission Coverage Map</h2>
                    <p className="text-slate-500 text-sm">Interactive visualization of outreach efforts.</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/map')}
                    className="text-xs h-8 cursor-pointer"
                  >
                    Open Full Map <MapPin className="ml-1 h-3.5 w-3.5 text-blue-600" />
                  </Button>
                </div>
                
                <div className="flex-1 rounded-2xl border border-white/60 relative overflow-hidden bg-blue-50/10">
                  <div className="absolute inset-0 bg-blue-50 opacity-10">
                    <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(#2563eb 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
                  </div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[80%] h-[80%] border-2 border-dashed border-blue-200 rounded-full flex items-center justify-center opacity-40">
                      <div className="w-[60%] h-[60%] border-2 border-dashed border-blue-100 rounded-full"></div>
                    </div>
                    {/* Animated Pulsing Markers */}
                    <div 
                      onClick={() => navigate('/countries/in')}
                      title="India: Active Hub"
                      className="absolute top-1/4 left-1/3 w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-[0_0_20px_rgba(37,99,235,0.6)] cursor-pointer" 
                    />
                    <div 
                      onClick={() => navigate('/countries/pk')}
                      title="Pakistan: Unreached Frontier"
                      className="absolute top-1/2 left-1/4 w-3 h-3 bg-blue-400 rounded-full animate-pulse cursor-pointer" 
                    />
                    <div 
                      onClick={() => navigate('/countries/id')}
                      title="Indonesia: Island Outreach"
                      className="absolute bottom-1/3 right-1/4 w-4 h-4 bg-sky-500 rounded-full animate-pulse shadow-[0_0_20px_rgba(14,165,233,0.6)] cursor-pointer" 
                    />
                  </div>

                  <div className="absolute bottom-6 left-6 p-4 bg-white/80 backdrop-blur-md rounded-xl border border-white shadow-sm">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Currently Tracking</p>
                     <div className="flex gap-4">
                       <button 
                        type="button" 
                        onClick={() => navigate('/missionary-hub')}
                        className="text-center hover:opacity-80 transition-opacity"
                       >
                         <p className="text-lg font-black text-blue-900">12</p>
                         <p className="text-[8px] uppercase font-bold text-slate-500">Live Calls</p>
                       </button>
                       <button 
                        type="button" 
                        onClick={() => navigate('/missionary-hub')}
                        className="text-center hover:opacity-80 transition-opacity"
                       >
                         <p className="text-lg font-black text-blue-900">84</p>
                         <p className="text-[8px] uppercase font-bold text-slate-500">Meetings</p>
                       </button>
                       <button 
                        type="button" 
                        onClick={() => navigate('/countries')}
                        className="text-center hover:opacity-80 transition-opacity"
                       >
                         <p className="text-lg font-black text-blue-900">214</p>
                         <p className="text-[8px] uppercase font-bold text-slate-500">Reports</p>
                       </button>
                     </div>
                  </div>
                </div>
            </div>

            {/* Prayer Requests Panel */}
            <div className="bg-white/60 backdrop-blur-2xl border border-white rounded-[32px] p-6 flex flex-col shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-black text-blue-900 tracking-tight">Urgent Prayer Requests</h3>
                  <button 
                    type="button"
                    onClick={() => setNewRequestModal(true)}
                    title="Submit Prayer Request"
                    className="w-7 h-7 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center text-blue-600 transition-colors cursor-pointer"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-4 flex-1">
                  {prayerRequests.slice(0, 3).map((req) => (
                    <div 
                      key={req.id} 
                      onClick={() => setSelectedRequest(req)}
                      className="p-4 bg-white/80 hover:bg-white rounded-2xl border border-white hover:border-blue-200 transition-all cursor-pointer group shadow-xs"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg ${req.color === 'red' ? 'bg-red-100 text-red-600' : req.color === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'} flex-shrink-0 flex items-center justify-center font-bold text-xs`}>
                          {req.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-black text-slate-800 line-clamp-1 group-hover:text-blue-600 transition-colors">{req.title}</p>
                          <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{req.desc}</p>
                          <div className="flex items-center justify-between gap-2 mt-2">
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${req.color === 'red' ? 'text-red-500 bg-red-50' : req.color === 'blue' ? 'text-blue-500 bg-blue-50' : 'text-amber-500 bg-amber-50'}`}>
                              {req.tag}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold flex items-center">
                              <Heart className="h-3 w-3 mr-1 text-rose-500 fill-rose-500/20" /> {req.prayedCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={() => setViewAllModal(true)}
                  className="mt-4 w-full h-12 bg-white border border-blue-100 rounded-2xl text-[10px] font-black uppercase text-blue-600 tracking-widest hover:bg-blue-50 cursor-pointer"
                >
                  View All Requests ({prayerRequests.length})
                </Button>
            </div>
        </div>

        {/* Modal: Prayer Request Details */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  selectedRequest.color === 'red' ? 'bg-red-100 text-red-700' : selectedRequest.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {selectedRequest.tag}
                </span>
                <button onClick={() => setSelectedRequest(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{selectedRequest.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                {selectedRequest.desc}
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between mb-6">
                <span className="text-xs font-semibold text-slate-500">Total Intercessors Prayed:</span>
                <span className="text-base font-bold text-blue-600">{selectedRequest.prayedCount}</span>
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={() => handlePrayForRequest(selectedRequest.id)}
                  className={`flex-1 h-12 rounded-xl font-bold cursor-pointer transition-all ${
                    hasPrayedMap[selectedRequest.id] 
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {hasPrayedMap[selectedRequest.id] ? (
                    <span className="flex items-center"><Check className="mr-2 h-4 w-4" /> I Have Prayed ✓</span>
                  ) : (
                    <span className="flex items-center"><Heart className="mr-2 h-4 w-4 fill-white" /> I Prayed For This</span>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success('Prayer request link copied to clipboard!');
                  }}
                  className="h-12 px-4 rounded-xl cursor-pointer"
                  title="Share Request"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: View All Requests */}
        {viewAllModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Global Prayer Board</h3>
                  <p className="text-xs text-slate-500">Live requests from field workers and translation frontiers</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => { setViewAllModal(false); setNewRequestModal(true); }}
                    className="bg-primary text-white h-8 text-xs cursor-pointer"
                  >
                    <Plus className="mr-1 h-3.5 w-3.5" /> Submit Request
                  </Button>
                  <button onClick={() => setViewAllModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="py-4 space-y-3 overflow-y-auto flex-1">
                {prayerRequests.map((req) => (
                  <div 
                    key={req.id} 
                    className="p-4 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          req.color === 'red' ? 'text-red-600 bg-red-50' : req.color === 'blue' ? 'text-blue-600 bg-blue-50' : 'text-amber-600 bg-amber-50'
                        }`}>
                          {req.tag}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900">{req.title}</h4>
                      </div>
                      <p className="text-xs text-slate-600">{req.desc}</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => handlePrayForRequest(req.id)}
                      className={`h-8 px-3 text-xs shrink-0 cursor-pointer ${
                        hasPrayedMap[req.id] ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      <Heart className="mr-1 h-3.5 w-3.5" />
                      {hasPrayedMap[req.id] ? 'Prayed' : 'Pray'} ({req.prayedCount})
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal: Submit New Request */}
        {newRequestModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Submit Prayer Request</h3>
                <button onClick={() => setNewRequestModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCreateRequest} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Request Title</label>
                  <input 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    placeholder="e.g. Workers needed in Caspian Basin"
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Priority Category</label>
                  <select 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value as 'High Urgency' | 'Global Body' | 'Resource')}
                    className="w-full h-11 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  >
                    <option value="High Urgency">High Urgency</option>
                    <option value="Global Body">Global Body</option>
                    <option value="Resource">Resource & Logistics</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Details & Specific Points</label>
                  <textarea 
                    rows={3}
                    value={newDesc} 
                    onChange={(e) => setNewDesc(e.target.value)} 
                    placeholder="Share specific prayer requests..."
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                    required 
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setNewRequestModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary text-white font-bold">
                    <Send className="mr-2 h-4 w-4" /> Submit to Board
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}

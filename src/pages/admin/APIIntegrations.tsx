
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  Plus,
  Trash2,
  Copy,
  CheckCircle2,
  Server,
  Cloud,
  Database,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

interface Integration {
  id: string;
  name: string;
  provider: 'Cloudinary' | 'Firebase' | 'Twilio' | 'Joshua Project';
  keyName: string;
  keyValue: string;
  status: 'Active' | 'Inactive';
  lastUsed: string;
}

const initialIntegrations: Integration[] = [
  { id: '1', name: 'Media Storage', provider: 'Cloudinary', keyName: 'CLOUD_NAME', keyValue: 'pcloud-assets-prod', status: 'Active', lastUsed: '4m ago' },
  { id: '2', name: 'Cloud Firestore', provider: 'Firebase', keyName: 'FIREBASE_API_KEY', keyValue: 'AIzaSyAdN9X9A2_88V1FFKL98Z0X9B2C1', status: 'Active', lastUsed: '12m ago' },
  { id: '3', name: 'Secure Comms', provider: 'Twilio', keyName: 'TWILIO_AUTH_TOKEN', keyValue: '88v1ffkl98z0x9b2c1a2d9a9x9a2', status: 'Active', lastUsed: '1h ago' },
  { id: '4', name: 'Nations Data', provider: 'Joshua Project', keyName: 'JP_API_KEY', keyValue: 'pcloud_jp_key_v1', status: 'Inactive', lastUsed: '3d ago' },
];

export default function AdminAPIIntegrations() {
  const [integrations, setIntegrations] = useState(initialIntegrations);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Key copied to clipboard');
  };

  const handleRotate = (id: string) => {
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    setIntegrations(prev => prev.map(item => 
      item.id === id ? { ...item, keyValue: `rot_${randomSuffix}_${item.keyValue.slice(0, 10)}`, lastUsed: 'Just now' } : item
    ));
    toast.success('New key provisioned and synced to all nodes');
  };

  const handleDelete = (id: string, name: string) => {
    setIntegrations(prev => prev.filter(i => i.id !== id));
    toast.success(`Integration ${name} removed`);
  };

  return (
    <div className="space-y-8 max-w-5xl">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">API Integrations</h1>
          <p className="text-slate-500">Connect and manage third-party services that power the platform.</p>
        </div>
        <Button className="h-10 px-6 bg-primary shadow-lg shadow-primary/20" onClick={() => toast.info('New integration wizard opening...')}>
          <Plus className="h-4 w-4 mr-2" /> Add Integration
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         {integrations.map((int) => (
           <Card key={int.id} className="border-none shadow-sm group hover:shadow-md transition-all">
             <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-xl group-hover:bg-primary/5 transition-colors">
                         {int.provider === 'Cloudinary' && <Cloud className="h-5 w-5 text-sky-600" />}
                         {int.provider === 'Firebase' && <Database className="h-5 w-5 text-amber-500" />}
                         {int.provider === 'Twilio' && <Server className="h-5 w-5 text-rose-600" />}
                         {int.provider === 'Joshua Project' && <ShieldCheck className="h-5 w-5 text-emerald-600" />}
                      </div>
                      <div>
                         <CardTitle className="text-lg">{int.name}</CardTitle>
                         <CardDescription className="text-xs">{int.provider}</CardDescription>
                      </div>
                   </div>
                   <Badge className={cn(
                     "rounded-full border-none px-2 py-0 text-[10px] font-bold uppercase tracking-widest",
                     int.status === 'Active' ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                   )}>
                     {int.status}
                   </Badge>
                </div>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="space-y-2">
                   <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{int.keyName}</span>
                      <div className="flex items-center gap-2">
                         <button onClick={() => toggleKeyVisibility(int.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            {showKeys[int.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                         </button>
                         <button onClick={() => copyToClipboard(int.keyValue)} className="text-slate-400 hover:text-slate-600 transition-colors">
                            <Copy className="h-3.5 w-3.5" />
                         </button>
                      </div>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-lg font-mono text-xs text-slate-600 truncate border border-slate-100">
                      {showKeys[int.id] ? int.keyValue : '••••••••••••••••••••••••••••••••'}
                   </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                   <span className="text-[10px] text-slate-500">Last used: <span className="font-bold">{int.lastUsed}</span></span>
                   <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold" onClick={() => handleRotate(int.id)}>
                         <RefreshCw className="h-3 w-3 mr-1" /> Rotate
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50" onClick={() => handleDelete(int.id, int.name)}>
                         <Trash2 className="h-3 w-3 mr-1" /> Remove
                      </Button>
                   </div>
                </div>
             </CardContent>
           </Card>
         ))}
      </div>

      <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden relative">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Lock className="h-32 w-32" />
         </div>
         <CardHeader>
            <CardTitle>Security Protocol</CardTitle>
            <CardDescription className="text-slate-400">All API keys are encrypted at rest using AES-256-GCM and stored in PRAYERCLOUD's internal HSM cluster.</CardDescription>
         </CardHeader>
         <CardContent>
            <div className="flex flex-col md:flex-row md:items-center gap-4">
               <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/10 flex-1">
                  <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Encrypted Storage Active</p>
                    <p className="text-[10px] text-slate-400">No raw keys are stored in database tables.</p>
                  </div>
               </div>
               <Button variant="outline" className="h-11 border-white/10 bg-white/5 hover:bg-white/10 border-white/20 text-white">
                  Auditing Documentation <ExternalLink className="h-4 w-4 ml-2" />
               </Button>
            </div>
         </CardContent>
      </Card>
    </div>
  );
}

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

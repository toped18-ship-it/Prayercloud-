
import React from 'react';
import { 
  Shield, 
  Lock, 
  ShieldAlert, 
  Smartphone, 
  Key, 
  Ban, 
  Globe, 
  Clock, 
  Save,
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

export default function AdminSecurity() {
  const [showKey, setShowKey] = React.useState(false);

  const handleSave = () => {
    toast.success('Security policies updated across all nodes');
  };

  return (
    <div className="space-y-8 max-w-5xl">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Security & Compliance</h1>
          <p className="text-slate-500">Configure global protection layers and authentication protocols.</p>
        </div>
        <Button onClick={handleSave} className="h-10 px-6 bg-primary shadow-lg shadow-primary/20">
          <Save className="h-4 w-4 mr-2" /> Save Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-sm bg-emerald-50/50 border border-emerald-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Shield className="h-5 w-5 text-emerald-600" />
              <Badge className="bg-emerald-100 text-emerald-700 border-none px-2 uppercase text-[9px] tracking-widest">Active</Badge>
            </div>
            <CardTitle className="text-sm mt-4">SSO Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-emerald-950">Secure</p>
            <p className="text-xs text-emerald-600 mt-1">Enterprise SSO is enabled.</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-blue-50/50 border border-blue-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Lock className="h-5 w-5 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-700 border-none px-2 uppercase text-[9px] tracking-widest">Configured</Badge>
            </div>
            <CardTitle className="text-sm mt-4">2FA Adoption</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-blue-950">94.2%</p>
            <p className="text-xs text-blue-600 mt-1">Mandatory for all Admin roles.</p>
          </CardContent>
        </Card>
        <Card className="border-none shadow-sm bg-amber-50/50 border border-amber-100">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <ShieldAlert className="h-5 w-5 text-amber-600" />
              <Badge className="bg-amber-100 text-amber-700 border-none px-2 uppercase text-[9px] tracking-widest">Monitoring</Badge>
            </div>
            <CardTitle className="text-sm mt-4">Auth Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-black text-amber-950">0</p>
            <p className="text-xs text-amber-600 mt-1">No critical breaches in 30d.</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="auth" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-12">
          <TabsTrigger value="auth" className="rounded-lg px-6 h-full data-[state=active]:bg-slate-100 data-[state=active]:text-primary">
            <Smartphone className="h-4 w-4 mr-2" /> Authentication
          </TabsTrigger>
          <TabsTrigger value="network" className="rounded-lg px-6 h-full data-[state=active]:bg-slate-100 data-[state=active]:text-primary">
            <Globe className="h-4 w-4 mr-2" /> Network Security
          </TabsTrigger>
          <TabsTrigger value="sessions" className="rounded-lg px-6 h-full data-[state=active]:bg-slate-100 data-[state=active]:text-primary">
            <Clock className="h-4 w-4 mr-2" /> Sessions
          </TabsTrigger>
          <TabsTrigger value="keys" className="rounded-lg px-6 h-full data-[state=active]:bg-slate-100 data-[state=active]:text-primary">
            <Key className="h-4 w-4 mr-2" /> Master Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="auth" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Authentication Policies</CardTitle>
              <CardDescription>Control how users access the cloud.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Mandatory MFA</p>
                  <p className="text-xs text-slate-500">Require Two-Factor Authentication for all administrative roles.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Strong Password Requirement</p>
                  <p className="text-xs text-slate-500">Minimum 12 characters with symbols, numbers, and mixed case.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-bold">Password Expiration</p>
                  <p className="text-xs text-slate-500">Force users to rotate passwords every 90 days.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Login Restrictions</CardTitle>
              <CardDescription>Brute force protection and account locking.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-2">
                    <Label>Max Login Attempts</Label>
                    <Input type="number" defaultValue={5} />
                    <p className="text-[10px] text-slate-400">Lock account after X consecutive failures.</p>
                 </div>
                 <div className="space-y-2">
                    <Label>Lock Duration (minutes)</Label>
                    <Input type="number" defaultValue={30} />
                    <p className="text-[10px] text-slate-400">Time before account automatically unlocks.</p>
                 </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
           <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">IP Access Control</CardTitle>
              <CardDescription>Allow or block specific IP addresses and ranges.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-emerald-900">Allowed: Corporate VPN</p>
                        <p className="text-xs text-emerald-600">10.0.0.0/24</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-emerald-700">Remove</Button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-rose-50 rounded-xl border border-rose-100">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                        <Ban className="h-4 w-4 text-rose-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-rose-900">Blocked: Suspended Node</p>
                        <p className="text-xs text-rose-600">185.122.4.91</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-rose-700">Unblock</Button>
                  </div>
               </div>
               <div className="flex gap-3">
                  <Input placeholder="Enter IP or CIDR range..." className="h-11" />
                  <Button className="h-11 shrink-0 px-6">Add to Allowlist</Button>
               </div>
            </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="keys" className="space-y-6">
           <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Encryption Keys</CardTitle>
                <CardDescription>Master platform encryption and signing secrets.</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="text-rose-600">Rotate Keys</Button>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="p-4 bg-slate-100 rounded-xl font-mono text-sm break-all relative group overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">X-MASTER-ENCRYPTION-KEY</span>
                    <button onClick={() => setShowKey(!showKey)}>
                      {showKey ? <EyeOff className="h-4 w-4 text-slate-400" /> : <Eye className="h-4 w-4 text-slate-400" />}
                    </button>
                  </div>
                  {showKey ? 'PCLOUD_SEC_9X_A2_88_V1_FF_KL_98_Z0_X9_B2_C1' : '••••••••••••••••••••••••••••••••••••••••••••'}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
               </div>
               <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed">
                 <span className="font-black text-rose-600 flex items-center gap-1 mb-1"><ShieldAlert className="h-3 w-3" /> SECURITY WARNING:</span>
                 Rotating master keys will invalidate all current user sessions and may temporarily disrupt service for 5-10 minutes while regional nodes re-sync.
               </p>
            </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

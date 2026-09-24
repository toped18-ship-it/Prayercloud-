
import React from 'react';
import { 
  Mail, 
  Send, 
  Server, 
  RefreshCw, 
  CheckCircle2,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

export default function AdminEmail() {
  const [testing, setTesting] = React.useState(false);
  const [testEmail, setTestEmail] = React.useState('');

  const handleTestEmail = () => {
    if (!testEmail) {
      toast.error('Please enter a target email address');
      return;
    }
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      toast.success(`Test email dispatched successfully to ${testEmail}`);
    }, 2000);
  };

  return (
    <div className="space-y-8 max-w-5xl">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Email & SMTP</h1>
          <p className="text-slate-500">Configure outbound communication channels and mail servers.</p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none px-4 py-1 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          SMTP Server Connected
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
           <Card className="border-none shadow-sm">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Mail Server Configuration</CardTitle>
                    <CardDescription>Primary SMTP settings for transactional emails.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>SMTP Host</Label>
                    <Input defaultValue="smtp.prayercloud.io" />
                  </div>
                  <div className="space-y-2">
                     <Label>Port</Label>
                     <Input defaultValue="587" />
                  </div>
                  <div className="space-y-2">
                     <Label>Encryption</Label>
                     <Select defaultValue="tls">
                       <SelectTrigger className="bg-white">
                         <SelectValue placeholder="Encryption" />
                       </SelectTrigger>
                       <SelectContent>
                         <SelectItem value="tls">STARTTLS (Recommended)</SelectItem>
                         <SelectItem value="ssl">SSL/TLS</SelectItem>
                         <SelectItem value="none">None</SelectItem>
                       </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Authentication</Label>
                    <Select defaultValue="basic">
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Auth Method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="basic">Username/Password</SelectItem>
                        <SelectItem value="oauth">OAuth 2.0</SelectItem>
                        <SelectItem value="none">No Auth</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Username</Label>
                    <Input defaultValue="notifications@prayercloud.io" />
                  </div>
                  <div className="space-y-2 relative">
                    <Label>Password</Label>
                    <Input type="password" defaultValue="••••••••••••" />
                    <Button variant="ghost" size="icon" className="absolute right-0 bottom-0 h-10 w-10 text-slate-400">
                      <Lock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex justify-end">
                   <Button onClick={() => toast.success('SMTP configuration saved')} className="bg-primary px-8">Save Details</Button>
                </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle className="text-lg">Sender Identity</CardTitle>
                  <CardDescription>How the platform appears in user inboxes.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Default From Name</Label>
                    <Input defaultValue="PRAYERCLOUD Missions" />
                  </div>
                  <div className="space-y-2">
                    <Label>Default From Email</Label>
                    <Input defaultValue="no-reply@prayercloud.io" />
                  </div>
               </div>
            </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Connection Test</CardTitle>
                <CardDescription>Verify your SMTP settings are functional.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                 <div className="space-y-4">
                    <div className="flex items-start gap-3">
                       <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1" />
                       <span className="text-xs text-slate-600">Resolving hostname: Success</span>
                    </div>
                    <div className="flex items-start gap-3">
                       <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1" />
                       <span className="text-xs text-slate-600">Handshake TLS 1.3: Success</span>
                    </div>
                    <div className="flex items-start gap-3 border-b border-slate-50 pb-4">
                       <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1" />
                       <span className="text-xs text-slate-600">Session auth: Success</span>
                    </div>
                 </div>

                 <div className="space-y-3">
                    <Label className="text-xs text-slate-500 uppercase font-bold tracking-widest">Send Manual Test</Label>
                    <Input 
                      placeholder="target@example.com" 
                      value={testEmail}
                      onChange={e => setTestEmail(e.target.value)}
                      className="bg-slate-50 border-none h-11" 
                    />
                    <Button 
                      className="w-full h-11 bg-slate-900 gap-2" 
                      onClick={handleTestEmail}
                      disabled={testing}
                    >
                       {testing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                       Dispatch Test Mail
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Regional Relay</CardTitle>
                <Badge variant="outline" className="text-[10px]">Auto</Badge>
              </div>
            </CardHeader>
            <CardContent>
               <div className="space-y-3">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Automatically route email through the nearest regional relay to ensure delivery in high-restricted zones (10/40 window).
                  </p>
                  <Button variant="ghost" size="sm" className="w-full text-primary h-8 gap-1">
                    Manage Relay Nodes <ChevronRight className="h-3 w-3" />
                  </Button>
               </div>
            </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

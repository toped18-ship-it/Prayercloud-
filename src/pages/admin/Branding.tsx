
import React from 'react';
import { 
  Palette, 
  Upload, 
  Image as ImageIcon, 
  Type, 
  Save, 
  RefreshCw,
  Globe,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Switch } from '../../components/ui/switch';
import { toast } from 'sonner';

export default function AdminBranding() {
  const [loading, setLoading] = React.useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Branding settings updated successfully');
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Branding & Appearance</h1>
          <p className="text-slate-500">Customize the visual identity and platform personality.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 px-4" onClick={() => toast.info('Resetting to default branding...')}>
            <RefreshCw className="h-4 w-4 mr-2" /> Reset
          </Button>
          <Button onClick={handleSave} disabled={loading} className="h-10 px-6 bg-primary shadow-lg shadow-primary/20">
            {loading ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="visuals" className="space-y-6">
        <TabsList className="bg-white border border-slate-200 p-1 rounded-xl h-12">
          <TabsTrigger value="visuals" className="rounded-lg px-6 h-full data-[state=active]:bg-slate-100 data-[state=active]:text-primary">
            <Palette className="h-4 w-4 mr-2" /> Visuals
          </TabsTrigger>
          <TabsTrigger value="identity" className="rounded-lg px-6 h-full data-[state=active]:bg-slate-100 data-[state=active]:text-primary">
            <Type className="h-4 w-4 mr-2" /> Identity
          </TabsTrigger>
          <TabsTrigger value="contact" className="rounded-lg px-6 h-full data-[state=active]:bg-slate-100 data-[state=active]:text-primary">
            <Mail className="h-4 w-4 mr-2" /> Contact & Social
          </TabsTrigger>
          <TabsTrigger value="seo" className="rounded-lg px-6 h-full data-[state=active]:bg-slate-100 data-[state=active]:text-primary">
            <Globe className="h-4 w-4 mr-2" /> SEO & Meta
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visuals" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Color Palette</CardTitle>
                  <CardDescription>Define the core colors of the platform.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>Primary Brand Color</Label>
                    <div className="flex gap-3">
                      <div className="h-12 w-12 rounded-xl bg-[#3b82f6] border border-slate-200 shrink-0" />
                      <Input defaultValue="#3B82F6" className="font-mono text-sm" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Secondary / Accent Color</Label>
                    <div className="flex gap-3">
                      <div className="h-12 w-12 rounded-xl bg-[#f43f5e] border border-slate-200 shrink-0" />
                      <Input defaultValue="#F43F5E" className="font-mono text-sm" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label>Background Surface</Label>
                    <div className="flex gap-3">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-200 shrink-0" />
                      <Input defaultValue="#F8FAFC" className="font-mono text-sm" />
                    </div>
                  </div>
                </CardContent>
             </Card>

             <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Assets & Icons</CardTitle>
                  <CardDescription>Logos and favicon management.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="p-8 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors group">
                      <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Upload className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-bold text-slate-900">Upload Platform Logo</p>
                      <p className="text-xs text-slate-500 mt-1">PNG, SVG up to 5MB</p>
                   </div>
                   <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center border border-slate-200">
                          <ImageIcon className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">favicon.ico</p>
                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">32x32px • Original</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">Replace</Button>
                   </div>
                </CardContent>
             </Card>
          </div>

          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Theme Settings</CardTitle>
              <CardDescription>Global behavior for light and dark modes.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-bold">Auto Dark Mode</span>
                  <span className="text-xs text-slate-500 font-medium leading-tight">Sync with system preferences.</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-bold">Glassmorphism</span>
                  <span className="text-xs text-slate-500 font-medium leading-tight">Enable blur effects in UI.</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between space-x-4">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm font-bold">Animations</span>
                  <span className="text-xs text-slate-500 font-medium leading-tight">Enable motion effects.</span>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="identity" className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Platform Identity</CardTitle>
              <CardDescription>Core identifiers and text content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Application Name</Label>
                  <Input defaultValue="PRAYERCLOUD" />
                </div>
                <div className="space-y-2">
                  <Label>Mission Tagline</Label>
                  <Input defaultValue="Secure Global Coordination for Strategic Missions" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Footer Credits</Label>
                <textarea 
                  className="w-full h-24 rounded-xl border border-slate-200 bg-white p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  defaultValue="© 2026 PRAYERCLOUD. All rights reserved. Built for the Great Commission."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
           <Card className="border-none shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg">Search Engine Optimization</CardTitle>
               <CardDescription>Manage how the platform appears in search results.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                  <Label>Global Title Template</Label>
                  <Input defaultValue="%page% | PRAYERCLOUD - Global Missions" />
               </div>
               <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <textarea 
                    className="w-full h-32 rounded-xl border border-slate-200 bg-white p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    defaultValue="The world's most advanced platform for secure missionary coordination, prayer strategy, and unreached people group data."
                  />
               </div>
               <div className="space-y-2">
                  <Label>Meta Keywords (Comma separated)</Label>
                  <Input defaultValue="missionary, prayer, missions, unreached people groups, 10/40 window" />
               </div>
            </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

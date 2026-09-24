
import React from 'react';
import { 
  Save, 
  Eye, 
  Layout, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  GripVertical 
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { toast } from 'sonner';

export default function AdminHomepage() {
  const [sections, setSections] = React.useState([
    { id: '1', title: 'Hero Section', type: 'Hero', status: 'Published' },
    { id: '2', title: 'About PRAYERCLOUD', type: 'Content', status: 'Published' },
    { id: '3', title: 'Recent Prayer Strikes', type: 'Featured', status: 'Published' },
    { id: '4', title: 'Global Mission Stats', type: 'Stats', status: 'Draft' },
  ]);

  const handleAddSection = () => {
    const id = `${Date.now()}`;
    setSections([...sections, { id, title: 'New Custom Section', type: 'Content', status: 'Draft' }]);
    toast.success('New section draft created');
  };

  const handleDeleteSection = (id: string, title: string) => {
    setSections(sections.filter(s => s.id !== id));
    toast.success(`Removed "${title}" section`);
  };

  return (
    <div className="space-y-8 max-w-5xl">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Homepage Content</h1>
          <p className="text-slate-500">Manage the landing page experience and public-facing content.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 px-4" onClick={() => window.open('/', '_blank')}>
            <Eye className="h-4 w-4 mr-2" /> Live Preview
          </Button>
          <Button className="h-10 px-6 bg-primary shadow-lg shadow-primary/20" onClick={() => toast.success('Homepage changes deployed to production!')}>
            <Save className="h-4 w-4 mr-2" /> Publish Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
           <Card className="border-none shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg">Structural Sections</CardTitle>
                  <CardDescription>Drag and drop to reorder the landing page content.</CardDescription>
                </div>
                <Button size="sm" variant="ghost" className="text-primary" onClick={handleAddSection}>
                  <Plus className="h-4 w-4 mr-1" /> Add Section
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                 {sections.map((section) => (
                   <div key={section.id} className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-2xl group hover:border-primary/30 transition-all hover:shadow-md cursor-move">
                      <div className="flex items-center gap-4">
                         <GripVertical className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                         <div>
                            <p className="text-sm font-bold text-slate-900">{section.title}</p>
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{section.type}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <Badge variant="outline" className={cn(
                           "border-none px-2 py-0 text-[10px] font-bold uppercase tracking-widest",
                           section.status === 'Published' ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-600"
                         )}>
                            {section.status}
                         </Badge>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 text-slate-400 group-hover:text-slate-600 transition-colors"
                           onClick={() => toast.info(`Editing layout for ${section.title}`)}
                         >
                            <Layout className="h-4 w-4" />
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="icon" 
                           className="h-8 w-8 text-slate-400 hover:text-rose-600 transition-colors"
                           onClick={() => handleDeleteSection(section.id, section.title)}
                         >
                            <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                   </div>
                 ))}
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm">
            <CardHeader>
               <CardTitle className="text-lg">Hero Editor</CardTitle>
               <CardDescription>Edit the primary call-to-action on top of the page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="space-y-2">
                  <Label>Main Headline</Label>
                  <Input defaultValue="Uniting the Global Body for Global Missions" />
               </div>
               <div className="space-y-2">
                  <Label>Support Paragraph</Label>
                  <textarea 
                    className="w-full h-24 rounded-xl border border-slate-200 bg-white p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    defaultValue="Secure coordination and real-time intelligence for missionaries, intercessors, and churches reaching the nations."
                  />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary CTABtn</Label>
                    <Input defaultValue="Join the Cloud" />
                  </div>
                  <div className="space-y-2">
                    <Label>Action Link</Label>
                    <Input defaultValue="/register" />
                  </div>
               </div>
            </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Media Library</CardTitle>
                <CardDescription>Hero and background assets.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="aspect-video bg-slate-200 rounded-xl flex items-center justify-center relative group overflow-hidden">
                    <ImageIcon className="h-8 w-8 text-slate-400" />
                    <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Button size="sm" variant="ghost" className="text-white">Replace Image</Button>
                    </div>
                 </div>
                 <div className="flex gap-2 h-16">
                    <div className="flex-1 bg-slate-100 rounded-lg flex items-center justify-center border border-dashed border-slate-200 cursor-pointer hover:bg-slate-50">
                       <Plus className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-lg" />
                    <div className="flex-1 bg-slate-100 rounded-lg" />
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm">
             <CardHeader>
                <CardTitle className="text-sm">Content Health</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-500">Readability</span>
                   <span className="font-bold text-emerald-600">Great</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-500">SEO Score</span>
                   <span className="font-bold text-emerald-600">92/100</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                   <span className="text-slate-500">Last Published</span>
                   <span className="font-bold text-slate-900">4h ago</span>
                </div>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

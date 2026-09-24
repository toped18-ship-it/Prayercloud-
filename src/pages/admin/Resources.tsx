import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { FileText, FileCode, Search, Download, Trash2, Plus, Library } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploadZone } from '../../components/ui/FileUploadZone';
import { formatFileSize, type UploadedFileResult } from '../../lib/fileUpload';

interface ResourceItem {
  id: string;
  title: string;
  category: string;
  format: string;
  size: string;
  downloads: number;
  url?: string;
}

const initialResources: ResourceItem[] = [
  { id: '1', title: 'UPG Engagement Field Handbook 2026', category: 'Guides', format: 'PDF', size: '14.2 MB', downloads: 1250 },
  { id: '2', title: 'Security Protocol for Hostile Regions', category: 'Legal', format: 'PDF', size: '2.1 MB', downloads: 840 },
  { id: '3', title: 'Language Learning Audio Assets: Pashto', category: 'Tools', format: 'ZIP', size: '128 MB', downloads: 310 },
  { id: '4', title: 'Intercessory Prayer Matrix Template', category: 'Training', format: 'XLSX', size: '450 KB', downloads: 2200 },
];

export default function AdminResources() {
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Guides');
  const [newFormat, setNewFormat] = useState('PDF');
  const [uploadedFile, setUploadedFile] = useState<UploadedFileResult | null>(null);

  const filteredResources = resources.filter(res => {
    const matchesCategory = activeCategory === 'All' || res.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || res.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUploaded = (file: UploadedFileResult) => {
    setUploadedFile(file);
    if (!newTitle.trim()) {
      const clean = file.originalName.replace(/\.[^/.]+$/, '');
      setNewTitle(clean);
    }
    // Infer format from extension
    const ext = file.originalName.split('.').pop()?.toUpperCase() || '';
    if (['PDF', 'ZIP', 'XLSX', 'DOCX'].includes(ext)) {
      setNewFormat(ext);
    } else if (['MP3', 'WAV', 'M4A'].includes(ext)) {
      setNewFormat('AUDIO');
    } else {
      setNewFormat(ext || 'FILE');
    }
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please enter resource title');
      return;
    }
    const newRes: ResourceItem = {
      id: String(Date.now()),
      title: newTitle.trim(),
      category: newCategory,
      format: newFormat,
      size: uploadedFile ? formatFileSize(uploadedFile.size) : '1.5 MB',
      downloads: 0,
      url: uploadedFile?.url,
    };
    setResources([newRes, ...resources]);
    setShowAddModal(false);
    setNewTitle('');
    setUploadedFile(null);
    toast.success(`Resource "${newRes.title}" published!`);
  };

  const handleDownload = (res: ResourceItem) => {
    setResources(resources.map(r => r.id === res.id ? { ...r, downloads: r.downloads + 1 } : r));
    if (res.url) {
      const link = document.createElement('a');
      link.href = res.url;
      link.download = res.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloaded ${res.title}`);
    } else {
      toast.success(`Downloading ${res.title} (${res.format})`);
    }
  };

  const handleDelete = (id: string, title: string) => {
    setResources(resources.filter(r => r.id !== id));
    toast.success(`Removed resource "${title}"`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Resource Library</h1>
          <p className="text-slate-500">Manage downloadable guides, training materials, and documents.</p>
        </div>
        <Button 
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Resource
        </Button>
      </div>

      {showAddModal && (
        <Card className="p-5 border-blue-200 bg-blue-50/50 shadow-sm">
          <form onSubmit={handleAddResource} className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Upload New Mission Resource</h3>
                <p className="text-xs text-slate-500">Attach file directly from your computer, phone, or tablet</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowAddModal(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>

            {/* Real File Upload from Device */}
            <FileUploadZone
              onFileUploaded={handleFileUploaded}
              label="Select file from gadget"
              sublabel="Upload PDF, DOCX, ZIP, MP3, or spreadsheet directly from your computer or phone"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Resource Title (e.g. 2026 Engagement Guide)"
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
              <select
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
              >
                <option value="Guides">Guides</option>
                <option value="Training">Training</option>
                <option value="Tools">Tools</option>
                <option value="Legal">Legal</option>
              </select>
              <select
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                value={newFormat}
                onChange={e => setNewFormat(e.target.value)}
              >
                <option value="PDF">PDF</option>
                <option value="ZIP">ZIP</option>
                <option value="XLSX">XLSX</option>
                <option value="DOCX">DOCX</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Publish Resource
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Guides</p>
                <p className="text-xl font-bold">
                  {resources.filter(r => r.category === 'Guides').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
             <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                <FileCode className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Total Tools</p>
                <p className="text-xl font-bold">
                  {resources.filter(r => r.category === 'Tools').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold text-blue-600">
              {resources.reduce((s, r) => s + r.downloads, 0).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500 font-medium">Total Downloads</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-xl font-bold text-slate-900">1.4 GB</div>
            <p className="text-xs text-slate-500 font-medium">Storage Used</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-6 rounded-2xl border shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search library..." 
              className="pl-10 w-full h-10" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {['All', 'Guides', 'Training', 'Tools', 'Legal'].map(cat => (
              <Badge 
                key={cat} 
                variant={activeCategory === cat ? 'default' : 'outline'} 
                className="cursor-pointer hover:bg-slate-100 select-none"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredResources.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No matching resources found.</p>
          ) : (
            filteredResources.map((res) => (
              <div key={res.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Library className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{res.title}</p>
                    <p className="text-xs text-slate-500">{res.category} • {res.format} • {res.size} • {res.downloads} downloads</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleDownload(res)}
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 cursor-pointer"
                    title="Download resource"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => handleDelete(res.id, res.title)}
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 text-rose-500 hover:bg-rose-50 cursor-pointer"
                    title="Delete resource"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

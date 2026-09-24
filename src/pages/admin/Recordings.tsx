import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Mic2, Video, Search, Filter, Play, Pause, Download, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploadZone } from '../../components/ui/FileUploadZone';
import { formatFileSize, type UploadedFileResult } from '../../lib/fileUpload';

interface RecordingItem {
  id: string;
  title: string;
  type: 'Audio' | 'Video';
  duration: string;
  size: string;
  date: string;
  status: 'Published' | 'Processing';
  url?: string;
}

const initialRecordings: RecordingItem[] = [
  { id: '1', title: 'Mission Field Report - Central Asia', type: 'Audio', duration: '14:20', size: '18.4 MB', date: '2026-05-08', status: 'Published' },
  { id: '2', title: 'Testimonial from Underground Leader', type: 'Audio', duration: '08:45', size: '9.2 MB', date: '2026-05-06', status: 'Published' },
  { id: '3', title: 'Prayer Summit 2026 Keynote Opening', type: 'Video', duration: '45:10', size: '640 MB', date: '2026-05-01', status: 'Published' },
];

export default function AdminRecordings() {
  const [recordings, setRecordings] = useState<RecordingItem[]>(initialRecordings);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Audio' | 'Video'>('All');
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<'Audio' | 'Video'>('Audio');
  const [uploadedFile, setUploadedFile] = useState<UploadedFileResult | null>(null);

  const filtered = recordings.filter(rec => {
    const matchesType = filterType === 'All' || rec.type === filterType;
    const matchesSearch = rec.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleFileUploaded = (file: UploadedFileResult) => {
    setUploadedFile(file);
    if (!newTitle.trim()) {
      const clean = file.originalName.replace(/\.[^/.]+$/, '');
      setNewTitle(clean);
    }
    if (file.fileType.startsWith('video/')) {
      setNewType('Video');
    } else {
      setNewType('Audio');
    }
  };

  const handlePlayToggle = (id: string, title: string) => {
    if (playingId === id) {
      setPlayingId(null);
      toast.info(`Paused playback of "${title}"`);
    } else {
      setPlayingId(id);
      toast.success(`Playing preview of "${title}"`);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Please enter a recording title');
      return;
    }
    const newRec: RecordingItem = {
      id: String(Date.now()),
      title: newTitle.trim(),
      type: newType,
      duration: '10:00',
      size: uploadedFile ? formatFileSize(uploadedFile.size) : (newType === 'Audio' ? '12 MB' : '150 MB'),
      date: new Date().toISOString().slice(0, 10),
      status: 'Published',
      url: uploadedFile?.url,
    };
    setRecordings([newRec, ...recordings]);
    setShowUploadModal(false);
    setNewTitle('');
    setUploadedFile(null);
    toast.success(`Recording "${newRec.title}" uploaded!`);
  };

  const handleDownload = (rec: RecordingItem) => {
    if (rec.url) {
      const link = document.createElement('a');
      link.href = rec.url;
      link.download = rec.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading recording: ${rec.title}`);
    } else {
      toast.success(`Downloading recording: ${rec.title}`);
    }
  };

  const handleDelete = (id: string, title: string) => {
    setRecordings(recordings.filter(r => r.id !== id));
    toast.success(`Recording "${title}" deleted.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Voice & Video Recordings</h1>
          <p className="text-slate-500">Manage field recordings, testimonials, and media uploads.</p>
        </div>
        <Button 
          onClick={() => setShowUploadModal(true)}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          <Upload className="w-4 h-4 mr-2" /> Upload Recording
        </Button>
      </div>

      {showUploadModal && (
        <Card className="p-5 border-blue-200 bg-blue-50/50 shadow-sm">
          <form onSubmit={handleUpload} className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Upload Field Recording</h3>
                <p className="text-xs text-slate-500">Record or upload audio testimonials and video briefings from phone or computer</p>
              </div>
              <button 
                type="button" 
                onClick={() => setShowUploadModal(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>

            {/* Device file uploader supporting microphone & phone camera/files */}
            <FileUploadZone
              onFileUploaded={handleFileUploaded}
              accept="audio/*,video/*"
              label="Select or record media from gadget"
              sublabel="Upload MP3, WAV, M4A, or MP4, or record a voice note directly from your phone or computer"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Recording Title (e.g. Field Report from Ankara)"
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
              <select
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                value={newType}
                onChange={e => setNewType(e.target.value as 'Audio' | 'Video')}
              >
                <option value="Audio">Audio Testimonial / Voice Note</option>
                <option value="Video">Video Briefing / Documentary</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Confirm & Publish
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="flex items-center p-6 border-l-4 border-l-blue-500">
          <div className="bg-blue-50 p-3 rounded-xl mr-4">
            <Mic2 className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Audio Files</p>
            <h3 className="text-2xl font-bold">
              {recordings.filter(r => r.type === 'Audio').length}
            </h3>
          </div>
        </Card>
        <Card className="flex items-center p-6 border-l-4 border-l-indigo-500">
          <div className="bg-indigo-50 p-3 rounded-xl mr-4">
            <Video className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Video Files</p>
            <h3 className="text-2xl font-bold">
              {recordings.filter(r => r.type === 'Video').length}
            </h3>
          </div>
        </Card>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search media by title or author..." 
            className="pl-10" 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <Button 
          variant="outline" 
          className="cursor-pointer"
          onClick={() => {
            const nextType = filterType === 'All' ? 'Audio' : filterType === 'Audio' ? 'Video' : 'All';
            setFilterType(nextType);
            toast.info(`Filtered recordings: ${nextType}`);
          }}
        >
          <Filter className="w-4 h-4 mr-2" /> Filter: {filterType}
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((rec) => (
                <TableRow key={rec.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900">{rec.title}</span>
                      <span className="text-xs text-slate-400">Added on {rec.date}</span>
                      {playingId === rec.id && rec.url && (
                        <div className="mt-2 p-2 bg-blue-50 rounded-xl border border-blue-100 max-w-sm">
                          {rec.type === 'Audio' ? (
                            <audio controls autoPlay src={rec.url} className="w-full h-8" />
                          ) : (
                            <video controls autoPlay src={rec.url} className="w-full max-h-48 rounded-lg" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {rec.type === 'Audio' ? <Mic2 className="w-4 h-4 text-blue-500" /> : <Video className="w-4 h-4 text-indigo-500" />}
                      <span className="text-sm">{rec.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{rec.duration}</TableCell>
                  <TableCell>{rec.size}</TableCell>
                  <TableCell>
                    <Badge variant={rec.status === 'Published' ? 'secondary' : 'outline'}>
                      {rec.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button 
                        onClick={() => handlePlayToggle(rec.id, rec.title)}
                        variant={playingId === rec.id ? 'default' : 'ghost'} 
                        size="icon" 
                        className={`h-8 w-8 cursor-pointer ${playingId === rec.id ? 'bg-blue-600 text-white' : ''}`}
                        title={playingId === rec.id ? "Pause" : "Play"}
                       >
                         {playingId === rec.id ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                       </Button>
                       <Button 
                        onClick={() => handleDownload(rec)}
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 cursor-pointer"
                        title="Download"
                       >
                         <Download className="w-4 h-4" />
                       </Button>
                       <Button 
                        onClick={() => handleDelete(rec.id, rec.title)}
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Delete"
                       >
                         <Trash2 className="w-4 h-4" />
                       </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

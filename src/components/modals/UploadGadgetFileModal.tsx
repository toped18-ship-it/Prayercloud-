import React, { useState, useEffect } from 'react';
import { 
  X, 
  UploadCloud, 
  CheckCircle2, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Download, 
  Copy,
  Smartphone,
  Laptop,
  Loader2
} from 'lucide-react';
import { Button } from '../ui/button';
import { FileUploadZone } from '../ui/FileUploadZone';
import { formatFileSize, type UploadedFileResult } from '../../lib/fileUpload';
import { toast } from 'sonner';

interface UploadGadgetFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (file: UploadedFileResult) => void;
  defaultCategory?: string;
}

interface StoredUpload {
  name: string;
  url: string;
  size: number;
  createdAt: string;
  category?: string;
}

export function UploadGadgetFileModal({
  isOpen,
  onClose,
  onSuccess,
  defaultCategory = 'General Document'
}: UploadGadgetFileModalProps) {
  const [activeFile, setActiveFile] = useState<UploadedFileResult | null>(null);
  const [fileTitle, setFileTitle] = useState('');
  const [category, setCategory] = useState(defaultCategory);
  const [recentUploads, setRecentUploads] = useState<StoredUpload[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchRecentUploads();
    }
  }, [isOpen]);

  const fetchRecentUploads = async () => {
    try {
      setLoadingRecent(true);
      const res = await fetch('/api/uploads');
      if (res.ok) {
        const data = await res.json();
        setRecentUploads(data.slice(0, 5));
      }
    } catch {
      // Ignore
    } finally {
      setLoadingRecent(false);
    }
  };

  const handleFileUploaded = (file: UploadedFileResult) => {
    setActiveFile(file);
    if (!fileTitle) {
      // Auto-set title from file name without extension
      const cleanName = file.originalName.replace(/\.[^/.]+$/, '');
      setFileTitle(cleanName);
    }
  };

  const handleSaveAndClose = () => {
    if (!activeFile) {
      toast.error('Please select or upload a file first');
      return;
    }

    toast.success(`File "${fileTitle || activeFile.originalName}" saved to your cloud library!`);
    onSuccess?.(activeFile);
    setActiveFile(null);
    setFileTitle('');
    onClose();
  };

  const copyFileLink = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Upload from Device</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Laptop className="w-3.5 h-3.5" /> Computers & <Smartphone className="w-3.5 h-3.5" /> Smartphones supported
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* File Upload Zone */}
          <FileUploadZone
            onFileUploaded={handleFileUploaded}
            label="Upload Document, Image, or Audio"
            sublabel="Select files from your phone gallery, camera, voice memos, or computer storage"
          />

          {/* Metadata inputs once a file is chosen */}
          {activeFile && (
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">File Details</span>
                <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Ready to Save
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Display Title</label>
                <input
                  type="text"
                  value={fileTitle}
                  onChange={(e) => setFileTitle(e.target.value)}
                  placeholder="Give this file a descriptive name"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="General Document">General Document</option>
                  <option value="Field Testimony">Field Testimony</option>
                  <option value="Audio Voice Memo">Audio Voice Memo</option>
                  <option value="Missionary Resource">Missionary Resource</option>
                  <option value="Photo Report">Photo Report</option>
                  <option value="Prayer Fuel">Prayer Fuel</option>
                </select>
              </div>

              {/* Preview Box */}
              {activeFile.fileType.startsWith('image/') && (
                <div className="rounded-xl overflow-hidden border border-slate-200 bg-black/5 flex items-center justify-center max-h-48">
                  <img 
                    src={activeFile.url} 
                    alt="Preview" 
                    className="max-h-48 w-auto object-contain rounded-lg"
                  />
                </div>
              )}

              {activeFile.fileType.startsWith('audio/') && (
                <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-purple-700 font-semibold text-xs">
                    <Music className="w-4 h-4" /> Audio Playback
                  </div>
                  <audio controls src={activeFile.url} className="w-full h-8" />
                </div>
              )}
            </div>
          )}

          {/* Recent Uploads from Gadgets */}
          {recentUploads.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Recent Gadget Uploads
                </h4>
                {loadingRecent && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-400" />
                )}
              </div>
              <div className="space-y-2">
                {recentUploads.map((rec) => (
                  <div
                    key={rec.name}
                    className="flex items-center justify-between p-3 bg-white border border-slate-100 hover:border-slate-200 rounded-xl shadow-2xs transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        {rec.name.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                          <ImageIcon className="w-4 h-4" />
                        ) : rec.name.match(/\.(mp3|wav|m4a|aac)$/i) ? (
                          <Music className="w-4 h-4" />
                        ) : (
                          <FileText className="w-4 h-4" />
                        )}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-800 truncate">{rec.name}</p>
                        <p className="text-[11px] text-slate-400">{formatFileSize(rec.size)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyFileLink(rec.url)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Copy Link"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <a
                        href={rec.url}
                        download={rec.name}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        title="Download to gadget"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-100 bg-slate-50/50">
          <Button variant="ghost" onClick={onClose} className="rounded-xl">
            Cancel
          </Button>
          <Button
            onClick={handleSaveAndClose}
            disabled={!activeFile}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md shadow-blue-500/20"
          >
            Save File
          </Button>
        </div>
      </div>
    </div>
  );
}

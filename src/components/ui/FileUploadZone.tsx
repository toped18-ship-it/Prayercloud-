import React, { useState, useRef } from 'react';
import { 
  Upload, 
  Camera, 
  Mic, 
  FileText, 
  Image as ImageIcon, 
  Music, 
  Video, 
  X, 
  CheckCircle2, 
  Loader2,
  Smartphone,
  Laptop
} from 'lucide-react';
import { Button } from './button';
import { uploadFileFromDevice, formatFileSize, type UploadedFileResult } from '../../lib/fileUpload';
import { toast } from 'sonner';

interface FileUploadZoneProps {
  onFileUploaded?: (result: UploadedFileResult) => void;
  accept?: string;
  maxSizeBytes?: number; // default 25MB
  label?: string;
  sublabel?: string;
  allowCamera?: boolean;
  allowAudio?: boolean;
  className?: string;
  compact?: boolean;
}

export function FileUploadZone({
  onFileUploaded,
  accept = '*/*',
  maxSizeBytes = 25 * 1024 * 1024, // 25MB default
  label = 'Upload from your computer or phone',
  sublabel = 'Drag & drop files or browse from your device (Images, Audio, Docs, Videos)',
  allowCamera = true,
  allowAudio = true,
  className = '',
  compact = false,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedResult, setUploadedResult] = useState<UploadedFileResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > maxSizeBytes) {
      toast.error(`File size exceeds limit (${formatFileSize(maxSizeBytes)})`);
      return;
    }

    try {
      setUploading(true);
      setProgress(10);
      const result = await uploadFileFromDevice(file, (p) => setProgress(p));
      setUploadedResult(result);
      toast.success(`Uploaded "${file.name}" (${formatFileSize(result.size)}) from gadget`);
      onFileUploaded?.(result);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload file';
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setUploadedResult(null);
    setProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
  };

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
        {allowCamera && (
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        )}
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="gap-1.5 h-8 text-xs font-medium"
        >
          {uploading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Upload className="w-3.5 h-3.5 text-blue-600" />
          )}
          <span>{uploading ? `${progress}%` : 'Attach File'}</span>
        </Button>
        {allowCamera && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            title="Take photo on phone/webcam"
            disabled={uploading}
            onClick={() => cameraInputRef.current?.click()}
          >
            <Camera className="w-4 h-4 text-slate-500 hover:text-blue-600" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Hidden Native File Inputs with Mobile Device Direct Capture Support */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      {allowCamera && (
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      )}
      {allowAudio && (
        <input
          ref={audioInputRef}
          type="file"
          accept="audio/*"
          capture="user"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      )}

      {/* Dropzone & Device Action Card */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer select-none ${
          isDragging
            ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
            : uploadedResult
            ? 'border-emerald-300 bg-emerald-50/30'
            : 'border-slate-200 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
        }`}
      >
        {uploadedResult ? (
          <div className="flex items-center justify-between gap-4 p-2 bg-white rounded-xl border border-emerald-100 shadow-sm text-left">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                {uploadedResult.fileType.startsWith('image/') ? (
                  <ImageIcon className="w-5 h-5" />
                ) : uploadedResult.fileType.startsWith('audio/') ? (
                  <Music className="w-5 h-5" />
                ) : uploadedResult.fileType.startsWith('video/') ? (
                  <Video className="w-5 h-5" />
                ) : (
                  <FileText className="w-5 h-5" />
                )}
              </div>
              <div className="truncate">
                <p className="text-sm font-bold text-slate-800 truncate">{uploadedResult.originalName}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>{formatFileSize(uploadedResult.size)}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={uploadedResult.url}
                target="_blank"
                rel="noreferrer"
                download={uploadedResult.originalName}
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-semibold text-blue-600 hover:underline px-2 py-1 rounded hover:bg-blue-50"
              >
                View
              </a>
              <button
                type="button"
                onClick={clearFile}
                className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shadow-inner">
                {uploading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                ) : (
                  <Upload className="w-6 h-6 text-blue-600" />
                )}
              </div>
            </div>

            <h4 className="text-sm font-bold text-slate-900 mb-1">{label}</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">{sublabel}</p>

            {uploading ? (
              <div className="max-w-xs mx-auto space-y-2">
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs font-medium text-blue-600">Uploading {progress}%...</p>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border-slate-200 bg-white text-xs shadow-xs hover:border-blue-300 gap-1.5"
                >
                  <Laptop className="w-3.5 h-3.5 text-blue-500" /> Browse Computer / Files
                </Button>

                {allowCamera && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => cameraInputRef.current?.click()}
                    className="rounded-xl border-slate-200 bg-white text-xs shadow-xs hover:border-emerald-300 gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5 text-emerald-500" /> Phone Camera / Photo
                  </Button>
                )}

                {allowAudio && (
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => audioInputRef.current?.click()}
                    className="rounded-xl border-slate-200 bg-white text-xs shadow-xs hover:border-purple-300 gap-1.5"
                  >
                    <Mic className="w-3.5 h-3.5 text-purple-500" /> Voice / Audio
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

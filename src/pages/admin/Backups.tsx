import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Database, Download, RefreshCw, Trash2, Shield, Clock, HardDrive, ChevronRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface BackupItem {
  id: string;
  name: string;
  size: string;
  date: string;
  status: 'Healthy' | 'Syncing';
  type: string;
}

const initialBackups: BackupItem[] = [
  { id: '1', name: 'daily_full_backup_2026-05-10.sql', size: '1.2 GB', date: '2026-05-10 03:00 AM', status: 'Healthy', type: 'Full' },
  { id: '2', name: 'inc_users_delta_2026-05-09.sql', size: '45.8 MB', date: '2026-05-09 03:00 AM', status: 'Healthy', type: 'Incremental' },
  { id: '3', name: 'media_assets_backup_2026-05-08.zip', size: '14.5 GB', date: '2026-05-08 03:00 AM', status: 'Syncing', type: 'Media' },
];

export default function AdminBackups() {
  const [backups, setBackups] = useState<BackupItem[]>(initialBackups);
  const [isBackingUp, setIsBackingUp] = useState(false);

  const handleStartBackup = () => {
    setIsBackingUp(true);
    toast.info('Starting manual database & asset snapshot...');
    setTimeout(() => {
      const now = new Date();
      const newBackup: BackupItem = {
        id: String(Date.now()),
        name: `manual_snapshot_${now.toISOString().slice(0, 10)}.sql`,
        size: '1.24 GB',
        date: 'Just now',
        status: 'Healthy',
        type: 'Full',
      };
      setBackups([newBackup, ...backups]);
      setIsBackingUp(false);
      toast.success('Manual backup completed successfully and archived!');
    }, 1500);
  };

  const handleRestore = (name: string) => {
    toast.info(`Preparing rollback checkpoint for ${name}...`);
    setTimeout(() => {
      toast.success(`Platform successfully verified against snapshot ${name}`);
    }, 1200);
  };

  const handleDownload = (name: string) => {
    toast.success(`Downloading encrypted archive: ${name}`);
  };

  const handleDelete = (id: string, name: string) => {
    setBackups(prev => prev.filter(b => b.id !== id));
    toast.success(`Backup archive ${name} deleted.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Backup & Restore</h1>
          <p className="text-slate-500">Securely backup platform data and restore from previous points.</p>
        </div>
        <Button 
          onClick={handleStartBackup}
          disabled={isBackingUp}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isBackingUp ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating Snapshot...</>
          ) : (
            <><Database className="w-4 h-4 mr-2" /> Start Manual Backup</>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-emerald-500">
            <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-emerald-500" />
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">System Status</p>
                        <p className="text-lg font-bold">Protected</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                    <Clock className="w-6 h-6 text-blue-500" />
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Last Backup</p>
                        <p className="text-lg font-bold">Just now</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500">
            <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                    <HardDrive className="w-6 h-6 text-amber-500" />
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Storage Pool</p>
                        <p className="text-lg font-bold">42% Used</p>
                    </div>
                </div>
            </CardContent>
        </Card>
        <Card className="border-l-4 border-l-indigo-500">
            <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                    <RefreshCw className="w-6 h-6 text-indigo-500" />
                    <div>
                        <p className="text-xs font-bold text-slate-500 uppercase">Auto-Sync</p>
                        <p className="text-lg font-bold">Active</p>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Snapshots</CardTitle>
          <CardDescription>Click restore to roll back the system to a specific point in time.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y border-t">
            {backups.map((backup) => (
              <div key={backup.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                    <Database className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{backup.name}</span>
                        <Badge variant="outline" className="text-[9px] uppercase tracking-tighter">{backup.type}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                        <span>{backup.size}</span>
                        <span>•</span>
                        <span>{backup.date}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-6">
                    <div className="flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${backup.status === 'Healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-xs font-medium text-slate-600">{backup.status}</span>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                          onClick={() => handleRestore(backup.name)}
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-rose-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700 cursor-pointer"
                        >
                            Restore
                        </Button>
                        <Button 
                          onClick={() => handleDownload(backup.name)}
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 cursor-pointer"
                          title="Download archive"
                        >
                            <Download className="w-4 h-4" />
                        </Button>
                        <Button 
                          onClick={() => handleDelete(backup.id, backup.name)}
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-rose-500 hover:bg-rose-50 cursor-pointer"
                          title="Delete archive"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-100 shadow-none">
          <CardHeader>
              <div className="flex items-center gap-2 text-blue-900">
                  <Shield className="w-5 h-5" />
                  <CardTitle className="text-base">Off-site Replication</CardTitle>
              </div>
          </CardHeader>
          <CardContent>
              <p className="text-sm text-blue-700 leading-relaxed">
                  Your platform is currently configured to replicate all backups to <strong>AWS S3 (Frankfurt)</strong> and <strong>Google Cloud Storage (London)</strong>. In the event of a total region failure, PRAYERCLOUD can be restored within 15 minutes.
              </p>
              <Button 
                onClick={() => toast.info('Replication is synchronized across Frankfurt (AWS S3) and London (GCS).')}
                variant="link" 
                className="text-blue-700 font-bold p-0 mt-2 h-auto cursor-pointer flex items-center"
              >
                Configure replication settings <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
          </CardContent>
      </Card>
    </div>
  );
}

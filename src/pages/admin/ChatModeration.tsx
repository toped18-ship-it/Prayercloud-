import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Trash2, Shield, AlertTriangle, CheckCircle, Search, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface ReportItem {
  id: string;
  user: string;
  message: string;
  type: string;
  status: 'Pending' | 'Resolved';
}

const initialReports: ReportItem[] = [
  { id: '1', user: 'Brother_Mark', message: 'Urgent: Sensitive coordinates leaked in general chat.', type: 'Security Violation', status: 'Pending' },
  { id: '2', user: 'Anonymous_User', message: 'Promotional spam link targeting missionary funds.', type: 'Spam', status: 'Pending' },
  { id: '3', user: 'FieldWorker_9', message: 'Inappropriate language during live prayer session.', type: 'Harassment', status: 'Pending' },
];

export default function AdminChatModeration() {
  const [reports, setReports] = useState<ReportItem[]>(initialReports);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = reports.filter(r => 
    r.user.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id: string, user: string) => {
    setReports(reports.filter(r => r.id !== id));
    toast.success(`Message from ${user} deleted from all chat logs.`);
  };

  const handleBan = (id: string, user: string) => {
    setReports(reports.filter(r => r.id !== id));
    toast.warning(`User ${user} suspended from live chat channels.`);
  };

  const handleDismiss = (id: string, user: string) => {
    setReports(reports.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
    toast.info(`Flag dismissed for ${user}.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Chat Moderation</h1>
          <p className="text-slate-500">Monitor real-time communication and handle user reports.</p>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                {reports.filter(r => r.status === 'Pending').length} Pending Reports
            </Badge>
            <Button 
              variant="outline"
              onClick={() => toast.info('Auto-moderation filters active (Profanity filter: ON, URL blocker: ON)')}
              className="cursor-pointer"
            >
              <Settings className="w-4 h-4 mr-2" /> Moderation Settings
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
            <CardContent className="pt-6">
                <div className="text-2xl font-bold">1.2k</div>
                <p className="text-xs text-slate-500">Messages Today</p>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="text-2xl font-bold">14</div>
                <p className="text-xs text-slate-500">Auto-blocked</p>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-slate-500">Banned Users</p>
            </CardContent>
        </Card>
        <Card>
            <CardContent className="pt-6">
                <div className="text-2xl font-bold">99.8%</div>
                <p className="text-xs text-slate-500">Safe Score</p>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Reports</CardTitle>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input 
              placeholder="Search reports or users..." 
              className="pl-10" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {filteredReports.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">No reports found.</p>
          ) : (
            filteredReports.map((report) => (
              <div key={report.id} className="p-4 border rounded-xl flex items-start justify-between bg-white hover:border-blue-200 transition-colors">
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${report.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                    {report.status === 'Pending' ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{report.user}</span>
                      <Badge variant="secondary" className="text-[10px]">{report.type}</Badge>
                      <span className="text-xs text-slate-400">
                        {report.status === 'Resolved' ? 'Resolved' : 'Pending review'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">"{report.message}"</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleDelete(report.id, report.user)}
                    variant="ghost" 
                    size="sm" 
                    className="text-rose-500 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                  <Button 
                    onClick={() => handleBan(report.id, report.user)}
                    variant="ghost" 
                    size="sm" 
                    className="text-slate-500 hover:text-rose-600 cursor-pointer"
                  >
                    <Shield className="w-4 h-4 mr-1" /> Ban
                  </Button>
                  {report.status === 'Pending' && (
                    <Button 
                      onClick={() => handleDismiss(report.id, report.user)}
                      size="sm" 
                      className="bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                    >
                      Dismiss
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

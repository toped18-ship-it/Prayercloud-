
import React from 'react';
import { 
  Search, 
  Download,
  Calendar,
  User,
  Info,
  AlertTriangle,
  AlertOctagon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { toast } from 'sonner';

const mockLogs = [
  { id: '1', user: 'Admin Sarah', action: 'Update Site Settings', module: 'Branding', time: '2026-05-10 14:12:05', status: 'Success', severity: 'Info', ip: '192.168.1.1' },
  { id: '2', user: 'Abraham M.', action: 'Delete User Account', module: 'Users', time: '2026-05-10 13:45:22', status: 'Success', severity: 'Warning', ip: '45.12.33.220' },
  { id: '3', user: 'System', action: 'Weekly Database Backup', module: 'System', time: '2026-05-10 12:00:00', status: 'Success', severity: 'Info', ip: 'localhost' },
  { id: '4', user: 'Admin Wong', action: 'Login Attempt Failure', module: 'Auth', time: '2026-05-10 11:20:14', status: 'Failed', severity: 'Critical', ip: '185.x.x.x' },
  { id: '5', user: 'Sarah Jenkins', action: 'Create Strategy Group', module: 'Missionary Hub', time: '2026-05-10 09:12:44', status: 'Success', severity: 'Info', ip: '192.168.1.1' },
  { id: '6', user: 'Admin Sarah', action: 'Update Hero Title', module: 'Homepage', time: '2026-05-10 08:30:11', status: 'Success', severity: 'Info', ip: '192.168.1.1' },
  { id: '7', user: 'System', action: 'Automatic SSL Rotation', module: 'Security', time: '2026-05-10 00:05:12', status: 'Success', severity: 'Info', ip: 'localhost' },
];

export default function AdminAuditLogs() {
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredLogs = mockLogs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Audit Logs</h1>
          <p className="text-slate-500">Traceable history of all administrative actions and system events.</p>
        </div>
        <Button variant="outline" onClick={() => toast.success('Exporting logs to CSV...')} className="h-10 px-4">
          <Download className="h-4 w-4 mr-2" /> Export Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative col-span-1 md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search logs by keyword..." 
            className="pl-10 h-11 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select defaultValue="all">
          <SelectTrigger className="h-11 bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="all">
          <SelectTrigger className="h-11 bg-white">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Severities</SelectItem>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Time</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Admin</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Action</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Module</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">IP Address</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Severity</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Calendar className="h-3.5 w-3.5" />
                        {log.time}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="h-3.5 w-3.5 text-slate-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-700">{log.user}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm font-medium text-slate-900">{log.action}</p>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="font-medium text-[10px] uppercase tracking-wide bg-slate-50 border-slate-200">
                        {log.module}
                      </Badge>
                    </td>
                    <td className="p-4 font-mono text-xs text-slate-400">
                      {log.ip}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {log.severity === 'Info' && <Info className="h-3.5 w-3.5 text-blue-500" />}
                        {log.severity === 'Warning' && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                        {log.severity === 'Critical' && <AlertOctagon className="h-3.5 w-3.5 text-rose-500" />}
                        <span className={cn(
                          "text-xs font-bold",
                          log.severity === 'Info' ? "text-blue-600" :
                          log.severity === 'Warning' ? "text-amber-600" : "text-rose-600"
                        )}>
                          {log.severity}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={cn(
                        "rounded-full border-none px-2 py-0 text-[10px] font-bold uppercase tracking-widest",
                        log.status === 'Success' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                      )}>
                        {log.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing {filteredLogs.length} of {mockLogs.length} logs</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-primary text-white border-none">
                1
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const cn = (...classes: string[]) => classes.filter(Boolean).join(' ');

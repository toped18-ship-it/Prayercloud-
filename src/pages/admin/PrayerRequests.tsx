import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Heart, MessageSquare, Shield, Check, Trash2, Filter } from 'lucide-react';
import { toast } from 'sonner';

const mockPrayers = [
  { id: '1', author: 'Sister Maria', content: 'Pray for the medical mission in Sudan...', category: 'Mission', urgency: 'High', date: '2026-05-10' },
  { id: '2', author: 'Pastor James', content: 'New church plant in Kyoto needs wisdom.', category: 'Planting', urgency: 'Normal', date: '2026-05-09' },
  { id: '3', author: 'Brother David', content: 'Wisdom for Bible translation in Amazonia.', category: 'Translation', urgency: 'High', date: '2026-05-08' },
];

export default function AdminPrayerRequests() {
  const [prayers, setPrayers] = React.useState(mockPrayers);

  const handleApprove = (id: string, author: string) => {
    toast.success(`Request from ${author} approved`);
    setPrayers(prev => prev.filter(p => p.id !== id));
  };

  const handleDelete = (id: string, author: string) => {
    if (confirm(`Reject and delete prayer request from ${author}?`)) {
       toast.error(`Request from ${author} deleted`);
       setPrayers(prev => prev.filter(p => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prayer Requests Management</h1>
          <p className="text-slate-500">Review, categorize, and moderate global prayer submissions.</p>
        </div>
        <Button variant="outline" onClick={() => toast.info('Filter options opening...')}><Filter className="w-4 h-4 mr-2" /> Filter by Category</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-rose-500 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toast.info('Viewing total history...')}>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Total Requests</p>
                        <h3 className="text-3xl font-bold text-slate-900">4,284</h3>
                    </div>
                    <Heart className="w-8 h-8 text-rose-500 opacity-20" />
                </div>
            </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toast.info('Viewing prayed list...')}>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Prayed For</p>
                        <h3 className="text-3xl font-bold text-slate-900">12.5k</h3>
                    </div>
                    <Shield className="w-8 h-8 text-blue-500 opacity-20" />
                </div>
            </CardContent>
        </Card>
        <Card className="border-l-4 border-l-amber-500 cursor-pointer hover:bg-slate-50 transition-colors" onClick={() => toast.info('Viewing pending queue...')}>
            <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">Pending Review</p>
                        <h3 className="text-3xl font-bold text-slate-900">{prayers.length}</h3>
                    </div>
                    <MessageSquare className="w-8 h-8 text-amber-500 opacity-20" />
                </div>
            </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Content Preview</TableHead>
                <TableHead>Urgency</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prayers.map((prayer) => (
                <TableRow key={prayer.id}>
                  <TableCell className="font-bold whitespace-nowrap">{prayer.author}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-full">{prayer.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-md truncate text-slate-600">
                    {prayer.content}
                  </TableCell>
                  <TableCell>
                    <Badge variant={prayer.urgency === 'High' ? 'destructive' : 'secondary'}>
                      {prayer.urgency}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-emerald-600" onClick={() => handleApprove(prayer.id, prayer.author)}>
                            <Check className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500" onClick={() => handleDelete(prayer.id, prayer.author)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {prayers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-slate-500 font-medium">
                    No pending prayer requests to review.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Users, Shield, UserPlus, Star, MoreVertical } from 'lucide-react';
import { toast } from 'sonner';

const mockMissions = [
  { id: '1', name: 'Global Outreach', lead: 'Sarah Jenkins', type: 'Evangelism', members: 45, status: 'Active' },
  { id: '2', name: 'Northern Tribes Focus', lead: 'David Omotayo', type: 'Humanitarian', members: 12, status: 'Active' },
  { id: '3', name: 'Youth Mission Network', lead: 'Emma Wilson', type: 'Education', members: 89, status: 'On Hold' },
];

export default function AdminMissionaryHubControl() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Missionary Hub Management</h1>
          <p className="text-slate-500">Oversee mission groups, missionary assignments, and field reports.</p>
        </div>
        <Button className="bg-blue-600" onClick={() => toast.info('Missionary assignment panel opening...')}>
          <UserPlus className="w-4 h-4 mr-2" /> Assign Missionary
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-600 text-white cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => toast.info('Viewing total missionary list...')}>
          <CardContent className="p-6">
            <Users className="w-8 h-8 mb-4 opacity-50" />
            <h3 className="text-3xl font-bold">1,248</h3>
            <p className="text-blue-100 text-sm">Total Field Missionaries</p>
          </CardContent>
        </Card>
        <Card className="bg-rose-600 text-white cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => toast.info('Viewing mission groups...')}>
          <CardContent className="p-6">
            <Star className="w-8 h-8 mb-4 opacity-50" />
            <h3 className="text-3xl font-bold">42</h3>
            <p className="text-rose-100 text-sm">Active Mission Groups</p>
          </CardContent>
        </Card>
        <Card className="bg-indigo-600 text-white cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => toast.info('Viewing pending verifications...')}>
          <CardContent className="p-6">
            <Shield className="w-8 h-8 mb-4 opacity-50" />
            <h3 className="text-3xl font-bold">28</h3>
            <p className="text-indigo-100 text-sm">Pending Verifications</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mission Groups</CardTitle>
          <CardDescription>Manage group leads and resource allocation.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockMissions.map((group) => (
            <div key={group.id} className="flex items-center justify-between p-4 border rounded-xl hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500">
                  {group.name.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{group.name}</p>
                  <p className="text-xs text-slate-500">Lead: {group.lead} • {group.members} members</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={group.status === 'Active' ? 'outline' : 'secondary'} className="text-[10px]">
                  {group.type}
                </Badge>
                <div className="flex items-center gap-2">
                   <Button variant="ghost" size="sm" onClick={() => toast.info(`Managing ${group.name}...`)}>Manage</Button>
                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={() => toast.info(`Options for ${group.name}`)}>
                     <MoreVertical className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

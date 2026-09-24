import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, MapPin, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const mockUPGs = [
  { id: '1', name: 'Pashtuns', country: 'Afghanistan', population: '15.4M', religion: 'Islam', status: 'Unreached' },
  { id: '2', name: 'Kurds', country: 'Turkey', population: '14.5M', religion: 'Islam', status: 'Partially Reached' },
  { id: '3', name: 'Hausa', country: 'Nigeria', population: '70M', religion: 'Islam', status: 'Unreached' },
  { id: '4', name: 'Zhuang', country: 'China', population: '18M', religion: 'Ethnic Religions', status: 'Unreached' },
];

export default function AdminUnreachedPlaces() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [groups, setGroups] = React.useState(mockUPGs);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Remove ${name} from tracking?`)) {
      setGroups(prev => prev.filter(g => g.id !== id));
      toast.success(`${name} group removed`);
    }
  };

  const filteredGroups = groups.filter(g => 
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Unreached People Groups (UPGs)</h1>
          <p className="text-slate-500">Track and update the status of unreached groups globally.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => toast.info('Add UPG wizard opening...')}>
          <Plus className="w-4 h-4 mr-2" /> Add Group
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
        <Input 
          placeholder="Search people groups or religions..." 
          className="pl-10" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Religion</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGroups.map((upg) => (
                <TableRow key={upg.id}>
                  <TableCell className="font-medium">{upg.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <MapPin className="w-3.5 h-3.5" />
                      {upg.country}
                    </div>
                  </TableCell>
                  <TableCell>{upg.population}</TableCell>
                  <TableCell>{upg.religion}</TableCell>
                  <TableCell>
                    <Badge variant={upg.status === 'Reached' ? 'secondary' : 'destructive'} className="rounded-full">
                      {upg.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                       <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Editing ${upg.name}`)}>
                         <Edit2 className="h-4 w-4" />
                       </Button>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500" onClick={() => handleDelete(upg.id, upg.name)}>
                         <Trash2 className="h-4 w-4" />
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

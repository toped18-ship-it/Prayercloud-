import React from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Badge } from '../../components/ui/badge';
import { Search, Plus, Filter, Edit2, Trash2, Globe } from 'lucide-react';
import { toast } from 'sonner';

const mockCountries = [
  { id: '1', name: 'Afghanistan', code: 'AF', population: '40.1M', status: 'Priority', progress: '12%', missionaries: 45 },
  { id: '2', name: 'Turkey', code: 'TR', population: '84.8M', status: 'Growing', progress: '45%', missionaries: 120 },
  { id: '3', name: 'Nigeria', code: 'NG', population: '211.4M', status: 'Active', progress: '65%', missionaries: 450 },
  { id: '4', name: 'Thailand', code: 'TH', population: '71.6M', status: 'Priority', progress: '22%', missionaries: 88 },
];

export default function AdminCountries() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [countries, setCountries] = React.useState(mockCountries);

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name}?`)) {
      setCountries(prev => prev.filter(c => c.id !== id));
      toast.success(`${name} removed from active operations`);
    }
  };

  const handleAddCountry = () => {
    toast.info('Add Country wizard opening...');
    // Real implementation would open a Dialog
  };

  const filteredCountries = countries.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Countries & Regions</h1>
          <p className="text-slate-500">Manage operational data for target nations.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddCountry}>
          <Plus className="w-4 h-4 mr-2" /> Add Country
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input 
            placeholder="Search countries..." 
            className="pl-10" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => toast.info('Filter options coming soon')}>
          <Filter className="w-4 h-4 mr-2" /> Filters
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Country</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Population</TableHead>
                <TableHead>Missionaries</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCountries.map((country) => (
                <TableRow key={country.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                       <Globe className="w-4 h-4 text-slate-400" />
                       {country.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={country.status === 'Priority' ? 'destructive' : 'secondary'} className="rounded-full">
                      {country.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{country.population}</TableCell>
                  <TableCell>{country.missionaries}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                        <div 
                          className="h-full bg-blue-600" 
                          style={{ width: country.progress }} 
                        />
                      </div>
                      <span className="text-xs text-slate-500">{country.progress}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toast.info(`Editing ${country.name}`)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500" onClick={() => handleDelete(country.id, country.name)}>
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

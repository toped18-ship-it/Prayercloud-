
import React from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Mail, 
  UserPlus, 
  Download,
  Trash2,
  Ban,
  CheckCircle2,
  ExternalLink,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback } from '../../components/ui/avatar';
import { Badge } from '../../components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '../../components/ui/dropdown-menu';
import { Checkbox } from '../../components/ui/checkbox';
import { toast } from 'sonner';

const mockUsers = [
  { id: 'admin-0', name: 'System Administrator', email: 'admin@prayercloud.org', role: 'Super Admin', status: 'Active', country: 'Global', joined: 'May 10, 2026' },
  { id: '1', name: 'Abraham Maslow', email: 'abraham@mission.org', role: 'Super Admin', status: 'Active', country: 'United States', joined: 'Oct 12, 2025' },
  { id: '2', name: 'Sarah Jenkins', email: 'sarah.j@missions.net', role: 'Missionary', status: 'Active', country: 'Turkey', joined: 'Nov 05, 2025' },
  { id: '3', name: 'David Omotayo', email: 'd.temitope@gmail.com', role: 'Pastor', status: 'Active', country: 'Nigeria', joined: 'Dec 01, 2025' },
  { id: '4', name: 'Elena Petrova', email: 'elena@intercede.io', role: 'Prayer Warrior', status: 'Pending', country: 'Russia', joined: 'Jan 14, 2026' },
  { id: '5', name: 'Marcus Wong', email: 'marcus@field.org', role: 'Missionary', status: 'Suspended', country: 'Thailand', joined: 'Feb 20, 2026' },
  { id: '6', name: 'Chanda Nkosi', email: 'chanda@church.za', role: 'Evangelist', status: 'Active', country: 'South Africa', joined: 'Mar 10, 2026' },
  { id: '7', name: 'Maria Garcia', email: 'maria.g@outreach.es', role: 'Intercessor', status: 'Active', country: 'Spain', joined: 'Apr 02, 2026' },
];

export default function AdminUsers() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [users, setUsers] = React.useState(mockUsers);

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleBulkAction = (action: string) => {
    if (action === 'Delete') {
      if (confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
        setUsers(prev => prev.filter(u => !selectedUsers.includes(u.id)));
        toast.success(`${selectedUsers.length} users permanently removed`);
        setSelectedUsers([]);
      }
    } else {
      toast.success(`Performing ${action} on ${selectedUsers.length} users`);
      setSelectedUsers([]);
    }
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
       setUsers(prev => prev.filter(u => u.id !== id));
       toast.success(`${name} account removed`);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">User Management</h1>
          <p className="text-slate-500">Oversee {users.length} platform members across all regions.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="h-10 px-4" onClick={() => toast.info('Generating PDF report...')}>
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="h-10 px-6 bg-primary shadow-lg shadow-primary/20" onClick={() => toast.info('New user onboarding flow opening...')}>
            <UserPlus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search by name, email, or country..." 
            className="pl-10 h-11 bg-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3">
          {selectedUsers.length > 0 && (
            <div className="flex items-center gap-2 pr-4 border-r border-slate-200">
              <span className="text-sm font-bold text-slate-600">{selectedUsers.length} selected</span>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Delete')} className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleBulkAction('Suspend')}>
                <Ban className="h-4 w-4" />
              </Button>
            </div>
          )}
          <Button variant="outline" className="h-11 px-4" onClick={() => toast.info('Advanced filters coming soon')}>
            <Filter className="h-4 w-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      <Card className="border-none shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  <th className="p-4 w-12">
                    <Checkbox 
                      checked={selectedUsers.length === users.length && users.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) setSelectedUsers(users.map(u => u.id));
                        else setSelectedUsers([]);
                      }}
                    />
                  </th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">User Profile</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Role</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Region</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Joined</th>
                  <th className="p-4 w-12"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4">
                      <Checkbox 
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => toggleUserSelection(user.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-blue-100 text-blue-600 font-bold text-xs">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                          <p className="text-[10px] text-slate-500 mt-1">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline" className="bg-white font-medium text-slate-600 border-slate-200">
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-slate-600">{user.country}</p>
                    </td>
                    <td className="p-4">
                      <Badge className={cn(
                        "font-bold uppercase text-[9px] tracking-widest border-none px-2",
                        user.status === 'Active' ? "bg-emerald-100 text-emerald-700" :
                        user.status === 'Suspended' ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"
                      )}>
                        {user.status === 'Active' && <CheckCircle2 className="h-2.5 w-2.5 mr-1" />}
                        {user.status === 'Suspended' && <Ban className="h-2.5 w-2.5 mr-1" />}
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm text-slate-500 font-medium">
                      {user.joined}
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuGroup>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => toast.info(`Editing ${user.name}`)}>
                              <Users className="h-4 w-4 mr-2" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => toast.info(`Impersonating ${user.name}`)}>
                              <ExternalLink className="h-4 w-4 mr-2" /> Impersonate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => toast.success(`Mailing ${user.email}`)}>
                              <Mail className="h-4 w-4 mr-2" /> Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-rose-600 focus:text-rose-600" onClick={() => handleDeleteUser(user.id, user.name)}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Account
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-500">Showing {filteredUsers.length} of {users.length} users</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white" onClick={() => toast.info('Previous page')}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-primary text-white border-none">
                1
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white" onClick={() => toast.info('Page 2')}>
                2
              </Button>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0 bg-white" onClick={() => toast.info('Next page')}>
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

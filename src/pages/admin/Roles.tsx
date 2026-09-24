import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Shield, Plus, Lock, ChevronRight, Search } from 'lucide-react';
import { Input } from '../../components/ui/input';

const mockRoles = [
  { id: '1', name: 'Super Admin', permissions: 'All', users: 3, status: 'System' },
  { id: '2', name: 'Admin', permissions: 'Dashboard, Content, Users', users: 5, status: 'Active' },
  { id: '3', name: 'Moderator', permissions: 'Chat, Prayer Requests', users: 12, status: 'Active' },
  { id: '4', name: 'Editor', permissions: 'Homepage, Resources', users: 8, status: 'Active' },
];

export default function AdminRoles() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Roles & Permissions</h1>
          <p className="text-slate-500">Define access levels and fine-tune platform permissions.</p>
        </div>
        <Button className="bg-blue-600">
          <Plus className="w-4 h-4 mr-2" /> Create New Role
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 text-white border-none">
              <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                        <div className="text-3xl font-bold">14</div>
                        <p className="text-xs text-slate-400">Total Roles</p>
                    </div>
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-slate-500">Atomic Permissions</p>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold text-emerald-600">Active</div>
                  <p className="text-xs text-slate-500">RBAC Status</p>
              </CardContent>
          </Card>
          <Card>
              <CardContent className="pt-6 text-center">
                  <div className="text-2xl font-bold">System</div>
                  <p className="text-xs text-slate-500">Security Model</p>
              </CardContent>
          </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Role Management</CardTitle>
                <CardDescription>Click on a role to edit its specific permissions map.</CardDescription>
            </div>
            <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <Input placeholder="Filter roles..." className="pl-10 h-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y border-t">
            {mockRoles.map((role) => (
              <div key={role.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${role.status === 'System' ? 'bg-slate-900 text-white' : 'bg-blue-50 text-blue-600'}`}>
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{role.name}</span>
                        {role.status === 'System' && <Badge className="text-[9px] bg-slate-900">SYSTEM</Badge>}
                    </div>
                    <p className="text-xs text-slate-500">Permissions: {role.permissions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">{role.users} Users</p>
                    <p className="text-[10px] text-slate-400">Assigned</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
              <CardHeader>
                  <CardTitle className="text-lg">Permission Groups</CardTitle>
                  <CardDescription>Manage global lists of available permissions.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                  {['Dashboard Access', 'Content Management', 'User Management', 'Financial Records', 'API Control'].map(group => (
                      <div key={group} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="text-sm font-medium">{group}</span>
                          <Lock className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                  ))}
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                  <CardTitle className="text-lg">Security Auditor</CardTitle>
                  <CardDescription>Recent changes in the roles filesystem.</CardDescription>
              </CardHeader>
              <CardContent>
                  <div className="space-y-4">
                      {[
                          { action: 'Updated Editor Role', time: '12m ago', user: 'Admin' },
                          { action: 'New Permission: "Delete Prayer"', time: '1h ago', user: 'System' },
                          { action: 'Role Cloned: Moderation II', time: '3h ago', user: 'Admin' },
                      ].map((log, i) => (
                          <div key={i} className="flex justify-between items-center text-sm border-b pb-3 last:border-0">
                              <span className="text-slate-600">{log.action}</span>
                              <div className="text-right">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase">{log.time}</p>
                                  <p className="text-xs font-medium">{log.user}</p>
                              </div>
                          </div>
                      ))}
                  </div>
              </CardContent>
          </Card>
      </div>
    </div>
  );
}

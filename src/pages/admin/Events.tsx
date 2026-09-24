import React, { useState } from 'react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Calendar, Plus, MapPin, Users, Clock, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface EventItem {
  id: string;
  name: string;
  date: string;
  location: string;
  type: string;
  attendees: number;
  status: 'Upcoming' | 'Completed';
}

const initialEvents: EventItem[] = [
  { id: '1', name: 'Global Prayer Summit', date: '2026-06-15', location: 'Online/Global', type: 'Prayer', attendees: 1200, status: 'Upcoming' },
  { id: '2', name: 'Missionary Training: Security', date: '2026-06-20', location: 'London Hub', type: 'Training', attendees: 50, status: 'Upcoming' },
  { id: '3', name: 'Evangelism Strategy Meeting', date: '2026-05-01', location: 'Singapore', type: 'Conference', attendees: 300, status: 'Completed' },
];

export default function AdminEvents() {
  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [showScheduleDialog, setShowScheduleDialog] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const [newEventLocation, setNewEventLocation] = useState('');
  const [newEventType, setNewEventType] = useState('Prayer');
  const [newEventDate, setNewEventDate] = useState('2026-07-01');

  const handleScheduleEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventName.trim()) {
      toast.error('Please enter an event name');
      return;
    }
    const newEvent: EventItem = {
      id: String(Date.now()),
      name: newEventName.trim(),
      date: newEventDate,
      location: newEventLocation.trim() || 'Global Virtual Room',
      type: newEventType,
      attendees: 1,
      status: 'Upcoming',
    };
    setEvents([newEvent, ...events]);
    setShowScheduleDialog(false);
    setNewEventName('');
    setNewEventLocation('');
    toast.success(`Event "${newEvent.name}" scheduled successfully!`);
  };

  const handleEditEvent = (id: string, name: string) => {
    const updatedName = prompt('Update event name:', name);
    if (updatedName && updatedName.trim()) {
      setEvents(events.map(ev => ev.id === id ? { ...ev, name: updatedName.trim() } : ev));
      toast.success(`Event updated to "${updatedName.trim()}"`);
    }
  };

  const handleDeleteEvent = (id: string, name: string) => {
    setEvents(events.filter(ev => ev.id !== id));
    toast.success(`Event "${name}" deleted.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Events Management</h1>
          <p className="text-slate-500">Coordinate summits, training sessions, and global prayer events.</p>
        </div>
        <Button 
          onClick={() => setShowScheduleDialog(true)}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Schedule Event
        </Button>
      </div>

      {showScheduleDialog && (
        <Card className="p-5 border-blue-200 bg-blue-50/50 shadow-sm">
          <form onSubmit={handleScheduleEvent} className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 text-sm">Schedule New Mission Event</h3>
              <button 
                type="button" 
                onClick={() => setShowScheduleDialog(false)}
                className="text-xs text-slate-500 hover:text-slate-700"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Event Name"
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                value={newEventName}
                onChange={e => setNewEventName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Location / Virtual Link"
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                value={newEventLocation}
                onChange={e => setNewEventLocation(e.target.value)}
              />
              <input
                type="date"
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                value={newEventDate}
                onChange={e => setNewEventDate(e.target.value)}
              />
              <select
                className="px-3 py-2 text-sm bg-white border border-slate-200 rounded-lg"
                value={newEventType}
                onChange={e => setNewEventType(e.target.value)}
              >
                <option value="Prayer">Prayer Gathering</option>
                <option value="Training">Field Training</option>
                <option value="Conference">Strategic Summit</option>
                <option value="Outreach">Field Outreach</option>
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowScheduleDialog(false)}>
                Cancel
              </Button>
              <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700">
                Save & Broadcast Event
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-500">Total Events</p>
            <p className="text-2xl font-black">{events.length}</p>
          </div>
          <Calendar className="w-10 h-10 text-blue-100" />
        </div>
        <div className="bg-white p-6 rounded-2xl border flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-500">Total Registrations</p>
            <p className="text-2xl font-black">
              {events.reduce((sum, e) => sum + e.attendees, 0).toLocaleString()}
            </p>
          </div>
          <Users className="w-10 h-10 text-indigo-100" />
        </div>
        <div className="bg-white p-6 rounded-2xl border flex items-center justify-between shadow-sm">
          <div>
            <p className="text-sm text-slate-500">Next Event In</p>
            <p className="text-2xl font-black">Upcoming</p>
          </div>
          <Clock className="w-10 h-10 text-emerald-100" />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Attendees</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-bold text-slate-900">{event.name}</TableCell>
                  <TableCell className="text-slate-600">{event.date}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {event.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{event.type}</Badge>
                  </TableCell>
                  <TableCell>{event.attendees}</TableCell>
                  <TableCell>
                    <Badge variant={event.status === 'Upcoming' ? 'secondary' : 'outline'}>
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button 
                        onClick={() => handleEditEvent(event.id, event.name)}
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-slate-100 cursor-pointer"
                        title="Edit event"
                      >
                        <Edit2 className="w-4 h-4 text-slate-500" />
                      </Button>
                      <Button 
                        onClick={() => handleDeleteEvent(event.id, event.name)}
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-rose-500 hover:bg-rose-50 cursor-pointer"
                        title="Delete event"
                      >
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

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Users, 
  Plus, 
  Globe, 
  Check, 
  Bell, 
  ArrowRight,
  ExternalLink,
  Sparkles,
  MapPin,
  X
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import { useAuth } from '../lib/AuthContext';

interface EventItem {
  id: string;
  title: string;
  category: 'Daily Prayer' | 'Strategy Summit' | 'Frontline Briefing' | 'Intercession Hour';
  date: string;
  timeUTC: string;
  host: string;
  rsvpsCount: number;
  hasRsvp: boolean;
  description: string;
  meetingLink: string;
  status: 'Live Now' | 'Today' | 'Upcoming';
}

export default function EventsPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 'ev1',
      title: 'Global 10/40 Window 24-Hour Intercession Watch',
      category: 'Daily Prayer',
      date: 'Today',
      timeUTC: '14:00 - 15:30 UTC',
      host: 'PRAYERCLOUD Global Canopy',
      rsvpsCount: 184,
      hasRsvp: true,
      description: 'Unified prayer watch focusing on the unreached peoples across North Africa, the Middle East, and Central Asia. Live field testimonies from subterranean workers.',
      meetingLink: '/calls',
      status: 'Live Now'
    },
    {
      id: 'ev2',
      title: 'Somalia & Horn of Africa Church Planting Consultation',
      category: 'Strategy Summit',
      date: 'Tomorrow, Sep 24',
      timeUTC: '17:00 UTC',
      host: 'Alliance Frontier Taskforce',
      rsvpsCount: 62,
      hasRsvp: false,
      description: 'Strategic analysis on logistical corridors for audio Scripture delivery and pastoral discipleship in clan territories.',
      meetingLink: '/calls',
      status: 'Upcoming'
    },
    {
      id: 'ev3',
      title: 'Himalayan Frontier Workers Mutual Encouragement & Trauma Care',
      category: 'Frontline Briefing',
      date: 'Friday, Sep 26',
      timeUTC: '11:00 UTC',
      host: 'Sister Ruth & Dr. John',
      rsvpsCount: 45,
      hasRsvp: false,
      description: 'Private pastoral debriefing and prayer fellowship for missionaries serving in extreme high-altitude and restricted valley zones.',
      meetingLink: '/calls',
      status: 'Upcoming'
    },
    {
      id: 'ev4',
      title: 'Unreached Peoples Translation Sprint & Bible Dedication',
      category: 'Strategy Summit',
      date: 'Sunday, Sep 28',
      timeUTC: '19:00 UTC',
      host: 'Wycliffe & Indigenous Translators',
      rsvpsCount: 97,
      hasRsvp: true,
      description: 'Celebration and prayer dedication of newly completed Gospel portions in three previously unwritten tribal tongues.',
      meetingLink: '/calls',
      status: 'Upcoming'
    }
  ]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [newEventModal, setNewEventModal] = useState(false);

  // New Event Form State
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<'Daily Prayer' | 'Strategy Summit' | 'Frontline Briefing' | 'Intercession Hour'>('Daily Prayer');
  const [formDate, setFormDate] = useState('');
  const [formTime, setFormTime] = useState('');
  const [formDesc, setFormDesc] = useState('');

  const handleRsvpToggle = (id: string) => {
    setEvents(prev => prev.map(ev => {
      if (ev.id === id) {
        const next = !ev.hasRsvp;
        if (next) {
          toast.success(`RSVP confirmed for: ${ev.title}`, {
            description: 'Added to your PRAYERCLOUD calendar. Meeting link ready.'
          });
        }
        return {
          ...ev,
          hasRsvp: next,
          rsvpsCount: next ? ev.rsvpsCount + 1 : ev.rsvpsCount - 1
        };
      }
      return ev;
    }));
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newEv: EventItem = {
      id: `ev${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      date: formDate || 'Upcoming',
      timeUTC: formTime || '15:00 UTC',
      host: user?.displayName || 'Prayer Leader',
      rsvpsCount: 1,
      hasRsvp: true,
      description: formDesc.trim() || 'Global online gathering for prayer and mission coordination.',
      meetingLink: '/calls',
      status: 'Upcoming'
    };

    setEvents([newEv, ...events]);
    setNewEventModal(false);
    setFormTitle('');
    setFormDate('');
    setFormTime('');
    setFormDesc('');
    toast.success('Prayer meeting successfully scheduled!');
  };

  const filteredEvents = events.filter(e => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Live Now') return e.status === 'Live Now';
    return e.category === activeFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarIcon className="w-3.5 h-3.5 text-blue-600" />
            Global Prayer Meetings & Strategy Summits
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meetings & Events
          </h1>
          <p className="text-slate-600 text-sm">
            Join Zoom and WebRTC-powered virtual prayer sessions, daily intercession hours, and field councils.
          </p>
        </div>

        <Button
          onClick={() => setNewEventModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Schedule Meeting
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-8">
        {['All', 'Live Now', 'Daily Prayer', 'Strategy Summit', 'Frontline Briefing'].map(cat => (
          <Button
            key={cat}
            variant={activeFilter === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveFilter(cat)}
            className="rounded-xl text-xs h-10 cursor-pointer"
          >
            {cat === 'Live Now' && <span className="w-2 h-2 rounded-full bg-red-500 animate-ping mr-1.5 inline-block" />}
            {cat}
          </Button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvents.map(event => (
          <Card key={event.id} className="border-slate-200/80 hover:border-blue-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
            <CardContent className="p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      event.status === 'Live Now'
                        ? 'bg-red-50 text-red-600 border-red-200 font-bold'
                        : 'text-blue-700 bg-blue-50 border-blue-200'
                    }`}
                  >
                    {event.status === 'Live Now' ? '🔴 Live Now' : event.date}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {event.category}
                  </Badge>
                </div>

                <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5" /> {event.timeUTC}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1.5">{event.title}</h3>
                <p className="text-slate-600 text-xs leading-relaxed">{event.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                <span>Hosted by: <strong className="text-slate-700">{event.host}</strong></span>
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <Users className="w-3.5 h-3.5 text-blue-600" /> {event.rsvpsCount} Intercessors Attending
                </span>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  asChild
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold h-10 shadow-md shadow-blue-500/20"
                >
                  <Link to={event.meetingLink}>
                    <Video className="w-4 h-4 mr-1.5" /> Enter Virtual Room
                  </Link>
                </Button>

                <Button
                  variant={event.hasRsvp ? 'default' : 'outline'}
                  onClick={() => handleRsvpToggle(event.id)}
                  className={`rounded-xl text-xs font-semibold h-10 px-4 cursor-pointer ${
                    event.hasRsvp ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''
                  }`}
                >
                  {event.hasRsvp ? (
                    <>
                      <Check className="w-3.5 h-3.5 mr-1" /> Attending
                    </>
                  ) : (
                    'RSVP'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal: Schedule Meeting */}
      {newEventModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Schedule Prayer Meeting</h3>
                <p className="text-xs text-slate-500">Create a Zoom or WebRTC conference session.</p>
              </div>
              <button onClick={() => setNewEventModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Meeting Title *
                </label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Daily Dawn Intercession for Unreached Tuareg"
                  required
                  className="rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Daily Prayer">Daily Prayer</option>
                    <option value="Strategy Summit">Strategy Summit</option>
                    <option value="Frontline Briefing">Frontline Briefing</option>
                    <option value="Intercession Hour">Intercession Hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Date
                  </label>
                  <Input
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    placeholder="e.g. Sep 25, 2026"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Time (UTC)
                </label>
                <Input
                  value={formTime}
                  onChange={(e) => setFormTime(e.target.value)}
                  placeholder="e.g. 15:00 UTC (10:00 AM EST)"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder="Topic, focus scripture, prayer points..."
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setNewEventModal(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                  Schedule Event
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

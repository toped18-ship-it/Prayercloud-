import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Plus, 
  Filter, 
  Search, 
  Globe, 
  Flame, 
  Clock, 
  ShieldAlert, 
  Share2, 
  Check, 
  X,
  User,
  Sparkles
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';

interface PrayerItem {
  id: string;
  author: string;
  authorRole: string;
  country: string;
  isAnonymous: boolean;
  category: 'Country Need' | 'Missionary Family' | 'Frontline Crisis' | 'Personal';
  urgency: 'Critical' | 'High' | 'Normal';
  title: string;
  content: string;
  prayedCount: number;
  hasPrayed?: boolean;
  commentsCount: number;
  timeAgo: string;
  comments?: { author: string; text: string; time: string }[];
}

export default function PrayerRequestsPage() {
  const { user } = useAuth();
  const [prayers, setPrayers] = useState<PrayerItem[]>([
    {
      id: 'p1',
      author: 'Brother Emmanuel',
      authorRole: 'Pioneer Missionary',
      country: 'Somalia',
      isAnonymous: false,
      category: 'Frontline Crisis',
      urgency: 'Critical',
      title: 'Underground fellowship discovery risk in southern Mogadishu',
      content: 'Local authorities conducted sudden searches in our neighborhood. Two brother believers are safely hidden, but the congregation cannot meet publicly. Please pray for supernatural protection, angelic guard, and peace over their families.',
      prayedCount: 342,
      hasPrayed: false,
      commentsCount: 18,
      timeAgo: '2 hours ago',
      comments: [
        { author: 'Sister Grace (Kenya)', text: 'Interceding right now under Psalm 91. The Lord will preserve them.', time: '1 hour ago' },
        { author: 'Pastor David', text: 'Our church prayer chain is activated for brother Emmanuel.', time: '35 mins ago' }
      ]
    },
    {
      id: 'p2',
      author: 'Frontline Worker',
      authorRole: 'Bible Translator',
      country: 'Yemen',
      isAnonymous: true,
      category: 'Country Need',
      urgency: 'High',
      title: 'First draft of the Gospel of John in Mehri dialect complete',
      content: 'Praise God! The first 12 chapters are drafted. Pray for indigenous checkers to verify linguistic clarity without attracting tribal suspicion.',
      prayedCount: 215,
      hasPrayed: true,
      commentsCount: 9,
      timeAgo: '5 hours ago',
      comments: [
        { author: 'Sister Martha', text: 'Hallelujah! The Word of the Lord cannot be chained.', time: '4 hours ago' }
      ]
    },
    {
      id: 'p3',
      author: 'Pastor John',
      authorRole: 'Church Planter',
      country: 'Afghanistan',
      isAnonymous: true,
      category: 'Frontline Crisis',
      urgency: 'Critical',
      title: 'Winter food crisis among displaced Hazara believers',
      content: 'Severely cold weather is setting in and supplies are sparse. We need spiritual resilience and provision of flour, oil, and heaters for 40 families.',
      prayedCount: 489,
      hasPrayed: false,
      commentsCount: 32,
      timeAgo: '1 day ago'
    },
    {
      id: 'p4',
      author: 'Sister Lois',
      authorRole: 'Medical Missionary',
      country: 'Chad',
      isAnonymous: false,
      category: 'Missionary Family',
      urgency: 'Normal',
      title: 'Health and endurance for clinic staff amidst malaria outbreak',
      content: 'Our mobile medical team is serving 14 unreached villages along the Chari River. Pray for strength, sustained energy, and opportunities to share the Living Water.',
      prayedCount: 164,
      hasPrayed: false,
      commentsCount: 6,
      timeAgo: '2 days ago'
    }
  ]);

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [newPrayerModal, setNewPrayerModal] = useState(false);
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState('');

  // New Prayer Form
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState<'Country Need' | 'Missionary Family' | 'Frontline Crisis' | 'Personal'>('Country Need');
  const [formCountry, setFormCountry] = useState('Global');
  const [formUrgency, setFormUrgency] = useState<'Critical' | 'High' | 'Normal'>('Normal');
  const [formAnonymous, setFormAnonymous] = useState(false);

  const handlePrayClick = (id: string) => {
    setPrayers(prev => prev.map(p => {
      if (p.id === id) {
        const next = !p.hasPrayed;
        if (next) {
          toast.success('Your prayer has been recorded in Heaven and on PRAYERCLOUD!', {
            description: `Standing in agreement for: "${p.title.slice(0, 35)}..."`
          });
        }
        return {
          ...p,
          hasPrayed: next,
          prayedCount: next ? p.prayedCount + 1 : p.prayedCount - 1
        };
      }
      return p;
    }));
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    const authorName = user?.displayName || 'Intercessor';
    setPrayers(prev => prev.map(p => {
      if (p.id === postId) {
        const existing = p.comments || [];
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...existing, { author: authorName, text: newCommentText.trim(), time: 'Just now' }]
        };
      }
      return p;
    }));
    setNewCommentText('');
    toast.success('Prayer encouragement posted!');
  };

  const handleCreatePrayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const newPrayer: PrayerItem = {
      id: `p${Date.now()}`,
      author: formAnonymous ? 'Anonymous Believer' : (user?.displayName || 'You'),
      authorRole: 'Prayer Warrior',
      country: formCountry,
      isAnonymous: formAnonymous,
      category: formCategory,
      urgency: formUrgency,
      title: formTitle.trim(),
      content: formContent.trim(),
      prayedCount: 1,
      hasPrayed: true,
      commentsCount: 0,
      timeAgo: 'Just now',
      comments: []
    };

    setPrayers([newPrayer, ...prayers]);
    setFormTitle('');
    setFormContent('');
    setNewPrayerModal(false);
    toast.success('Prayer request published to global prayer wall!');
  };

  const filteredPrayers = prayers.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.country.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame className="w-3.5 h-3.5 text-blue-600" />
            24/7 Global Prayer Canopy
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Prayer Wall
          </h1>
          <p className="text-slate-600 text-sm">
            Stand in agreement with thousands of saints across 195 nations.
          </p>
        </div>

        <Button
          onClick={() => setNewPrayerModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Submit Prayer Request
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by country, missionary need, or keyword..."
            className="pl-10 h-11 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {['All', 'Frontline Crisis', 'Country Need', 'Missionary Family', 'Personal'].map((cat) => (
            <Button
              key={cat}
              variant={activeCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveCategory(cat)}
              className="rounded-xl text-xs h-11 cursor-pointer"
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Prayer Feed */}
      <div className="space-y-6">
        {filteredPrayers.map((item) => (
          <Card key={item.id} className="border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {item.isAnonymous ? '?' : item.author.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{item.author}</span>
                      <span className="text-xs text-slate-400">• {item.authorRole}</span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <Globe className="w-3 h-3 text-blue-500" /> {item.country} • {item.timeAgo}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      item.urgency === 'Critical'
                        ? 'border-red-300 text-red-600 bg-red-50'
                        : item.urgency === 'High'
                        ? 'border-amber-300 text-amber-700 bg-amber-50'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    {item.urgency === 'Critical' && <ShieldAlert className="w-3 h-3 mr-1 text-red-500 inline" />}
                    {item.urgency} Urgency
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {item.category}
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                <p className="text-slate-700 text-sm leading-relaxed">{item.content}</p>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between pt-4 border-t border-slate-100 gap-3">
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => handlePrayClick(item.id)}
                    variant={item.hasPrayed ? 'default' : 'outline'}
                    size="sm"
                    className={`rounded-xl text-xs font-bold cursor-pointer transition-all ${
                      item.hasPrayed ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' : 'text-slate-700'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 mr-1.5 ${item.hasPrayed ? 'fill-white' : 'text-blue-600'}`} />
                    {item.hasPrayed ? 'I Am Praying' : 'I Prayed For This'} ({item.prayedCount})
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveCommentPostId(activeCommentPostId === item.id ? null : item.id)}
                    className="rounded-xl text-xs text-slate-600 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                    Encourage ({item.commentsCount})
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(window.location.href);
                    toast.success('Prayer request link copied to share with your prayer group!');
                  }}
                  className="rounded-xl text-xs text-slate-500 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 mr-1" /> Share
                </Button>
              </div>

              {/* Comments Section */}
              {activeCommentPostId === item.id && (
                <div className="pt-4 mt-2 border-t border-slate-100 space-y-3 bg-slate-50/50 p-4 rounded-2xl">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Intercessory Encouragements
                  </h4>

                  {item.comments && item.comments.length > 0 ? (
                    <div className="space-y-2">
                      {item.comments.map((c, i) => (
                        <div key={i} className="p-3 bg-white rounded-xl border border-slate-200/80 text-xs space-y-1">
                          <div className="flex items-center justify-between text-slate-400 font-medium">
                            <span className="font-bold text-slate-700">{c.author}</span>
                            <span>{c.time}</span>
                          </div>
                          <p className="text-slate-700">{c.text}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Be the first to speak a blessing or scripture.</p>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Input
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Write words of faith, scripture, or prayer..."
                      className="text-xs h-9 rounded-xl bg-white"
                    />
                    <Button
                      size="sm"
                      onClick={() => handleAddComment(item.id)}
                      className="h-9 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold"
                    >
                      Post
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal: Submit Prayer Request */}
      {newPrayerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Post Prayer Need</h3>
                <p className="text-xs text-slate-500">Mobilize the global alliance of intercessors.</p>
              </div>
              <button onClick={() => setNewPrayerModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePrayer} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Title *
                </label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Breakthrough for nomadic Tuareg tribes"
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
                    <option value="Country Need">Country Need</option>
                    <option value="Frontline Crisis">Frontline Crisis</option>
                    <option value="Missionary Family">Missionary Family</option>
                    <option value="Personal">Personal Need</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Urgency Level
                  </label>
                  <select
                    value={formUrgency}
                    onChange={(e) => setFormUrgency(e.target.value as any)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-xs font-medium focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical Emergency</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Target Nation / Territory
                </label>
                <Input
                  value={formCountry}
                  onChange={(e) => setFormCountry(e.target.value)}
                  placeholder="e.g. Somalia, Afghanistan, India, or Global"
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Prayer Specifics *
                </label>
                <textarea
                  rows={4}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Share details, scripture references, and how intercessors should pray..."
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="anonymousCheck"
                  checked={formAnonymous}
                  onChange={(e) => setFormAnonymous(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600"
                />
                <label htmlFor="anonymousCheck" className="text-xs text-slate-600 cursor-pointer">
                  Post anonymously (recommended for security-restricted territories)
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setNewPrayerModal(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                  Publish to Prayer Wall
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

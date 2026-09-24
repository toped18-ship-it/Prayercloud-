import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Globe, 
  MapPin, 
  Camera, 
  Video, 
  Share2, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  HeartHandshake, 
  Sparkles,
  X
} from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';

interface ReportItem {
  id: string;
  author: string;
  country: string;
  region: string;
  title: string;
  summary: string;
  testimonies: string;
  challenges: string;
  needs: string;
  photos: string[];
  date: string;
  verified: boolean;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<ReportItem[]>([
    {
      id: 'rep1',
      author: 'Missionary Caleb & Sarah',
      country: 'Somalia',
      region: 'Jubaland Frontier',
      title: 'First underground house fellowship established among nomadic pastoralists',
      summary: 'After 18 months of relational discovery Bible studies through solar audio players, 7 elders and their households made professions of faith.',
      testimonies: 'Elder Mohamed openly declared: "For generations we heard of Isa only in passing. Now we know Him as our Redeemer and Shepherd."',
      challenges: 'Severe drought in the lower Jubba region has displaced hundreds of families. Extreme caution is needed as local clan militias inspect traveling caravans.',
      needs: '100 solar audio Bibles in the Af-Maay dialect, emergency grain relief packets, and prayer for elder Mohamed’s safe return from the northern market.',
      photos: [
        'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=800&q=80'
      ],
      date: 'Sep 22, 2026',
      verified: true
    },
    {
      id: 'rep2',
      author: 'Brother Tenzin & Team',
      country: 'Nepal',
      region: 'Upper Mustang Himalayan Valley',
      title: 'High-altitude medical trek reaches 6 unreached Tibetan Buddhist villages',
      summary: 'We crossed three 5,000-meter passes carrying medical supplies, eye care kits, and gospel portions in central Tibetan script.',
      testimonies: 'Over 280 villagers received basic health screenings. Three monastery novices asked for copies of the Gospel of Luke to read in secret.',
      challenges: 'Altitude sickness and steep winter landslides closing foot trails until spring.',
      needs: 'Portable cold-chain vaccine carriers and thermal winter sleeping bags for indigenous porters.',
      photos: [
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80'
      ],
      date: 'Sep 18, 2026',
      verified: true
    },
    {
      id: 'rep3',
      author: 'Frontline Worker Marcus',
      country: 'Turkey',
      region: 'Southeastern Anatolia',
      title: 'Earthquake reconstruction outreach opens unprecedented doors for dialogue',
      summary: 'Providing trauma therapy and rebuilding water purification stations has forged deep trust with local municipal councils.',
      testimonies: 'A local village head stated: "You were the first to arrive and the last to leave. Your Messiah must be full of love."',
      challenges: 'Permit renewals for foreign volunteer engineers face red tape.',
      needs: 'Civil engineering volunteers and funds for prefabricated family shelters before sub-zero temperatures.',
      photos: [
        'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80'
      ],
      date: 'Sep 14, 2026',
      verified: true
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [newReportModal, setNewReportModal] = useState(false);

  // Form State
  const [formCountry, setFormCountry] = useState('Somalia');
  const [formRegion, setFormRegion] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formTestimonies, setFormTestimonies] = useState('');
  const [formChallenges, setFormChallenges] = useState('');
  const [formNeeds, setFormNeeds] = useState('');
  const [formPhoto, setFormPhoto] = useState('');

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formSummary.trim()) return;

    const newRep: ReportItem = {
      id: `rep${Date.now()}`,
      author: user?.displayName || 'Missionary Field Worker',
      country: formCountry,
      region: formRegion || 'Frontline District',
      title: formTitle.trim(),
      summary: formSummary.trim(),
      testimonies: formTestimonies.trim() || 'God is moving in quiet miracles throughout the community.',
      challenges: formChallenges.trim() || 'Logistical barriers and spiritual warfare.',
      needs: formNeeds.trim() || 'Continued intercession and tactical support.',
      photos: formPhoto ? [formPhoto] : ['https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=800&q=80'],
      date: 'Just now',
      verified: true
    };

    setReports([newRep, ...reports]);
    setNewReportModal(false);
    // Reset
    setFormTitle('');
    setFormSummary('');
    setFormTestimonies('');
    setFormChallenges('');
    setFormNeeds('');
    setFormPhoto('');
    toast.success('Field Mission Report successfully published!');
  };

  const filteredReports = reports.filter(r => {
    const matchesCountry = selectedCountry === 'All' || r.country === selectedCountry;
    const matchesSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          r.region.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Globe className="w-3.5 h-3.5 text-blue-600" />
            Frontline Dispatch & Field Updates
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Mission Reports
          </h1>
          <p className="text-slate-600 text-sm">
            Eyewitness testimonies, field breakthroughs, strategic challenges, and urgent needs.
          </p>
        </div>

        <Button
          onClick={() => setNewReportModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" /> Upload Field Report
        </Button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search reports by keyword, region, or testimony..."
            className="pl-10 h-11 rounded-xl"
          />
        </div>

        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold focus:ring-2 focus:ring-blue-600"
        >
          <option value="All">All Nations</option>
          <option value="Somalia">Somalia</option>
          <option value="Nepal">Nepal</option>
          <option value="Turkey">Turkey</option>
          <option value="Afghanistan">Afghanistan</option>
          <option value="Yemen">Yemen</option>
        </select>
      </div>

      {/* Reports Feed */}
      <div className="space-y-8">
        {filteredReports.map((report) => (
          <Card key={report.id} className="border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                {/* Visual side */}
                <div className="lg:col-span-4 bg-slate-950 relative min-h-[240px] lg:min-h-full">
                  <img
                    src={report.photos[0]}
                    alt={report.title}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {report.country} • {report.region}
                    </p>
                    <p className="text-xs text-slate-300 mt-1">Dispatched: {report.date}</p>
                  </div>
                </div>

                {/* Content side */}
                <div className="lg:col-span-8 p-6 sm:p-8 space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{report.author}</span>
                      {report.verified && (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600 inline" /> Verified Missionary
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href);
                          toast.success('Report link copied!');
                        }}
                        className="text-xs rounded-xl h-8"
                      >
                        <Share2 className="w-3.5 h-3.5 mr-1" /> Share
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toast.info('Exporting report PDF dossier...')}
                        className="text-xs rounded-xl h-8"
                      >
                        <Download className="w-3.5 h-3.5 mr-1" /> PDF
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">{report.title}</h3>
                    <p className="text-slate-700 text-sm leading-relaxed">{report.summary}</p>
                  </div>

                  {/* Sectional callouts */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-emerald-800 flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Testimonies
                      </div>
                      <p className="text-emerald-950/80 leading-relaxed">{report.testimonies}</p>
                    </div>

                    <div className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-amber-800 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Challenges
                      </div>
                      <p className="text-amber-950/80 leading-relaxed">{report.challenges}</p>
                    </div>

                    <div className="p-3 bg-blue-50/70 border border-blue-100 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-blue-800 flex items-center gap-1">
                        <HeartHandshake className="w-3.5 h-3.5" /> Urgent Needs
                      </div>
                      <p className="text-blue-950/80 leading-relaxed">{report.needs}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal: Upload Report */}
      {newReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Upload Missionary Report</h3>
                <p className="text-xs text-slate-500">Document your work for the global church alliance.</p>
              </div>
              <button onClick={() => setNewReportModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateReport} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Country *
                  </label>
                  <Input
                    value={formCountry}
                    onChange={(e) => setFormCountry(e.target.value)}
                    placeholder="e.g. Somalia"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Province / Region
                  </label>
                  <Input
                    value={formRegion}
                    onChange={(e) => setFormRegion(e.target.value)}
                    placeholder="e.g. Lower Jubba"
                    className="rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Report Title *
                </label>
                <Input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Translation milestone and baptism of 12 disciples"
                  required
                  className="rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Summary Overview *
                </label>
                <textarea
                  rows={3}
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="Give a brief summary of the mission period and outcomes..."
                  required
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Testimonies
                  </label>
                  <textarea
                    rows={2}
                    value={formTestimonies}
                    onChange={(e) => setFormTestimonies(e.target.value)}
                    placeholder="Quotes, salvations..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Challenges
                  </label>
                  <textarea
                    rows={2}
                    value={formChallenges}
                    onChange={(e) => setFormChallenges(e.target.value)}
                    placeholder="Opposition, logistics..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                    Urgent Needs
                  </label>
                  <textarea
                    rows={2}
                    value={formNeeds}
                    onChange={(e) => setFormNeeds(e.target.value)}
                    placeholder="Supplies, Bibles..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Photo URL / Attachment
                </label>
                <Input
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  placeholder="https://... (or leave blank for standard default)"
                  className="rounded-xl"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <Button type="button" variant="ghost" onClick={() => setNewReportModal(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold">
                  Publish Field Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

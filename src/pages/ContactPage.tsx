import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { toast } from 'sonner';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [inquiryType, setInquiryType] = useState('Missionary Partnership');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      toast.error('Please fill in all required fields');
      return;
    }
    setSubmitted(true);
    toast.success('Your message has been received by our global mission secretariat.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Contact PRAYERCLOUD</h1>
        <p className="text-slate-600 text-base">
          Connecting missionaries, sending agencies, and prayer networks worldwide.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <Card className="border-slate-200/80 bg-gradient-to-br from-blue-600 to-sky-700 text-white shadow-lg">
            <CardContent className="p-6 space-y-6">
              <h3 className="text-xl font-bold">Global Secretariat</h3>
              <p className="text-blue-100 text-sm leading-relaxed">
                Our support team and intercession directors are stationed across North America, Europe, East Africa, and Southeast Asia.
              </p>

              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 font-semibold uppercase">Email Support</p>
                    <p className="font-medium">contact@prayercloud.org</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 font-semibold uppercase">Field Emergency Line</p>
                    <p className="font-medium">+1 (800) 555-PRAY (7729)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-200 font-semibold uppercase">Alliance Headquarters</p>
                    <p className="font-medium">Global Missionary Alliance, Geneva & Dallas</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/20 flex items-center gap-2 text-xs text-blue-100">
                <ShieldCheck className="w-4 h-4 text-emerald-300" />
                <span>End-to-end encrypted dispatch for restricted zones</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80">
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                <HeartHandshake className="w-4 h-4" /> Missionary Verification
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you are a field missionary seeking access to sensitive security channels or strategic discussion rooms, please include your sending agency or church endorsement.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Form */}
        <div className="lg:col-span-2">
          <Card className="border-slate-200/80 shadow-sm">
            <CardContent className="p-8">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                    <ShieldCheck className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">Message Dispatched</h3>
                  <p className="text-slate-600 max-w-md mx-auto text-sm">
                    Thank you, {name}. A member of our global coordination team will contact you at {email} within 24 hours.
                  </p>
                  <Button onClick={() => setSubmitted(false)} variant="outline" className="rounded-xl">
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Full Name *
                      </label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. David Livingstone"
                        required
                        className="rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Email Address *
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@domain.org"
                        required
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Inquiry Category
                      </label>
                      <select
                        value={inquiryType}
                        onChange={(e) => setInquiryType(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value="Missionary Partnership">Missionary Partnership</option>
                        <option value="Unreached Data Correction">Unreached People Data Correction</option>
                        <option value="Prayer Emergency Alert">Prayer Emergency Alert</option>
                        <option value="Sending Agency Verification">Sending Agency Verification</option>
                        <option value="General Inquiry">General Inquiry</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        Subject
                      </label>
                      <Input
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder="Brief summary of topic..."
                        className="rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                      Message Content *
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share details regarding your field situation, prayer request, or agency collaboration..."
                      required
                      className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20">
                    <Send className="w-4 h-4 mr-2" /> Dispatch Message
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

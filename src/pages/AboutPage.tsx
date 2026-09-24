import React from 'react';
import { Cloud, Globe, Heart, Shield, Users, BookOpen, Target, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          The PRAYERCLOUD Vision
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Mobilizing Believers for Every <span className="text-blue-600">Unreached Nation</span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          PRAYERCLOUD is a secure, global Christian alliance platform connecting intercessors, field missionaries, pastors, and church planters with unreached people groups, real-time prayer alerts, and strategic field resources.
        </p>
      </div>

      {/* Scriptural Foundation */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 mb-16 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-4">
          <BookOpen className="w-10 h-10 mx-auto text-blue-300" />
          <p className="text-xl sm:text-2xl font-serif italic text-blue-100 leading-relaxed">
            "And this gospel of the kingdom will be preached in all the world as a witness to all the nations, and then the end will come."
          </p>
          <p className="text-sm font-bold tracking-widest uppercase text-blue-300">Matthew 24:14 • Revelation 7:9</p>
        </div>
      </div>

      {/* Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <Card className="border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Unreached Intelligence</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We compile and synthesize field data from Joshua Project, Operation World, and frontline workers to catalog all 195 countries, thousands of unreached places, tribes, and villages.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Cloud className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">24/7 Global Intercession</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              A united canopy of prayer linking prayer warriors worldwide with frontline field needs, critical persecution emergencies, and breakthrough intercession hours.
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Encrypted Collaboration</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Equipped with role-based access control, secure messaging, WebRTC encrypted calling, and field asset distribution to protect pioneer workers in high-risk zones.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alliance Partners */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 mb-16 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Grounded in Global Missiology</h2>
        <p className="text-slate-600 text-sm max-w-2xl mx-auto mb-8">
          In solidarity with Bible translation agencies, cross-cultural sending organizations, and indigenous prayer networks.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm font-semibold text-slate-700">
          <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-2xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Joshua Project Align
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-2xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Operation World Sync
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-2xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> 10/40 Window Focus
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200/60 shadow-2xs flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Global Great Commission
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Ready to stand in the gap?</h2>
        <p className="text-slate-600 text-sm">Join thousands of believers praying and mobilizing for every tribe and tongue.</p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20">
            <Link to="/register">
              Join PRAYERCLOUD <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-xl">
            <Link to="/countries">Explore Unreached Nations</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

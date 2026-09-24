import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Cloud, Search, Globe, Users, MessageSquare, LayoutDashboard, Menu, X, ShieldAlert, Mail, ArrowRight, Compass, UploadCloud } from 'lucide-react';
import { buttonVariants } from '../ui/button';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../lib/AuthContext';
import { PermissionGate } from '../auth/PermissionGate';
import { RoleSwitcher } from '../auth/RoleSwitcher';
import { Permission } from '../../types/auth';
import { COUNTRIES_SEED } from '../../lib/mockData';
import { UploadGadgetFileModal } from '../modals/UploadGadgetFileModal';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [query, setQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/home', icon: LayoutDashboard, permission: 'view_dashboard' as Permission },
    { name: 'Map', path: '/map', icon: Globe, permission: 'view_countries' as Permission },
    { name: 'Countries', path: '/countries', icon: Search, permission: 'view_countries' as Permission },
    { name: 'Missionary Hub', path: '/missionary-hub', icon: Users, permission: 'view_missionary_hub' as Permission },
    { name: 'Chat', path: '/chat', icon: MessageSquare, permission: 'post_prayer_requests' as Permission },
    { name: 'Gmail', path: '/gmail', icon: Mail, permission: 'view_dashboard' as Permission },
    { name: 'Admin', path: '/admin', icon: ShieldAlert, permission: 'access_admin_panel' as Permission },
  ];

  const searchResults = query.trim() === '' ? [] : COUNTRIES_SEED.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.religion.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-[#2563EB] to-[#0EA5E9] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-blue-900 hidden sm:block">
                PRAYERCLOUD
              </span>
            </Link>
            
            <div className="hidden md:ml-10 md:flex items-center space-x-8">
              {navItems.map((item) => (
                <PermissionGate key={item.name} permission={item.permission}>
                  <Link
                    to={item.path}
                    className={`text-sm font-semibold transition-all duration-200 border-b-2 ${
                      location.pathname === item.path
                        ? 'text-blue-600 border-blue-600 pb-1'
                        : 'text-slate-600 border-transparent hover:text-blue-600 pb-1'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <item.icon className="h-4 w-4" />
                      {item.name}
                    </span>
                  </Link>
                </PermissionGate>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setUploadModalOpen(true)}
              title="Upload file from gadget (Computer or Phone)"
              className="h-8 px-3 rounded-full bg-white/60 hover:bg-white/90 border border-white/50 flex items-center gap-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:text-blue-600 transition-colors cursor-pointer"
            >
              <UploadCloud className="h-4 w-4 text-blue-600" />
              <span className="hidden lg:inline">Upload</span>
            </button>
            <button 
              onClick={() => setSearchOpen(true)}
              title="Search mission resources (Cmd+K)"
              className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center border border-white/40 hover:bg-white/80 transition-colors group cursor-pointer"
            >
              <Search className="h-4 w-4 text-slate-500 group-hover:text-primary transition-colors" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-white/40">
              {user ? (
                <RoleSwitcher />
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}>Login</Link>
                  <Link to="/register" className={cn(buttonVariants({ size: "sm" }))}>Join</Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-primary hover:bg-slate-100"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white border-t border-slate-100"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <PermissionGate key={item.name} permission={item.permission}>
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-md text-base font-medium text-slate-600 hover:text-primary hover:bg-slate-50"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              </PermissionGate>
            ))}
            <button
              onClick={() => {
                setIsOpen(false);
                setUploadModalOpen(true);
              }}
              className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-semibold text-blue-600 bg-blue-50/60 hover:bg-blue-50"
            >
              <UploadCloud className="h-5 w-5 text-blue-600" />
              <span>Upload from Phone / Device</span>
            </button>
            {!user && (
              <div className="pt-4 pb-3 border-t border-slate-100">
                <Link 
                  to="/login"
                  className={cn(buttonVariants({ variant: "outline", className: "w-full mb-2" }))}
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register"
                  className={cn(buttonVariants({ className: "w-full bg-primary" }))}
                  onClick={() => setIsOpen(false)}
                >
                  Join Platform
                </Link>
              </div>
            )}
            {user && (
              <div className="pt-4 px-3">
                <RoleSwitcher />
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Global Mission Quick Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSearchOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10"
            >
              <div className="flex items-center px-4 border-b border-slate-100">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search nations, religions, missionary hubs... (Press Esc to close)"
                  className="w-full h-14 px-4 text-slate-900 bg-transparent border-none outline-none text-base placeholder:text-slate-400"
                />
                <button 
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-4 max-h-96 overflow-y-auto space-y-3">
                {query.trim() === '' ? (
                  <div className="space-y-4">
                    <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Quick Links</p>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Interactive World Map', path: '/map', icon: Globe },
                        { label: 'Browse 195 Nations', path: '/countries', icon: Compass },
                        { label: 'Missionary Strategy Hub', path: '/missionary-hub', icon: Users },
                        { label: 'Secure Field Chat', path: '/chat', icon: MessageSquare },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            setSearchOpen(false);
                            navigate(item.path);
                          }}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200 text-left transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">Search Results</p>
                    {searchResults.length === 0 ? (
                      <div className="py-8 text-center text-slate-500 text-sm">
                        No results found for "{query}". Try "India", "Middle East", or "Islam".
                      </div>
                    ) : (
                      searchResults.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSearchOpen(false);
                            navigate(`/countries/${c.id}`);
                          }}
                          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-blue-50/60 border border-transparent hover:border-blue-100 transition-colors text-left"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{c.flag}</span>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{c.name}</p>
                              <p className="text-xs text-slate-500">{c.religion} • {c.unreachedPercentage}% Unreached</p>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-slate-400" />
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <UploadGadgetFileModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </nav>
  );
}

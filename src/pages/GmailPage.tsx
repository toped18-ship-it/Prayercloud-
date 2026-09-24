import React, { useState, useEffect, useCallback } from 'react';
import { 
  Mail, 
  Send, 
  Trash2, 
  Archive, 
  Search, 
  Plus, 
  RefreshCw, 
  ArrowLeft, 
  Inbox, 
  ShieldCheck,
  X,
  SendHorizontal
} from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { toast } from 'sonner';

interface GmailMessage {
  id: string;
  threadId: string;
}

interface GmailDetails {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  subject: string;
  from: string;
  to: string;
  date: string;
  body: string;
}

export default function GmailPage() {
  const { googleAccessToken, connectGmail } = useAuth();
  
  const [messages, setMessages] = useState<GmailDetails[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'INBOX' | 'SENT' | 'TRASH'>('INBOX');
  const [selectedEmail, setSelectedEmail] = useState<GmailDetails | null>(null);
  const [isComposing, setIsComposing] = useState(false);
  
  // Compose state
  const [composeTo, setComposeTo] = useState('');
  const [composeSubject, setComposeSubject] = useState('');
  const [composeBody, setComposeBody] = useState('');
  const [sending, setSending] = useState(false);

  // Helper function to decode Gmail's Base64Url
  const decodeBase64 = (base64Url: string) => {
    try {
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = atob(base64);
      // Support UTF-8 properly
      return decodeURIComponent(
        decoded
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
    } catch {
      try {
        // Fallback for standard atob
        return atob(base64Url.replace(/-/g, '+').replace(/_/g, '/'));
      } catch {
        return '';
      }
    }
  };

  // Extract body content from Gmail message payload
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getMessageBody = useCallback((payload: any): string => {
    if (payload.body?.data) {
      return decodeBase64(payload.body.data) || payload.snippet || '';
    }
    if (payload.parts) {
      // Prefer html if available
      for (const part of payload.parts) {
        if (part.mimeType === 'text/html' && part.body?.data) {
          return decodeBase64(part.body.data) || '';
        }
      }
      // Or search deeper if nested
      for (const part of payload.parts) {
        if (part.parts) {
          const nested = getMessageBody(part);
          if (nested) return nested;
        }
      }
      // Fallback to text/plain
      for (const part of payload.parts) {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          return decodeBase64(part.body.data) || '';
        }
      }
    }
    return payload.snippet || '';
  }, []);

  const getHeader = (headers: { name: string; value: string }[], name: string) => {
    return headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value || '';
  };

  const fetchEmailDetails = useCallback(async (msgList: GmailMessage[], token: string) => {
    try {
      const detailsList: GmailDetails[] = [];
      // Fetch details in parallel of first 12 messages for fast response
      const promises = msgList.slice(0, 12).map(async (msg) => {
        try {
          const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!res.ok) return null;
          const data = await res.json();
          const headers = data.payload?.headers || [];
          
          return {
            id: data.id,
            threadId: data.threadId,
            labelIds: data.labelIds || [],
            snippet: data.snippet || '',
            subject: getHeader(headers, 'subject') || '(No Subject)',
            from: getHeader(headers, 'from') || 'Unknown Sender',
            to: getHeader(headers, 'to') || 'me',
            date: getHeader(headers, 'date') || 'No Date',
            body: getMessageBody(data.payload)
          };
        } catch (err) {
          console.error(`Error fetching message ${msg.id}`, err);
          return null;
        }
      });

      const resolved = await Promise.all(promises);
      resolved.forEach(item => {
        if (item) detailsList.push(item);
      });

      setMessages(detailsList);
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse emails.');
    }
  }, [getMessageBody]);

  // Main Email Fetch Loader
  const loadEmails = useCallback(async (term = '', explicitToken?: string) => {
    const token = explicitToken || googleAccessToken;
    if (!token) return;

    setLoading(true);
    try {
      // Determine query: search text or category/label selection
      let query = '';
      if (activeTab === 'INBOX') {
        query = 'label:INBOX';
      } else if (activeTab === 'SENT') {
        query = 'label:SENT';
      } else if (activeTab === 'TRASH') {
        query = 'label:TRASH';
      }

      if (term) {
        query += ` ${term}`;
      }

      const encodedQuery = encodeURIComponent(query);
      const url = `https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=15&q=${encodedQuery}`;
      
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401) {
        toast.error('Google Session expired. Please connect again.');
        return;
      }

      if (!res.ok) {
        throw new Error('Gmail API lookup failed.');
      }

      const data = await res.json();
      const rawMessages: GmailMessage[] = data.messages || [];
      
      if (rawMessages.length === 0) {
        setMessages([]);
      } else {
        await fetchEmailDetails(rawMessages, token);
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      toast.error(error.message || 'Error occurred while loading mailbox.');
    } finally {
      setLoading(false);
    }
  }, [googleAccessToken, activeTab, fetchEmailDetails]);

  useEffect(() => {
    if (googleAccessToken) {
      loadEmails();
    }
  }, [googleAccessToken, activeTab, loadEmails]);

  // Connect Google account flow
  const handleConnect = async () => {
    try {
      const token = await connectGmail();
      toast.success('Gmail Account connected successfully!');
      loadEmails('', token);
    } catch (err: unknown) {
      const error = err as Error;
      toast.error(error.message || 'Connecting to Gmail failed.');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadEmails(searchQuery);
  };

  // Organise: Archive Email Behavior
  const handleArchive = async (emailId: string) => {
    if (!googleAccessToken) return;
    
    // Safety check / Confirmation dialog as required by the system rules
    const confirmed = window.confirm('Are you sure you want to Archive this message? It will be removed from your main Inbox.');
    if (!confirmed) return;

    toast.loading('Archiving email...', { id: 'archive-load' });
    try {
      const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}/modify`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${googleAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          removeLabelIds: ['INBOX']
        })
      });

      if (res.ok) {
        toast.success('Email successfully archived', { id: 'archive-load' });
        if (selectedEmail?.id === emailId) {
          setSelectedEmail(null);
        }
        loadEmails();
      } else {
        throw new Error('Could not modify labels');
      }
    } catch {
      toast.error('Failed to archive message.', { id: 'archive-load' });
    }
  };

  // Organise: Trash Email Behavior
  const handleTrash = async (emailId: string) => {
    if (!googleAccessToken) return;

    // Safety check / Confirmation dialog as required by the system rules
    const confirmed = window.confirm('Are you sure you want to move this email to the Trash folder?');
    if (!confirmed) return;

    toast.loading('Moving to trash...', { id: 'trash-load' });
    try {
      const res = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${emailId}/trash`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${googleAccessToken}` }
      });

      if (res.ok) {
        toast.success('Email moved to trash', { id: 'trash-load' });
        if (selectedEmail?.id === emailId) {
          setSelectedEmail(null);
        }
        loadEmails();
      } else {
        throw new Error('Could not move to trash');
      }
    } catch {
      toast.error('Failed to trash message.', { id: 'trash-load' });
    }
  };

  // Send: Compose/Send Email implementation
  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleAccessToken) return;
    if (!composeTo || !composeSubject || !composeBody) {
      toast.error('Please fill in all email fields.');
      return;
    }

    // Safety check / Confirmation dialog before sending as strictly required by system rules
    const confirmSend = window.confirm(`Confirm: Do you want to send this email to ${composeTo}?`);
    if (!confirmSend) return;

    setSending(true);
    toast.loading(`Sending email to ${composeTo}...`, { id: 'send-load' });
    try {
      // Build MIME content carefully
      const rawMimi = [
        `To: ${composeTo}`,
        `Subject: ${composeSubject}`,
        'Content-Type: text/html; charset=utf-8',
        'MIME-Version: 1.0',
        '',
        `<div style="font-family: sans-serif; line-height: 1.6; color: #333;">${composeBody.replace(/\n/g, '<br/>')}</div>`
      ].join('\r\n');

      const encodedMime = btoa(unescape(encodeURIComponent(rawMimi)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');

      const res = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${googleAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          raw: encodedMime
        })
      });

      if (res.ok) {
        toast.success('Email sent successfully!', { id: 'send-load' });
        setIsComposing(false);
        setComposeTo('');
        setComposeSubject('');
        setComposeBody('');
        loadEmails();
      } else {
        const errorData = await res.json();
        throw new Error(errorData.error?.message || 'Send operation failed.');
      }
    } catch (err: unknown) {
      const error = err as Error;
      console.error(error);
      toast.error(error.message || 'Failed to send email. Please verify structural inputs.', { id: 'send-load' });
    } finally {
      setSending(false);
    }
  };

  // Handle HTML sanitizer or simplified preview safely
  const renderEmailBody = (htmlString: string) => {
    // If it's HTML, we'll embed it safely in an iframe or strip it.
    // For a clean secure layout without styling leaks, let's inject it into an iframe container dynamically.
    return (
      <iframe 
        title="Email Body Viewport"
        srcDoc={`
          <html>
            <head>
              <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; margin: 16px; font-size: 14px; }
                a { color: #2563eb; }
              </style>
            </head>
            <body>${htmlString}</body>
          </html>
        `}
        className="w-full h-[380px] border border-slate-100 rounded-xl bg-white shadow-inner"
        sandbox="allow-same-origin"
      />
    );
  };

  // If no Google Access Token, display Gmail authorization portal
  if (!googleAccessToken) {
    return (
      <div id="gmail_portal" className="max-w-4xl mx-auto px-4 py-16 flex flex-col justify-center items-center min-h-[calc(100vh-140px)]">
        <div className="bg-white border border-blue-100 rounded-[32px] p-8 md:p-12 text-center shadow-xl shadow-blue-500/5 max-w-lg w-full relative overflow-hidden backdrop-blur-3xl">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-600 via-sky-400 to-[#2563EB]" />
          
          <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-md border border-blue-100/40">
            <Mail className="h-10 w-10 animate-bounce" />
          </div>

          <h1 className="text-3xl font-black text-blue-950 tracking-tight mb-3">Gmail Integration</h1>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Sync your missionary workspace with Gmail to coordinate prayer chains, send status briefs, and access outreach communications securely inside your client platform.
          </p>

          <Button 
            onClick={handleConnect}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white font-bold shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
          >
            <ShieldCheck className="h-5 w-5" />
            Connect Google Mail Workspace
          </Button>

          <div className="mt-6 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-medium">
            <span>Requires authorized permissions from PRAYERCLOUD</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="gmail_dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-full flex flex-col space-y-6">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-blue-950 tracking-tight flex items-center gap-2">
            <Mail className="h-8 w-8 text-blue-600" />
            Workspace Mail
          </h1>
          <p className="text-slate-500 text-sm">
            Access Gmail functionality programmatically to draft and coordinate prayer broadcasts.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => setIsComposing(true)}
            className="rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 px-6 shadow-md shadow-blue-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            Compose Message
          </Button>

          <Button 
            variant="outline" 
            onClick={() => loadEmails()} 
            disabled={loading}
            className="rounded-full border-blue-200 text-blue-700 font-bold hover:bg-blue-50 h-11"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Main Mailbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 items-stretch">
        
        {/* Navigation Sidebar & Folders */}
        <div className="lg:col-span-3 flex flex-col space-y-4">
          <div className="bg-white/70 border border-white p-4 rounded-3xl shadow-sm space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-3 display-block mb-2">My Folders</span>
            
            <button 
              onClick={() => { setActiveTab('INBOX'); setSelectedEmail(null); }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'INBOX' 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Inbox className="h-4 w-4" /> Inbox
              </span>
            </button>

            <button 
              onClick={() => { setActiveTab('SENT'); setSelectedEmail(null); }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'SENT' 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Send className="h-4 w-4" /> Sent
              </span>
            </button>

            <button 
              onClick={() => { setActiveTab('TRASH'); setSelectedEmail(null); }}
              className={`w-full flex items-center justify-between px-3 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'TRASH' 
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Trash Bin
              </span>
            </button>
          </div>

          {/* Quick Search */}
          <div className="bg-white/70 border border-white p-4 rounded-3xl shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider px-1 block mb-2">Filter Emails</span>
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search subject..." 
                className="bg-white/90 border-slate-200 h-10 pr-9 rounded-xl focus:border-blue-400"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-slate-400 hover:text-blue-600">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Inbox / Thread View Panels */}
        <div className="lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* List panel */}
          <div className="bg-white/80 border border-white rounded-[32px] p-6 flex flex-col shadow-sm min-h-[480px]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-blue-950 text-lg">
                {activeTab === 'INBOX' ? 'Received Emails' : activeTab === 'SENT' ? 'Sent Messages' : 'Trash History'}
              </h3>
              <Badge variant="secondary" className="bg-blue-50 text-blue-600">Gmail Linked</Badge>
            </div>

            {loading ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="h-8 w-8 text-blue-600 animate-spin" />
                <p className="text-xs text-slate-400 font-bold">Synchronizing mailbox...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3">
                  <Inbox className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-slate-700">No emails found</p>
                <p className="text-xs text-slate-400 mt-1">Try reloading or altering your search query filter.</p>
              </div>
            ) : (
              <ScrollArea className="flex-1 max-h-[500px]">
                <div className="space-y-3 pr-2">
                  {messages.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedEmail(item)}
                      className={`w-full text-left p-4 rounded-2xl border transition-all pointer cursor-pointer ${
                        selectedEmail?.id === item.id 
                          ? 'bg-blue-50/70 border-blue-200 shadow-sm' 
                          : 'bg-white border-slate-100 hover:border-blue-100'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-xs font-black text-slate-800 line-clamp-1 max-w-[70%]">{item.from}</span>
                        <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">{item.date.split(',')[0]}</span>
                      </div>
                      <h4 className="text-xs font-bold text-blue-900 line-clamp-1 mb-1">{item.subject}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-2">{item.snippet}</p>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Details / Preview Pane */}
          <div className="bg-white/80 border border-white rounded-[32px] p-6 flex flex-col shadow-sm">
            {selectedEmail ? (
              <div className="flex flex-col h-full space-y-4">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setSelectedEmail(null)}
                    className="text-slate-400 hover:text-slate-600 flex items-center text-xs font-bold"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back
                  </button>
                  
                  <div className="flex gap-2">
                    {activeTab !== 'TRASH' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleArchive(selectedEmail.id)}
                        className="h-8 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-50"
                      >
                        <Archive className="h-3.5 w-3.5 mr-1" /> Archive
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleTrash(selectedEmail.id)}
                      className="h-8 rounded-full border border-red-100 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Trash
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400">SUBJECT</p>
                  <h3 className="text-base font-black text-blue-950 tracking-tight leading-snug">{selectedEmail.subject}</h3>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">From</span>
                    <span className="font-bold text-slate-800 line-clamp-1">{selectedEmail.from}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Date & Time</span>
                    <span className="font-bold text-slate-600">{selectedEmail.date}</span>
                  </div>
                </div>

                <div className="flex-1 flex flex-col min-h-[300px]">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-2">Message Body</span>
                  {renderEmailBody(selectedEmail.body)}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                <div className="w-14 h-14 bg-slate-50 text-blue-600/30 rounded-2xl flex items-center justify-center mb-4">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">No message selected</h3>
                <p className="text-xs text-slate-400 max-w-[200px] mt-1 mx-auto">
                  Click on an email from your feed list to read its contents and perform coordination actions.
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Compose Email Modal */}
      {isComposing && (
        <div className="fixed inset-0 bg-blue-950/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden relative animate-in fade-in zoom-in-95">
            <div className="p-6 bg-gradient-to-r from-blue-600 to-sky-500 text-white flex justify-between items-center">
              <div>
                <h3 className="font-black text-lg">Compose Broadcaster Email</h3>
                <p className="text-[10px] text-white/80">Submit and broadcast missionary alerts through Gmail</p>
              </div>
              <button 
                onClick={() => setIsComposing(false)}
                className="text-white/80 hover:text-white rounded-full p-2 hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSendEmail} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">Recipient Email Address</label>
                <Input 
                  type="email" 
                  required
                  placeholder="recipient@example.com" 
                  value={composeTo}
                  onChange={e => setComposeTo(e.target.value)}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">Subject Headline</label>
                <Input 
                  required
                  placeholder="Prayer broadcast: Urgent supply request" 
                  value={composeSubject}
                  onChange={e => setComposeSubject(e.target.value)}
                  className="rounded-xl border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 block">Message Body (HTML supported)</label>
                <textarea 
                  required
                  rows={8}
                  placeholder={`Write your email content here. HTML styles are supported...\n\nStay Blessed,\nPrayercloud Team`}
                  value={composeBody}
                  onChange={e => setComposeBody(e.target.value)}
                  className="w-full text-sm border border-slate-200 p-3 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsComposing(false)}
                  className="rounded-xl h-12"
                >
                  Discard Draft
                </Button>
                <Button 
                  disabled={sending}
                  type="submit" 
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 h-12 flex items-center shadow-lg shadow-blue-500/20"
                >
                  <SendHorizontal className="h-4 w-4 mr-2" />
                  {sending ? 'Sending Broadcast...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

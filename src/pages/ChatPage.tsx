import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
    Send, 
    Plus, 
    Image as ImageIcon, 
    Mic, 
    Smile, 
    MoreVertical, 
    Search,
    Phone,
    Video,
    Hash,
    User,
    CheckCheck,
    X,
    PhoneOff,
    MicOff,
    VideoOff,
    FileText,
    Download,
    Loader2
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Separator } from '../components/ui/separator';
import { Badge } from '../components/ui/badge';
import { toast } from 'sonner';
import { uploadFileFromDevice, formatFileSize, type UploadedFileResult } from '../lib/fileUpload';

interface Message {
  id: number | string;
  sender: string;
  text: string;
  time: string;
  self: boolean;
  attachment?: {
    url: string;
    name: string;
    size: number;
    type: string;
  };
}

interface ChannelItem {
  id: string;
  name: string;
  type: string;
  unread: number;
}

interface DirectMessageItem {
  id: string;
  name: string;
  status: string;
  avatar: string;
}

export default function ChatPage() {
  const [channels, setChannels] = useState<ChannelItem[]>([
    { id: 'me', name: 'Middle East Strategy', type: 'private', unread: 0 },
    { id: 'all', name: 'Global Prayer', type: 'public', unread: 5 },
    { id: 'india', name: 'India Field Ops', type: 'private', unread: 12 },
    { id: 'logistics', name: 'Relief Logistics', type: 'public', unread: 0 },
  ]);

  const [directMessages, setDirectMessages] = useState<DirectMessageItem[]>([
    { id: 'u1', name: 'Abraham M.', status: 'online', avatar: 'AM' },
    { id: 'u2', name: 'Sarah T.', status: 'offline', avatar: 'ST' },
    { id: 'u3', name: 'Dr. Samuel', status: 'online', avatar: 'DS' },
  ]);

  const [activeChat, setActiveChat] = useState<{ id: string; name: string; isChannel: boolean }>({
    id: 'me',
    name: 'Middle East Strategy',
    isChannel: true,
  });

  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>({
    me: [
      { id: 1, sender: 'Abraham M.', text: 'Greetings everyone. The field report from North India is ready.', time: '10:30 AM', self: false },
      { id: 2, sender: 'You', text: 'Excellent. Does it include the new village stats?', time: '10:32 AM', self: true },
      { id: 3, sender: 'Abraham M.', text: 'Yes, 12 new villages mapped. 3 show high interest.', time: '10:33 AM', self: false },
      { id: 4, sender: 'Dr. Samuel', text: 'We should schedule a briefing for the intercessors tomorrow.', time: '10:35 AM', self: false },
    ],
    all: [
      { id: 1, sender: 'Sarah T.', text: '24/7 Prayer room currently covering the Horn of Africa.', time: '09:00 AM', self: false },
      { id: 2, sender: 'You', text: 'Standing in faith with the team there.', time: '09:15 AM', self: true },
    ],
    u1: [
      { id: 1, sender: 'Abraham M.', text: 'Brother, did you receive the translation proofs?', time: '08:45 AM', self: false },
    ]
  });

  const [message, setMessage] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [callState, setCallState] = useState<{ active: boolean; type: 'audio' | 'video'; target: string } | null>(null);
  const [newChannelModal, setNewChannelModal] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [newDmModal, setNewDmModal] = useState(false);
  const [newDmName, setNewDmName] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [attachment, setAttachment] = useState<UploadedFileResult | null>(null);
  const [isUploadingAttachment, setIsUploadingAttachment] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const currentMessages = chatMessages[activeChat.id] || [
    { id: 1, sender: 'System', text: `Welcome to the start of #${activeChat.name}`, time: 'Just now', self: false }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, activeChat.id]);

  const handleDeviceFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    try {
      setIsUploadingAttachment(true);
      const res = await uploadFileFromDevice(file);
      setAttachment(res);
      toast.success(`Attached "${file.name}" (${formatFileSize(res.size)}) from gadget`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to attach file';
      toast.error(msg);
    } finally {
      setIsUploadingAttachment(false);
    }
  };

  const handleSendMessage = () => {
    if (!message.trim() && !attachment) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: Message = {
      id: Date.now(),
      sender: 'You',
      text: message.trim(),
      time: timeString,
      self: true,
      attachment: attachment ? {
        url: attachment.url,
        name: attachment.originalName,
        size: attachment.size,
        type: attachment.fileType,
      } : undefined
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChat.id]: [...(prev[activeChat.id] || []), newMsg]
    }));
    setMessage('');
    setAttachment(null);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    const cleanName = newChannelName.toLowerCase().replace(/\s+/g, '-');
    const newChan: ChannelItem = {
      id: cleanName,
      name: newChannelName.trim(),
      type: 'public',
      unread: 0
    };
    setChannels(prev => [...prev, newChan]);
    setActiveChat({ id: newChan.id, name: newChan.name, isChannel: true });
    setNewChannelName('');
    setNewChannelModal(false);
    toast.success(`Channel #${newChan.name} created!`);
  };

  const handleCreateDm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDmName.trim()) return;
    const initials = newDmName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const newDm: DirectMessageItem = {
      id: `u_${Date.now()}`,
      name: newDmName.trim(),
      status: 'online',
      avatar: initials || 'US'
    };
    setDirectMessages(prev => [...prev, newDm]);
    setActiveChat({ id: newDm.id, name: newDm.name, isChannel: false });
    setNewDmName('');
    setNewDmModal(false);
    toast.success(`Conversation with ${newDm.name} started!`);
  };

  const handleStartCall = (type: 'audio' | 'video') => {
    setCallState({
      active: true,
      type,
      target: activeChat.name
    });
    toast.info(`Calling ${activeChat.name}...`);
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex bg-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-200 flex flex-col bg-slate-50/50">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search chats..." 
              className="pl-10 bg-white border-slate-200 h-10"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-8">
            {/* Channels */}
            <div>
              <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Channels</h3>
                <button 
                  type="button" 
                  onClick={() => setNewChannelModal(true)}
                  title="Create Channel"
                  className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-0.5">
                {channels
                  .filter(ch => ch.name.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((ch) => {
                    const isSelected = activeChat.id === ch.id;
                    return (
                      <div 
                        key={ch.id}
                        onClick={() => {
                          setActiveChat({ id: ch.id, name: ch.name, isChannel: true });
                          setChannels(channels.map(c => c.id === ch.id ? { ...c, unread: 0 } : c));
                        }}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors group ${
                          isSelected ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-200/50 text-slate-600'
                        }`}
                      >
                        <div className="flex items-center space-x-2.5 font-medium truncate">
                          <Hash className={`h-4 w-4 shrink-0 ${isSelected ? 'text-white' : 'text-slate-400 group-hover:text-primary'}`} />
                          <span className="text-sm truncate">{ch.name}</span>
                        </div>
                        {ch.unread > 0 && !isSelected && (
                          <Badge className="bg-primary text-white h-5 min-w-[20px] px-1 flex items-center justify-center text-[10px] border-none shrink-0">
                            {ch.unread}
                          </Badge>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Direct Messages */}
            <div>
              <div className="flex items-center justify-between mb-2 px-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Direct Messages</h3>
                <button 
                  type="button" 
                  onClick={() => setNewDmModal(true)}
                  title="New Direct Message"
                  className="p-1 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-0.5">
                {directMessages
                  .filter(dm => dm.name.toLowerCase().includes(searchFilter.toLowerCase()))
                  .map((dm) => {
                    const isSelected = activeChat.id === dm.id;
                    return (
                      <div 
                        key={dm.id}
                        onClick={() => setActiveChat({ id: dm.id, name: dm.name, isChannel: false })}
                        className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg cursor-pointer transition-colors group ${
                          isSelected ? 'bg-blue-600 text-white shadow-sm' : 'hover:bg-slate-200/50 text-slate-600'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <Avatar className="h-8 w-8 border border-slate-200 shadow-sm">
                            <AvatarFallback className={`${isSelected ? 'bg-blue-700 text-white' : 'bg-white text-slate-600'} text-xs font-bold`}>
                              {dm.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-50 ${dm.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                        </div>
                        <span className="text-sm font-medium truncate">{dm.name}</span>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Profile Mini */}
        <div className="p-4 border-t border-slate-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">ME</AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 leading-tight truncate">Missionary Worker</p>
                <p className="text-xs text-emerald-500 font-medium leading-none mt-1">Online</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toast.info('Missionary Profile Status: Verified & Encrypted')}
              className="h-8 w-8 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Chat Header */}
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10 bg-white">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0">
              {activeChat.isChannel ? <Hash className="h-6 w-6 font-bold" /> : <User className="h-6 w-6" />}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-none mb-1">{activeChat.name}</h2>
              <p className="text-xs text-slate-500 font-medium">
                {activeChat.isChannel ? 'Secured Group • Active field room' : 'Encrypted Direct Session'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleStartCall('audio')}
              title="Voice Call"
              className="text-slate-500 hover:text-primary cursor-pointer"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => handleStartCall('video')}
              title="Video Briefing"
              className="text-slate-500 hover:text-primary cursor-pointer"
            >
              <Video className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6 mx-2" />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => toast.info(`Viewing settings for ${activeChat.name}`)}
              title="Channel Options"
              className="text-slate-500 cursor-pointer"
            >
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <AnimatePresence initial={false}>
              {currentMessages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start space-x-3 ${msg.self ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  {!msg.self && (
                    <Avatar className="h-9 w-9 shrink-0 mt-1">
                      <AvatarFallback className="bg-slate-100 text-slate-600 font-bold text-xs">{msg.sender[0]}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className={`max-w-[70%] space-y-1 ${msg.self ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!msg.self && <span className="text-xs font-bold text-slate-500 ml-1">{msg.sender}</span>}
                    <div className={`px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed ${
                      msg.self 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-slate-100 text-slate-800 rounded-tl-none'
                    }`}>
                      {msg.text}
                      {msg.attachment && (
                        <div className="mt-2.5 pt-2 border-t border-white/20">
                          {msg.attachment.type.startsWith('image/') ? (
                            <a href={msg.attachment.url} target="_blank" rel="noreferrer" className="block overflow-hidden rounded-xl bg-black/5">
                              <img src={msg.attachment.url} alt={msg.attachment.name} className="max-h-60 rounded-xl object-contain hover:opacity-95" />
                            </a>
                          ) : msg.attachment.type.startsWith('audio/') ? (
                            <div className="p-2 bg-white/95 text-slate-900 rounded-xl shadow-xs space-y-1">
                              <p className="text-[11px] font-semibold truncate text-slate-700">{msg.attachment.name}</p>
                              <audio controls src={msg.attachment.url} className="w-full h-8" />
                            </div>
                          ) : (
                            <a
                              href={msg.attachment.url}
                              download={msg.attachment.name}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-2 p-2 px-3 rounded-xl bg-white/95 text-slate-900 text-xs font-semibold hover:bg-white shadow-xs transition-colors"
                            >
                              <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                              <span className="truncate max-w-[160px]">{msg.attachment.name}</span>
                              <span className="text-[10px] text-slate-500">({formatFileSize(msg.attachment.size)})</span>
                              <Download className="w-3.5 h-3.5 text-slate-400 hover:text-blue-600 ml-1 shrink-0" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-1 px-1">
                      <span className="text-[10px] text-slate-400 font-medium uppercase">{msg.time}</span>
                      {msg.self && <CheckCheck className="h-3 w-3 text-emerald-500" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-200 bg-white relative">
          {showEmojiPicker && (
            <div className="absolute bottom-20 right-6 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-30 flex gap-2">
              {['🙏', '❤️', '🔥', '🙌', '✝️', '🌍', '✨', '📖'].map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => addEmoji(em)}
                  className="text-xl p-2 hover:bg-slate-100 rounded-lg transition-transform hover:scale-125"
                >
                  {em}
                </button>
              ))}
            </div>
          )}

          <div className="max-w-4xl mx-auto">
            {/* Hidden device file inputs */}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={(e) => handleDeviceFileUpload(e.target.files)}
            />
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleDeviceFileUpload(e.target.files)}
            />
            <input
              ref={audioInputRef}
              type="file"
              accept="audio/*"
              capture="user"
              className="hidden"
              onChange={(e) => handleDeviceFileUpload(e.target.files)}
            />

            {/* Pending Attachment Preview Banner */}
            {isUploadingAttachment && (
              <div className="mb-2 p-2.5 px-4 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2.5 text-xs text-blue-700 font-medium animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span>Uploading file from your gadget...</span>
              </div>
            )}

            {attachment && (
              <div className="mb-2 p-2 px-3 bg-white border border-blue-200 rounded-2xl flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    {attachment.fileType.startsWith('image/') ? (
                      <ImageIcon className="w-4 h-4" />
                    ) : attachment.fileType.startsWith('audio/') ? (
                      <Mic className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-800 truncate">{attachment.originalName}</p>
                    <p className="text-[10px] text-slate-500">{formatFileSize(attachment.size)} • Ready to send</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="p-1 text-slate-400 hover:text-rose-500 rounded-full hover:bg-rose-50 transition-colors"
                  title="Remove attachment"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="relative group">
              <div className="absolute left-3 bottom-3 flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-8 w-8 text-slate-400 hover:text-primary cursor-pointer"
                  title="Attach File from Computer or Phone"
                >
                  <Plus className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="h-8 w-8 text-slate-400 hover:text-primary cursor-pointer"
                  title="Attach Photo / Camera on Phone"
                >
                  <ImageIcon className="h-5 w-5" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button"
                  onClick={() => audioInputRef.current?.click()}
                  className="h-8 w-8 text-slate-400 hover:text-primary cursor-pointer"
                  title="Upload Voice Note / Audio"
                >
                  <Mic className="h-5 w-5" />
                </Button>
              </div>
              <textarea
                placeholder={`Message #${activeChat.name}... (Press Enter to send)`}
                className="w-full min-h-[52px] max-h-[150px] p-4 pl-32 pr-20 bg-slate-100 border-none rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm leading-relaxed"
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <div className="absolute right-3 bottom-3 flex items-center space-x-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="h-8 w-8 text-slate-400 hover:text-primary cursor-pointer"
                  title="Add Emoji"
                >
                  <Smile className="h-5 w-5" />
                </Button>
                <Button 
                  type="button"
                  onClick={handleSendMessage}
                  className={`h-9 w-9 rounded-xl transition-all shadow-lg cursor-pointer ${(message.trim() || attachment) ? 'bg-primary text-white translate-y-0 opacity-100' : 'bg-slate-200 text-slate-400 translate-y-1 opacity-50'}`}
                  title="Send Message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-[10px] text-slate-400 text-center mt-3 font-medium uppercase tracking-widest">
              End-to-end encrypted messaging
            </p>
          </div>
        </div>
      </div>

      {/* Call Modal */}
      {callState && callState.active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md">
          <div className="bg-slate-800 text-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-700">
            <div className="w-20 h-20 rounded-full bg-blue-600/30 border border-blue-500 flex items-center justify-center mx-auto mb-4 animate-pulse">
              {callState.type === 'video' ? <Video className="h-10 w-10 text-blue-400" /> : <Phone className="h-10 w-10 text-blue-400" />}
            </div>
            <h3 className="text-xl font-bold">{callState.target}</h3>
            <p className="text-xs text-slate-400 mt-1 mb-6">Secured encrypted {callState.type} session...</p>
            <div className="flex items-center justify-center gap-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-12 w-12 rounded-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => toast.info('Microphone muted')}
              >
                <MicOff className="h-5 w-5" />
              </Button>
              {callState.type === 'video' && (
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-12 w-12 rounded-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => toast.info('Camera toggled')}
                >
                  <VideoOff className="h-5 w-5" />
                </Button>
              )}
              <Button 
                onClick={() => {
                  setCallState(null);
                  toast.info('Call ended');
                }}
                className="h-12 w-12 rounded-full bg-rose-600 hover:bg-rose-700 text-white"
              >
                <PhoneOff className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Channel */}
      {newChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Create New Channel</h3>
              <button onClick={() => setNewChannelModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateChannel} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Channel Name</label>
                <Input 
                  value={newChannelName} 
                  onChange={(e) => setNewChannelName(e.target.value)}
                  placeholder="e.g. Sudan Relief Coordination"
                  required 
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setNewChannelModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary text-white font-bold">Create Channel</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Direct Message */}
      {newDmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">New Direct Message</h3>
              <button onClick={() => setNewDmModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDm} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Worker Name / Handle</label>
                <Input 
                  value={newDmName} 
                  onChange={(e) => setNewDmName(e.target.value)}
                  placeholder="e.g. Priscilla Vance"
                  required 
                />
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setNewDmModal(false)}>Cancel</Button>
                <Button type="submit" className="bg-primary text-white font-bold">Start Message</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

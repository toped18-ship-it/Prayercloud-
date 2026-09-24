import React, { useState, useEffect, useRef } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  PhoneOff, 
  Monitor, 
  Hand, 
  MessageSquare, 
  Users, 
  Radio, 
  Download, 
  Play, 
  Share2, 
  Sparkles, 
  Clock, 
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';

interface CallParticipant {
  id: string;
  name: string;
  role: string;
  country: string;
  isMuted: boolean;
  isVideoOff: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
}

interface CallHistoryItem {
  id: string;
  roomName: string;
  type: 'Video Conference' | 'Voice Intercession';
  date: string;
  duration: string;
  participantsCount: number;
  recordingUrl?: string;
}

export default function CallsPage() {
  const { user } = useAuth();
  const [activeCall, setActiveCall] = useState(false);
  const [roomName, setRoomName] = useState('Global Prayer Room #1');
  const [callType, setCallType] = useState<'video' | 'voice'>('video');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [activeTab, setActiveTab] = useState<'conference' | 'history'>('conference');
  const [inCallChat, setInCallChat] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Sister Ruth (Sahel)', text: 'Praising God for breakthrough in the village!', time: '14:02' },
    { sender: 'Pastor Andrew', text: 'Joining in agreement. Praying for peace in the border provinces.', time: '14:04' }
  ]);
  const [newChatMessage, setNewChatMessage] = useState('');
  const [showChatPanel, setShowChatPanel] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);

  const [participants, setParticipants] = useState<CallParticipant[]>([
    {
      id: 'p1',
      name: user?.displayName || 'You (Field Worker)',
      role: 'Intercessor',
      country: 'Global',
      isMuted: false,
      isVideoOff: false,
      isHandRaised: false,
      isSpeaking: true
    },
    {
      id: 'p2',
      name: 'Brother Joshua',
      role: 'Missionary',
      country: 'Somalia',
      isMuted: true,
      isVideoOff: false,
      isHandRaised: false,
      isSpeaking: false
    },
    {
      id: 'p3',
      name: 'Sister Esther',
      role: 'Prayer Leader',
      country: 'Nigeria',
      isMuted: false,
      isVideoOff: true,
      isHandRaised: true,
      isSpeaking: false
    }
  ]);

  const [callHistory, setCallHistory] = useState<CallHistoryItem[]>([
    {
      id: 'h1',
      roomName: 'Sahel Unreached Intercession',
      type: 'Video Conference',
      date: 'Today, 10:00 AM',
      duration: '45 mins',
      participantsCount: 14,
      recordingUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
    },
    {
      id: 'h2',
      roomName: 'Middle East Church Planting Briefing',
      type: 'Voice Intercession',
      date: 'Yesterday, 04:30 PM',
      duration: '1 hr 12 mins',
      participantsCount: 8,
      recordingUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    },
    {
      id: 'h3',
      roomName: 'Himalayan Frontier Task Force',
      type: 'Video Conference',
      date: 'Sep 21, 2026',
      duration: '38 mins',
      participantsCount: 19
    }
  ]);

  // Duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeCall) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleStartCall = () => {
    setActiveCall(true);
    toast.success(`Joined encrypted room: ${roomName}`, {
      description: 'WebRTC end-to-end active with high-definition audio & video'
    });
  };

  const handleLeaveCall = () => {
    if (isRecording) {
      toast.info('Meeting recording saved to Cloud Recordings library');
    }
    setActiveCall(false);
    setIsRecording(false);
    setIsScreenSharing(false);
    toast.info('Call ended');
  };

  const toggleRecording = () => {
    setIsRecording((prev) => {
      const next = !prev;
      if (next) {
        toast.success('Recording started', {
          description: 'Audio & video stream captured securely for PRAYERCLOUD archive'
        });
      } else {
        toast.info('Recording saved to your Recordings module');
        // Add to history
        const newHist: CallHistoryItem = {
          id: `h${Date.now()}`,
          roomName,
          type: callType === 'video' ? 'Video Conference' : 'Voice Intercession',
          date: 'Just now',
          duration: formatTime(callDuration),
          participantsCount: participants.length,
          recordingUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        };
        setCallHistory([newHist, ...callHistory]);
      }
      return next;
    });
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatMessage.trim()) return;
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    setInCallChat([...inCallChat, {
      sender: user?.displayName || 'You',
      text: newChatMessage.trim(),
      time: timeStr
    }]);
    setNewChatMessage('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
            Encrypted WebRTC Calling Center
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Voice & Video Rooms
          </h1>
          <p className="text-slate-600 text-sm">
            Host high-definition prayer summits, frontline missionary briefings, and strategy conferences.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={activeTab === 'conference' ? 'default' : 'outline'}
            onClick={() => setActiveTab('conference')}
            className="rounded-xl cursor-pointer"
          >
            <Video className="w-4 h-4 mr-2" /> Live Conference
          </Button>
          <Button
            variant={activeTab === 'history' ? 'default' : 'outline'}
            onClick={() => setActiveTab('history')}
            className="rounded-xl cursor-pointer"
          >
            <Clock className="w-4 h-4 mr-2" /> Call Recordings ({callHistory.length})
          </Button>
        </div>
      </div>

      {activeTab === 'conference' ? (
        activeCall ? (
          /* ACTIVE CALL SCREEN */
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className={showChatPanel ? 'lg:col-span-3 space-y-4' : 'lg:col-span-4 space-y-4'}>
              {/* Call Stage */}
              <div className="relative aspect-video bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center">
                {/* Header indicators */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                  <Badge className="bg-red-600 text-white font-mono flex items-center gap-1.5 px-3 py-1">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    LIVE • {formatTime(callDuration)}
                  </Badge>
                  {isRecording && (
                    <Badge className="bg-amber-500 text-slate-950 font-bold flex items-center gap-1.5">
                      <Radio className="w-3 h-3 animate-spin" /> REC
                    </Badge>
                  )}
                  <Badge variant="outline" className="bg-black/40 text-white border-white/20 backdrop-blur-sm">
                    {roomName}
                  </Badge>
                </div>

                <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
                  <Badge className="bg-emerald-600/90 text-white flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> 256-Bit Encrypted
                  </Badge>
                </div>

                {/* Video Feeds Simulation Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 w-full h-full">
                  {participants.map((p, idx) => (
                    <div
                      key={p.id}
                      className={`relative rounded-2xl overflow-hidden bg-slate-900 border ${
                        p.isSpeaking ? 'border-blue-500 shadow-md shadow-blue-500/30' : 'border-slate-800'
                      } flex flex-col items-center justify-center`}
                    >
                      {p.isVideoOff || (idx === 0 && isVideoOff) ? (
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-bold text-2xl flex items-center justify-center shadow-lg">
                          {p.name.charAt(0)}
                        </div>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center relative">
                          <img
                            src={`https://images.unsplash.com/photo-${1534528741775 + idx * 1000}?auto=format&fit=crop&w=400&q=80`}
                            alt={p.name}
                            className="w-full h-full object-cover opacity-85"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                        </div>
                      )}

                      {/* Participant tag */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                        <span className="font-semibold bg-black/60 px-2 py-0.5 rounded backdrop-blur-xs truncate max-w-[120px]">
                          {p.name} {idx === 0 ? '(You)' : ''}
                        </span>
                        <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded">
                          {p.isHandRaised && <Hand className="w-3.5 h-3.5 text-amber-400" />}
                          {p.isMuted || (idx === 0 && isMuted) ? (
                            <MicOff className="w-3.5 h-3.5 text-red-400" />
                          ) : (
                            <Mic className="w-3.5 h-3.5 text-emerald-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Raised Hand Banner */}
                {isHandRaised && (
                  <div className="absolute bottom-20 z-20 bg-amber-400 text-slate-950 font-bold px-4 py-1.5 rounded-full text-xs flex items-center gap-2 shadow-lg animate-bounce">
                    <Hand className="w-4 h-4" /> Your hand is raised to pray / share
                  </div>
                )}
              </div>

              {/* Call Controls Bar */}
              <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-900 rounded-3xl border border-slate-800 shadow-xl">
                <Button
                  variant={isMuted ? 'destructive' : 'secondary'}
                  size="lg"
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-2xl h-12 px-5 cursor-pointer"
                >
                  {isMuted ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
                  {isMuted ? 'Unmute' : 'Mute'}
                </Button>

                <Button
                  variant={isVideoOff ? 'destructive' : 'secondary'}
                  size="lg"
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className="rounded-2xl h-12 px-5 cursor-pointer"
                >
                  {isVideoOff ? <VideoOff className="w-5 h-5 mr-2" /> : <Video className="w-5 h-5 mr-2" />}
                  {isVideoOff ? 'Turn On Camera' : 'Stop Video'}
                </Button>

                <Button
                  variant={isScreenSharing ? 'default' : 'secondary'}
                  size="lg"
                  onClick={() => {
                    setIsScreenSharing(!isScreenSharing);
                    toast.info(isScreenSharing ? 'Screen sharing stopped' : 'Screen sharing active');
                  }}
                  className="rounded-2xl h-12 px-5 cursor-pointer"
                >
                  <Monitor className="w-5 h-5 mr-2" />
                  {isScreenSharing ? 'Stop Share' : 'Share Screen'}
                </Button>

                <Button
                  variant={isHandRaised ? 'default' : 'secondary'}
                  size="lg"
                  onClick={() => {
                    setIsHandRaised(!isHandRaised);
                    toast.info(isHandRaised ? 'Hand lowered' : 'Hand raised for prayer intercession');
                  }}
                  className="rounded-2xl h-12 px-5 cursor-pointer"
                >
                  <Hand className="w-5 h-5 mr-2" />
                  {isHandRaised ? 'Lower Hand' : 'Raise Hand'}
                </Button>

                <Button
                  variant={isRecording ? 'destructive' : 'secondary'}
                  size="lg"
                  onClick={toggleRecording}
                  className="rounded-2xl h-12 px-5 cursor-pointer"
                >
                  <Radio className={`w-5 h-5 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
                  {isRecording ? 'Stop Rec' : 'Record'}
                </Button>

                <Button
                  variant={showChatPanel ? 'default' : 'secondary'}
                  size="lg"
                  onClick={() => setShowChatPanel(!showChatPanel)}
                  className="rounded-2xl h-12 px-5 cursor-pointer"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Chat
                </Button>

                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleLeaveCall}
                  className="rounded-2xl h-12 px-6 bg-red-600 hover:bg-red-700 font-bold cursor-pointer"
                >
                  <PhoneOff className="w-5 h-5 mr-2" />
                  Leave Room
                </Button>
              </div>
            </div>

            {/* In-Call Side Chat */}
            {showChatPanel && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl flex flex-col h-[520px]">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm">Meeting Chat</h3>
                  <Button variant="ghost" size="sm" onClick={() => setShowChatPanel(false)} className="h-7 w-7 p-0">
                    ✕
                  </Button>
                </div>

                <div className="flex-1 p-4 overflow-y-auto space-y-3">
                  {inCallChat.map((m, i) => (
                    <div key={i} className="text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="font-bold text-slate-700">{m.sender}</span>
                        <span>{m.time}</span>
                      </div>
                      <p className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-800">
                        {m.text}
                      </p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="p-3 border-t border-slate-100 flex gap-2">
                  <Input
                    value={newChatMessage}
                    onChange={(e) => setNewChatMessage(e.target.value)}
                    placeholder="Type scripture or prayer..."
                    className="text-xs h-9 rounded-xl"
                  />
                  <Button type="submit" size="sm" className="h-9 px-3 rounded-xl bg-blue-600 text-white">
                    Send
                  </Button>
                </form>
              </div>
            )}
          </div>
        ) : (
          /* JOIN / CREATE ROOM LOBBY */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-slate-200/80 shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-slate-900">Start or Join a Room</CardTitle>
                  <CardDescription>
                    Connect instantly with up to 100 global missionaries, pastors, and prayer coordinators.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Room Name / Strategy Channel
                    </label>
                    <Input
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      placeholder="e.g. Sahel Sahara Intercession"
                      className="rounded-xl h-11"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Mode
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        onClick={() => setCallType('video')}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          callType === 'video'
                            ? 'border-blue-600 bg-blue-50/60'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Video className="w-6 h-6 text-blue-600 mb-2" />
                        <h4 className="font-bold text-slate-900 text-sm">HD Video Conference</h4>
                        <p className="text-xs text-slate-500 mt-1">Multi-participant video, screen sharing & recording.</p>
                      </div>

                      <div
                        onClick={() => setCallType('voice')}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                          callType === 'voice'
                            ? 'border-blue-600 bg-blue-50/60'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <Mic className="w-6 h-6 text-blue-600 mb-2" />
                        <h4 className="font-bold text-slate-900 text-sm">Voice Intercession</h4>
                        <p className="text-xs text-slate-500 mt-1">Low-bandwidth optimized for frontline field areas.</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Button
                      size="lg"
                      onClick={handleStartCall}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 font-bold h-12 cursor-pointer"
                    >
                      <Play className="w-5 h-5 mr-2" /> Launch Encrypted Room
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        toast.success('Room invitation link copied to clipboard!');
                      }}
                      className="rounded-xl h-12 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 mr-2" /> Copy Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Active Scheduled Rooms */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900">Active Scheduled Rooms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: '10/40 Window Intercession Hour', time: 'Everyday 06:00 UTC', participants: 42, active: true },
                    { name: 'Somali Language Bible Translation Council', time: 'Live Now', participants: 9, active: true },
                    { name: 'Pastoral Care for Persecuted Workers', time: 'Today 18:00 UTC', participants: 16, active: false }
                  ].map((room, idx) => (
                    <Card key={idx} className="border-slate-200/80 hover:border-blue-300 transition-all">
                      <CardContent className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          {room.active ? (
                            <Badge className="bg-emerald-600 text-white text-xs">Live Now</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">{room.time}</Badge>
                          )}
                          <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                            <Users className="w-3.5 h-3.5" /> {room.participants} Online
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-base">{room.name}</h4>
                        <Button
                          size="sm"
                          onClick={() => {
                            setRoomName(room.name);
                            handleStartCall();
                          }}
                          className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          Join Session
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Security & Tips */}
            <div className="space-y-6">
              <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg">Missionary Security Protocol</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    All audio and video traffic is encrypted peer-to-peer using WebRTC DTLS-SRTP standards. Workers in high-risk territories can turn off camera and obscure backgrounds safely.
                  </p>
                  <div className="space-y-2 text-xs text-slate-700 pt-2 border-t border-blue-200/60 font-medium">
                    <p>✓ Low-latency bandwidth adaptation</p>
                    <p>✓ Cloud recording with storage quotas</p>
                    <p>✓ Screen sharing for mission maps and reports</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
      ) : (
        /* CALL RECORDINGS TAB */
        <div className="space-y-6">
          <Card className="border-slate-200/80 shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Cloud Meeting & Prayer Recordings</CardTitle>
              <CardDescription>
                Review, playback, or download audio and video meetings recorded during missionary summits.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {callHistory.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 gap-4 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                        {item.type === 'Video Conference' ? <Video className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{item.roomName}</h4>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.type} • {item.date} • Duration: {item.duration} • {item.participantsCount} Workers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {item.recordingUrl ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              window.open(item.recordingUrl, '_blank');
                              toast.success(`Opening playback for ${item.roomName}`);
                            }}
                            className="rounded-xl text-xs cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 mr-1 text-blue-600" /> Play Recording
                          </Button>
                          <a
                            href={item.recordingUrl}
                            download={`${item.roomName}.mp4`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 border border-slate-200 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors"
                            title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        </>
                      ) : (
                        <Badge variant="outline" className="text-xs text-slate-400">
                          No Recording
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

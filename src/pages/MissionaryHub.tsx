import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
    Users, 
    Search, 
    Video, 
    Mic, 
    FileText, 
    Globe, 
    ChevronRight, 
    Star, 
    Plus, 
    Download, 
    ThumbsUp, 
    MessageSquare, 
    X,
    Music
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PermissionGate } from '../components/auth/PermissionGate';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { FileUploadZone } from '../components/ui/FileUploadZone';
import { formatFileSize, type UploadedFileResult } from '../lib/fileUpload';

interface GroupItem {
  id: string;
  name: string;
  members: number;
  activity: string;
  category: string;
}

interface ResourceItem {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  downloads: number;
  url?: string;
}

interface ForumPost {
  id: string;
  title: string;
  author: string;
  role: string;
  time: string;
  content: string;
  upvotes: number;
  replies: number;
  hasUpvoted?: boolean;
  attachment?: {
    url: string;
    name: string;
    size: number;
    type: string;
  };
}

export default function MissionaryHub() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('groups');
  
  // Groups State
  const [groups, setGroups] = useState<GroupItem[]>([
    { id: 'g1', name: 'Middle East Strategy', members: 42, activity: 'High', category: 'Strategy' },
    { id: 'g2', name: 'India Rural Outreach', members: 156, activity: 'Extreme', category: 'Field' },
    { id: 'g3', name: 'Global Intercessors', members: 2400, activity: 'Moderate', category: 'Prayer' },
    { id: 'g4', name: 'Bible Translation Hub', members: 89, activity: 'Constant', category: 'Translation' },
  ]);
  const [createGroupModal, setCreateGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupCategory, setNewGroupCategory] = useState('Strategy');

  // Active Sessions State
  const [joinedSessions, setJoinedSessions] = useState<Record<string, boolean>>({});

  // Resources State
  const [resourceSearch, setResourceSearch] = useState('');
  const [resourceFilter, setResourceFilter] = useState('All');
  const [resources, setResources] = useState<ResourceItem[]>([
    { id: 'r1', name: 'Security Protocol V2.pdf', type: 'PDF', size: '2.4MB', category: 'Security', downloads: 840 },
    { id: 'r2', name: 'Pashto Gospel Tracks', type: 'Audio', size: '15MB', category: 'Language', downloads: 312 },
    { id: 'r3', name: 'Rural Outreach Guide', type: 'Manual', size: '8.1MB', category: 'Field', downloads: 1205 },
    { id: 'r4', name: 'Inductive Study Template.docx', type: 'DOCX', size: '480KB', category: 'Discipleship', downloads: 950 },
    { id: 'r5', name: 'Digital Security For Missionaries.pdf', type: 'PDF', size: '3.1MB', category: 'Security', downloads: 2150 },
  ]);

  // Forum State
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: 'f1',
      title: 'Best practices for secure messaging in restrictive zones',
      author: 'David K.',
      role: 'Regional Director',
      time: '2 hours ago',
      content: 'When operating in Tier-1 surveillance regions, what backup offline mesh systems are field teams currently utilizing for check-ins?',
      upvotes: 24,
      replies: 9,
      hasUpvoted: false
    },
    {
      id: 'f2',
      title: 'Praise report: First fellowship formed among the Badawi',
      author: 'Sister Ruth',
      role: 'Pioneer Worker',
      time: '5 hours ago',
      content: 'After 18 months of silent prayer walks, three family heads welcomed the Word! Please continue standing with us for discipleship wisdom.',
      upvotes: 89,
      replies: 23,
      hasUpvoted: true
    }
  ]);
  const [newPostModal, setNewPostModal] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [postAttachment, setPostAttachment] = useState<UploadedFileResult | null>(null);

  // Resource Upload Modal State
  const [uploadResourceModal, setUploadResourceModal] = useState(false);
  const [newResourceName, setNewResourceName] = useState('');
  const [newResourceCategory, setNewResourceCategory] = useState('Manuals');
  const [uploadedResourceFile, setUploadedResourceFile] = useState<UploadedFileResult | null>(null);

  // Group Handlers
  const handleOpenRoom = (roomName: string) => {
    toast.success(`Connecting to ${roomName}...`);
    navigate('/chat');
  };

  const handleCreateGroupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim()) return;
    const newGroup: GroupItem = {
      id: `g${Date.now()}`,
      name: newGroupName,
      category: newGroupCategory,
      members: 1,
      activity: 'New'
    };
    setGroups([newGroup, ...groups]);
    setNewGroupName('');
    setCreateGroupModal(false);
    toast.success(`Strategic group "${newGroupName}" created!`);
  };

  const toggleSession = (sessionTitle: string) => {
    setJoinedSessions(prev => {
      const isJoined = !!prev[sessionTitle];
      const next = !isJoined;
      if (next) {
        toast.success(`Joined ${sessionTitle}! Synchronizing stream...`);
      } else {
        toast.info(`Disconnected from ${sessionTitle}`);
      }
      return { ...prev, [sessionTitle]: next };
    });
  };

  const handleDownloadResource = (res: ResourceItem) => {
    setResources(prev => prev.map(r => r.id === res.id ? { ...r, downloads: r.downloads + 1 } : r));
    if (res.url) {
      const link = document.createElement('a');
      link.href = res.url;
      link.download = res.name;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloaded ${res.name}`, { description: `File size: ${res.size}` });
    } else {
      toast.success(`Downloading ${res.name}...`, {
        description: `File size: ${res.size}`
      });
    }
  };

  const toggleUpvote = (postId: string) => {
    setForumPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isVoted = post.hasUpvoted;
        return {
          ...post,
          upvotes: isVoted ? post.upvotes - 1 : post.upvotes + 1,
          hasUpvoted: !isVoted
        };
      }
      return post;
    }));
  };

  const handleNewPostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    const newPost: ForumPost = {
      id: `f${Date.now()}`,
      title: newPostTitle,
      author: 'You (Missionary)',
      role: 'Field Worker',
      time: 'Just now',
      content: newPostContent,
      upvotes: 1,
      replies: 0,
      hasUpvoted: true,
      attachment: postAttachment ? {
        url: postAttachment.url,
        name: postAttachment.originalName,
        size: postAttachment.size,
        type: postAttachment.fileType
      } : undefined
    };
    setForumPosts([newPost, ...forumPosts]);
    setNewPostTitle('');
    setNewPostContent('');
    setPostAttachment(null);
    setNewPostModal(false);
    toast.success('Discussion thread published to global forum!');
  };

  const handleUploadResourceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceName.trim() || !uploadedResourceFile) {
      toast.error('Please attach a file from your gadget');
      return;
    }
    const ext = uploadedResourceFile.originalName.split('.').pop()?.toUpperCase() || 'PDF';
    const newRes: ResourceItem = {
      id: `r${Date.now()}`,
      name: newResourceName.trim(),
      type: ext,
      size: formatFileSize(uploadedResourceFile.size),
      category: newResourceCategory,
      downloads: 0,
      url: uploadedResourceFile.url
    };
    setResources([newRes, ...resources]);
    setNewResourceName('');
    setUploadedResourceFile(null);
    setUploadResourceModal(false);
    toast.success(`Resource "${newRes.name}" uploaded to field toolkit!`);
  };

  const filteredResources = resources.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(resourceSearch.toLowerCase());
    const matchesCategory = resourceFilter === 'All' || r.category === resourceFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div className="space-y-1">
                <h1 className="text-4xl font-bold font-display text-slate-900 tracking-tight">Missionary Hub</h1>
                <p className="text-slate-500 text-lg">Central command for global mission collaboration.</p>
            </div>
            <div className="flex items-center space-x-2">
                <PermissionGate permission="manage_users">
                  <Button 
                    onClick={() => setCreateGroupModal(true)}
                    className="bg-primary text-white h-11 px-6 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 cursor-pointer"
                  >
                      <Plus className="mr-2 h-5 w-5" /> Create Group
                  </Button>
                </PermissionGate>
            </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="bg-slate-100 p-1 rounded-xl h-14">
                <TabsTrigger value="groups" className="rounded-lg px-8 h-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all cursor-pointer">
                    Strategic Groups
                </TabsTrigger>
                <TabsTrigger value="resources" className="rounded-lg px-8 h-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all cursor-pointer">
                    Resource Library
                </TabsTrigger>
                <TabsTrigger value="forum" className="rounded-lg px-8 h-full data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all cursor-pointer">
                    Discussion Forum
                </TabsTrigger>
            </TabsList>

            {/* TAB 1: STRATEGIC GROUPS */}
            <TabsContent value="groups" className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {groups.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <Card 
                                onClick={() => handleOpenRoom(item.name)}
                                className="hover:shadow-md hover:border-primary/50 transition-all cursor-pointer group active:scale-[0.98]"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-primary/5 transition-colors">
                                            <Globe className="h-5 w-5 text-primary" />
                                        </div>
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wider">{item.category}</Badge>
                                    </div>
                                    <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">{item.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center text-sm text-slate-500 space-x-4 mb-4">
                                        <span className="flex items-center"><Users className="h-3.5 w-3.5 mr-1" /> {item.members}</span>
                                        <span className="flex items-center"><Star className="h-3.5 w-3.5 mr-1 text-amber-500" /> {item.activity}</span>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenRoom(item.name);
                                      }}
                                      className="w-full text-slate-600 group-hover:text-primary group-hover:bg-primary/5 px-4 justify-between transition-all"
                                    >
                                        Open Room <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Active Strategy Sessions */}
                    <Card className="lg:col-span-2 border-slate-200">
                        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50 pb-6">
                            <div>
                                <CardTitle className="text-xl">Active Strategy Sessions</CardTitle>
                                <CardDescription>Live video and audio coordination</CardDescription>
                            </div>
                            <Badge className="bg-rose-100 text-rose-600 hover:bg-rose-100 border-none px-3 py-1 animate-pulse">3 Live Now</Badge>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            {[
                                { title: 'Middle East Vision 2030', lead: 'Dr. Samuel K.', participants: 8, type: 'Video' },
                                { title: 'North India Prayer Strike', lead: 'Abraham M.', participants: 156, type: 'Audio' },
                                { title: 'West Africa Logistics', lead: 'Sarah T.', participants: 4, type: 'Video' },
                            ].map((session, i) => {
                                const isJoined = joinedSessions[session.title];
                                return (
                                  <div key={i} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-all group">
                                      <div className="flex items-center space-x-4">
                                          <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                              {session.lead[0]}
                                          </div>
                                          <div>
                                              <p className="font-bold text-slate-900 group-hover:text-primary transition-colors">{session.title}</p>
                                              <p className="text-xs text-slate-500">Led by {session.lead} • {session.participants} in session</p>
                                          </div>
                                      </div>
                                      <div className="flex items-center space-x-3">
                                          {session.type === 'Video' ? <Video className="h-5 w-5 text-slate-400 group-hover:text-primary" /> : <Mic className="h-5 w-5 text-slate-400 group-hover:text-primary" />}
                                          <Button 
                                              size="sm" 
                                              onClick={() => toggleSession(session.title)}
                                              className={`h-9 px-4 rounded-lg transition-all cursor-pointer ${
                                                isJoined ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-primary text-white hover:bg-primary/90'
                                              }`}
                                          >
                                              {isJoined ? 'Joined ✓' : 'Join'}
                                          </Button>
                                      </div>
                                  </div>
                                );
                            })}
                        </CardContent>
                    </Card>

                    {/* Resources Preview */}
                    <Card className="border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-xl">Top Resources</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {resources.slice(0, 3).map((res) => (
                                <div 
                                    key={res.id} 
                                    onClick={() => handleDownloadResource(res)}
                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 cursor-pointer group active:scale-95 transition-all border border-transparent hover:border-slate-100"
                                >
                                    <div className="flex items-center space-x-3">
                                      <FileText className="h-8 w-8 text-slate-400 group-hover:text-primary transition-colors" />
                                      <div>
                                          <p className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{res.name}</p>
                                          <p className="text-[10px] text-slate-500 uppercase tracking-widest">{res.type} • {res.size}</p>
                                      </div>
                                    </div>
                                    <Download className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                                </div>
                            ))}
                            <Button 
                                variant="outline" 
                                onClick={() => setActiveTab('resources')}
                                className="w-full mt-4 hover:bg-slate-50 hover:text-primary hover:border-primary/50 transition-all cursor-pointer"
                            >
                                Browse Full Library
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </TabsContent>

            {/* TAB 2: RESOURCE LIBRARY */}
            <TabsContent value="resources" className="space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input 
                    placeholder="Search documents, field manuals, translation audio..."
                    value={resourceSearch}
                    onChange={(e) => setResourceSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {['All', 'Security', 'Field', 'Language', 'Discipleship'].map((cat) => (
                    <Button
                      key={cat}
                      size="sm"
                      variant={resourceFilter === cat ? "default" : "outline"}
                      onClick={() => setResourceFilter(cat)}
                      className="text-xs h-9 cursor-pointer"
                    >
                      {cat}
                    </Button>
                  ))}
                  <Button
                    size="sm"
                    onClick={() => setUploadResourceModal(true)}
                    className="bg-primary text-white text-xs h-9 ml-auto cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Upload Tool
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredResources.map((res) => (
                  <Card key={res.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                          <FileText className="h-6 w-6" />
                        </div>
                        <Badge variant="outline">{res.category}</Badge>
                      </div>
                      <CardTitle className="text-base mt-3 leading-snug">{res.name}</CardTitle>
                      <CardDescription>{res.type} Format • {res.size} • {res.downloads} downloads</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        onClick={() => handleDownloadResource(res)}
                        className="w-full bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
                      >
                        <Download className="mr-2 h-4 w-4" /> Download File
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* TAB 3: DISCUSSION FORUM */}
            <TabsContent value="forum" className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Missionary Discussion Forum</h2>
                  <p className="text-sm text-slate-500">Secure peer conversations between verified global field workers.</p>
                </div>
                <Button 
                  onClick={() => setNewPostModal(true)}
                  className="bg-primary text-white cursor-pointer"
                >
                  <Plus className="mr-2 h-4 w-4" /> Start Discussion
                </Button>
              </div>

              <div className="space-y-4">
                {forumPosts.map((post) => (
                  <Card key={post.id} className="border-slate-200">
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 hover:text-primary transition-colors cursor-pointer">
                            {post.title}
                          </h3>
                          <p className="text-xs text-slate-400 mt-1">
                            Posted by <span className="font-semibold text-slate-600">{post.author}</span> ({post.role}) • {post.time}
                          </p>
                        </div>
                      </div>
                      <p className="text-slate-700 text-sm leading-relaxed">
                        {post.content}
                      </p>

                      {/* Attachment preview in forum post */}
                      {post.attachment && (
                        <div className="pt-2">
                          {post.attachment.type.startsWith('image/') ? (
                            <div className="rounded-2xl overflow-hidden border border-slate-200 max-w-md bg-slate-50">
                              <a href={post.attachment.url} target="_blank" rel="noreferrer">
                                <img src={post.attachment.url} alt={post.attachment.name} className="w-full max-h-72 object-cover hover:opacity-95 transition-opacity" />
                              </a>
                              <div className="p-2 text-xs text-slate-500 font-medium flex justify-between items-center bg-white border-t border-slate-100">
                                <span className="truncate">{post.attachment.name}</span>
                                <span>{formatFileSize(post.attachment.size)}</span>
                              </div>
                            </div>
                          ) : post.attachment.type.startsWith('audio/') ? (
                            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 max-w-md space-y-2">
                              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                                <Music className="w-4 h-4 text-blue-600" />
                                <span className="truncate">{post.attachment.name}</span>
                                <span className="text-slate-400 font-normal">({formatFileSize(post.attachment.size)})</span>
                              </div>
                              <audio controls src={post.attachment.url} className="w-full h-8" />
                            </div>
                          ) : (
                            <a
                              href={post.attachment.url}
                              download={post.attachment.name}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-3 p-3 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100 shadow-2xs transition-colors"
                            >
                              <FileText className="w-5 h-5 text-blue-600 shrink-0" />
                              <div>
                                <p className="font-bold truncate max-w-xs">{post.attachment.name}</p>
                                <p className="text-[10px] text-slate-500 font-normal">{formatFileSize(post.attachment.size)} • Click to download</p>
                              </div>
                              <Download className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
                            </a>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-4 pt-2 border-t border-slate-100">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toggleUpvote(post.id)}
                          className={`h-8 px-3 text-xs font-semibold cursor-pointer ${
                            post.hasUpvoted ? 'text-primary bg-primary/10' : 'text-slate-600'
                          }`}
                        >
                          <ThumbsUp className="mr-1.5 h-3.5 w-3.5" />
                          {post.upvotes} Upvotes
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => toast.info(`Viewing replies for "${post.title}"`)}
                          className="h-8 px-3 text-xs font-semibold text-slate-600 cursor-pointer"
                        >
                          <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
                          {post.replies} Replies
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
        </Tabs>

        {/* Modal: Create Group */}
        {createGroupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Create Strategic Group</h3>
                <button onClick={() => setCreateGroupModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Group Name</label>
                  <Input 
                    value={newGroupName} 
                    onChange={(e) => setNewGroupName(e.target.value)} 
                    placeholder="e.g. Sahel Sahara Church Planting" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Strategy Focus</label>
                  <select 
                    value={newGroupCategory} 
                    onChange={(e) => setNewGroupCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Strategy">Strategy</option>
                    <option value="Field">Field Operations</option>
                    <option value="Prayer">Intercession & Prayer</option>
                    <option value="Translation">Bible Translation</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setCreateGroupModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary text-white font-bold">Create Group</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Start Discussion */}
        {newPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-900">Start Discussion</h3>
                <button onClick={() => setNewPostModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleNewPostSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Thread Title</label>
                  <Input 
                    value={newPostTitle} 
                    onChange={(e) => setNewPostTitle(e.target.value)} 
                    placeholder="Subject of field topic or inquiry..." 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Topic Details</label>
                  <textarea 
                    rows={4}
                    value={newPostContent} 
                    onChange={(e) => setNewPostContent(e.target.value)} 
                    placeholder="Share context, questions, or guidance for field workers..." 
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    required 
                  />
                </div>

                {/* Upload field evidence from gadget */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Attach Field Asset (Optional)</label>
                  <FileUploadZone
                    onFileUploaded={(file) => setPostAttachment(file)}
                    label="Attach file from phone or computer"
                    sublabel="Photos, voice recordings, PDFs, or field data"
                  />
                </div>

                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setNewPostModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary text-white font-bold">Post Thread</Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Upload Toolkit Resource */}
        {uploadResourceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Upload Toolkit Resource</h3>
                  <p className="text-xs text-slate-500">Add documents, security checklists, or translation tools</p>
                </div>
                <button onClick={() => setUploadResourceModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleUploadResourceSubmit} className="space-y-4">
                <FileUploadZone
                  onFileUploaded={(file) => {
                    setUploadedResourceFile(file);
                    if (!newResourceName.trim()) {
                      setNewResourceName(file.originalName.replace(/\.[^/.]+$/, ''));
                    }
                  }}
                  label="Select file from gadget"
                  sublabel="Upload PDF, DOCX, ZIP, or audio file directly from your computer or phone"
                />

                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Resource Title</label>
                  <Input 
                    value={newResourceName} 
                    onChange={(e) => setNewResourceName(e.target.value)} 
                    placeholder="e.g. 2026 Security Handbook" 
                    required 
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 block mb-1">Category</label>
                  <select 
                    value={newResourceCategory} 
                    onChange={(e) => setNewResourceCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="Security">Security</option>
                    <option value="Field">Field Operations</option>
                    <option value="Language">Language & Translation</option>
                    <option value="Discipleship">Discipleship & Training</option>
                    <option value="Manuals">Manuals & Handbooks</option>
                  </select>
                </div>
                <div className="pt-4 flex justify-end gap-2">
                  <Button type="button" variant="ghost" onClick={() => setUploadResourceModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-primary text-white font-bold">Publish to Toolkit</Button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}

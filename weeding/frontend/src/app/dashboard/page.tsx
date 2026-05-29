'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Heart,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Users,
  Calendar,
  MapPin,
  Eye,
  Copy,
  Check,
  Layout,
  Music,
  Paintbrush,
  Settings,
  BarChart3,
  QrCode,
  ScanLine,
  HelpCircle,
  FileText,
  UserCheck,
  Star,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as ChartTooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { InvitationData, RSVPItem, GuestItem } from '../../types';
import ImageUploader from '../../components/upload/ImageUploader';
import AudioUploader from '../../components/upload/AudioUploader';
import GalleryUploader from '../../components/upload/GalleryUploader';

function ModernDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { user, token, isAuthenticated, isLoading, logout } = useAuthStore();

  // Sidebar navigation status
  const [sidebarTab, setSidebarTab] = useState<'invites' | 'analytics' | 'customizer' | 'qr'>('invites');
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'edit' | 'rsvp' | 'guests'>('list');
  const [selectedInviteId, setSelectedInviteId] = useState<string | null>(null);

  // QR Scan manual state
  const [qrInputToken, setQrInputToken] = useState('');
  const [qrVerifyMessage, setQrVerifyMessage] = useState<{ status: string; message: string } | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    subdomain: '',
    title: '',
    weddingDate: '',
    themeColor: '#085090',
    welcomeText: 'Kami mengundang Anda untuk merayakan pernikahan kami.',
    address: '',
    mapUrl: '',
    musicUrl: '',
    coverImage: '',
    templateCode: 'romantic',
  });

  // Customizer local states
  const [customTheme, setCustomTheme] = useState({
    primaryColor: '#085090',
    secondaryColor: '#d4af37',
    fontFamily: 'sans',
    animationStyle: 'fade',
    backgroundStyle: 'solid',
  });

  const [sections, setSections] = useState<Record<string, boolean>>({
    hero: true,
    bride: true,
    gallery: true,
    countdown: true,
    story: true,
    gift: true,
    rsvp: true,
    maps: true,
    music: true,
  });

  const [galleries, setGalleries] = useState<{ imageUrl: string; caption: string }[]>([]);
  const [stories, setStories] = useState<{ date: string; title: string; content: string }[]>([]);

  // Guest fields
  const [guestName, setGuestName] = useState('');
  const [guestAddress, setGuestAddress] = useState('');
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Session checks
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Read callback URL reference for payment upgrades
  useEffect(() => {
    const payStatus = searchParams.get('payment');
    const payRef = searchParams.get('reference');
    if (payStatus === 'success' && payRef) {
      api.post('/payment/verify', { reference: payRef })
        .then(() => {
          alert('Pembayaran sukses! Undangan Anda telah di-upgrade ke premium.');
          queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
        })
        .catch(err => {
          console.error(err);
        });
    }
  }, [searchParams, queryClient]);

  // Fetch invitations
  const { data: invitations, isLoading: isInvitesLoading } = useQuery({
    queryKey: ['my-invitations', token],
    queryFn: async () => {
      const response = await api.get('/invitations/my');
      return response.data.data.invitations as (InvitationData & {
        _count: { rsvps: number; guests: number; analytics: number };
      })[];
    },
    enabled: isAuthenticated,
  });

  // Auto-select invitation for customizer/analytics if list loaded
  useEffect(() => {
    if (invitations && invitations.length > 0 && !selectedInviteId) {
      setSelectedInviteId(invitations[0].id);
      loadInviteCustomSettings(invitations[0]);
    }
  }, [invitations, selectedInviteId]);

  const loadInviteCustomSettings = (invite: InvitationData) => {
    if (invite.themeSettings) {
      setCustomTheme({
        primaryColor: invite.themeSettings.primaryColor,
        secondaryColor: invite.themeSettings.secondaryColor,
        fontFamily: invite.themeSettings.fontFamily,
        animationStyle: invite.themeSettings.animationStyle,
        backgroundStyle: invite.themeSettings.backgroundStyle,
      });
    }
    if (invite.sections) {
      const sectMap: Record<string, boolean> = {};
      invite.sections.forEach((s) => {
        sectMap[s.sectionName] = s.isEnabled;
      });
      setSections(prev => ({ ...prev, ...sectMap }));
    }
  };

  // Fetch RSVPs
  const { data: rsvps } = useQuery({
    queryKey: ['rsvps', selectedInviteId],
    queryFn: async () => {
      const response = await api.get(`/rsvp/invitation/${selectedInviteId}`);
      return response.data.data.rsvps as RSVPItem[];
    },
    enabled: !!selectedInviteId,
  });

  // Fetch Guests
  const { data: guests } = useQuery({
    queryKey: ['guests', selectedInviteId],
    queryFn: async () => {
      const response = await api.get(`/guests/invitation/${selectedInviteId}`);
      return response.data.data.guests as GuestItem[];
    },
    enabled: !!selectedInviteId,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post('/invitations', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
      setActiveTab('list');
      resetForm();
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Gagal membuat undangan.');
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) => {
      const response = await api.put(`/invitations/${id}`, payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
      setActiveTab('list');
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (confirm('Apakah Anda yakin ingin menghapus undangan ini?')) {
        await api.delete(`/invitations/${id}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
    },
  });

  const addGuestMutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await api.post('/guests', payload);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guests', selectedInviteId] });
      setGuestName('');
      setGuestAddress('');
    },
  });

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !selectedInviteId) return;
    addGuestMutation.mutate({
      invitationId: selectedInviteId,
      name: guestName,
      address: guestAddress,
    });
  };

  const saveCustomThemeMutation = useMutation({
    mutationFn: async () => {
      const sectPayload = Object.keys(sections).map((key) => ({
        sectionName: key,
        isEnabled: sections[key],
      }));
      await api.put(`/invitations/${selectedInviteId}`, {
        themeSettings: customTheme,
        sections: sectPayload,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-invitations'] });
      alert('Tema dan Modul berhasil disimpan!');
    },
  });

  const upgradeInvitationMutation = useMutation({
    mutationFn: async (inviteId: string) => {
      const response = await api.post('/payment/checkout', {
        invitationId: inviteId,
        amount: 150000, // Price for premium
      });
      return response.data.data;
    },
    onSuccess: (data) => {
      if (data.redirectUrl) {
        router.push(data.redirectUrl);
      }
    },
  });

  const verifyQrMutation = useMutation({
    mutationFn: async (tokenVal: string) => {
      setQrVerifyMessage(null);
      const response = await api.post('/guests/verify-qr', { qrToken: tokenVal });
      return response.data;
    },
    onSuccess: (data) => {
      setQrVerifyMessage({ status: 'success', message: `Check-in sukses! Tamu: ${data.data.guest.name}` });
      setQrInputToken('');
      queryClient.invalidateQueries({ queryKey: ['guests', selectedInviteId] });
    },
    onError: (err: any) => {
      setQrVerifyMessage({ status: 'error', message: err.response?.data?.message || 'Token QR tidak valid.' });
    },
  });

  const resetForm = () => {
    setFormData({
      subdomain: '',
      title: '',
      weddingDate: '',
      themeColor: '#085090',
      welcomeText: 'Kami mengundang Anda untuk merayakan pernikahan kami.',
      address: '',
      mapUrl: '',
      musicUrl: '',
      coverImage: '',
      templateCode: 'romantic',
    });
    setGalleries([]);
    setStories([]);
  };

  const handleEditClick = (invite: InvitationData) => {
    setSelectedInviteId(invite.id);
    setFormData({
      subdomain: invite.subdomain,
      title: invite.title,
      weddingDate: new Date(invite.weddingDate).toISOString().substring(0, 16),
      themeColor: invite.themeColor || '#085090',
      welcomeText: invite.welcomeText || '',
      address: invite.address || '',
      mapUrl: invite.mapUrl || '',
      musicUrl: invite.musicUrl || '',
      coverImage: invite.coverImage || '',
      templateCode: invite.templateCode,
    });
    setGalleries(invite.galleries?.map(g => ({ imageUrl: g.imageUrl, caption: g.caption || '' })) || []);
    setStories(invite.stories?.map(s => ({ date: new Date(s.date).toISOString().substring(0, 10), title: s.title, content: s.content })) || []);
    setActiveTab('edit');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      galleries,
      stories,
    };
    if (activeTab === 'create') {
      createMutation.mutate(payload);
    } else if (activeTab === 'edit' && selectedInviteId) {
      updateMutation.mutate({ id: selectedInviteId, payload });
    }
  };

  const copyGuestLink = (subdomain: string, name: string, code: string) => {
    const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000';
    const link = `http://${subdomain}.${domain}?to=${encodeURIComponent(name)}&code=${code}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(code);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  // Compile Analytics Dashboard Charts
  const activeInvite = invitations?.find((i) => i.id === selectedInviteId);

  // 1. Visitors timeline chart
  const visitorsTimelineData = [
    { date: '25 Mei', visits: 12 },
    { date: '26 Mei', visits: 19 },
    { date: '27 Mei', visits: 32 },
    { date: '28 Mei', visits: 25 },
    { date: '29 Mei', visits: activeInvite?._count.analytics || 45 },
  ];

  // 2. Device Breakdown
  const deviceData = [
    { name: 'Mobile', value: 70 },
    { name: 'Desktop', value: 25 },
    { name: 'Tablet', value: 5 },
  ];

  // 3. Browser Breakdown
  const browserData = [
    { name: 'Chrome', value: 60 },
    { name: 'Safari', value: 25 },
    { name: 'Firefox', value: 15 },
  ];

  const PIE_COLORS = ['#085090', '#d4af37', '#1e7ec8', '#b98e3b'];

  if (isLoading || isInvitesLoading) {
    return (
      <div className="min-h-screen bg-[#01070e] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-gold-500 animate-spin" />
        <span className="text-sm text-slate-400 font-medium ml-4">Memuat panel admin...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#01070e] flex flex-col md:flex-row font-sans text-slate-100 relative overflow-x-hidden">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[30vw] h-[30vw] bg-sapphire-600/5 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-5%] w-[40vw] h-[40vw] bg-gold-700/5 rounded-full filter blur-[150px] pointer-events-none" />

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 glass-premium text-slate-400 flex flex-col justify-between flex-shrink-0 border-r border-gold-500/10 relative z-10">
        <div>
          {/* Brand/Logo Header */}
          <div className="p-6 border-b border-slate-900 flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center bg-sapphire-950 border border-gold-500/20 rounded-full overflow-hidden shadow-inner">
              <img src="/logo1.png" alt="MBNP Logo" className="w-5 h-5 object-contain drop-shadow-[0_0_8px_rgba(8,80,144,0.6)]" />
            </div>
            <span className="font-cinzel text-sm font-bold tracking-[0.2em] text-white">
              MBNP <span className="text-gold-500">HUB</span>
            </span>
          </div>

          {/* Invitation Selector */}
          <div className="p-4 border-b border-slate-900 bg-slate-950/20">
            <label className="text-[9px] uppercase tracking-wider font-extrabold text-gold-500 block mb-1.5 font-mono">Kelola Undangan</label>
            <select
              value={selectedInviteId || ''}
              onChange={(e) => {
                setSelectedInviteId(e.target.value);
                const targetObj = invitations?.find(i => i.id === e.target.value);
                if (targetObj) loadInviteCustomSettings(targetObj);
              }}
              className="w-full bg-slate-950 border border-slate-800 text-white text-xs rounded-xl p-2.5 outline-none focus:border-gold-500/50 transition-colors"
            >
              {invitations?.map((invite) => (
                <option key={invite.id} value={invite.id} className="bg-slate-950 text-white">
                  {invite.title}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {[
              { id: 'invites', label: 'Undangan Saya', icon: <FileText size={16} /> },
              { id: 'analytics', label: 'Analitik Kunjungan', icon: <BarChart3 size={16} /> },
              { id: 'customizer', label: 'Desain Customizer', icon: <Paintbrush size={16} /> },
              { id: 'qr', label: 'Kehadiran QR', icon: <QrCode size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSidebarTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-[10px] font-bold tracking-wider uppercase rounded-xl transition-premium cursor-pointer ${
                  sidebarTab === tab.id
                    ? 'bg-gold-500 text-sapphire-950 shadow-lg shadow-gold-500/10'
                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* User Account / Logout */}
        <div className="p-4 border-t border-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-sapphire-950 border border-gold-500/20 text-gold-400 flex items-center justify-center font-bold text-sm">
              {user?.name.charAt(0).toUpperCase()}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-white leading-tight">{user?.name}</p>
              <p className="text-[10px] text-slate-500 leading-tight truncate mt-0.5">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); router.push('/'); }}
            className="w-full py-2.5 text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-950/10 hover:bg-rose-950/20 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-premium border border-rose-950"
          >
            <LogOut size={14} />
            <span>Keluar Hub</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <section className="flex-1 p-6 md:p-10 overflow-y-auto max-w-5xl w-full mx-auto relative z-10">
        
        {/* 1. INVITES WORKSPACE */}
        {sidebarTab === 'invites' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-cinzel font-bold text-white tracking-wide">Manajemen Undangan</h2>
              {activeTab !== 'list' && (
                <button
                  onClick={() => { setActiveTab('list'); resetForm(); }}
                  className="text-xs font-bold text-gold-500 hover:text-gold-400 transition-colors uppercase tracking-wider"
                >
                  ← Kembali ke Daftar
                </button>
              )}
            </div>

            {activeTab === 'list' && (
              <div>
                {invitations && invitations.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {invitations.map((invite) => {
                      const domain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000';
                      const inviteUrl = `http://${invite.subdomain}.${domain}`;
                      
                      return (
                        <div key={invite.id} className="glass-premium rounded-3xl p-6 flex flex-col justify-between hover:border-gold-500/30 transition-premium">
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] uppercase font-bold tracking-widest text-gold-400 bg-gold-500/10 border border-gold-500/25 px-3 py-1 rounded-full">
                                {invite.templateCode}
                              </span>
                              <div className="flex gap-2">
                                {invite.isPremium ? (
                                  <span className="text-[9px] uppercase font-bold tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/25 px-3 py-1 rounded-full flex items-center gap-1">
                                    <Star size={10} className="fill-amber-500" />
                                    <span>Premium</span>
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => upgradeInvitationMutation.mutate(invite.id)}
                                    disabled={upgradeInvitationMutation.isPending}
                                    className="text-[9px] uppercase font-bold tracking-widest text-sapphire-950 bg-gold-500 hover:bg-gold-400 px-3 py-1 rounded-full cursor-pointer shadow-lg shadow-gold-500/10 transition-colors"
                                  >
                                    Upgrade Pro
                                  </button>
                                )}
                              </div>
                            </div>

                            <h3 className="text-lg font-cinzel font-bold text-white mt-4 leading-tight">{invite.title}</h3>
                            <a
                              href={inviteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-slate-400 hover:text-gold-500 transition-colors block truncate mt-1 w-full"
                            >
                              {invite.subdomain}.{domain}
                            </a>

                            <div className="mt-4 border-t border-b border-slate-900/60 py-3 space-y-2">
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <Calendar size={14} className="text-gold-500" />
                                <span>{new Date(invite.weddingDate).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                              </div>
                              <div className="flex items-center gap-2 text-xs text-slate-400">
                                <MapPin size={14} className="flex-shrink-0 text-gold-500" />
                                <span className="truncate">{invite.address}</span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-6 space-y-2">
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => { setSelectedInviteId(invite.id); setActiveTab('rsvp'); }}
                                className="py-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 text-xs font-bold text-slate-300 border border-slate-800 flex justify-center items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <span>RSVP ({invite._count.rsvps})</span>
                              </button>
                              <button
                                onClick={() => { setSelectedInviteId(invite.id); setActiveTab('guests'); }}
                                className="py-2.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 text-xs font-bold text-slate-300 border border-slate-800 flex justify-center items-center gap-1.5 cursor-pointer transition-colors"
                              >
                                <Users size={12} />
                                <span>Tamu ({invite._count.guests})</span>
                              </button>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <button
                                onClick={() => handleEditClick(invite)}
                                className="py-2.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 text-xs font-bold text-gold-400 flex justify-center items-center gap-1.5 cursor-pointer transition-colors border border-gold-500/10"
                              >
                                <Edit size={12} />
                                <span>Edit Konten</span>
                              </button>
                              <button
                                onClick={() => deleteMutation.mutate(invite.id)}
                                className="py-2.5 rounded-xl bg-rose-950/20 hover:bg-rose-950/40 text-xs font-bold text-rose-400 flex justify-center items-center gap-1.5 cursor-pointer transition-colors border border-rose-950/20"
                              >
                                <Trash2 size={12} />
                                <span>Hapus</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="glass-premium rounded-3xl p-12 text-center max-w-md mx-auto">
                    <Heart className="text-gold-500/20 fill-gold-500/5 mx-auto mb-4 animate-bounce" size={48} />
                    <h3 className="text-base font-cinzel font-bold text-white">Mulai Undangan Pertama</h3>
                    <p className="text-xs text-slate-400 mt-2 max-w-xs mx-auto leading-relaxed">
                      Anda belum memiliki undangan terdaftar. Buat dan kustomisasi sesuai tema pernikahan impian Anda.
                    </p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="mt-6 px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-sapphire-950 font-black text-xs tracking-widest uppercase shadow-md transition-premium cursor-pointer flex items-center gap-1.5 mx-auto"
                    >
                      <Plus size={14} />
                      <span>Buat Undangan Baru</span>
                    </button>
                  </div>
                )}

                {invitations && invitations.length > 0 && (
                  <button
                    onClick={() => setActiveTab('create')}
                    className="fixed bottom-6 right-6 p-4 rounded-full bg-gold-500 hover:bg-gold-400 text-sapphire-950 shadow-xl shadow-gold-500/20 cursor-pointer flex items-center justify-center hover:scale-105 transition-all z-10 border border-gold-300/20"
                  >
                    <Plus size={24} />
                  </button>
                )}
              </div>
            )}

            {/* CREATE / EDIT FORM */}
            {(activeTab === 'create' || activeTab === 'edit') && (
              <div className="glass-premium p-6 sm:p-8 rounded-3xl border border-gold-500/10 shadow-2xl">
                <form onSubmit={handleFormSubmit} className="space-y-6">
                  
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Subdomain</label>
                      <div className="flex rounded-xl border border-slate-800 overflow-hidden bg-slate-950/50 focus-within:border-gold-500/40">
                        <input
                          type="text"
                          required
                          disabled={activeTab === 'edit'}
                          value={formData.subdomain}
                          onChange={(e) => setFormData({ ...formData, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                          placeholder="andi-salsa"
                          className="px-4 py-3 bg-transparent text-sm w-full focus:outline-none text-white disabled:opacity-60"
                        />
                        <span className="bg-slate-900 text-slate-400 px-3 flex items-center text-xs border-l border-slate-800">
                          .{process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:3000'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Judul Undangan</label>
                      <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="The Wedding of Andi & Salsa"
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:outline-none focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/10 text-sm transition-all text-white placeholder:text-slate-700"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Tanggal Pernikahan</label>
                      <input
                        type="datetime-local"
                        required
                        value={formData.weddingDate}
                        onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:outline-none focus:border-gold-500/50 text-white text-sm"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Pilihan Template</label>
                      <select
                        value={formData.templateCode}
                        onChange={(e) => setFormData({ ...formData, templateCode: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:outline-none focus:border-gold-500/50 text-white text-sm"
                      >
                        <option value="romantic" className="bg-[#01070e]">Romantic (Rose Pink)</option>
                        <option value="islami" className="bg-[#01070e]">Islami (Green & Gold)</option>
                        <option value="luxury" className="bg-[#01070e]">Luxury (Dark & Gold)</option>
                        <option value="minimal" className="bg-[#01070e]">Minimal (Monochrome)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Welcome Text</label>
                    <textarea
                      value={formData.welcomeText}
                      onChange={(e) => setFormData({ ...formData, welcomeText: e.target.value })}
                      placeholder="Maha Suci Allah yang menyatukan kami..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:outline-none focus:border-gold-500/50 text-white text-sm placeholder:text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Alamat Acara</label>
                    <textarea
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Gedung Grand Ballroom, Lantai 2"
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:outline-none focus:border-gold-500/50 text-white text-sm placeholder:text-slate-700"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Link Google Maps (URL)</label>
                      <input
                        type="url"
                        value={formData.mapUrl}
                        onChange={(e) => setFormData({ ...formData, mapUrl: e.target.value })}
                        placeholder="https://maps.google.com/..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-800 bg-slate-950/50 focus:outline-none focus:border-gold-500/50 text-white text-sm placeholder:text-slate-700"
                      />
                    </div>

                    <div>
                      <ImageUploader
                        value={formData.coverImage}
                        onChange={(url) => setFormData({ ...formData, coverImage: url || '' })}
                        type="covers"
                        label="Foto Sampul Undangan"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-900 pt-5">
                    <AudioUploader
                      value={formData.musicUrl}
                      onChange={(url) => setFormData({ ...formData, musicUrl: url || '' })}
                    />
                  </div>

                  {/* Galleries Dynamic Lists */}
                  <div className="border-t border-slate-900 pt-5">
                    <GalleryUploader
                      values={galleries.map((g, idx) => ({ id: String(idx), imageUrl: g.imageUrl, sortOrder: idx }))}
                      onChange={(items) => setGalleries(items.map(item => ({ imageUrl: item.imageUrl, caption: '' })))}
                      label="Galeri Foto Pernikahan"
                    />
                  </div>

                  {/* Stories list */}
                  <div className="border-t border-slate-900 pt-5">
                    <div className="flex justify-between items-center mb-3">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Kisah Cinta (Timeline)</label>
                      <button
                        type="button"
                        onClick={() => setStories([...stories, { date: '', title: '', content: '' }])}
                        className="text-[10px] font-bold text-gold-500 hover:text-gold-400 transition-colors uppercase tracking-wider"
                      >
                        + Tambah Kisah
                      </button>
                    </div>
                    {stories.map((s, idx) => (
                      <div key={idx} className="p-4 bg-slate-950/30 border border-slate-900 rounded-xl mb-3 space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="date"
                            required
                            value={s.date}
                            onChange={(e) => {
                              const newS = [...stories];
                              newS[idx].date = e.target.value;
                              setStories(newS);
                            }}
                            className="w-full px-3 py-2 border border-slate-800 text-xs rounded-xl text-white bg-slate-950"
                          />
                          <input
                            type="text"
                            required
                            placeholder="Momen (Misal: Tunangan)"
                            value={s.title}
                            onChange={(e) => {
                              const newS = [...stories];
                              newS[idx].title = e.target.value;
                              setStories(newS);
                            }}
                            className="w-full px-3 py-2 border border-slate-800 text-xs rounded-xl text-white bg-slate-950 placeholder:text-slate-700"
                          />
                        </div>
                        <textarea
                          required
                          placeholder="Detail Momen..."
                          rows={2}
                          value={s.content}
                          onChange={(e) => {
                            const newS = [...stories];
                            newS[idx].content = e.target.value;
                            setStories(newS);
                          }}
                          className="w-full px-3 py-2 border border-slate-800 text-xs rounded-xl text-white bg-slate-950 placeholder:text-slate-700"
                        />
                        <button
                          type="button"
                          onClick={() => setStories(stories.filter((_, i) => i !== idx))}
                          className="text-rose-400 hover:text-rose-300 text-[10px] font-bold"
                        >
                          Hapus Momen Ini
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex gap-3">
                    <button
                      type="submit"
                      disabled={createMutation.isPending || updateMutation.isPending}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-sapphire-950 font-black text-xs tracking-widest uppercase transition-premium cursor-pointer shadow-lg shadow-gold-500/10"
                    >
                      Simpan Konten
                    </button>
                    <button
                      type="button"
                      onClick={() => { setActiveTab('list'); resetForm(); }}
                      className="px-6 py-3 rounded-xl bg-slate-950/50 border border-slate-800 text-slate-300 hover:text-white font-bold text-xs tracking-widest uppercase transition-premium cursor-pointer"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* RSVPs lists */}
            {activeTab === 'rsvp' && (
              <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-2xl">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gold-500 mb-4 font-mono">RSVP Masuk</h3>
                {rsvps && rsvps.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[9px]">
                          <th className="py-3 px-4">Nama</th>
                          <th className="py-3 px-4">Kehadiran</th>
                          <th className="py-3 px-4">Tamu</th>
                          <th className="py-3 px-4">Pesan</th>
                          <th className="py-3 px-4">Waktu</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rsvps.map((r) => (
                          <tr key={r.id} className="border-b border-slate-900/60 text-slate-300 hover:bg-white/5 transition-colors">
                            <td className="py-3 px-4 font-bold text-white">{r.name}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                                r.attendance ? 'bg-emerald-950/80 border border-emerald-500/20 text-emerald-400' : 'bg-rose-950/80 border border-rose-500/20 text-rose-400'
                              }`}>
                                {r.attendance ? 'Hadir' : 'Absen'}
                              </span>
                            </td>
                            <td className="py-3 px-4">{r.guestCount} Orang</td>
                            <td className="py-3 px-4 italic text-slate-400">{r.message || '-'}</td>
                            <td className="py-3 px-4 text-slate-500">
                              {new Date(r.createdAt).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 text-center py-6">Belum ada RSVP terkirim.</p>
                )}
              </div>
            )}

            {/* Guests lists */}
            {activeTab === 'guests' && (
              <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-2xl space-y-6">
                <form onSubmit={handleAddGuest} className="p-4 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col sm:flex-row gap-3 items-end">
                  <div className="w-full">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Nama Tamu</label>
                    <input
                      type="text"
                      required
                      placeholder="Bapak Budi Santoso"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-800 bg-slate-950 text-xs rounded-xl focus:border-gold-500/50 focus:outline-none text-white placeholder:text-slate-700"
                    />
                  </div>
                  <div className="w-full">
                    <label className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5 font-mono">Alamat</label>
                    <input
                      type="text"
                      placeholder="Jakarta Selatan"
                      value={guestAddress}
                      onChange={(e) => setGuestAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-800 bg-slate-950 text-xs rounded-xl focus:border-gold-500/50 focus:outline-none text-white placeholder:text-slate-700"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={addGuestMutation.isPending}
                    className="w-full sm:w-auto px-5 py-2.5 bg-gold-500 hover:bg-gold-400 disabled:bg-slate-800 text-sapphire-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer"
                  >
                    Tambah
                  </button>
                </form>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[9px]">
                        <th className="py-3 px-4">Nama Tamu</th>
                        <th className="py-3 px-4">Alamat</th>
                        <th className="py-3 px-4">Status QR</th>
                        <th className="py-3 px-4 text-center">Tindakan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests?.map((g) => (
                        <tr key={g.id} className="border-b border-slate-900/60 text-slate-300 hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4 font-bold text-white">{g.name}</td>
                          <td className="py-3 px-4">{g.address || '-'}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded-full font-bold text-[9px] ${
                              g.isAttended ? 'bg-emerald-950/80 border border-emerald-500/20 text-emerald-400' : 'bg-slate-950/80 border border-slate-800 text-slate-500'
                            }`}>
                              {g.isAttended ? 'Checked-in' : 'Belum Hadir'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => copyGuestLink(activeInvite?.subdomain || '', g.name, g.code)}
                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors ${
                                copiedLink === g.code
                                  ? 'bg-emerald-950 border-emerald-500/20 text-emerald-400'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-gold-500/30 hover:text-gold-400'
                              }`}
                            >
                              {copiedLink === g.code ? <Check size={12} /> : <Copy size={12} />}
                              <span>{copiedLink === g.code ? 'Tersalin' : 'Link Undangan'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. ANALYTICS WORKSPACE */}
        {sidebarTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="text-xl font-cinzel font-bold text-white tracking-wide">Analitik Kunjungan Platform</h2>
            
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-lg flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block font-mono">Total Kunjungan</span>
                  <span className="text-3xl font-cinzel font-bold text-white mt-2 block">{activeInvite?._count.analytics || 0}</span>
                </div>
                <p className="text-[10px] text-emerald-400 mt-3 font-bold flex items-center gap-1">
                  <TrendingUp size={12} />
                  <span>↑ 12% dari minggu lalu</span>
                </p>
              </div>
              <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-lg flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block font-mono">Konfirmasi RSVP</span>
                  <span className="text-3xl font-cinzel font-bold text-white mt-2 block">{activeInvite?._count.rsvps || 0}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-3 font-medium">Dari {activeInvite?._count.guests || 0} tamu terdaftar</p>
              </div>
              <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-lg flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 block font-mono">Rasio Kehadiran QR</span>
                  <span className="text-3xl font-cinzel font-bold text-white mt-2 block">
                    {guests?.filter(g => g.isAttended).length || 0}
                  </span>
                </div>
                <p className="text-[10px] text-gold-500 mt-3 font-bold">Tamu checked-in via QR code</p>
              </div>
            </div>

            {/* Recharts Timeline Graph */}
            <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-lg">
              <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6 font-mono">Tren Pengunjung (5 Hari Terakhir)</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={visitorsTimelineData}>
                    <defs>
                      <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#d4af37" stopOpacity={0.25}/>
                        <stop offset="95%" stopColor="#d4af37" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#475569" fontSize={10} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                    <ChartTooltip contentStyle={{ backgroundColor: '#020b18', borderColor: '#d4af3733', borderRadius: '12px', color: '#fff' }} />
                    <Area type="monotone" dataKey="visits" stroke="#d4af37" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Charts Breakdown Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-lg flex flex-col justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono">Metrik Browser</h3>
                <div className="h-44 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={browserData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {browserData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip contentStyle={{ backgroundColor: '#020b18', borderColor: '#d4af3733', borderRadius: '12px', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-400 mt-4">
                  {browserData.map((b, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                      <span>{b.name} ({b.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-lg flex flex-col justify-between">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 font-mono">Metrik Perangkat (Device)</h3>
                <div className="h-44 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={65}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip contentStyle={{ backgroundColor: '#020b18', borderColor: '#d4af3733', borderRadius: '12px', color: '#fff' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-400 mt-4">
                  {deviceData.map((d, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx] }} />
                      <span>{d.name} ({d.value}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. THEME CUSTOMIZER WORKSPACE */}
        {sidebarTab === 'customizer' && (
          <div className="space-y-6">
            <h2 className="text-xl font-cinzel font-bold text-white tracking-wide">Customizer & Pengelola Modul</h2>
            
            <div className="grid sm:grid-cols-2 gap-6 items-start">
              
              {/* Controls panel */}
              <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-2xl space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">Setelan Warna</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Warna Utama (Primary)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={customTheme.primaryColor}
                          onChange={(e) => setCustomTheme({ ...customTheme, primaryColor: e.target.value })}
                          className="w-10 h-10 border-none rounded-lg cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-400 uppercase">{customTheme.primaryColor}</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-slate-500 block mb-1">Warna Kedua (Secondary)</label>
                      <div className="flex gap-2 items-center">
                        <input
                          type="color"
                          value={customTheme.secondaryColor}
                          onChange={(e) => setCustomTheme({ ...customTheme, secondaryColor: e.target.value })}
                          className="w-10 h-10 border-none rounded-lg cursor-pointer bg-transparent"
                        />
                        <span className="text-xs font-mono text-slate-400 uppercase">{customTheme.secondaryColor}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">Setelan Tipografi</h3>
                  <label className="text-[10px] font-semibold text-slate-500 block mb-1">Font Family</label>
                  <select
                    value={customTheme.fontFamily}
                    onChange={(e) => setCustomTheme({ ...customTheme, fontFamily: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-800 text-xs text-white bg-slate-950 focus:outline-none"
                  >
                    <option value="sans">Modern Sans-Serif (Inter)</option>
                    <option value="serif">Elegant Serif (Playfair Display)</option>
                  </select>
                </div>

                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3 font-mono">Modul / Section Toggle</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'hero', label: 'Tampilan Hero' },
                      { id: 'bride', label: 'Mempelai' },
                      { id: 'gallery', label: 'Galeri Foto' },
                      { id: 'countdown', label: 'Countdown' },
                      { id: 'story', label: 'Timeline Kisah' },
                      { id: 'maps', label: 'Peta & Lokasi' },
                      { id: 'rsvp', label: 'Form RSVP' },
                      { id: 'music', label: 'Musik Latar' },
                    ].map((sec) => (
                      <label key={sec.id} className="flex items-center gap-2.5 p-2.5 border border-slate-800 rounded-xl hover:bg-white/5 cursor-pointer text-xs font-semibold text-slate-300">
                        <input
                          type="checkbox"
                          checked={sections[sec.id] !== false}
                          onChange={(e) => setSections({ ...sections, [sec.id]: e.target.checked })}
                          className="rounded text-gold-500 focus:ring-gold-500 bg-slate-950 border-slate-800"
                        />
                        <span>{sec.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => saveCustomThemeMutation.mutate()}
                  disabled={saveCustomThemeMutation.isPending}
                  className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-sapphire-950 rounded-xl font-black text-xs uppercase shadow-lg shadow-gold-500/10 cursor-pointer border border-gold-300/20"
                >
                  {saveCustomThemeMutation.isPending ? 'Menyimpan...' : 'Simpan Setelan Tema'}
                </button>
              </div>

              {/* Live Preview panel */}
              <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-2xl flex flex-col justify-between">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-1 font-mono">
                    <Paintbrush size={14} className="text-gold-500" />
                    <span>Live Preview Mockup</span>
                  </h3>
                  
                  {/* Simulated card utilizing local states */}
                  <div
                    className="aspect-[4/5] rounded-[2.5rem] border border-gold-500/10 shadow-inner flex flex-col items-center justify-center text-center p-6 transition-all duration-300 relative overflow-hidden ring-1 ring-gold-500/20 bg-slate-950"
                    style={{
                      fontFamily: customTheme.fontFamily === 'serif' ? 'Playfair Display, serif' : 'Inter, sans-serif',
                    }}
                  >
                    {sections.music && (
                      <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gold-500/10 flex items-center justify-center text-gold-400 animate-spin-slow">
                        <Music size={12} />
                      </div>
                    )}
                    <span className="text-[8px] font-bold tracking-[0.3em] uppercase mb-4" style={{ color: customTheme.secondaryColor }}>
                      THE WEDDING OF
                    </span>
                    <h4 className="text-2xl font-cinzel font-bold mb-4" style={{ color: customTheme.primaryColor }}>
                      {activeInvite?.title || 'Andi & Salsa'}
                    </h4>
                    
                    {sections.countdown && (
                      <div className="flex gap-1.5 justify-center my-4 scale-90">
                        {['12d', '08h', '45m'].map((t, idx) => (
                          <div key={idx} className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-[9px] font-bold" style={{ color: customTheme.primaryColor }}>
                            {t}
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-[9px] text-slate-400 max-w-[180px] leading-relaxed italic">
                      "{activeInvite?.welcomeText || 'Kami mengundang Anda...'}"
                    </p>
                  </div>
                </div>
                
                <p className="text-[10px] text-slate-500 mt-4 leading-relaxed text-center font-mono">
                  Mockup di atas menggunakan skema warna dan tipografi kustom Anda saat ini.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* 4. QR ATTENDANCE WORKSPACE */}
        {sidebarTab === 'qr' && (
          <div className="space-y-6">
            <h2 className="text-xl font-cinzel font-bold text-white tracking-wide">Sistem Kehadiran QR Code</h2>

            <div className="grid sm:grid-cols-2 gap-6 items-start">
              
              {/* QR scanner input simulation */}
              <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-2xl space-y-6">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">Simulasi Scanner QR Code</h3>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                    Masukkan token unik QR tamu di bawah untuk mendaftarkan kehadiran check-in (simulasi scan webcam).
                  </p>
                  
                  <div className="flex rounded-xl border border-slate-800 overflow-hidden bg-slate-950/50 focus-within:border-gold-500/40">
                    <input
                      type="text"
                      placeholder="Masukkan Token (Misal: qr-RONI-COLLEAGUE-12345)"
                      value={qrInputToken}
                      onChange={(e) => setQrInputToken(e.target.value)}
                      className="px-4 py-3 bg-transparent text-xs w-full focus:outline-none text-white font-mono placeholder:text-slate-700"
                    />
                  </div>
                </div>

                {qrVerifyMessage && (
                  <div className={`p-4 rounded-xl border text-xs flex gap-2.5 items-center ${
                    qrVerifyMessage.status === 'success'
                      ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400'
                      : 'bg-rose-950/40 border-rose-500/20 text-rose-400'
                  }`}>
                    {qrVerifyMessage.status === 'success' ? <UserCheck size={16} /> : <ScanLine size={16} />}
                    <span>{qrVerifyMessage.message}</span>
                  </div>
                )}

                <button
                  onClick={() => verifyQrMutation.mutate(qrInputToken)}
                  disabled={verifyQrMutation.isPending || !qrInputToken.trim()}
                  className="w-full py-3.5 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-sapphire-950 rounded-xl font-black text-xs uppercase tracking-widest transition-premium flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-gold-500/10 border border-gold-300/20"
                >
                  <ScanLine size={14} />
                  <span>{verifyQrMutation.isPending ? 'Verifikasi...' : 'Verifikasi Kehadiran'}</span>
                </button>
              </div>

              {/* QR display list */}
              <div className="glass-premium p-6 rounded-3xl border border-gold-500/10 shadow-2xl space-y-4">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-mono">Daftar Token Kehadiran Tamu</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed mb-4">
                  Daftar token QR untuk disalin dan disimulasikan pada panel sebelah kiri.
                </p>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {guests && guests.length > 0 ? (
                    guests.map((g) => (
                      <div key={g.id} className="p-3 bg-slate-950/40 border border-slate-900 rounded-xl flex items-center justify-between">
                        <div className="truncate pr-4">
                          <p className="text-xs font-bold text-white">{g.name}</p>
                          <p className="text-[9px] font-mono text-slate-500 mt-0.5 truncate">{g.qrToken || 'Tidak ada QR token'}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            g.isAttended ? 'bg-emerald-950/80 border border-emerald-500/20 text-emerald-400' : 'bg-slate-950/80 border border-slate-800 text-slate-500'
                          }`}>
                            {g.isAttended ? 'Hadir' : 'Absen'}
                          </span>
                          {g.qrToken && (
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(g.qrToken || '');
                                alert('Token berhasil disalin!');
                              }}
                              className="text-slate-500 hover:text-gold-500 transition-colors p-1"
                              title="Salin Token"
                            >
                              <Copy size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 text-center py-6">Belum ada tamu terdaftar.</p>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </section>
    </div>
  );
}

export default function ModernDashboardWrapper() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center font-sans text-slate-200">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-gold-500 animate-spin" />
        <span className="text-sm font-medium text-slate-400 mt-4">Memuat Dashboard...</span>
      </div>
    }>
      <ModernDashboard />
    </Suspense>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Phone, 
  MessageCircle, 
  Trophy, 
  ChevronRight, 
  ChevronDown, 
  Play, 
  Search, 
  MapPin, 
  Heart, 
  X, 
  Bell, 
  Home, 
  MessageSquare,
  Sparkles, 
  TrendingUp,
  Activity,
  Clock,
  MoreVertical,
  Menu,
  CheckCircle2,
  Layers,
  Info,
  Linkedin,
  Star,
  Share
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

// --- Components ---

const Badge = ({ text, color = "bg-gray-100 text-gray-700", icon }: { text: string; color?: string; icon?: React.ReactNode }) => (
  <div className={`px-3 py-1 rounded-md flex items-center gap-1.5 text-xs font-medium ${color}`}>
    {icon}
    {text}
  </div>
);

const Tooltip = ({ text, children }: { text: string; children: React.ReactNode }) => {
  const [show, setShow] = useState(false);
  return (
    <div className="relative inline-block" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-black text-white text-[10px] rounded shadow-lg pointer-events-none text-center"
          >
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-black" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Switch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none flex-shrink-0 ${checked ? 'bg-[#1C8C64]' : 'bg-gray-200'}`}
  >
    <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

export default function App() {
  const [showFollowModal, setShowFollowModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingType, setBookingType] = useState<'Viewing' | 'Consultation'>('Viewing');
  const [bookingStep, setBookingStep] = useState(0);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [selectedListingId, setSelectedListingId] = useState<number | null>(null);
  const [modalSearchQuery, setModalSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState<'29' | '30'>('29');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [lookingTo, setLookingTo] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [isFollowing, setIsFollowing] = useState(false);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'Overview' | 'Active listings' | 'Transactions'>('Active listings');
  const [transactionFilter, setTransactionFilter] = useState<'Sold' | 'Rented'>('Sold');
  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'listing',
      title: 'New listing alerts',
      description: 'Be the first to see homes Fiona adds in Dubai Marina and Downtown.',
      icon: <Home className="w-5 h-5 text-gray-500" />,
      enabled: false
    },
    {
      id: 'stories',
      title: 'New TruBroker Stories',
      description: 'Daily building tours, market takes and walkthroughs from Fiona.',
      icon: <Sparkles className="w-5 h-5 text-gray-500" />,
      enabled: false
    }
  ]);

  const toggleNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  const handleFollowClick = () => {
    if (!isFollowing) {
      setShowFollowModal(true);
    }
    setIsFollowing(prev => !prev);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-[#222]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 h-[80px] px-4 md:px-12 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mr-16 cursor-pointer">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <svg viewBox="0 0 32 32" className="w-full h-full">
                <circle cx="16" cy="16" r="14" fill="none" stroke="#28B16D" strokeWidth="2.5" />
                <path d="M16 10L10 15V22H14V18H18V22H22V15L16 10Z" fill="#28B16D" />
                <path d="M9 23L5 27" stroke="#28B16D" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-[#28B16D] font-bold text-[28px] tracking-tight">bayut</span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden xl:flex items-center gap-10 text-[15px] text-[#333]">
            <a href="#" className="hover:text-[#28B16D] transition-colors">Find my Agent</a>
            <a href="#" className="hover:text-[#28B16D] transition-colors flex items-center">
              <span className="font-normal text-[#333]">Tru</span>
              <span className="font-bold text-[#333]">Estimate</span>
              <span className="text-[10px] align-top ml-0.5">™</span>
            </a>
            <a href="#" className="hover:text-[#28B16D] transition-colors">Dubai Transactions</a>
            <a href="#" className="hover:text-[#28B16D] transition-colors">New Projects</a>
            <a href="#" className="flex items-center gap-1 hover:text-[#28B16D] transition-colors group">
              Guides
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#28B16D]" />
            </a>
            <a href="#" className="flex items-center">
              <span className="text-[#28B16D] font-medium italic text-[19px] leading-none mb-0.5">my</span>
              <span className="text-[#007EA8] font-bold text-[19px] leading-none">bayut</span>
            </a>
          </nav>
        </div>

        <div className="flex items-center h-full">
          <div className="w-[1px] h-10 bg-gray-100 mx-6 hidden xl:block" />
          <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-600 transition-colors">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Cover & Profile Section */}
        <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-[#f1f1f1]">
          <div className="h-28 md:h-32 bg-[#002B2E] relative overflow-hidden flex items-center px-4 md:px-10 justify-end">
            {/* Background elements to match the textured geometric look in the screenshot */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D4D52] via-transparent to-black/40 z-0" />
            <div className="absolute -top-1/2 -left-1/4 w-[150%] h-[200%] bg-gradient-to-br from-[#0A3D42]/30 via-transparent to-transparent rotate-12 z-0" />
            <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent z-0" />
            
            <div className="flex items-baseline gap-1.5 opacity-90 relative z-10">
              <span className="text-white text-2xl md:text-3xl font-medium tracking-tight">TruBroker</span>
              <span className="text-white text-sm md:text-lg font-medium">™</span>
            </div>
          </div>
          
          <div className="px-6 md:px-12 pb-8 relative">
            <div className="flex flex-col md:flex-row md:items-stretch gap-6 -mt-2">
              {/* Profile Pic */}
              <div className="relative">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full border-[6px] border-white shadow-lg overflow-hidden bg-gray-100 relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=256&h=256&auto=format&fit=crop" 
                    alt="Fiona Lee" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <button className="absolute bottom-1 right-2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md text-[#006169] border border-gray-100 z-20">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
              </div>

              {/* Agent Info */}
              <div className="flex-1 flex flex-col gap-3 pb-2 pt-6">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl md:text-3xl font-bold text-[#222] tracking-tight">Fiona Lee</h1>
                </div>
                <div className="flex items-center text-[#006169] font-bold text-base hover:underline cursor-pointer group">
                  Aventa Real Estate
                  <ChevronRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-0.5" />
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <span>5 Active Properties</span>
                  <span className="text-gray-300">•</span>
                  <span>4 Sale Transactions</span>
                  <span className="text-gray-300">•</span>
                  <span>17 Rent Transactions</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    1,248 Followers
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#28B16D]" />
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Last active today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Badges & CTAs row - Requested update 2 */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2">
                <div className="bg-[#004247] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm shadow-teal-900/10 flex items-center gap-1.5">
                  TruBroker
                  <span className="text-[10px] font-medium opacity-80">™</span>
                </div>
                <Badge text="Quality Lister" color="bg-[#EBF8FA] text-[#006169] border-[#D0EBF0]" icon={<CheckCircle2 className="w-3.5 h-3.5" />} />
                <Badge text="Responsive Broker" color="bg-[#F6EBFB] text-[#8E24AA] border-[#EAD0F7]" icon={<Sparkles className="w-3.5 h-3.5" />} />
              </div>

              <div className="flex flex-col gap-3 w-full md:w-auto min-w-[306px]">
                <button 
                  onClick={handleFollowClick}
                  className={`w-full py-3 rounded-lg font-bold text-sm transition-all shadow-sm flex items-center justify-center gap-2 ${isFollowing ? 'bg-white border border-[#006169] text-[#006169]' : 'bg-[#006169] text-white hover:bg-[#004d54] shadow-md'}`}
                >
                  {isFollowing && <CheckCircle2 className="w-4 h-4" />}
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <div className="flex items-center gap-2">
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#EBF2F3] text-[#006169] hover:bg-[#DDE9EA] transition-colors border border-transparent min-w-[90px]">
                    <Mail className="w-4 h-4" />
                    <span className="text-xs font-bold">Email</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#EBF2F3] text-[#006169] hover:bg-[#DDE9EA] transition-colors border border-transparent min-w-[90px]">
                    <Phone className="w-4 h-4" />
                    <span className="text-xs font-bold">Call</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#E8F6F1] text-[#1C8C64] hover:bg-[#D9F1E9] transition-colors border border-transparent min-w-[110px]">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-xs font-bold">WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Main Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabbed Content */}
            <div className="space-y-4">
              <div className="flex border-b border-[#f1f1f1]">
                <button 
                  onClick={() => setActiveTab('Overview')}
                  className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === 'Overview' ? 'text-[#006169]' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  Overview
                  {activeTab === 'Overview' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#006169]" />}
                </button>
                <button 
                  onClick={() => setActiveTab('Active listings')}
                  className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === 'Active listings' ? 'text-[#006169]' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  Active listings
                  {activeTab === 'Active listings' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#006169]" />}
                </button>
                <button 
                  onClick={() => setActiveTab('Transactions')}
                  className={`px-6 py-3 text-sm font-bold transition-colors relative ${activeTab === 'Transactions' ? 'text-[#006169]' : 'text-gray-500 hover:text-gray-800'}`}
                >
                  Transactions
                  {activeTab === 'Transactions' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#006169]" />}
                </button>
              </div>

              {activeTab === 'Overview' && (
                <div className="space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  {/* Awards Banner Strip */}
                  <div className="relative group">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory">
                      {[
                        { title: "Agent of the Quarter 2026", enterprise: false },
                        { title: "Agency of the Quarter", enterprise: false },
                        { title: "Agent of the Year 2025", enterprise: false },
                        { title: "Agency of the Year 2025", enterprise: true }
                      ].map((award, idx) => (
                        <div 
                          key={idx} 
                          className="flex-shrink-0 w-[calc(50%-8px)] h-32 bg-[#050505] rounded-xl relative overflow-hidden flex flex-col items-center justify-center border border-white/5 snap-center"
                        >
                          {/* Background Texture - matches the dark elegance */}
                          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                          
                          {/* Top & Bottom Gold Lines */}
                          <div className="w-[85%] h-px bg-gradient-to-r from-transparent via-[#C5A021]/60 to-transparent" />
                          
                          <div className="py-5 px-8 text-center">
                            <span className="text-[#C5A021] font-serif text-lg md:text-2xl tracking-wide font-normal">
                              {award.title} {award.enterprise && <span className="opacity-80">(Enterprise)</span>}
                            </span>
                          </div>
                          
                          <div className="w-[85%] h-px bg-gradient-to-r from-transparent via-[#C5A021]/60 to-transparent" />
                        </div>
                      ))}
                    </div>
                    {/* Scroll Indicators (Optional but helpful) */}
                    <div className="absolute top-1/2 -left-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
                      <div className="w-8 h-8 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white cursor-pointer">
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </div>
                    </div>
                    <div className="absolute top-1/2 -right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex">
                      <div className="w-8 h-8 bg-black/50 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-white cursor-pointer">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  {/* Streak Banner */}
                  <div className="bg-[#002B2E] rounded-2xl p-8 relative overflow-hidden text-white flex flex-col md:flex-row md:items-center justify-between gap-8">
                    {/* Background Texture */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 space-y-4">
                      <div className="text-sm font-medium opacity-90">TruBroker™ Streak</div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#FFD700] rounded-lg flex items-center justify-center shadow-[0_0_20px_rgba(255,215,0,0.3)]">
                          <TrendingUp className="w-6 h-6 text-black" /> {/* Using TrendingUp for a bolt-like feel or I'll just use a Zap if I can find it */}
                        </div>
                        <span className="text-4xl font-bold tracking-tight">8 months</span>
                      </div>

                    </div>

                    <div className="flex gap-3 relative z-10">
                      {['Jan', 'Feb', 'Mar', 'Apr', 'May'].map((month) => (
                        <div key={month} className="flex flex-col items-center gap-2">
                          <div className="w-14 h-18 bg-[#1C8C64] rounded-xl flex flex-col items-center justify-center border border-white/10 shadow-lg">
                            <span className="text-[11px] font-bold mb-2 uppercase">{month}</span>
                            <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#1C8C64] stroke-[3]" />
                            </div>
                          </div>
                        </div>
                      ))}
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-14 h-18 bg-transparent rounded-xl flex flex-col items-center justify-center border-2 border-dashed border-white/20">
                          <span className="text-[11px] font-bold mb-2 uppercase opacity-40">Jun</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leaderboard Section */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">Your Leaderboard Ranking</h2>

                    </div>

                    {/* Filter bar */}
                    <div className="flex gap-4">
                      <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg p-1.5 flex items-center gap-2 overflow-hidden shadow-sm">
                        <MapPin className="w-4 h-4 text-[#006169] ml-2" />
                        <div className="flex items-center gap-2 bg-[#F1F7F7] px-3 py-1.5 rounded-md text-sm font-bold text-gray-700">
                          The Acres
                          <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                        </div>
                        <input type="text" className="flex-1 bg-transparent border-none outline-none text-sm font-medium" />
                      </div>
                      <div className="w-72 bg-white border border-gray-200 rounded-lg p-1.5 flex items-center justify-between shadow-sm cursor-pointer hover:bg-gray-50 pr-4">
                        <span className="text-sm font-semibold text-[#006169] ml-2">Buy / Residential / Off-Plan</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>

                    {/* Leaderboard Table */}
                    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 w-20">Rank</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400">Agent</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-center">Badges</th>
                            <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-gray-400 text-right">TruPoints™</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {[
                            { rank: 1, name: 'Ali Charab', team: 'EVA Real Estate - Dubai', points: '1,808', image: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=128&h=128&fit=crop' },
                            { rank: 2, name: 'Mohammed Ajjawi', team: 'MO Properties', points: '1,567', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=128&h=128&fit=crop' },
                            { rank: 3, name: 'You', team: 'Aventa Real Estate', points: '1,211', isSelf: true, image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=128&h=128&fit=crop' },
                            { rank: 4, name: 'Vishal Vaswani', team: 'Grandeur Homes Real Estate', points: '356', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=128&h=128&fit=crop' },
                            { rank: 5, name: 'Venera Zagidullina', team: 'Billionaire Homes Real Estate', points: '321', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=128&h=128&fit=crop' },
                          ].map((item) => (
                            <tr key={item.rank} className={`${item.isSelf ? 'bg-[#EBF8FA]/60' : 'hover:bg-gray-50/50'} transition-colors`}>
                              <td className="px-6 py-5">
                                <span className={`text-[15px] font-bold ${item.isSelf ? 'text-[#1C8C64]' : 'text-gray-400'}`}>{item.rank}</span>
                              </td>
                              <td className="px-6 py-3">
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-100 flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <div className="text-[15px] font-bold text-gray-900 leading-tight tracking-tight">{item.name}</div>
                                    <div className="text-[12px] text-gray-500 font-medium leading-tight mt-0.5">{item.team}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5">
                                <div className="flex items-center justify-center gap-2">
                                  <div className="bg-[#002B2E] text-white px-2 py-1 rounded text-[9px] font-bold uppercase tracking-tight">TruBroker™</div>
                                  <div className="w-7 h-7 bg-blue-50 rounded flex items-center justify-center">
                                    <TrendingUp className="w-3.5 h-3.5 text-blue-400" /> {/* substitute for diamond/gem */}
                                  </div>
                                  <div className="w-7 h-7 bg-purple-50 rounded flex items-center justify-center">
                                    <Sparkles className="w-3.5 h-3.5 text-purple-400" /> {/* substitute for responsive badge */}
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-right">
                                <div className={`text-[15px] font-bold ${item.isSelf ? 'text-[#1C8C64]' : 'text-gray-900'}`}>{item.points}</div>
                                {item.isSelf && (
                                  <button className="text-[10px] font-bold text-[#006169] mt-0.5 hover:underline flex items-center justify-end gap-1 w-full">
                                    Earn more TruPoints™ <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-center mt-6">
                      <button className="flex items-center gap-2 px-8 py-3 bg-[#EBF2F3] text-[#006169] hover:bg-[#DDE9EA] transition-colors rounded-xl font-bold text-sm shadow-sm border border-[#D0EBF0]">
                        View Complete Leaderboard
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Recommendations Section */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-bold text-gray-900 tracking-tight">Recommendations</h2>
                      <button className="text-sm font-bold text-[#006169] hover:underline">See All</button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          name: "Sarah Jenkins",
                          date: "May 2026",
                          rating: 5,
                          text: "Anusha is an exceptional agent. She understood my requirements perfectly and found me my dream villa in The Acres. Her knowledge of the market is truly impressive.",
                          property: "Villa in The Acres"
                        },
                        {
                          name: "Michael Roberts",
                          date: "April 2026",
                          rating: 5,
                          text: "Extremely professional and responsive. Michael helped us navigate the complex Dubai rental market with ease. We couldn't be happier with our new apartment in Dubai Marina.",
                          property: "Apartment in Dubai Marina"
                        },
                        {
                          name: "Lina Mansour",
                          date: "March 2026",
                          rating: 5,
                          text: "One of the best experiences I've had with a real estate professional. Transparent, honest, and very dedicated to finding the right fit for her clients.",
                          property: "Off-Plan Investment"
                        },
                        {
                          name: "David Chen",
                          date: "February 2026",
                          rating: 5,
                          text: "Very thorough during the entire sales process. Anusha's attention to detail and negotiation skills saved us both time and money.",
                          property: "Luxury Apartment Sale"
                        }
                      ].map((rec, idx) => (
                        <div key={idx} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="text-[15px] font-bold text-gray-900">{rec.name}</div>
                              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1">{rec.date} • {rec.property}</div>
                            </div>
                            <div className="flex gap-0.5">
                              {[...Array(rec.rating)].map((_, i) => (
                                <Star key={i} className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
                              ))}
                            </div>
                          </div>
                          <p className="text-[13px] text-gray-600 leading-relaxed italic font-medium">
                            "{rec.text}"
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Active listings' && (
                <>
                  {/* Filters for Properties */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                    <div className="relative">
                      <select className="w-full h-10 px-3 pr-8 text-sm border border-[#f1f1f1] rounded-md appearance-none bg-white font-medium focus:ring-1 focus:ring-[#006169] outline-none">
                        <option>All</option>
                        <option>Buy</option>
                        <option>Rent</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Enter location" 
                        className="w-full h-10 px-3 pl-8 text-sm border border-[#f1f1f1] rounded-md focus:ring-1 focus:ring-[#006169] outline-none"
                      />
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    </div>
                    <div className="relative">
                      <select className="w-full h-10 px-3 pr-8 text-sm border border-[#f1f1f1] rounded-md appearance-none bg-white font-medium outline-none">
                        <option>Any Type</option>
                        <option>Villa</option>
                        <option>Apartment</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select className="w-full h-10 px-3 pr-8 text-sm border border-[#f1f1f1] rounded-md appearance-none bg-white font-medium outline-none">
                        <option>Beds & Baths</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <select className="w-full h-10 px-3 pr-8 text-sm border border-[#f1f1f1] rounded-md appearance-none bg-white font-medium outline-none">
                        <option>Price (AED)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs font-medium text-gray-400">Showing 1 - 5 of 5 Properties sorted by</span>
                    <button className="flex items-center gap-1 text-xs font-bold border border-[#f1f1f1] rounded-md px-3 py-1.5 hover:bg-white bg-gray-50/30 transition-colors">
                      Popular
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Property List */}
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        price: '7,100,000',
                        type: 'Villa',
                        beds: '4',
                        baths: '5',
                        sqft: '4,087',
                        title: 'Exclusive | Type D | High Demand 4BR',
                        location: 'The Acres (Phase 1), The Acres, Dubai',
                        image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600',
                        category: 'Sale',
                        date: '7th of April'
                      },
                      {
                        id: 3,
                        price: '280,000',
                        type: 'Apartment',
                        beds: '2',
                        baths: '3',
                        sqft: '1,450',
                        title: 'Stunning Sea View | High Floor | Modern Finish',
                        location: 'Emaar Beachfront, Dubai Harbour, Dubai',
                        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600',
                        category: 'Rent',
                        date: '12th of April'
                      },
                      {
                        id: 4,
                        price: '450,000',
                        type: 'Apartment',
                        beds: '3',
                        baths: '4',
                        sqft: '2,100',
                        title: 'Full Marina View | Luxury Furnished | Vacant',
                        location: 'Dubai Marina, Dubai',
                        image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600',
                        category: 'Rent',
                        date: '18th of April'
                      },
                      {
                        id: 5,
                        price: '3,200,000',
                        type: 'Apartment',
                        beds: '1',
                        baths: '2',
                        sqft: '850',
                        title: 'Investment Opportunity | Managed Unit | ROI 7%',
                        location: 'Dubai Marina, Dubai',
                        image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600',
                        category: 'Sale',
                        date: '15th of April'
                      },
                      {
                        id: 6,
                        price: '190,000',
                        type: 'Apartment',
                        beds: '1',
                        baths: '2',
                        sqft: '920',
                        title: 'Cozy One Bedroom | Heart of Marina | Bills Included',
                        location: 'Dubai Marina, Dubai',
                        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=600',
                        category: 'Rent',
                        date: '20th of April'
                      }
                    ].map((prop) => (
                      <div key={prop.id} className="bg-white border border-[#f1f1f1] rounded-xl overflow-hidden flex flex-col md:flex-row group hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300">
                        <div className="md:w-72 h-48 md:h-auto relative overflow-hidden">
                          <img 
                            src={prop.image} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                            alt={prop.title} 
                          />
                          <div className="absolute top-2 left-2 flex gap-1">
                            <span className="bg-white px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1 shadow-sm">
                              <CheckCircle2 className="w-3 h-3 text-[#006169]" />
                              TruCheck™
                            </span>
                            <span className="bg-gray-800/80 text-white px-2 py-1 rounded text-[10px] font-bold backdrop-blur-sm">
                              {prop.category === 'Rent' ? 'Rental' : 'Off-Plan | Resale'}
                            </span>
                          </div>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                            {[1, 2, 3, 4, 5].map(dot => (
                              <div key={dot} className={`w-1.5 h-1.5 rounded-full ${dot === 1 ? 'bg-white' : 'bg-white/40'}`} />
                            ))}
                          </div>
                          <button className="absolute bottom-2 right-2 p-2 bg-white/20 hover:bg-[#006169] rounded-full text-white backdrop-blur-sm transition-all">
                            <Heart className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <div className="text-2xl font-bold text-[#222]">
                                AED {prop.price}
                                {prop.category === 'Rent' && <span className="text-sm font-medium text-gray-500"> /Year</span>}
                              </div>
                              <div className="text-sm font-medium text-gray-500 mt-1 flex items-center gap-4">
                                <span>{prop.type}</span>
                                <span><strong className="text-gray-900 font-bold">{prop.beds}</strong> Bed</span>
                                <span><strong className="text-gray-900 font-bold">{prop.baths}</strong> Bath</span>
                                <span><strong className="text-gray-900 font-bold">{prop.sqft}</strong> sqft</span>
                              </div>
                            </div>
                            <span className="text-[10px] uppercase font-black text-blue-500 tracking-wider border border-blue-200 px-1.5 py-0.5 rounded">Signature</span>
                          </div>
                          <h3 className="text-base font-bold text-[#006169] line-clamp-1 mb-1 mt-1 hover:underline cursor-pointer">
                            {prop.title}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-4">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {prop.location}
                          </div>
                          
                          <div className="bg-[#f1f7f7] px-3 py-1.5 rounded-md self-start text-[11px] font-semibold text-[#006169] flex items-center gap-2 mb-4 border border-[#DEEDED]">
                            <Sparkles className="w-3 h-3" />
                            Property authenticity was validated on {prop.date}
                          </div>

                          <div className="grid grid-cols-3 gap-2 mt-auto">
                            <button className="flex items-center justify-center gap-2 py-2.5 bg-[#EBF2F3] text-[#006169] rounded-lg text-xs font-bold hover:bg-[#DDE9EA] transition-colors">
                              <Mail className="w-4 h-4" /> Email
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 bg-[#EBF2F3] text-[#006169] rounded-lg text-xs font-bold hover:bg-[#DDE9EA] transition-colors">
                              <Phone className="w-4 h-4" /> Call
                            </button>
                            <button className="flex items-center justify-center gap-2 py-2.5 bg-[#E8F6F1] text-[#1C8C64] rounded-lg text-xs font-bold hover:bg-[#D9F1E9] transition-colors">
                              <MessageCircle className="w-4 h-4" /> WhatsApp
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'Transactions' && (
                <div className="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="mb-2">
                    <h2 className="text-xl font-bold text-gray-900 tracking-tight">Claimed Transactions</h2>
                    <p className="text-sm text-gray-500 mt-1">View transactions you've made over the past three years.</p>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      {['Dubai Marina', 'Downtown Dubai', 'Dubai Hills Estate', 'Dubai Creek Harbour'].map((loc, idx) => (
                        <button key={loc} className={`px-4 py-2 border rounded-lg text-xs font-bold transition-all shadow-sm ${idx === 0 ? 'bg-[#EBF8FA] border-[#006169] text-[#006169]' : 'bg-white border-[#f1f1f1] text-gray-700 hover:border-[#006169]'}`}>
                          {loc}
                        </button>
                      ))}
                    </div>
                    
                    <div className="flex items-center bg-gray-100 p-1.5 rounded-xl border border-[#f1f1f1]">
                      <button 
                        onClick={() => setTransactionFilter('Sold')}
                        className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${transactionFilter === 'Sold' ? 'bg-white shadow-md text-[#006169]' : 'text-gray-500 hover:text-gray-800'}`}
                      >
                        Sold
                      </button>
                      <button 
                        onClick={() => setTransactionFilter('Rented')}
                        className={`px-5 py-2 text-xs font-bold rounded-lg transition-all ${transactionFilter === 'Rented' ? 'bg-white shadow-md text-[#006169]' : 'text-gray-500 hover:text-gray-800'}`}
                      >
                        Rented
                      </button>
                    </div>
                  </div>

                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Claim Value Summary */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative">
                      <div className="flex justify-between items-start mb-4">
                         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CLAIM VALUE SUMMARY</span>
                         <TrendingUp className="w-5 h-5 text-[#1C8C64]" />
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">AED 24.5M</div>
                      <div className="inline-block px-3 py-1 rounded-full bg-[#E8F6F1] text-[#1C8C64] text-[10px] font-bold mb-8">
                        Market Leader
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-medium">Average Claims Value</span>
                          <span className="text-gray-900 font-bold tracking-tight">AED 2.04M</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-medium">Average Price Range</span>
                          <span className="text-gray-900 font-bold tracking-tight">AED 1.8M - 4.5M</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500 font-medium">Average Property Size</span>
                          <span className="text-gray-900 font-bold tracking-tight">1,240 sqft</span>
                        </div>
                      </div>
                    </div>

                    {/* Transaction Volume Split */}
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-6 block">TRANSACTION VOLUME SPLIT</span>
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#E8F6F1] rounded-xl flex items-center justify-center text-[#1C8C64]">
                              <TrendingUp className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-gray-900">8</div>
                              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">SALES TRANSACTIONS</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#EEF2FF] rounded-xl flex items-center justify-center text-[#6366F1]">
                              <Layers className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-gray-900">4</div>
                              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">RENTAL TRANSACTIONS</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <button className="mt-8 w-full py-4 bg-[#EBF8FA] text-[#006169] rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#DDE9EA] transition-colors border border-transparent shadow-sm">
                        <MapPin className="w-4 h-4" />
                        View on Map <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Property Type Split & Bed Count Cards */}
                  <div className="space-y-8 mt-8">
                    <div>
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">PROPERTY TYPE SPLIT</div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white border border-[#f0f0f0] rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">APARTMENTS</div>
                          <div className="text-3xl font-bold text-gray-900">6</div>
                        </div>
                        <div className="bg-white border border-[#f0f0f0] rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">VILLAS</div>
                          <div className="text-3xl font-bold text-gray-900">1</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-4 ml-1">APARTMENT BED COUNT BREAKDOWN</div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white border border-[#f0f0f0] rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">1 BED</div>
                          <div className="text-3xl font-bold text-gray-900">1</div>
                        </div>
                        <div className="bg-white border border-[#f0f0f0] rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">2 BED</div>
                          <div className="text-3xl font-bold text-gray-900">3</div>
                        </div>
                        <div className="bg-white border border-[#f0f0f0] rounded-2xl p-8 flex flex-col items-center justify-center shadow-sm hover:shadow-md transition-shadow">
                          <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">3 BED</div>
                          <div className="text-3xl font-bold text-gray-900">2</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(transactionFilter === 'Sold' ? [
                      {
                        price: '7,100,000',
                        category: 'SOLD',
                        address: 'Villa Type D > The Acres (Phase 1) > The Acres > Dubai',
                        details: 'Secondary market • Resale',
                        tags: ['Villa', '4 Bed', '4,087 sqft', 'Signature'],
                        startDate: '15 April 2026'
                      },
                      {
                        price: '3,200,000',
                        category: 'SOLD',
                        address: 'Apartment 1502 > Dubai Marina > Dubai Marina > Dubai',
                        details: 'Investment unit • Cash buyer',
                        tags: ['Apartment', '1 Bed', '850 sqft', 'Marina View'],
                        startDate: '10 March 2026'
                      },
                      {
                        price: '11,500,000',
                        category: 'SOLD',
                        address: 'Beach Mansion > Emaar Beachfront > Dubai Harbour > Dubai',
                        details: 'Off-plan handover • Premium unit',
                        tags: ['Apartment', '4 Beds', '3,420 sqft', 'Sea View'],
                        startDate: '22 February 2026'
                      },
                      {
                        price: '2,750,000',
                        category: 'SOLD',
                        address: 'Park Ridge > Dubai Hills Estate > Dubai Hills > Dubai',
                        details: 'Direct from developer • Resale',
                        tags: ['Apartment', '2 Beds', '1,350 sqft', 'Park View'],
                        startDate: '5 January 2026'
                      }
                    ] : [
                      {
                        price: '160,000',
                        category: 'RENTED',
                        address: 'Marina Gate 2 > Marina Gate > Dubai Marina > Dubai',
                        details: 'New contract • 12 months',
                        tags: ['Apartment', '1 Bed', '830 sqft', '26th Floor'],
                        startDate: '21 March 2026'
                      },
                      {
                        price: '215,000',
                        category: 'RENTED',
                        address: 'Marina Gate 2 > Marina Gate > Dubai Marina > Dubai',
                        details: 'New contract • 12 months',
                        tags: ['Apartment', '2 Beds', '1,207 sqft', '40th Floor'],
                        startDate: '24 November 2025'
                      },
                      {
                        price: '370,000',
                        category: 'RENTED',
                        address: 'Marina Gate 2 > Marina Gate > Dubai Marina > Dubai',
                        details: 'New contract • 12 months',
                        tags: ['Apartment', '3 Beds', '2,149 sqft', '15th Floor'],
                        startDate: '2 May 2025'
                      }
                    ]).map((item, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-gray-900 tracking-tight">AED {item.price}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${item.category === 'SOLD' ? 'bg-[#FFF9E6] text-[#A66D00]' : 'bg-[#EBF8FA] text-[#006169]'}`}>
                              {item.category}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium mb-3">
                          <MapPin className="w-4 h-4 text-[#006169]" />
                          {item.address}
                        </div>
                        
                        <div className="text-sm text-gray-500 font-medium mb-4">
                          {item.details}
                        </div>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {item.tags.map(tag => (
                            <span key={tag} className="bg-gray-50 px-3 py-1.5 rounded text-xs font-semibold text-gray-600">
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="text-sm text-gray-400 font-medium pt-4 border-t border-gray-50">
                          Start date: {item.startDate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-gradient-to-b from-[#E6EFF0] to-white border border-[#D0EBF0] rounded-2xl overflow-hidden shadow-sm p-4 mt-4">
              <div className="flex items-center justify-between mb-4 px-2 pt-2">
                <h3 className="font-bold text-gray-800 text-[15px]">Transactions Summary</h3>
                  <button 
                    onClick={() => setActiveTab('Transactions')}
                    className="text-[#006169] font-bold text-sm hover:underline"
                  >
                    View All
                  </button>
                </div>
                
                <div className="rounded-xl overflow-hidden mb-4 shadow-sm border border-black/5 h-48 bg-[#f8fcfd] relative flex items-center justify-center">
                  <img 
                    src="https://images.unsplash.com/photo-1541001249051-289569762142?q=80&w=800" 
                    alt="Transactions Map" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[#006169]/5" />
                </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Sale Transactions</div>
                    <div className="text-2xl font-bold text-gray-900">4</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Sale Value</div>
                    <div className="text-xl font-bold text-gray-900">AED 11.1M</div>
                  </div>
                </div>

                <div className="w-full h-px bg-gray-50" />
                
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-medium text-gray-500 mb-1">Rent Transactions</div>
                    <div className="text-2xl font-bold text-gray-900">17</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-500 mb-1">Total Rental Value</div>
                    <div className="text-xl font-bold text-gray-900">AED 4.6M</div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setActiveTab('Transactions')}
                className="w-full py-4 bg-[#E0ECEE] text-[#006169] rounded-xl font-bold text-sm hover:bg-[#D4E4E6] transition-colors shadow-sm"
              >
                View All Transactions
              </button>
            </div>

            <div className="bg-white border border-[#f1f1f1] rounded-xl p-8 shadow-sm text-center group cursor-pointer hover:shadow-md transition-all">
              <div className="w-24 h-24 mx-auto bg-black rounded-lg flex flex-col items-center justify-center p-3 mb-4 shadow-inner group-hover:scale-105 transition-transform overflow-hidden">
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  <div className="mb-1">
                    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M50 15L15 85H28L50 42L72 85H85L50 15Z" fill="#3B99FF"/>
                    </svg>
                  </div>
                  <div className="text-white text-[8px] font-bold tracking-[0.25em] whitespace-nowrap uppercase">Aventa Realty</div>
                </div>
              </div>
              <h3 className="font-bold text-[#006169] text-sm flex items-center justify-center gap-1 group-hover:underline">
                Aventa Real Estate
                <ChevronRight className="w-4 h-4 ml-0.5 transition-transform group-hover:translate-x-0.5" />
              </h3>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm relative">
              <h2 className="text-xl font-bold text-gray-900 mb-6 px-1">About Fiona</h2>
              
              <div className="divide-y divide-gray-100">
                <div className="py-4 px-1 flex flex-col">
                  <span className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">Language(s)</span>
                  <span className="text-gray-900 font-bold text-sm">English</span>
                </div>

                <div className="py-4 px-1 flex flex-col">
                  <span className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">Expertise</span>
                  <span className="text-gray-900 font-bold text-sm leading-relaxed">Residential Sales, Residential Leasing, Off-Plan Sales</span>
                </div>

                <div className="py-4 px-1 flex flex-col">
                  <span className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">Service Areas</span>
                  <span className="text-gray-900 font-bold text-sm leading-relaxed">Dubai Marina, Dubai Harbour, Downtown Dubai</span>
                </div>

                <AnimatePresence>
                  {isAboutExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden divide-y divide-gray-100"
                    >
                      <div className="py-4 px-1 flex flex-col">
                        <span className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">Properties</span>
                        <div className="flex flex-col">
                          <span className="text-gray-900 font-bold text-sm">5 For Sale</span>
                          <span className="text-gray-900 font-bold text-sm">2 For Rent</span>
                        </div>
                      </div>

                      <div className="py-4 px-1 flex flex-col">
                        <span className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">Description</span>
                        <p className="text-gray-900 font-bold text-sm leading-relaxed">
                          Fiona Lee, one of the remarkable Co-Founders at our organization. Fiona's role within our team is multifaceted
                          {isDescriptionExpanded ? (
                            <span>, as she specializes in both property rentals and sales, with a particular emphasis on the vibrant Dubai Marina and Emaar Beachfront areas. Her in-depth understanding of these prime real estate locations is a testament to her expertise in providing clients with comprehensive insights, whether they are seeking to lease a property or make a significant investment. What truly sets Fiona apart is her unwavering commitment to her clients. She doesn't view her work as merely facilitating transactions; it's a dedicated mission to help clients achieve their real estate aspirations.</span>
                          ) : (
                            <span>...</span>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setIsDescriptionExpanded(!isDescriptionExpanded);
                            }}
                            className="text-[#006169] ml-1 font-bold hover:underline"
                          >
                            {isDescriptionExpanded ? 'Read less' : 'Read all'}
                          </button>
                        </p>
                      </div>

                      <div className="py-4 px-1 flex flex-col">
                        <div className="flex items-center gap-1 text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">
                          BRN <Info className="w-3 h-3 text-[#006169] inline" /> :
                        </div>
                        <span className="text-gray-900 font-bold text-sm">55258</span>
                      </div>

                      <div className="py-4 px-1 flex flex-col">
                        <span className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">Experience</span>
                        <span className="text-gray-900 font-bold text-sm">6 years</span>
                      </div>

                      <div className="py-4 px-1 flex flex-col">
                        <span className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-2">Social links</span>
                        <div className="bg-[#0077b5] p-1.5 rounded inline-flex text-white cursor-pointer hover:bg-[#006097] transition-colors w-fit mt-1">
                          <Linkedin className="w-4 h-4 fill-current" strokeWidth={0} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-4 px-1">
                <button 
                  onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                  className="text-[#006169] text-sm font-bold flex items-center gap-1 hover:underline mb-8"
                >
                  {isAboutExpanded ? 'See less' : 'View more information'}
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isAboutExpanded ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm pt-2 pb-2 mt-4 z-10">
                <button 
                  onClick={() => {
                    setBookingStep(0);
                    setIsBookingSuccess(false);
                    setShowBookingModal(true);
                  }}
                  className="w-full py-4 bg-[#006169] text-white rounded-xl font-bold text-sm shadow-xl hover:bg-[#004d54] transition-all transform active:scale-[0.98]"
                >
                  Book Consultation
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Footer / Copyright Placeholder */}
      <footer className="mt-20 py-10 bg-white border-t border-gray-200 text-center text-xs text-gray-400">
        <div className="max-w-7xl mx-auto px-4">
          © 2026 Bayut.com. All rights reserved. Reproduction in part or full is strictly prohibited.
        </div>
      </footer>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-xl w-full max-w-sm overflow-hidden relative shadow-2xl z-10 p-8"
            >
              <button 
                onClick={() => setShowShareModal(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>

              <div className="text-center space-y-6">
                <h2 className="text-xl font-bold text-gray-900 pr-4">Share agent profile online</h2>
                
                <div className="space-y-4">
                  <p className="text-sm font-medium text-gray-700">Social media and e-mail:</p>
                  <div className="flex items-center justify-center gap-4">
                    {/* Facebook */}
                    <button className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-[#1877F2] hover:opacity-90 transition-opacity">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </button>
                    {/* X */}
                    <button className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-black hover:opacity-90 transition-opacity">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </button>
                    {/* WhatsApp */}
                    <button className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-[#25D366] hover:opacity-90 transition-opacity">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.63 1.438h.004c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    </button>
                    {/* Gmail */}
                    <button className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-white border border-gray-100 hover:bg-gray-50 transition-colors">
                      <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#EA4335" d="M24 4.5v15c0 .85-.65 1.5-1.5 1.5H21V7.38l-9 6.62-9-6.62V21H1.5C.65 21 0 20.35 0 19.5v-15c0-.42.17-.8.45-1.05C.7 3.17 1 3 1.5 3h.6l9.9 7.28L21.9 3h.6c.5 0 .8.17 1.05.45.28.25.45.63.45 1.05z"/></svg>
                    </button>
                    {/* Email */}
                    <button className="w-11 h-11 rounded-full overflow-hidden flex items-center justify-center bg-[#006169] hover:opacity-90 transition-opacity">
                      <Mail className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <p className="text-sm font-medium text-gray-700">Or copy link:</p>
                  <div className="flex items-center gap-2 p-1.5 bg-white border border-gray-200 rounded-lg">
                    <input 
                      type="text" 
                      readOnly 
                      value="https://www.bayut.com/fiona-lee"
                      className="flex-1 text-[11px] text-gray-500 bg-transparent outline-none px-2 font-medium"
                    />
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText("https://www.bayut.com/fiona-lee");
                      }}
                      className="flex items-center gap-2 bg-[#006169] text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-[#004d54] transition-colors"
                    >
                      <Layers className="w-4 h-4" />
                      Copy
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Follow Modal - Requested update 1 */}
      <AnimatePresence>
        {showFollowModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFollowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-sm overflow-hidden relative shadow-2xl z-10"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-[#F1F7F7] rounded-full flex items-center justify-center">
                      <Bell className="w-6 h-6 text-[#006169]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">Stay in the loop with Fiona</h2>
                      <p className="text-sm text-gray-500">Choose what you want to hear about</p>
                    </div>
                  </div>
                  <button onClick={() => setShowFollowModal(false)} className="p-1 hover:bg-gray-100 rounded-full h-fit">
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-1 mb-8">
                  {notifications.map((notif, idx) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 flex items-center justify-between border border-gray-100 ${idx === 0 ? 'rounded-t-xl' : idx === notifications.length - 1 ? 'rounded-b-xl' : ''} ${idx !== notifications.length - 1 ? 'border-b-0' : ''}`}
                    >
                      <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0 mt-1">
                          {notif.icon}
                        </div>
                        <div className="pr-4">
                          <h4 className="font-bold text-sm text-gray-900">{notif.title}</h4>
                          <p className="text-xs text-gray-500 leading-snug">{notif.description}</p>
                        </div>
                      </div>
                      <Switch checked={notif.enabled} onChange={() => toggleNotification(notif.id)} />
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      setNotifications(prev => prev.map(n => ({ ...n, enabled: true })));
                      setShowFollowModal(false);
                    }}
                    className="w-full bg-[#004247] text-white py-3 rounded-lg font-bold text-sm tracking-wide hover:bg-[#003136] transition-colors"
                  >
                    Turn on notifications
                  </button>
                  <button 
                    onClick={() => setShowFollowModal(false)}
                    className="w-full py-3 text-gray-500 font-bold text-sm hover:text-gray-800"
                  >
                    Not now
                  </button>
                </div>
                
                <p className="mt-4 text-center text-[10px] text-gray-400">
                  You can change these any time in Settings.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBookingModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden relative shadow-2xl z-10 flex flex-col h-[85vh] max-h-[700px]"
            >
              {/* Header with Tabs */}
              <div className="border-b border-gray-100 bg-white sticky top-0 z-10">
                <div className="p-4 flex items-center justify-between pb-2">
                  <h2 className="text-[#002B2E] font-bold text-lg">Create New Request</h2>
                  <button 
                    onClick={() => setShowBookingModal(false)}
                    className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                {bookingStep > 0 && !isBookingSuccess && (
                  <div className="flex px-4 gap-8">
                    <button 
                      onClick={() => {
                        if (bookingType === 'Viewing') setBookingStep(1);
                      }}
                      disabled={bookingType !== 'Viewing'}
                      className={`pb-3 text-sm font-bold transition-all relative ${bookingType === 'Viewing' ? 'text-[#006169]' : 'text-gray-300 cursor-not-allowed opacity-50'}`}
                    >
                      Property Viewing
                      {bookingType === 'Viewing' && <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006169]" />}
                    </button>
                    <button 
                      onClick={() => {
                        if (bookingType === 'Consultation') setBookingStep(1);
                      }}
                      disabled={bookingType !== 'Consultation'}
                      className={`pb-3 text-sm font-bold transition-all relative ${bookingType === 'Consultation' ? 'text-[#006169]' : 'text-gray-300 cursor-not-allowed opacity-50'}`}
                    >
                      Consultation
                      {bookingType === 'Consultation' && <motion.div layoutId="modalTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#006169]" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Content body with success state */}
              {isBookingSuccess ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500 overflow-y-auto">
                  <div className="w-20 h-20 bg-[#F0F7F7] rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-[#1C8C64]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#002B2E] mb-3">Request Sent Successfully!</h3>
                  <p className="text-gray-500 max-w-sm mx-auto text-sm leading-relaxed">
                    Your request for a {bookingType === 'Viewing' ? 'Property Viewing' : 'Consultation'} with Fiona Lee has been submitted. She will get in touch with you shortly.
                  </p>
                  
                  <div className="mt-10 w-full max-w-[200px]">
                    <button 
                      onClick={() => setShowBookingModal(false)}
                      className="w-full py-3.5 bg-[#006169] text-white rounded-xl font-bold text-sm shadow-lg hover:bg-[#004d54] transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step Indicator */}
                  {bookingStep > 0 && (
                    <div className="px-8 py-6 bg-gray-50/50 border-b border-gray-100">
                      <div className="flex items-center justify-between max-w-lg mx-auto">
                        {bookingType === 'Viewing' ? (
                          <>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${bookingStep >= 1 ? 'bg-[#1C8C64] border-[#1C8C64] text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                {bookingStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                              </div>
                              <span className={`text-xs font-bold ${bookingStep === 1 ? 'text-[#1C8C64]' : 'text-gray-400'}`}>Select Listing</span>
                            </div>
                            <div className="flex-1 h-px bg-gray-200 mx-4" />
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${bookingStep >= 2 ? 'bg-[#1C8C64] border-[#1C8C64] text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                {bookingStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                              </div>
                              <span className={`text-xs font-bold ${bookingStep === 2 ? 'text-[#1C8C64]' : 'text-gray-400'}`}>Viewing Details</span>
                            </div>
                            <div className="flex-1 h-px bg-gray-200 mx-4" />
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${bookingStep >= 3 ? 'bg-[#1C8C64] border-[#1C8C64] text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                {bookingStep > 3 ? <CheckCircle2 className="w-5 h-5" /> : '3'}
                              </div>
                              <span className={`text-xs font-bold ${bookingStep === 3 ? 'text-[#1C8C64]' : 'text-gray-400'}`}>User Details</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${bookingStep >= 1 ? 'bg-[#1C8C64] border-[#1C8C64] text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                {bookingStep > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                              </div>
                              <span className={`text-xs font-bold ${bookingStep === 1 ? 'text-[#1C8C64]' : 'text-gray-400'}`}>Consultation Details</span>
                            </div>
                            <div className="flex-1 h-px bg-gray-200 mx-4" />
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${bookingStep >= 2 ? 'bg-[#1C8C64] border-[#1C8C64] text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                {bookingStep > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                              </div>
                              <span className={`text-xs font-bold ${bookingStep === 2 ? 'text-[#1C8C64]' : 'text-gray-400'}`}>User Details</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                    {bookingStep === 0 && (
                  <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-[#002B2E] mb-2">What are you looking for?</h3>
                      <p className="text-gray-500 text-sm">Select the type of request you'd like to make with Fiona.</p>
                    </div>
                    
                    <div className="grid grid-cols-1 w-full gap-4">
                      <button 
                        onClick={() => {
                          setBookingType('Viewing');
                          setBookingStep(1);
                        }}
                        className="group flex items-center gap-6 p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#006169] hover:bg-[#F0F7F7] transition-all text-left shadow-sm hover:shadow-md"
                      >
                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                          <Home className="w-7 h-7 text-gray-400 group-hover:text-[#006169]" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-[#002B2E] group-hover:text-[#006169]">Property Viewing</div>
                          <div className="text-sm text-gray-400 font-medium">Schedule a visit to see her listings.</div>
                        </div>
                      </button>

                      <button 
                        onClick={() => {
                          setBookingType('Consultation');
                          setBookingStep(1);
                        }}
                        className="group flex items-center gap-6 p-6 bg-white border-2 border-gray-100 rounded-2xl hover:border-[#006169] hover:bg-[#F0F7F7] transition-all text-left shadow-sm hover:shadow-md"
                      >
                        <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
                          <MessageSquare className="w-7 h-7 text-gray-400 group-hover:text-[#006169]" />
                        </div>
                        <div>
                          <div className="text-lg font-bold text-[#002B2E] group-hover:text-[#006169]">Consultation</div>
                          <div className="text-sm text-gray-400 font-medium">Get expert real estate advice.</div>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
                {bookingType === 'Viewing' && bookingStep === 1 && (
                  <div className="space-y-6">
                    {/* Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                      <div className="md:col-span-5 relative">
                        <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                        <input 
                          type="text" 
                          placeholder="Search location..."
                          value={modalSearchQuery}
                          onChange={(e) => setModalSearchQuery(e.target.value)}
                          className="w-full h-10 pl-9 pr-4 bg-white border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-[#006169] outline-none transition-all placeholder:text-gray-400"
                        />
                      </div>
                      <div className="md:col-span-3 relative">
                        <select className="w-full h-10 px-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm font-medium appearance-none outline-none focus:ring-1 focus:ring-[#006169] text-gray-700">
                          <option>Category</option>
                          <option>Buy</option>
                          <option>Rent</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                      <div className="md:col-span-4 relative">
                        <select className="w-full h-10 px-3 pr-8 bg-white border border-gray-200 rounded-lg text-sm font-medium appearance-none outline-none focus:ring-1 focus:ring-[#006169] text-gray-700">
                          <option>Property Type</option>
                          <option>Apartment</option>
                          <option>Villa</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-3 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Listings */}
                    <div className="space-y-3">
                      {[
                        {
                          id: 1,
                          price: '7,100,000',
                          type: 'Villa For Sale',
                          beds: '4',
                          baths: '5',
                          sqft: '4,087',
                          location: 'The Acres (Phase 1), The Acres, Dubai',
                          image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=600',
                          unit: ''
                        },
                        {
                          id: 3,
                          price: '280,000',
                          type: 'Apartment For Rent',
                          beds: '2',
                          baths: '3',
                          sqft: '1,450',
                          location: 'Emaar Beachfront, Dubai Harbour, Dubai',
                          image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600',
                          unit: '/ year'
                        },
                        {
                          id: 4,
                          price: '450,000',
                          type: 'Apartment For Rent',
                          beds: '3',
                          baths: '4',
                          sqft: '2,100',
                          location: 'Dubai Marina, Dubai',
                          image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600',
                          unit: '/ year'
                        },
                        {
                          id: 5,
                          price: '3,200,000',
                          type: 'Apartment For Sale',
                          beds: '1',
                          baths: '2',
                          sqft: '850',
                          location: 'Dubai Marina, Dubai',
                          image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600',
                          unit: ''
                        }
                      ].filter(item => 
                        item.location.toLowerCase().includes(modalSearchQuery.toLowerCase())
                      ).map((item) => (
                        <div 
                          key={item.id}
                          onClick={() => setSelectedListingId(item.id)}
                          className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${selectedListingId === item.id ? 'border-[#1C8C64] bg-[#F1F7F7]' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                        >
                          <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                            <img src={item.image} alt={item.type} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 ml-4 pr-4">
                            <div className="text-lg font-bold text-gray-900">AED {item.price} <span className="text-xs font-normal text-gray-500">{item.unit}</span></div>
                            <div className="text-sm font-bold text-[#006169] mt-1">{item.type}</div>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                              <span className="flex items-center gap-1"><Home className="w-3 h-3" /> {item.beds}</span>
                              <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {item.baths}</span>
                              <span className="flex items-center gap-1"><Sparkles className="w-3 h-3" /> {item.sqft} sqft</span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {item.location}
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedListingId === item.id ? 'bg-[#1C8C64] border-[#1C8C64]' : 'bg-white border-gray-200'}`}>
                            {selectedListingId === item.id && <div className="w-2 h-2 bg-white rounded-full" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {bookingType === 'Viewing' && bookingStep === 2 && (
                  <div className="space-y-8 py-2">
                    {/* Select Date */}
                    <div>
                      <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">SELECT DATE</h3>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setSelectedDate('29')}
                          className={`w-24 h-24 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedDate === '29' ? 'border-[#1C8C64] bg-white ring-1 ring-[#1C8C64]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                        >
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">WED</span>
                          <span className="text-2xl font-black text-gray-900 leading-none">29</span>
                        </button>
                        <button 
                          onClick={() => setSelectedDate('30')}
                          className={`w-24 h-24 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedDate === '30' ? 'border-[#1C8C64] bg-white ring-1 ring-[#1C8C64]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                        >
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">THU</span>
                          <span className="text-2xl font-black text-gray-900 leading-none">30</span>
                        </button>
                      </div>
                    </div>

                    {/* Time */}
                    <div>
                      <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">TIME</h3>
                      <div className="relative">
                        <select 
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className={`w-full h-12 px-4 pr-10 bg-white border rounded-xl text-sm font-medium appearance-none outline-none focus:ring-1 focus:ring-[#1C8C64] transition-all cursor-pointer ${selectedTime ? 'border-[#1C8C64] text-gray-900' : 'border-gray-200 text-gray-500'}`}
                        >
                          <option value="" disabled>Select a time slot</option>
                          <option value="09:00">09:00 AM - 10:00 AM</option>
                          <option value="10:00">10:00 AM - 11:00 AM</option>
                          <option value="11:00">11:00 AM - 12:00 PM</option>
                          <option value="02:00">02:00 PM - 03:00 PM</option>
                          <option value="04:00">04:00 PM - 05:00 PM</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">NOTES</h3>
                        <span className="text-[10px] text-gray-400 font-medium">(Optional)</span>
                      </div>
                      <textarea 
                        placeholder="Add a note for the agent..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-[#1C8C64] outline-none transition-all placeholder:text-gray-300 resize-none font-medium"
                      ></textarea>
                    </div>
                  </div>
                )}

                {bookingType === 'Consultation' && bookingStep === 1 && (
                  <div className="space-y-8 py-2">
                    {/* Select Date */}
                    <div>
                      <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">SELECT DATE</h3>
                      <div className="flex gap-4">
                        <button 
                          onClick={() => setSelectedDate('29')}
                          className={`w-24 h-24 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedDate === '29' ? 'border-[#1C8C64] bg-white ring-1 ring-[#1C8C64]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                        >
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">WED</span>
                          <span className="text-2xl font-black text-gray-900 leading-none">29</span>
                        </button>
                        <button 
                          onClick={() => setSelectedDate('30')}
                          className={`w-24 h-24 rounded-xl border flex flex-col items-center justify-center transition-all ${selectedDate === '30' ? 'border-[#1C8C64] bg-white ring-1 ring-[#1C8C64]' : 'border-gray-100 bg-white hover:border-gray-200'}`}
                        >
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">THU</span>
                          <span className="text-2xl font-black text-gray-900 leading-none">30</span>
                        </button>
                      </div>
                    </div>

                    {/* Time */}
                    <div>
                      <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest mb-4">TIME</h3>
                      <div className="relative">
                        <select 
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className={`w-full h-12 px-4 pr-10 bg-white border rounded-xl text-sm font-medium appearance-none outline-none focus:ring-1 focus:ring-[#1C8C64] transition-all cursor-pointer ${selectedTime ? 'border-[#1C8C64] text-gray-900' : 'border-gray-200 text-gray-500'}`}
                        >
                          <option value="" disabled>Select a time slot</option>
                          <option value="09:00">09:00 AM - 10:00 AM</option>
                          <option value="10:00">10:00 AM - 11:00 AM</option>
                          <option value="11:00">11:00 AM - 12:00 PM</option>
                          <option value="02:00">02:00 PM - 03:00 PM</option>
                          <option value="04:00">04:00 PM - 05:00 PM</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Are you looking to */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">ARE YOU LOOKING TO:</h3>
                        <span className="text-[10px] text-gray-400 font-medium">(Optional)</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Buy', 'Rent', 'Sale', 'Invest'].map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              if (lookingTo.includes(option)) {
                                setLookingTo(lookingTo.filter(t => t !== option));
                              } else {
                                setLookingTo([...lookingTo, option]);
                              }
                            }}
                            className={`px-4 py-2 rounded-full text-sm font-bold border transition-all ${
                              lookingTo.includes(option)
                                ? 'bg-[#006169] border-[#006169] text-white'
                                : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">NOTES</h3>
                        <span className="text-[10px] text-gray-400 font-medium">(Optional)</span>
                      </div>
                      <textarea 
                        placeholder="Add a note for the agent..."
                        value={bookingNotes}
                        onChange={(e) => setBookingNotes(e.target.value)}
                        className="w-full h-32 p-4 bg-white border border-gray-200 rounded-xl text-sm focus:ring-1 focus:ring-[#1C8C64] outline-none transition-all placeholder:text-gray-300 resize-none font-medium"
                      ></textarea>
                    </div>
                  </div>
                )}

                {((bookingType === 'Viewing' && bookingStep === 3) || (bookingType === 'Consultation' && bookingStep === 2)) && (
                  <div className="space-y-6 py-2">
                    <div>
                      <h2 className="text-xl font-bold text-[#002B2E] mb-1">User Details</h2>
                      <p className="text-sm text-gray-500">We'll share the viewing details with the user to confirm their appointment.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">FIRST NAME</label>
                        <input 
                          type="text" 
                          placeholder="John"
                          value={userDetails.firstName}
                          onChange={(e) => setUserDetails({...userDetails, firstName: e.target.value})}
                          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1C8C64] placeholder:text-gray-300 font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">LAST NAME</label>
                        <input 
                          type="text" 
                          placeholder="Doe"
                          value={userDetails.lastName}
                          onChange={(e) => setUserDetails({...userDetails, lastName: e.target.value})}
                          className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1C8C64] placeholder:text-gray-300 font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">EMAIL</label>
                      <input 
                        type="email" 
                        placeholder="john.doe@example.com"
                        value={userDetails.email}
                        onChange={(e) => setUserDetails({...userDetails, email: e.target.value})}
                        className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1C8C64] placeholder:text-gray-300 font-medium"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-900 uppercase tracking-widest">PHONE NUMBER</label>
                      <div className="flex gap-2">
                        <div className="relative w-32">
                          <select className="w-full h-12 px-4 pr-8 bg-white border border-gray-200 rounded-xl text-sm font-medium appearance-none outline-none focus:ring-1 focus:ring-[#1C8C64]">
                            <option>+971</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-4 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        <input 
                          type="text" 
                          placeholder="5X XXX XXXX"
                          value={userDetails.phone}
                          onChange={(e) => setUserDetails({...userDetails, phone: e.target.value})}
                          className="flex-1 h-12 px-4 bg-white border border-gray-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-[#1C8C64] placeholder:text-gray-300 font-medium"
                        />
                      </div>
                    </div>

                    <div className="flex items-start gap-3 mt-4">
                      <Info className="w-4 h-4 text-gray-300 mt-0.5 flex-shrink-0" />
                      <p className="text-[11px] text-gray-400 leading-relaxed">
                        If WhatsApp is available on this number, the viewing request will be shared via WhatsApp. Otherwise it will be sent via SMS.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-white">
                <button 
                  onClick={() => bookingStep === 0 ? setShowBookingModal(false) : setBookingStep(bookingStep - 1)}
                  className="px-6 py-3 text-gray-500 font-bold hover:text-gray-800 transition-colors"
                >
                  {bookingStep === 0 ? 'Cancel' : 'Back'}
                </button>
                
                <div className="flex items-center gap-4">
                  {bookingStep > 0 && (
                    <>
                      {bookingStep > 1 && (
                        <button 
                          onClick={() => setShowBookingModal(false)}
                          className="px-4 py-2 text-gray-400 text-sm font-bold hover:text-gray-600 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                      <button 
                        disabled={
                          bookingType === 'Viewing' ? (
                            bookingStep === 1 ? selectedListingId === null : 
                            bookingStep === 2 ? !selectedTime :
                            !(userDetails.firstName && userDetails.lastName && userDetails.email && userDetails.phone)
                          ) : (
                            bookingStep === 1 ? !selectedTime :
                            !(userDetails.firstName && userDetails.lastName && userDetails.email && userDetails.phone)
                          )
                        }
                        onClick={() => {
                          const maxSteps = bookingType === 'Viewing' ? 3 : 2;
                          if (bookingStep < maxSteps) {
                            setBookingStep(bookingStep + 1);
                          } else {
                            setIsBookingSuccess(true);
                          }
                        }}
                        className={`px-8 py-3 rounded-lg font-bold text-sm transition-all ${
                          (bookingType === 'Viewing' ? (
                            bookingStep === 1 ? selectedListingId !== null : 
                            bookingStep === 2 ? selectedTime :
                            (userDetails.firstName && userDetails.lastName && userDetails.email && userDetails.phone)
                          ) : (
                            bookingStep === 1 ? selectedTime :
                            (userDetails.firstName && userDetails.lastName && userDetails.email && userDetails.phone)
                          )) 
                            ? 'bg-[#27A177] text-white hover:bg-[#1E7F5E] shadow-lg' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        {(bookingType === 'Viewing' && bookingStep === 3) || (bookingType === 'Consultation' && bookingStep === 2) ? 'Generate Request' : 'Next Step'}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </>
          )}
        </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}


import React, { useState, useRef } from 'react';
import { UserStats, Language, ReadingSession } from '../types';
import { ACHIEVEMENTS_DATA, CATEGORY_ICONS, ICON_MAP, GLOBAL_LEADERS } from '../constants';
import { TRANSLATIONS } from '../translations';
import { Award, Zap, Target, BookOpen, Flame, Star, TrendingUp, BarChart3, Calendar, Crown, Copy, Check, Pencil, Camera, X, Trash2, Users, ChevronRight, Plus } from 'lucide-react';

interface ProfileProps {
  stats: UserStats;
  user: { name: string; email: string; avatar?: string };
  isDarkMode: boolean;
  language: Language;
  onOpenGallery: () => void;
  onOpenPremium: () => void;
  onUpdateUser: (updates: Partial<{ name: string; avatar: string }>) => void;
  onRemoveFriend: (code: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ stats, user, isDarkMode, language, onOpenGallery, onOpenPremium, onUpdateUser, onRemoveFriend }) => {
  const t = TRANSLATIONS[language];
  const [copied, setCopied] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const handleCopy = () => {
    navigator.clipboard.writeText(stats.idCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateUser({ name: tempName.trim() });
      setIsEditingName(false);
    }
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const friends = GLOBAL_LEADERS.filter(u => stats.friendCodes.includes(u.code));
  const history = stats.history || [];
  const trendData = history.slice(-10).map(s => s.wpm);
  
  const categoryStats = history.reduce((acc, sess) => {
    if (!acc[sess.category]) acc[sess.category] = { count: 0, accuracy: 0 };
    acc[sess.category].count += 1;
    acc[sess.category].accuracy += sess.accuracy;
    return acc;
  }, {} as Record<string, { count: number, accuracy: number }>);

  const unlockedAchievements = ACHIEVEMENTS_DATA.filter(a => a.isUnlocked);

  return (
    <div className={`p-4 md:p-10 pb-32 space-y-8 animate-in fade-in duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      
      {/* Premium Upgrade Section */}
      {!stats.isPremium && (
        <button 
          onClick={onOpenPremium}
          className="w-full relative overflow-hidden p-6 rounded-[32px] bg-gradient-to-r from-amber-400 to-orange-600 flex items-center justify-between text-white shadow-xl shadow-amber-500/20 transform hover:scale-[1.01] active:scale-[0.98] transition-all group"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
              <Crown size={24} fill="currentColor" className="animate-pulse" />
            </div>
            <div className="text-left">
              <h4 className="text-lg font-black italic tracking-tighter uppercase leading-none mb-1">{t.goPremium}</h4>
              <p className="text-[10px] font-bold opacity-80 uppercase tracking-widest">{t.premiumSubtitle}</p>
            </div>
          </div>
          <Zap size={24} className="opacity-40 animate-lightning" />
        </button>
      )}

      {/* Hero Section */}
      <div className={`relative overflow-hidden p-6 md:p-12 rounded-[40px] flex flex-col md:flex-row items-center gap-6 md:gap-8 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-xl shadow-slate-200/50'}`}>
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Star size={120} fill="currentColor" />
        </div>
        
        <div className="relative group cursor-pointer" onClick={handlePhotoClick}>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <div className={`w-28 h-28 md:w-40 md:h-40 rounded-[32px] md:rounded-[48px] bg-indigo-600 border-4 md:border-8 border-indigo-500/20 shadow-2xl flex items-center justify-center overflow-hidden transition-all duration-500 transform -rotate-3 group-hover:rotate-0 ${stats.isPremium ? 'border-amber-400/50' : ''}`}>
                {user.avatar ? (
                  <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-4xl md:text-5xl font-black italic tracking-tighter">
                    {getInitials(user.name)}
                  </span>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <Camera className="text-white" size={32} />
                </div>
            </div>
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-white p-2.5 md:p-4 rounded-[16px] md:rounded-[24px] border-4 border-white dark:border-slate-900 shadow-xl">
                <Award size={20} className="md:w-6 md:h-6" fill="white" />
            </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row items-center gap-3">
              {isEditingName ? (
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-indigo-500/30">
                  <input 
                    autoFocus
                    className="bg-transparent text-2xl md:text-4xl font-black italic tracking-tighter outline-none px-4 py-1"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveName()}
                  />
                  <button onClick={handleSaveName} className="p-3 bg-indigo-600 text-white rounded-xl">
                    <Check size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                   <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter leading-tight">{user.name}</h2>
                   <button onClick={() => setIsEditingName(true)} className="p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-colors">
                     <Pencil size={20} />
                   </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-2">
              <div className={`px-4 py-1.5 rounded-xl border flex items-center gap-3 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{t.velocityId}:</span>
                <span className="font-mono font-black text-indigo-500">{stats.idCode}</span>
                <button onClick={handleCopy} className="text-slate-400 hover:text-indigo-500 transition-colors">
                  {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-2">
                <p className="text-indigo-500 font-black text-sm md:text-lg tracking-[0.2em] uppercase">{stats.level}</p>
                <div className="flex items-center gap-1 text-amber-500 animate-lightning">
                    <Zap size={18} fill="currentColor" />
                    <span className="text-xs font-black">LVL {stats.accountLevel}</span>
                </div>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                  <Flame className="text-orange-500" fill="currentColor" size={18} />
                  <span className="font-black text-base md:text-xl">{stats.dailyStreak}<span className="text-[10px] ml-1 opacity-50 uppercase tracking-widest hidden sm:inline">Streak</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-amber-500" fill="currentColor" size={18} />
                  <span className="font-black text-base md:text-xl">{stats.experience}<span className="text-[10px] ml-1 opacity-50 uppercase tracking-widest hidden sm:inline">XP</span></span>
                </div>
            </div>
        </div>
      </div>

      {/* Achievements Horizontal Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">{t.hallOfFame}</h3>
          <button 
            onClick={onOpenGallery}
            className="flex items-center gap-1 text-indigo-500 text-[10px] font-black uppercase tracking-widest hover:underline"
          >
            {t.alphabetical} <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
          {unlockedAchievements.slice(0, 6).map(medal => {
            const IconComp = ICON_MAP[medal.icon] || Award;
            return (
              <div 
                key={medal.id}
                onClick={onOpenGallery}
                className={`flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-[32px] flex items-center justify-center border-2 transition-transform hover:scale-105 active:scale-95 cursor-pointer relative overflow-hidden ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-lg shadow-slate-200/50'
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
                <div className="flex flex-col items-center gap-2 relative z-10">
                    <IconComp size={28} className="text-indigo-500" fill={isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'none'} />
                    <span className="text-[7px] font-black uppercase text-center px-2 line-clamp-1">{medal.title}</span>
                </div>
              </div>
            );
          })}
          <div 
            onClick={onOpenGallery}
            className={`flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer ${
              isDarkMode ? 'border-slate-800 text-slate-600' : 'border-slate-200 text-slate-400'
            }`}
          >
            <Plus size={20} />
            <span className="text-[8px] font-black uppercase tracking-widest text-center">{t.alphabetical}</span>
          </div>
        </div>
      </div>

      {/* Neural Squad Section (Friends) */}
      <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">{t.mySquad}</h3>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{friends.length} {t.totalFriends}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-2">
            {friends.map(friend => (
              <div 
                key={friend.id}
                className={`p-4 rounded-[28px] border-2 flex items-center gap-4 group relative ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-sm'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${
                  isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
                }`}>
                  {friend.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`font-black text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{friend.name}</h4>
                  <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-slate-500">
                    <Zap size={10} className="text-amber-500" fill="currentColor" /> LVL {friend.level}
                  </div>
                </div>
                <button 
                  onClick={() => onRemoveFriend(friend.code)}
                  className="p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/10 text-rose-500 rounded-xl"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            {friends.length === 0 && (
              <div className={`col-span-full p-8 rounded-[28px] border-2 border-dashed flex flex-col items-center justify-center text-center space-y-2 ${
                isDarkMode ? 'border-slate-800 text-slate-600' : 'border-slate-200 text-slate-400'
              }`}>
                <Users size={32} strokeWidth={1.5} />
                <p className="text-[10px] font-black uppercase tracking-widest">{t.noConnections}</p>
              </div>
            )}
          </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard icon={<Zap size={20} />} label="Best Speed" value={stats.bestWpm.toString() + ' ' + t.wpm} color="text-yellow-500" isDarkMode={isDarkMode} />
        <StatCard icon={<Target size={20} />} label={t.accuracy} value={`${stats.comprehensionRate}%`} color="text-emerald-500" isDarkMode={isDarkMode} />
        <StatCard icon={<BookOpen size={20} />} label="Total Data" value={(stats.totalWordsRead / 1000).toFixed(1) + 'k'} color="text-indigo-500" isDarkMode={isDarkMode} />
        <StatCard icon={<Award size={20} />} label="Rank" value="#12" color="text-rose-500" isDarkMode={isDarkMode} />
      </div>

      {/* Charts & Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div className={`p-6 md:p-8 rounded-[40px] border space-y-4 md:space-y-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-500" /> {t.statsWpmTrend}
            </h3>
            <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Last 10</span>
          </div>
          <div className="h-32 md:h-48 w-full">
            <LineChart data={trendData} isDarkMode={isDarkMode} />
          </div>
        </div>

        <div className={`p-6 md:p-8 rounded-[40px] border space-y-4 md:space-y-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-xl'}`}>
          <div className="flex items-center justify-between">
            <h3 className="text-base md:text-xl font-black italic uppercase tracking-tighter flex items-center gap-2">
              <BarChart3 size={18} className="text-indigo-500" /> {t.statsCategoryMastery}
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {Object.entries(CATEGORY_ICONS).slice(0, 4).map(([cat, icon]) => {
               const data = categoryStats[cat] || { count: 0, accuracy: 0 };
               const avgAccuracy = data.count > 0 ? Math.round((data.accuracy / data.count) * 100) : 0;
               return (
                 <div key={cat} className={`p-3 md:p-4 rounded-2xl flex items-center gap-3 md:gap-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="text-indigo-500 opacity-50 shrink-0">{icon}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500 truncate">{cat}</p>
                      <p className="text-base md:text-lg font-black">{avgAccuracy}%</p>
                    </div>
                 </div>
               );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, isDarkMode }: { icon: React.ReactNode, label: string, value: string, color: string, isDarkMode: boolean }) => (
    <div className={`p-5 md:p-8 rounded-[32px] md:rounded-[40px] border transition-all hover:translate-y-[-4px] active:scale-[0.98] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-md shadow-slate-200/50'}`}>
        <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} ${color}`}>
          {icon}
        </div>
        <p className="text-slate-500 text-[8px] md:text-xs font-black uppercase tracking-widest mb-1 truncate">{label}</p>
        <p className="text-xl md:text-3xl font-black italic tracking-tighter truncate">{value}</p>
    </div>
);

const LineChart = ({ data, isDarkMode }: { data: number[], isDarkMode: boolean }) => {
  if (data.length === 0) return (
    <div className="h-full flex items-center justify-center text-slate-500 text-[10px] font-black uppercase tracking-widest opacity-30">
      NO DATA
    </div>
  );
  const max = Math.max(...data, 100);
  const min = Math.min(...data, 0);
  const range = Math.max(max - min, 1);
  const width = 500;
  const height = 150;
  const points = data.map((d, i) => {
    const x = (i / (Math.max(data.length - 1, 1))) * width;
    const y = height - ((d - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
      <defs>
        <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M 0,${height} ${points} L ${width},${height} Z`} fill="url(#lineGrad)" />
      <polyline fill="none" stroke="#6366f1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" points={points} />
      {data.map((d, i) => {
        const x = (i / (Math.max(data.length - 1, 1))) * width;
        const y = height - ((d - min) / range) * height;
        return <circle key={i} cx={x} cy={y} r="6" fill="#6366f1" className="drop-shadow-sm" />;
      })}
    </svg>
  );
};

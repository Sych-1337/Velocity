
import React from 'react';
import { UserStats, PlayerLevel } from '../types';
import { ACHIEVEMENTS_DATA } from '../constants';
import { Award, Zap, Target, BookOpen, Flame, Star } from 'lucide-react';

interface ProfileProps {
  stats: UserStats;
  user: { name: string; avatar?: string };
  isDarkMode: boolean;
  onOpenGallery: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ stats, user, isDarkMode, onOpenGallery }) => {
  const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className={`p-6 md:p-10 space-y-10 animate-in fade-in duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      
      {/* Header Banner */}
      <div className={`relative overflow-hidden p-8 md:p-12 rounded-[48px] flex flex-col md:flex-row items-center gap-8 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-xl shadow-slate-200/50'}`}>
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Star size={120} fill="currentColor" />
        </div>
        
        <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-[48px] bg-indigo-600 border-8 border-indigo-500/20 shadow-2xl flex items-center justify-center text-white text-5xl font-black italic tracking-tighter transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                {getInitials(user.name)}
            </div>
            <div className="absolute -bottom-4 -right-4 bg-amber-400 text-white p-4 rounded-[24px] border-4 border-white shadow-xl">
                <Award size={24} fill="white" />
            </div>
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter">{user.name}</h2>
              <p className="text-indigo-500 font-black text-lg tracking-[0.2em] uppercase">{stats.level}</p>
            </div>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
                <div className="flex items-center gap-2">
                  <Flame className="text-orange-500" fill="currentColor" size={20} />
                  <span className="font-black text-xl">{stats.dailyStreak}<span className="text-xs ml-1 opacity-50 uppercase tracking-widest">Day Streak</span></span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="text-amber-500" fill="currentColor" size={20} />
                  <span className="font-black text-xl">12,450<span className="text-xs ml-1 opacity-50 uppercase tracking-widest">Points</span></span>
                </div>
            </div>
        </div>

        <div className="w-full md:w-72 space-y-3">
            <div className="flex justify-between items-end">
                <p className="opacity-60 text-[10px] font-black uppercase tracking-widest">XP Progress</p>
                <span className="text-indigo-500 font-black">75%</span>
            </div>
            <div className={`h-4 rounded-full overflow-hidden p-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div className="h-full bg-indigo-500 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.6)] w-3/4" />
            </div>
            <p className="text-[10px] text-center font-bold opacity-40 uppercase">3,250 XP until Level 43</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Zap size={22} />} label="Best Speed" value={stats.bestWpm.toString() + ' WPM'} color="text-yellow-500" isDarkMode={isDarkMode} />
        <StatCard icon={<Target size={22} />} label="Accuracy" value={`${stats.comprehensionRate}%`} color="text-emerald-500" isDarkMode={isDarkMode} />
        <StatCard icon={<BookOpen size={22} />} label="Total Data" value={(stats.totalWordsRead / 1000).toFixed(1) + 'k Words'} color="text-indigo-500" isDarkMode={isDarkMode} />
        <StatCard icon={<Award size={22} />} label="Global Rank" value="#12" color="text-rose-500" isDarkMode={isDarkMode} />
      </div>

      {/* Achievements Section */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter">Medals & Trophies</h3>
            <button 
              onClick={onOpenGallery}
              className={`text-xs font-black uppercase tracking-widest px-6 py-3 rounded-2xl transition-all transform active:scale-95 ${
                isDarkMode ? 'bg-slate-900 border border-slate-800 hover:bg-slate-800 hover:text-indigo-400' : 'bg-white shadow-md hover:bg-slate-50 hover:text-indigo-600'
              }`}
            >
              View Full Gallery
            </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {ACHIEVEMENTS_DATA.map(achievement => (
                <div 
                    key={achievement.id}
                    className={`p-6 rounded-[32px] border-2 flex flex-col items-center text-center space-y-4 transition-all duration-300 transform hover:scale-105 ${
                        achievement.isUnlocked 
                          ? isDarkMode ? 'border-amber-500/30 bg-amber-500/5' : 'border-amber-100 bg-amber-50/30' 
                          : isDarkMode ? 'border-slate-900 bg-slate-900/50 opacity-20 grayscale' : 'border-slate-100 bg-slate-50 opacity-40 grayscale'
                    }`}
                >
                    <div className={`p-5 rounded-[24px] ${achievement.isUnlocked ? (isDarkMode ? 'bg-amber-500/20 text-amber-500' : 'bg-amber-400 text-white shadow-lg shadow-amber-400/20') : 'bg-slate-200 text-slate-400'}`}>
                        <Award size={32} />
                    </div>
                    <div>
                      <p className={`text-sm font-black uppercase leading-tight tracking-tight ${achievement.isUnlocked ? (isDarkMode ? 'text-amber-100' : 'text-slate-900') : 'text-slate-500'}`}>{achievement.title}</p>
                      <p className="text-[10px] mt-1 opacity-60 font-medium leading-tight">{achievement.description}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, isDarkMode }: { icon: React.ReactNode, label: string, value: string, color: string, isDarkMode: boolean }) => (
    <div className={`p-8 rounded-[40px] border transition-all hover:translate-y-[-4px] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100 shadow-md shadow-slate-200/50'}`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} ${color}`}>
          {icon}
        </div>
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-1">{label}</p>
        <p className="text-3xl font-black italic tracking-tighter">{value}</p>
    </div>
);

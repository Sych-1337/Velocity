
import React from 'react';
import { Achievement } from '../types';
import { Award, ArrowLeft, Star, Calendar, ShieldCheck, Zap } from 'lucide-react';

interface GalleryProps {
  achievements: Achievement[];
  onBack: () => void;
  isDarkMode: boolean;
}

export const AchievementsGallery: React.FC<GalleryProps> = ({ achievements, onBack, isDarkMode }) => {
  return (
    <div className={`min-h-full p-6 md:p-10 space-y-10 animate-in slide-in-from-right duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="flex items-center gap-6">
        <button 
          onClick={onBack}
          className={`p-4 rounded-3xl transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white shadow-md hover:bg-slate-50'}`}
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">Hall of Fame</h2>
          <p className="text-indigo-500 font-black uppercase tracking-widest text-[10px]">Your personal legacy</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {achievements.map((medal) => (
          <div 
            key={medal.id}
            className={`relative p-8 rounded-[48px] border-2 transition-all group overflow-hidden ${
              medal.isUnlocked 
                ? isDarkMode ? 'bg-indigo-950/20 border-amber-500/40' : 'bg-white border-amber-100 shadow-xl shadow-amber-500/10'
                : isDarkMode ? 'bg-slate-900 border-slate-800 opacity-60' : 'bg-slate-50 border-slate-100 opacity-50 grayscale'
            }`}
          >
            {/* Background Icon */}
            <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
               <Award size={160} />
            </div>

            <div className="flex flex-col items-center text-center space-y-6 relative z-10">
              <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-12 ${
                medal.isUnlocked 
                  ? 'bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-2xl shadow-orange-500/30' 
                  : 'bg-slate-200 text-slate-400'
              }`}>
                <Award size={48} fill={medal.isUnlocked ? "white" : "none"} />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">{medal.title}</h3>
                <p className={`text-sm font-medium leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  {medal.description}
                </p>
              </div>

              {medal.isUnlocked ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <ShieldCheck size={14} /> Unlocked
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-slate-500/10 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest">
                  <Zap size={14} /> Locked
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary Footer */}
      <div className={`p-10 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8 ${isDarkMode ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20' : 'bg-slate-900 text-white'}`}>
        <div className="flex items-center gap-6">
          <div className="p-6 bg-white/20 rounded-[32px] backdrop-blur-md">
            <Star size={40} fill="white" />
          </div>
          <div>
            <h4 className="text-3xl font-black italic tracking-tighter uppercase">Elite Completion</h4>
            <p className="opacity-70 font-bold">You've earned {achievements.filter(a => a.isUnlocked).length} of {achievements.length} badges</p>
          </div>
        </div>
        
        <div className="flex flex-col items-center md:items-end gap-2">
          <div className="flex gap-2">
            {achievements.map((a, i) => (
              <div key={i} className={`w-3 h-3 rounded-full ${a.isUnlocked ? 'bg-amber-400' : 'bg-white/20'}`} />
            ))}
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Keep reading to grow your legacy</p>
        </div>
      </div>
    </div>
  );
};

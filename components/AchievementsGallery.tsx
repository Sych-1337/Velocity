
import React from 'react';
import { Achievement, Language } from '../types';
import { ICON_MAP } from '../constants';
import { Award, ArrowLeft, Star, ShieldCheck, Zap } from 'lucide-react';
import { TRANSLATIONS } from '../translations';

interface GalleryProps {
  achievements: Achievement[];
  onBack: () => void;
  isDarkMode: boolean;
  language: Language;
}

export const AchievementsGallery: React.FC<GalleryProps> = ({ achievements, onBack, isDarkMode, language }) => {
  const t = TRANSLATIONS[language];
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
          <h2 className="text-4xl font-black italic tracking-tighter uppercase">{t.hallOfFame}</h2>
          <p className="text-indigo-500 font-black uppercase tracking-widest text-[10px]">{t.personalLegacy}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {achievements.map((medal) => {
          const IconComp = ICON_MAP[medal.icon] || Award;
          return (
            <div 
              key={medal.id}
              className={`relative p-5 md:p-8 rounded-[40px] border-2 transition-all group overflow-hidden ${
                medal.isUnlocked 
                  ? isDarkMode ? 'bg-indigo-950/20 border-amber-500/40' : 'bg-white border-amber-100 shadow-xl shadow-amber-500/10'
                  : isDarkMode ? 'bg-slate-900 border-slate-800 opacity-60' : 'bg-slate-50 border-slate-100 opacity-50 grayscale'
              }`}
            >
              <div className="absolute -bottom-4 -right-4 opacity-[0.03] group-hover:scale-110 transition-transform duration-700">
                 <IconComp size={120} />
              </div>

              <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 relative z-10">
                <div className={`w-16 h-16 md:w-20 md:h-20 rounded-[28px] flex items-center justify-center transform transition-transform duration-500 group-hover:rotate-12 ${
                  medal.isUnlocked 
                    ? 'bg-gradient-to-br from-amber-400 to-orange-600 text-white shadow-2xl shadow-orange-500/30' 
                    : 'bg-slate-200 text-slate-400'
                }`}>
                  <IconComp size={32} fill={medal.isUnlocked ? "white" : "none"} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm md:text-lg font-black italic uppercase tracking-tighter line-clamp-1">{medal.title}</h3>
                  <p className={`text-[10px] md:text-xs font-medium leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {medal.description}
                  </p>
                </div>

                {medal.isUnlocked ? (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[8px] font-black uppercase tracking-widest">
                    <ShieldCheck size={10} /> {t.unlocked}
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-500/10 text-slate-500 rounded-full text-[8px] font-black uppercase tracking-widest">
                    <Zap size={10} /> {t.locked}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className={`p-10 rounded-[48px] flex flex-col md:flex-row items-center justify-between gap-8 ${isDarkMode ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/20' : 'bg-slate-900 text-white'}`}>
        <div className="flex items-center gap-6">
          <div className="p-6 bg-white/20 rounded-[32px] backdrop-blur-md">
            <Star size={40} fill="white" />
          </div>
          <div>
            <h4 className="text-3xl font-black italic tracking-tighter uppercase">{t.evolutionProgress}</h4>
            <p className="opacity-70 font-bold">{t.questionOf.replace('{n}', achievements.filter(a => a.isUnlocked).length.toString()).replace('{m}', achievements.length.toString())}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

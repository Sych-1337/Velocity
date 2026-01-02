
import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface AdBannerProps {
  isDarkMode: boolean;
  type?: 'banner' | 'card';
  language?: Language;
}

export const AdBanner: React.FC<AdBannerProps> = ({ isDarkMode, type = 'banner', language = 'en' }) => {
  const t = TRANSLATIONS[language];

  if (type === 'card') {
    return (
      <div className={`p-6 rounded-[40px] border-2 border-dashed flex flex-col items-center justify-center text-center space-y-4 ${
        isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'
      }`}>
        <div className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-black rounded uppercase tracking-tighter">{t.sponsored}</div>
        <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black italic shadow-lg shadow-indigo-500/20">V.</div>
        <div>
          <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.premiumTitle}</h4>
          <p className="text-xs text-slate-500">{t.premiumSubtitle}</p>
        </div>
        <button className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
          {t.goPremium}
        </button>
      </div>
    );
  }

  return (
    <div className={`w-full p-3 flex items-center justify-between gap-4 rounded-2xl overflow-hidden relative ${
      isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-indigo-50 border border-indigo-100'
    }`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white text-[10px] font-black shrink-0">AI</div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-500 text-white leading-none uppercase`}>Ad</span>
            <span className={`text-xs font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Velocity Pro</span>
          </div>
          <p className="text-[10px] text-slate-500 line-clamp-1">{t.tagline}</p>
        </div>
      </div>
      <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
        {t.install} <ExternalLink size={10} />
      </button>
    </div>
  );
};

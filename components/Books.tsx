
import React, { useState } from 'react';
import { BookOpen, Upload, Lock, Bell, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface BooksProps {
  isDarkMode: boolean;
  language: Language;
}

export const Books: React.FC<BooksProps> = ({ isDarkMode, language }) => {
  const t = TRANSLATIONS[language];
  const [notified, setNotified] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 md:p-10 space-y-10 text-center animate-in fade-in duration-1000 relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[10%] left-[10%] w-64 h-64 bg-indigo-500/5 rounded-full blur-[80px] animate-float" />
          <div className="absolute bottom-[20%] right-[15%] w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] animate-float-delayed" />
          <div className="absolute top-[40%] right-[25%] w-48 h-48 bg-blue-500/5 rounded-full blur-[60px] animate-float-fast" />
          <div className="absolute bottom-[10%] left-[30%] w-56 h-56 bg-indigo-600/5 rounded-full blur-[70px] animate-float" />
      </div>

      <div className="relative z-10">
        <div className="relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-96 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative space-y-8">
              <div className="w-32 h-32 md:w-48 md:h-48 bg-indigo-600 rounded-[48px] mx-auto flex items-center justify-center text-white shadow-[0_0_80px_rgba(99,102,241,0.3)] animate-pulse">
                  <BookOpen className="w-16 h-16 md:w-20 md:h-20" />
              </div>
              
              <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-amber-500 font-black uppercase tracking-[0.3em] text-xs">
                     <Sparkles size={16} fill="currentColor" /> {t.comingSoon}
                  </div>
                  <h2 className={`text-4xl md:text-6xl font-black italic uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                      {t.myBooksTab}
                  </h2>
                  <p className={`text-lg md:text-xl font-medium max-w-xl mx-auto opacity-60`}>
                      {t.booksDesc}
                  </p>
              </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 w-full max-w-md relative z-10">
        <div className={`flex-1 flex items-center gap-4 p-6 rounded-[32px] border-2 border-dashed ${isDarkMode ? 'border-slate-800 bg-slate-900/40 text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
            <Upload size={24} />
            <div className="text-left">
                <p className="font-black text-[10px] uppercase tracking-widest">Supports</p>
                <p className="font-bold">{t.supportsFiles}</p>
            </div>
        </div>
        <div className={`flex-1 flex items-center gap-4 p-6 rounded-[32px] border-2 border-dashed ${isDarkMode ? 'border-slate-800 bg-slate-900/40 text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-400'}`}>
            <Lock size={24} />
            <div className="text-left">
                <p className="font-black text-[10px] uppercase tracking-widest">Privacy</p>
                <p className="font-bold">{t.privacyLocal}</p>
            </div>
        </div>
      </div>

      <button 
        onClick={() => setNotified(true)}
        disabled={notified}
        className={`group relative z-10 flex items-center gap-4 px-12 py-6 rounded-[32px] font-black text-xl transition-all active:scale-95 ${
          notified 
            ? 'bg-emerald-500 text-white shadow-emerald-500/20' 
            : 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30'
        }`}
      >
        {notified ? <Sparkles className="animate-spin-slow" /> : <Bell className="group-hover:animate-bounce" />}
        {notified ? t.notifiedFirst : t.notifyMe}
      </button>

      <div className="fixed bottom-0 left-0 w-full h-1/4 grid grid-cols-4 md:grid-cols-8 gap-4 px-10 opacity-10 pointer-events-none blur-sm z-0">
         {Array.from({ length: 16 }).map((_, i) => (
             <div key={i} className="aspect-[3/4] bg-slate-500 rounded-xl" />
         ))}
      </div>
    </div>
  );
};

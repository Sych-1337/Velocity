
import React, { useState } from 'react';
import { Volume2, Moon, Sun, Bell, Shield, LogOut, Globe, AlertTriangle, X, CheckCircle, ShieldAlert, Zap } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface SettingsProps {
  wpm: number;
  onWpmChange: (val: number) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onLogout: () => void;
  isStrictMode: boolean;
  hasSeenWarning: boolean;
  onToggleStrictMode: (bypass: boolean) => void;
}

export const Settings: React.FC<SettingsProps> = ({ 
    wpm, onWpmChange, isDarkMode, onToggleTheme, language, onLanguageChange, onLogout, isStrictMode, hasSeenWarning, onToggleStrictMode 
}) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const t = TRANSLATIONS[language];

  const languages: { id: Language; label: string; flag: string }[] = [
    { id: 'en', label: 'English', flag: '🇺🇸' },
    { id: 'es', label: 'Español', flag: '🇪🇸' },
    { id: 'ru', label: 'Русский', flag: '🇷🇺' },
    { id: 'uk', label: 'Українська', flag: '🇺🇦' },
  ];

  const handleStrictToggle = () => {
    if (!isStrictMode && !hasSeenWarning) {
        setShowWarningModal(true);
    } else {
        onToggleStrictMode(false);
    }
  };

  const confirmStrict = () => {
      onToggleStrictMode(dontShowAgain);
      setShowWarningModal(false);
  };

  return (
    <div className={`p-6 pb-24 space-y-8 animate-in fade-in duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <h2 className="text-3xl font-extrabold">{t.settingsTitle}</h2>

      <section className="space-y-6">
        <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
          <Globe size={14} /> {t.systemLanguage}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => onLanguageChange(lang.id)}
              className={`flex items-center gap-3 p-4 rounded-3xl border-2 transition-all active:scale-95 ${
                language === lang.id
                  ? 'border-indigo-600 bg-indigo-600/10 text-indigo-500'
                  : isDarkMode
                  ? 'border-slate-800 bg-slate-800 text-slate-400 hover:border-slate-700'
                  : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200 shadow-sm'
              }`}
            >
              <span className="text-xl">{lang.flag}</span>
              <span className="font-bold text-sm">{lang.label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">{t.readerConfig}</h3>
        
        <div className={`p-6 rounded-[32px] space-y-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className="flex justify-between items-center mb-2">
                <span className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{t.defaultSpeed}</span>
                <span className="text-indigo-500 font-black">{wpm} {t.wpm}</span>
            </div>
            <input 
                type="range" 
                min="50" 
                max="1000" 
                step="25"
                value={wpm}
                onChange={(e) => onWpmChange(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between text-[10px] font-black text-slate-400 px-1">
                <span>{t.relaxed}</span>
                <span>{t.legendary}</span>
            </div>
        </div>

        <div className="space-y-3">
            <ToggleOption icon={<Volume2 size={20} />} label={t.soundEffects} active={true} isDarkMode={isDarkMode} />
            <ToggleOption 
                icon={isDarkMode ? <Sun size={20} /> : <Moon size={20} />} 
                label={t.darkMode} 
                active={isDarkMode} 
                isDarkMode={isDarkMode}
                onToggle={onToggleTheme} 
            />
            <ToggleOption icon={<Bell size={20} />} label="Push Notifications" active={true} isDarkMode={isDarkMode} />
            <ToggleOption 
                icon={<Shield size={20} />} 
                label={t.strict} 
                active={isStrictMode} 
                isDarkMode={isDarkMode} 
                onToggle={handleStrictToggle}
            />
        </div>
      </section>

      <section className="space-y-6">
        <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">Account</h3>
        <button 
          onClick={onLogout}
          className={`w-full flex items-center justify-between p-5 border rounded-3xl font-bold active:scale-[0.98] transition-all ${
            isDarkMode 
              ? 'bg-slate-800 border-slate-700 text-rose-400' 
              : 'bg-white border-slate-100 text-rose-600 shadow-sm'
          }`}
        >
            <div className="flex items-center gap-3">
                <LogOut size={20} />
                <span>{t.logOut}</span>
            </div>
        </button>
      </section>

      {showWarningModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
              <div className={`w-full max-w-md p-8 rounded-[48px] space-y-8 shadow-2xl relative overflow-hidden border-4 ${isDarkMode ? 'bg-slate-900 border-rose-600/30' : 'bg-white border-rose-100'}`}>
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <ShieldAlert size={160} className="text-rose-600" />
                </div>

                <div className="flex flex-col items-center text-center space-y-6">
                    <div className="w-20 h-20 bg-rose-500/10 text-rose-500 rounded-3xl flex items-center justify-center animate-pulse">
                        <AlertTriangle size={40} />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-3xl font-black italic tracking-tighter uppercase">{t.safetyProtocolHeader}</h3>
                        <p className="text-rose-500 font-black uppercase tracking-widest text-[10px]">{t.strictActive}</p>
                    </div>

                    <div className={`w-full p-6 rounded-[32px] text-left space-y-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-start gap-4">
                            <Shield className="text-rose-500 shrink-0 mt-1" size={18} />
                            <p className="text-sm font-bold">{t.lockedControls}</p>
                        </div>
                        <div className="flex items-start gap-4">
                            <Zap className="text-amber-500 shrink-0 mt-1" size={18} />
                            <p className="text-sm font-bold">{t.riskReward}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full px-2">
                        <input 
                            type="checkbox" 
                            id="dontShow" 
                            className="w-5 h-5 rounded-lg accent-indigo-600"
                            checked={dontShowAgain}
                            onChange={(e) => setDontShowAgain(e.target.checked)}
                        />
                        <label htmlFor="dontShow" className="text-xs font-bold opacity-60">{t.bypassWarning}</label>
                    </div>

                    <div className="w-full flex flex-col gap-3">
                        <button 
                            onClick={confirmStrict}
                            className="w-full bg-rose-600 text-white py-5 rounded-[28px] font-black text-lg hover:bg-rose-700 shadow-xl shadow-rose-600/30 transition-all active:scale-95"
                        >
                            {t.activateProtocol}
                        </button>
                        <button 
                            onClick={() => setShowWarningModal(false)}
                            className="w-full py-4 text-[10px] font-black uppercase tracking-[0.2em] opacity-40 hover:opacity-100"
                        >
                            {t.cancel}
                        </button>
                    </div>
                </div>
              </div>
          </div>
      )}

      <div className="text-center pb-10">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Velocity v1.4.0 • Build ID: SPEED-MULTI</p>
      </div>
    </div>
  );
};

const ToggleOption = ({ icon, label, active, isDarkMode, onToggle }: { icon: React.ReactNode, label: string, active: boolean, isDarkMode: boolean, onToggle?: () => void }) => (
    <div 
        onClick={onToggle}
        className={`flex items-center justify-between p-5 border rounded-3xl cursor-pointer ${
            isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100 shadow-sm'
        }`}
    >
        <div className="flex items-center gap-3">
            <div className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>{icon}</div>
            <span className="font-bold">{label}</span>
        </div>
        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${active ? (label === 'Strict Mode' || label === 'Строгий' ? 'bg-rose-600' : 'bg-indigo-600') : 'bg-slate-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
    </div>
);

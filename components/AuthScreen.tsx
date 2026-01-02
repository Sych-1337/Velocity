
import React from 'react';
import { Rocket, Moon, Sun, Apple, Facebook, Instagram, Twitter } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface AuthScreenProps {
  onLogin: (user: { name: string; email: string }) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  language: Language;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, isDarkMode, onToggleTheme, language }) => {
  const t = TRANSLATIONS[language];

  const handleSocialLogin = (provider: string) => {
    onLogin({
      name: `${provider} User`,
      email: `user@${provider.toLowerCase()}.com`
    });
  };

  // Shared button style for consistent sizing
  const buttonBaseClass = "w-full flex items-center justify-center gap-4 h-16 rounded-[28px] font-black text-lg transition-all active:scale-[0.98] border-2";

  return (
    <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-between p-8 py-12 md:py-20 text-center">
      <div className="w-full flex justify-end">
        <button 
          onClick={onToggleTheme}
          className={`p-4 rounded-[24px] transition-all hover:scale-110 active:scale-95 ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-indigo-600 shadow-xl shadow-indigo-100'}`}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="relative inline-block">
          <div className="w-28 h-28 bg-indigo-600 rounded-[38px] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 rotate-12 transform hover:rotate-0 transition-transform duration-500">
            <Rocket size={56} fill="currentColor" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-400 rounded-full border-4 border-slate-50 flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 bg-white rounded-full" />
          </div>
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-black italic tracking-tighter leading-none">{t.appName}</h1>
          <p className={`text-xl font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.tagline} <br/> {t.subTagline}
          </p>
        </div>
      </div>

      <div className="w-full space-y-3 mt-12">
        <button 
          onClick={() => handleSocialLogin('Apple')}
          className={`${buttonBaseClass} shadow-sm hover:shadow-xl ${
            isDarkMode ? 'bg-white text-slate-900 border-white' : 'bg-slate-900 text-white border-slate-900'
          }`}
        >
          <Apple size={22} fill="currentColor" />
          {t.signInApple}
        </button>

        <button 
          onClick={() => handleSocialLogin('Google')}
          className={`${buttonBaseClass} shadow-sm hover:shadow-xl ${
            isDarkMode ? 'bg-slate-800 text-white border-slate-700' : 'bg-white text-slate-900 border-slate-100'
          }`}
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          {t.continueGoogle}
        </button>

        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => handleSocialLogin('Facebook')}
            className={`flex items-center justify-center h-16 rounded-[28px] transition-all hover:scale-105 active:scale-95 border-2 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-[#1877F2]' : 'bg-white border-slate-100 text-[#1877F2] shadow-sm'
            }`}
          >
            <Facebook size={24} fill="currentColor" />
          </button>
          <button 
            onClick={() => handleSocialLogin('Twitter')}
            className={`flex items-center justify-center h-16 rounded-[28px] transition-all hover:scale-105 active:scale-95 border-2 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-100 text-slate-900 shadow-sm'
            }`}
          >
            <Twitter size={24} fill="currentColor" />
          </button>
          <button 
            onClick={() => handleSocialLogin('Instagram')}
            className={`flex items-center justify-center h-16 rounded-[28px] transition-all hover:scale-105 active:scale-95 border-2 ${
              isDarkMode ? 'bg-slate-800 border-slate-700 text-[#E4405F]' : 'bg-white border-slate-100 text-[#E4405F] shadow-sm'
            }`}
          >
            <Instagram size={24} />
          </button>
        </div>

        <div className="pt-6 space-y-4">
          <p className="text-[10px] uppercase font-black tracking-[0.2em] opacity-30">
            {t.terms}
          </p>
        </div>
      </div>
    </div>
  );
};

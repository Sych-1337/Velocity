
import React from 'react';
import { ArrowLeft, Check, Zap, Crown, Shield, Rocket, Star } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface PremiumProps {
  isDarkMode: boolean;
  language: Language;
  onBack: () => void;
  onPurchase: () => void;
}

export const Premium: React.FC<PremiumProps> = ({ isDarkMode, language, onBack, onPurchase }) => {
  const t = TRANSLATIONS[language];

  const plans = [
    { id: 'monthly', title: 'Sprint', price: '$4.99', period: 'month', desc: 'Perfect for quick brain priming.' },
    { id: 'yearly', title: 'Velocity Pro', price: '$39.99', period: 'year', desc: 'The elite choice for daily mastery.', popular: true },
    { id: 'lifetime', title: 'Universal', price: '$99.99', period: 'forever', desc: 'Become a legendary speedster.' }
  ];

  return (
    <div className={`min-h-full flex flex-col items-center p-6 md:p-10 space-y-10 animate-in slide-in-from-bottom duration-700 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <div className="w-full flex items-center justify-between">
        <button onClick={onBack} className={`p-4 rounded-3xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-md'}`}>
          <ArrowLeft size={24} />
        </button>
        <div className="flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-full font-black uppercase tracking-widest text-[10px]">
          <Crown size={14} fill="currentColor" /> Premium
        </div>
      </div>

      <div className="text-center space-y-4 max-w-2xl">
        <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none uppercase">
          {t.premiumTitle}
        </h2>
        <p className="text-xl font-medium opacity-60">
          {t.premiumSubtitle}
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {plans.map((plan) => (
          <div 
            key={plan.id}
            className={`relative p-8 rounded-[48px] border-4 flex flex-col justify-between transition-all transform hover:scale-105 ${
              plan.popular 
                ? 'border-indigo-600 bg-indigo-600/5 shadow-2xl shadow-indigo-600/20' 
                : isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                Most Popular
              </div>
            )}
            
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter">{plan.title}</h3>
                <p className="text-xs font-medium opacity-50">{plan.desc}</p>
              </div>
              
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black">{plan.price}</span>
                <span className="text-sm font-bold opacity-40 uppercase">/ {plan.period}</span>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <FeatureItem text={t.unlimitedAccess} isDarkMode={isDarkMode} />
                <FeatureItem text={t.adFree} isDarkMode={isDarkMode} />
                <FeatureItem text={t.aiAnalysis} isDarkMode={isDarkMode} />
                <FeatureItem text={t.customVoices} isDarkMode={isDarkMode} />
              </div>
            </div>

            <button 
              onClick={onPurchase}
              className={`mt-10 w-full py-5 rounded-3xl font-black text-lg transition-all active:scale-95 ${
                plan.popular 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30' 
                  : isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
              }`}
            >
              CHOOSE PLAN
            </button>
          </div>
        ))}
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-10 opacity-30 pt-10">
        <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
          <Shield size={16} /> Secure Payment
        </div>
        <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
          <Star size={16} fill="currentColor" /> Apple Store Choice
        </div>
        <div className="flex items-center gap-2 font-black uppercase tracking-widest text-xs">
          <Rocket size={16} /> 2M+ Speedsters
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ text, isDarkMode }: { text: string; isDarkMode: boolean }) => (
  <div className="flex items-center gap-3">
    <div className="w-5 h-5 bg-indigo-600/20 text-indigo-500 rounded-full flex items-center justify-center shrink-0">
      <Check size={12} strokeWidth={4} />
    </div>
    <span className="text-xs font-bold opacity-80">{text}</span>
  </div>
);

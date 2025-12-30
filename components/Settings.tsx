
import React from 'react';
import { Volume2, Moon, Sun, Bell, Shield, LogOut } from 'lucide-react';

interface SettingsProps {
  wpm: number;
  onWpmChange: (val: number) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ wpm, onWpmChange, isDarkMode, onToggleTheme, onLogout }) => {
  return (
    <div className={`p-6 space-y-8 animate-in fade-in duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
      <h2 className="text-3xl font-extrabold">Settings</h2>

      {/* Reader Settings */}
      <section className="space-y-6">
        <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest">Reader Configuration</h3>
        
        <div className={`p-6 rounded-[32px] space-y-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <div className="flex justify-between items-center mb-2">
                <span className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Default Speed</span>
                <span className="text-indigo-500 font-black">{wpm} WPM</span>
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
                <span>RELAXED</span>
                <span>LEGENDARY</span>
            </div>
        </div>

        <div className="space-y-3">
            <ToggleOption icon={<Volume2 size={20} />} label="Sound Effects" active={true} isDarkMode={isDarkMode} />
            <ToggleOption 
                icon={isDarkMode ? <Sun size={20} /> : <Moon size={20} />} 
                label="Dark Mode" 
                active={isDarkMode} 
                isDarkMode={isDarkMode}
                onToggle={onToggleTheme} 
            />
            <ToggleOption icon={<Bell size={20} />} label="Daily Reminders" active={true} isDarkMode={isDarkMode} />
            <ToggleOption icon={<Shield size={20} />} label="Strict Mode" active={false} isDarkMode={isDarkMode} />
        </div>
      </section>

      {/* Account */}
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
                <span>Log Out</span>
            </div>
        </button>
      </section>

      <div className="text-center pb-10">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Velocity v1.3.0 • Build ID: SPEED-AI</p>
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
        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${active ? 'bg-indigo-600' : 'bg-slate-200'}`}>
            <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${active ? 'translate-x-6' : 'translate-x-0'}`} />
        </div>
    </div>
);

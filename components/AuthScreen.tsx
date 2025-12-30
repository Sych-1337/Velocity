
import React from 'react';
import { Rocket, Moon, Sun } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (user: { name: string; email: string }) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, isDarkMode, onToggleTheme }) => {
  const handleGoogleLogin = () => {
    // Simulate Google Login
    onLogin({
      name: 'Speed Reader',
      email: 'reader@velocity.app'
    });
  };

  return (
    <div className="max-w-md mx-auto h-screen flex flex-col items-center justify-between p-10 py-20 text-center">
      <div className="w-full flex justify-end">
        <button 
          onClick={onToggleTheme}
          className={`p-3 rounded-2xl transition-colors ${isDarkMode ? 'bg-slate-800 text-yellow-400' : 'bg-white text-indigo-600 shadow-sm'}`}
        >
          {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="space-y-6">
        <div className="relative inline-block">
          <div className="w-24 h-24 bg-indigo-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/50 rotate-12">
            <Rocket size={48} fill="currentColor" />
          </div>
        </div>
        <h1 className="text-5xl font-black italic tracking-tighter">VELOCITY</h1>
        <p className={`text-lg font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
          The future of fast reading. <br/> Train your brain, win the race.
        </p>
      </div>

      <div className="w-full space-y-4">
        <button 
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-4 bg-white text-slate-900 border-2 border-slate-100 py-4 rounded-3xl font-bold shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          Sign in with Google
        </button>
        <p className="text-[10px] uppercase font-black tracking-widest opacity-30">
          By continuing, you agree to our Terms
        </p>
      </div>
    </div>
  );
};

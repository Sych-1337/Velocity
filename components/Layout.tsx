
import React from 'react';
import { Home, User, Trophy, Settings, LogOut, Zap, Users } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: string;
  onNavigate: (screen: any) => void;
  hideNav?: boolean;
  isDarkMode?: boolean;
  language?: Language;
  user?: { name: string; avatar?: string; accountLevel?: number };
}

export const Layout: React.FC<LayoutProps> = ({ children, currentScreen, onNavigate, hideNav, isDarkMode, language = 'en', user }) => {
  const t = TRANSLATIONS[language];

  return (
    <div className={`flex h-screen w-full overflow-hidden flex-col md:flex-row ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* Desktop/Tablet Sidebar */}
      {!hideNav && (
        <aside className={`hidden md:flex flex-col w-64 lg:w-72 border-r transition-colors duration-300 shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-8">
            <h1 className={`text-2xl font-black tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {t.appName}<span className="text-indigo-500">.</span>
            </h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            <SidebarLink 
              active={currentScreen === 'home'} 
              onClick={() => onNavigate('home')} 
              icon={<Home size={22} />} 
              label={t.navLibrary}
              isDarkMode={isDarkMode}
            />
            <SidebarLink 
              active={currentScreen === 'community'} 
              onClick={() => onNavigate('community')} 
              icon={<Users size={22} />} 
              label={t.navCommunity}
              isDarkMode={isDarkMode}
            />
            <SidebarLink 
              active={currentScreen === 'leaderboard'} 
              onClick={() => onNavigate('leaderboard')} 
              icon={<Trophy size={22} />} 
              label={t.navLeaderboard}
              isDarkMode={isDarkMode}
            />
            <SidebarLink 
              active={currentScreen === 'profile'} 
              onClick={() => onNavigate('profile')} 
              icon={<User size={22} />} 
              label={t.navStats}
              isDarkMode={isDarkMode}
            />
            <SidebarLink 
              active={currentScreen === 'settings'} 
              onClick={() => onNavigate('settings')} 
              icon={<Settings size={22} />} 
              label={t.navSettings}
              isDarkMode={isDarkMode}
            />
          </nav>

          <div className="p-6">
             <div className={`p-4 rounded-3xl flex items-center gap-3 ${isDarkMode ? 'bg-indigo-900/20' : 'bg-indigo-50'}`}>
                <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white font-bold">
                  {user?.name?.[0] || 'U'}
                </div>
                <div className="overflow-hidden">
                  <p className={`font-bold text-sm truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user?.name}</p>
                  <div className="flex items-center gap-1 text-[10px] text-indigo-500 font-black uppercase">
                    <Zap size={10} fill="currentColor" /> LVL {user?.accountLevel || 0}
                  </div>
                </div>
             </div>
          </div>
        </aside>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
        {/* Mobile Header */}
        {!hideNav && (
          <header className={`md:hidden px-6 py-4 flex items-center justify-between border-b shrink-0 z-10 ${isDarkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-100'} backdrop-blur-md`}>
            <h1 className={`text-xl font-black tracking-tight italic ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t.appName}</h1>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800 text-indigo-400' : 'bg-indigo-50 border-indigo-100 text-indigo-700'}`}>
              <Zap size={14} fill="currentColor" />
              <span className="text-xs font-black uppercase tracking-widest">LVL {user?.accountLevel || 0}</span>
            </div>
          </header>
        )}

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
          {children}
        </main>

        {/* Mobile Bottom Navigation - 5 items for better spacing */}
        {!hideNav && (
          <nav className={`md:hidden border-t px-2 pt-3 pb-8 flex justify-around items-center shrink-0 z-50 ${isDarkMode ? 'bg-slate-950/95 border-slate-800 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]' : 'bg-white border-slate-100 shadow-[0_-10px_25px_rgba(0,0,0,0.05)]'} backdrop-blur-xl`}>
            <NavButton 
              active={currentScreen === 'home'} 
              onClick={() => onNavigate('home')} 
              icon={<Home size={26} />} 
              isDarkMode={isDarkMode}
              label={t.navLibrary}
            />
            <NavButton 
              active={currentScreen === 'community'} 
              onClick={() => onNavigate('community')} 
              icon={<Users size={26} />} 
              isDarkMode={isDarkMode}
              label={t.navCommunity}
            />
            <NavButton 
              active={currentScreen === 'leaderboard'} 
              onClick={() => onNavigate('leaderboard')} 
              icon={<Trophy size={26} />} 
              isDarkMode={isDarkMode}
              label={t.navLeaderboard}
            />
            <NavButton 
              active={currentScreen === 'profile'} 
              onClick={() => onNavigate('profile')} 
              icon={<User size={26} />} 
              isDarkMode={isDarkMode}
              label={t.navStats}
            />
            <NavButton 
              active={currentScreen === 'settings'} 
              onClick={() => onNavigate('settings')} 
              icon={<Settings size={26} />} 
              isDarkMode={isDarkMode}
              label={t.navSettings}
            />
          </nav>
        )}
      </div>
    </div>
  );
};

const SidebarLink = ({ active, onClick, icon, label, isDarkMode }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, isDarkMode?: boolean }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all duration-200 group ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-[1.02]' 
        : isDarkMode ? 'text-slate-400 hover:bg-slate-800 hover:text-white' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
    }`}
  >
    <span className={`${active ? 'text-white' : 'text-slate-400 group-hover:text-indigo-500'}`}>{icon}</span>
    {label}
  </button>
);

const NavButton = ({ active, onClick, icon, isDarkMode, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, isDarkMode?: boolean, label: string }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 px-4 py-1 rounded-2xl transition-all duration-300 active:scale-90 flex-shrink-0 ${
      active ? 'text-indigo-500' : isDarkMode ? 'text-slate-600' : 'text-slate-400'
    }`}
  >
    <div className={`p-1.5 transition-colors ${active ? (isDarkMode ? 'scale-110' : 'scale-110') : ''}`}>
      {icon}
    </div>
    <span className={`text-[7px] font-black uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-60'}`}>
      {label}
    </span>
  </button>
);

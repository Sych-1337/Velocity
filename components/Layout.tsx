
import React from 'react';
import { Home, User, Trophy, Settings, LogOut, Zap, Users } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentScreen: string;
  onNavigate: (screen: any) => void;
  hideNav?: boolean;
  isDarkMode?: boolean;
  user?: { name: string; avatar?: string; accountLevel?: number };
}

export const Layout: React.FC<LayoutProps> = ({ children, currentScreen, onNavigate, hideNav, isDarkMode, user }) => {
  return (
    <div className={`flex h-screen w-full overflow-hidden ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
      
      {/* Desktop/Tablet Sidebar */}
      {!hideNav && (
        <aside className={`hidden md:flex flex-col w-64 lg:w-72 border-r transition-colors duration-300 shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="p-8">
            <h1 className={`text-2xl font-black tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              VELOCITY<span className="text-indigo-500">.</span>
            </h1>
          </div>
          
          <nav className="flex-1 px-4 space-y-2">
            <SidebarLink 
              active={currentScreen === 'home'} 
              onClick={() => onNavigate('home')} 
              icon={<Home size={22} />} 
              label="Library"
              isDarkMode={isDarkMode}
            />
            <SidebarLink 
              active={currentScreen === 'community'} 
              onClick={() => onNavigate('community')} 
              icon={<Users size={22} />} 
              label="Community"
              isDarkMode={isDarkMode}
            />
            <SidebarLink 
              active={currentScreen === 'leaderboard'} 
              onClick={() => onNavigate('leaderboard')} 
              icon={<Trophy size={22} />} 
              label="Leaderboard"
              isDarkMode={isDarkMode}
            />
            <SidebarLink 
              active={currentScreen === 'profile'} 
              onClick={() => onNavigate('profile')} 
              icon={<User size={22} />} 
              label="My Stats"
              isDarkMode={isDarkMode}
            />
            <SidebarLink 
              active={currentScreen === 'settings'} 
              onClick={() => onNavigate('settings')} 
              icon={<Settings size={22} />} 
              label="Settings"
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
          <header className={`md:hidden px-6 py-4 flex items-center justify-between border-b shrink-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
            <h1 className={`text-xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>VELOCITY</h1>
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isDarkMode ? 'bg-indigo-900/40 text-indigo-300' : 'bg-indigo-50 text-indigo-700'}`}>
              <span className="text-xs font-bold uppercase tracking-widest">LVL {user?.accountLevel || 0}</span>
            </div>
          </header>
        )}

        {/* Content Container */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        {!hideNav && (
          <nav className={`md:hidden border-t px-6 py-3 pb-8 flex justify-between items-center backdrop-blur-md shrink-0 ${isDarkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
            <NavButton 
              active={currentScreen === 'home'} 
              onClick={() => onNavigate('home')} 
              icon={<Home size={24} />} 
              isDarkMode={isDarkMode}
            />
            <NavButton 
              active={currentScreen === 'community'} 
              onClick={() => onNavigate('community')} 
              icon={<Users size={24} />} 
              isDarkMode={isDarkMode}
            />
            <NavButton 
              active={currentScreen === 'leaderboard'} 
              onClick={() => onNavigate('leaderboard')} 
              icon={<Trophy size={24} />} 
              isDarkMode={isDarkMode}
            />
            <NavButton 
              active={currentScreen === 'profile'} 
              onClick={() => onNavigate('profile')} 
              icon={<User size={24} />} 
              isDarkMode={isDarkMode}
            />
            <NavButton 
              active={currentScreen === 'settings'} 
              onClick={() => onNavigate('settings')} 
              icon={<Settings size={24} />} 
              isDarkMode={isDarkMode}
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

const NavButton = ({ active, onClick, icon, isDarkMode }: { active: boolean, onClick: () => void, icon: React.ReactNode, isDarkMode?: boolean }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-2xl transition-all duration-200 ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200/50' 
        : isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'
    }`}
  >
    {icon}
  </button>
);

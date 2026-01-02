
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TextPicker } from './components/TextPicker';
import { SpeedReader } from './components/SpeedReader';
import { Quiz } from './components/Quiz';
import { Profile } from './components/Profile';
import { Leaderboard } from './components/Leaderboard';
import { Settings } from './components/Settings';
import { AuthScreen } from './components/AuthScreen';
import { Community } from './components/Community';
import { AchievementsGallery } from './components/AchievementsGallery';
import { AdBanner } from './components/AdBanner';
import { Premium } from './components/Premium';
import { Books } from './components/Books';
import { TextItem, UserStats, PlayerLevel, ReadingSession, DifficultyLevel, Language } from './types';
import { ACHIEVEMENTS_DATA } from './constants';
import { PRACTICE_TEXTS } from './data/practiceTexts';
import { TRANSLATIONS } from './translations';
import { summarizeText } from './services/geminiService';
import { Sparkles, Loader2, BookOpen, Layers, ShieldAlert, TrendingDown, Cpu, Shield } from 'lucide-react';

type AppScreen = 'home' | 'reader' | 'quiz' | 'results' | 'profile' | 'leaderboard' | 'settings' | 'community' | 'achievements' | 'premium';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [homeTab, setHomeTab] = useState<'protocols' | 'books'>('protocols');
  const [selectedText, setSelectedText] = useState<TextItem | null>(null);
  const [prepSummary, setPrepSummary] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastSession, setLastSession] = useState<ReadingSession | null>(null);
  const [wpm, setWpm] = useState(250);
  const [isRepeatRead, setIsRepeatRead] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('language') as Language) || 'en');
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  
  const t = TRANSLATIONS[language];

  const [libraryTexts, setLibraryTexts] = useState<TextItem[]>([]);
  const [communityTexts, setCommunityTexts] = useState<TextItem[]>([]);

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('userStats');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isStrictMode === undefined) parsed.isStrictMode = false;
      if (parsed.hasSeenStrictModeWarning === undefined) parsed.hasSeenStrictModeWarning = false;
      return parsed;
    }
    return {
      bestWpm: 0,
      averageWpm: 0,
      totalWordsRead: 0,
      comprehensionRate: 0,
      level: PlayerLevel.NOVICE,
      experience: 0,
      dailyStreak: 1,
      accountLevel: 1,
      language: 'en',
      history: [],
      isPremium: false,
      isStrictMode: false,
      hasSeenStrictModeWarning: false,
      idCode: Math.floor(10000 + Math.random() * 90000).toString(),
      friendCodes: [],
      hasAcceptedCommunityRules: false
    };
  });

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    setLibraryTexts(PRACTICE_TEXTS);
    const mockCommunity: TextItem[] = [{
        id: 'c1',
        title: 'The Future of Neural Networks',
        category: 'community',
        difficulty: 'Elite',
        length: 'long',
        content: "Neural networks have evolved from simple perceptrons to complex transformers capable of emergent reasoning. The bottleneck is no longer compute, but our ability to curate high-quality synthetic data for recursive improvement.",
        author: 'CyberPunk99',
        votes: 142,
        userVote: null,
        language: 'en'
    }];
    setCommunityTexts(mockCommunity);
  }, []);

  const navigate = (screen: AppScreen) => setCurrentScreen(screen);

  const startReading = (text: TextItem) => {
    const difficultyMap: Record<DifficultyLevel, number> = {
      'Noob': 150, 'Rookie': 200, 'Apprentice': 250, 'Competent': 300, 'Skilled': 350,
      'Advanced': 400, 'Expert': 500, 'Master': 600, 'Elite': 700, 'Legendary': 850
    };
    const alreadyRead = userStats.history.some(session => session.textId === text.id);
    setIsRepeatRead(alreadyRead);
    setSelectedText(text);
    setWpm(difficultyMap[text.difficulty || 'Competent']);
    navigate('reader');
  };

  const handleStartReadingRequest = async (text: TextItem) => {
    if (!userStats.isPremium) {
      startReading(text);
      return;
    }
    setSelectedText(text);
    setIsProcessing(true);
    const summary = await summarizeText(text.content);
    setTimeout(() => {
      setPrepSummary(summary);
      setIsProcessing(false);
    }, 600);
  };

  const handleConfirmStart = () => {
    if (selectedText) {
      startReading(selectedText);
      setPrepSummary(null);
    }
  };

  const handleFinishedReading = (finalWpm: number) => {
    setLastSession({
        textId: selectedText?.id || '',
        wpm: finalWpm,
        accuracy: 0,
        score: 0,
        timestamp: Date.now(),
        category: selectedText?.category || 'random',
        isStrict: userStats.isStrictMode
    });
    navigate('quiz');
  };

  const handleQuizComplete = (accuracy: number) => {
    if (accuracy === undefined) return;
    if (lastSession) {
        let score = Math.round((lastSession.wpm * accuracy) / 10);
        
        if (userStats.isStrictMode) {
            score = Math.round(score * 1.5);
        }

        if (isRepeatRead) {
          score = Math.floor(score * 0.3);
        }

        const finalSession = { ...lastSession, accuracy, score };
        setLastSession(finalSession);
        
        setUserStats(prev => {
            const newHistory = [...(prev.history || []), finalSession];
            const newExp = prev.experience + score;
            let newLevel = prev.accountLevel;
            let finalExp = newExp;
            
            if (newExp >= 100) {
                newLevel += 1;
                finalExp = newExp - 100;
            }

            const totalAccuracy = newHistory.reduce((acc, sess) => acc + sess.accuracy, 0);
            const newComprehension = Math.round((totalAccuracy / newHistory.length) * 100);
            return {
                ...prev,
                totalWordsRead: prev.totalWordsRead + (selectedText?.content.split(' ').length || 0),
                experience: finalExp,
                accountLevel: newLevel,
                bestWpm: Math.max(prev.bestWpm, lastSession.wpm),
                history: newHistory,
                comprehensionRate: newComprehension
            };
        });
    }
    navigate('results');
  };

  const handleAbortReading = () => {
    if (userStats.isStrictMode) {
        setUserStats(prev => ({
            ...prev,
            experience: Math.max(0, prev.experience - 25)
        }));
        alert("STRICT MODE PENALTY: -25 XP for aborting active protocol.");
    }
    navigate('home');
  };

  const handleUpdateUser = (updates: Partial<{ name: string; avatar: string }>) => {
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  const handleAddFriend = (code: string) => {
    setUserStats(prev => ({
      ...prev,
      friendCodes: prev.friendCodes.includes(code) ? prev.friendCodes : [...prev.friendCodes, code]
    }));
  };

  const handleRemoveFriend = (code: string) => {
    setUserStats(prev => ({
      ...prev,
      friendCodes: prev.friendCodes.filter(c => c !== code)
    }));
  };

  const handleToggleStrictMode = (bypassWarning: boolean) => {
      setUserStats(prev => ({
          ...prev,
          isStrictMode: !prev.isStrictMode,
          hasSeenStrictModeWarning: bypassWarning ? true : prev.hasSeenStrictModeWarning
      }));
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <AuthScreen onLogin={(u) => setUser(u)} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} language={language} />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Layout 
        currentScreen={currentScreen} 
        onNavigate={navigate}
        hideNav={currentScreen === 'reader' || currentScreen === 'quiz'}
        isDarkMode={isDarkMode}
        language={language}
        user={{ ...user, accountLevel: userStats.accountLevel }}
      >
        <div className="flex-1 w-full max-w-6xl mx-auto h-full flex flex-col">
          {currentScreen === 'home' && (
            <div className="flex flex-col h-full">
              <div className="px-6 md:px-10 pt-6 md:pt-10 flex justify-between items-start">
                <div className={`inline-flex p-1.5 rounded-[24px] ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-lg shadow-slate-200/50 border border-slate-100'}`}>
                  <button 
                    onClick={() => setHomeTab('protocols')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${homeTab === 'protocols' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-indigo-500'}`}
                  >
                    <Layers size={14} /> {t.protocolsTab}
                  </button>
                  <button 
                    onClick={() => setHomeTab('books')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${homeTab === 'books' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30' : 'text-slate-500 hover:text-indigo-500'}`}
                  >
                    <BookOpen size={14} /> {t.myBooksTab}
                  </button>
                </div>
                {userStats.isStrictMode && (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-600 text-white text-[10px] font-black uppercase animate-pulse">
                        <Shield size={14} fill="white" /> Strict Active
                    </div>
                )}
              </div>

              {homeTab === 'protocols' ? (
                <>
                  <TextPicker 
                    onSelect={handleStartReadingRequest} 
                    texts={libraryTexts} 
                    language={language}
                    onVote={(id, dir) => {
                      setLibraryTexts(prev => prev.map(t => {
                        if (t.id !== id) return t;
                        let v = t.votes || 0;
                        if (t.userVote === dir) v += (dir === 'up' ? -1 : 1);
                        else v += (t.userVote ? (dir === 'up' ? 2 : -2) : (dir === 'up' ? 1 : -1));
                        return { ...t, votes: v, userVote: t.userVote === dir ? null : dir };
                      }));
                    }}
                    isDarkMode={isDarkMode} 
                    isPremium={userStats.isPremium}
                  />
                  {!userStats.isPremium && (
                    <div className="px-6 md:px-10 pb-10">
                      <AdBanner isDarkMode={isDarkMode} />
                    </div>
                  )}
                </>
              ) : (
                <Books isDarkMode={isDarkMode} language={language} />
              )}
            </div>
          )}

          {currentScreen === 'reader' && selectedText && (
            <div className="fixed inset-0 z-[200]">
              <SpeedReader 
                text={selectedText.content} 
                difficulty={selectedText.difficulty}
                initialWpm={wpm} 
                language={language}
                accountLevel={userStats.accountLevel}
                onFinish={handleFinishedReading}
                onBack={handleAbortReading}
                isStrictMode={userStats.isStrictMode}
              />
            </div>
          )}

          {currentScreen === 'quiz' && selectedText && (
             <div className="flex-1 flex items-center justify-center p-4">
              <Quiz text={selectedText.content} onComplete={handleQuizComplete} isDarkMode={isDarkMode} language={language} isStrictMode={userStats.isStrictMode} />
            </div>
          )}

          {currentScreen === 'results' && lastSession && (
             <div className="flex-1 flex items-center justify-center p-6">
                <div className={`w-full max-w-lg p-10 flex flex-col items-center text-center space-y-8 rounded-[40px] ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-xl'}`}>
                  {userStats.isStrictMode && (
                    <div className="bg-indigo-600 text-white px-6 py-2 rounded-full flex items-center gap-2">
                        <Shield size={16} fill="white" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Strict Reward: x1.5 Multiplier Applied</span>
                    </div>
                  )}
                  {isRepeatRead && (
                    <div className="bg-rose-500/10 text-rose-500 px-6 py-2 rounded-full flex items-center gap-2 animate-bounce">
                      <TrendingDown size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest">Debuff: Secondary Analysis (-70% XP)</span>
                    </div>
                  )}
                  
                  <h2 className="text-4xl font-black text-indigo-500 italic">{t.victory}</h2>
                  
                  <div className="grid grid-cols-2 gap-6 w-full">
                      <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'} p-6 rounded-3xl`}>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{t.navStats}</p>
                          <p className="text-3xl font-black">{lastSession.wpm}<span className="text-sm ml-1 opacity-50">{t.wpm}</span></p>
                      </div>
                      <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'} p-6 rounded-3xl`}>
                          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{t.accuracy}</p>
                          <p className="text-3xl font-black">{Math.round(lastSession.accuracy * 100)}<span className="text-sm ml-1 opacity-50">%</span></p>
                      </div>
                  </div>

                  <div className="w-full flex flex-col items-center gap-2">
                    <p className="text-xs font-black uppercase tracking-widest opacity-40">Experience Acquired</p>
                    <p className={`text-5xl font-black ${isRepeatRead ? 'text-rose-500' : 'text-emerald-500'}`}>+{lastSession.score} XP</p>
                  </div>

                  <button 
                      onClick={() => navigate('home')}
                      className={`w-full py-5 rounded-3xl font-black text-xl active:scale-95 transition-all transform hover:-translate-y-1 ${isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}
                  >
                      {t.continueTraining}
                  </button>
                </div>
             </div>
          )}

          {currentScreen === 'profile' && (
            <Profile 
              stats={userStats} 
              user={user} 
              isDarkMode={isDarkMode} 
              language={language} 
              onOpenGallery={() => navigate('achievements')} 
              onOpenPremium={() => navigate('premium')} 
              onUpdateUser={handleUpdateUser}
              onRemoveFriend={handleRemoveFriend}
            />
          )}

          {currentScreen === 'leaderboard' && (
            <Leaderboard 
              isDarkMode={isDarkMode} 
              language={language} 
              userStats={userStats}
              onAddFriend={handleAddFriend}
            />
          )}
          
          {currentScreen === 'settings' && (
            <Settings 
              wpm={wpm} 
              onWpmChange={setWpm} 
              isDarkMode={isDarkMode} 
              onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
              language={language}
              onLanguageChange={setLanguage}
              onLogout={() => setUser(null)} 
              isStrictMode={userStats.isStrictMode}
              hasSeenWarning={userStats.hasSeenStrictModeWarning}
              onToggleStrictMode={handleToggleStrictMode}
            />
          )}

          {currentScreen === 'achievements' && <AchievementsGallery achievements={ACHIEVEMENTS_DATA} onBack={() => navigate('profile')} isDarkMode={isDarkMode} language={language} />}
        </div>
      </Layout>
    </div>
  );
};

export default App;


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
import { Shield, Crown, Zap, CheckCircle, Sparkles, Star, Rocket, Brain } from 'lucide-react';

type AppScreen = 'home' | 'reader' | 'quiz' | 'results' | 'profile' | 'leaderboard' | 'settings' | 'community' | 'achievements' | 'premium';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [homeTab, setHomeTab] = useState<'protocols' | 'books'>('protocols');
  const [selectedText, setSelectedText] = useState<TextItem | null>(null);
  const [prepSummary, setPrepSummary] = useState<string | null>(null);
  const [showPremiumSuccess, setShowPremiumSuccess] = useState(false);
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

  const [libraryTexts, setLibraryTexts] = useState<TextItem[]>(() => {
    const saved = localStorage.getItem('libraryTexts');
    return saved ? JSON.parse(saved) : PRACTICE_TEXTS;
  });

  const [communityTexts, setCommunityTexts] = useState<TextItem[]>(() => {
    const saved = localStorage.getItem('communityTexts');
    return saved ? JSON.parse(saved) : [
      {
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
      }
    ];
  });

  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('userStats');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.isStrictMode === undefined) parsed.isStrictMode = false;
      if (parsed.hasSeenStrictModeWarning === undefined) parsed.hasSeenStrictModeWarning = false;
      if (parsed.favorites === undefined) parsed.favorites = [];
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
      favorites: [],
      hasAcceptedCommunityRules: false
    };
  });

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(userStats));
  }, [userStats]);

  useEffect(() => {
    localStorage.setItem('libraryTexts', JSON.stringify(libraryTexts));
  }, [libraryTexts]);

  useEffect(() => {
    localStorage.setItem('communityTexts', JSON.stringify(communityTexts));
  }, [communityTexts]);

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
    setPrepSummary(summary);
    setIsProcessing(false);
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
        if (userStats.isStrictMode) score = Math.round(score * 1.5);
        if (isRepeatRead) score = Math.floor(score * 0.3);

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

  const handleVoteLibrary = (id: string, direction: 'up' | 'down') => {
    setLibraryTexts(prev => prev.map(t => {
      if (t.id !== id) return t;
      let v = t.votes || 0;
      if (t.userVote === direction) v += (direction === 'up' ? -1 : 1);
      else v += (t.userVote ? (direction === 'up' ? 2 : -2) : (direction === 'up' ? 1 : -1));
      return { ...t, votes: v, userVote: t.userVote === direction ? null : direction };
    }));
  };

  const handleVoteCommunity = (id: string, direction: 'up' | 'down') => {
    setCommunityTexts(prev => prev.map(t => {
      if (t.id !== id) return t;
      let v = t.votes || 0;
      if (t.userVote === direction) v += (direction === 'up' ? -1 : 1);
      else v += (t.userVote ? (direction === 'up' ? 2 : -2) : (direction === 'up' ? 1 : -1));
      return { ...t, votes: v, userVote: t.userVote === direction ? null : direction };
    }));
  };

  const handleToggleFavorite = (id: string) => {
    setUserStats(prev => {
        const isFav = prev.favorites.includes(id);
        const newFavs = isFav ? prev.favorites.filter(fid => fid !== id) : [...prev.favorites, id];
        return { ...prev, favorites: newFavs };
    });
  };

  const handleAddCommunityText = (textData: Partial<TextItem>) => {
    const newText: TextItem = {
      id: 'c' + Date.now(),
      title: textData.title || 'Untitled Protocol',
      category: 'community',
      difficulty: 'Competent',
      length: 'medium',
      content: textData.content || '',
      author: user?.name || 'Anonymous',
      votes: 0,
      userVote: null,
      language: language
    };
    setCommunityTexts(prev => [newText, ...prev]);
  };

  const handlePurchasePremium = () => {
    setUserStats(prev => ({ ...prev, isPremium: true }));
    setShowPremiumSuccess(true);
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
                  <button onClick={() => setHomeTab('protocols')} className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${homeTab === 'protocols' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
                    {t.protocolsTab}
                  </button>
                  <button onClick={() => setHomeTab('books')} className={`px-6 py-2.5 rounded-[18px] text-[10px] font-black uppercase tracking-widest transition-all ${homeTab === 'books' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>
                    {t.myBooksTab}
                  </button>
                </div>
                {userStats.isStrictMode && (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-rose-600 text-white text-[10px] font-black uppercase animate-pulse">
                    <Shield size={14} fill="white" /> {t.strictActive}
                  </div>
                )}
              </div>
              {homeTab === 'protocols' ? (
                <>
                  <TextPicker 
                    onSelect={handleStartReadingRequest} 
                    texts={libraryTexts} 
                    language={language} 
                    onVote={handleVoteLibrary} 
                    isDarkMode={isDarkMode} 
                    isPremium={userStats.isPremium} 
                    favorites={userStats.favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                  {!userStats.isPremium && <div className="px-6 md:px-10 pb-10"><AdBanner isDarkMode={isDarkMode} language={language} /></div>}
                </>
              ) : (
                <Books isDarkMode={isDarkMode} language={language} />
              )}
            </div>
          )}

          {currentScreen === 'community' && (
            <Community 
              texts={communityTexts} 
              onSelect={handleStartReadingRequest} 
              onVote={handleVoteCommunity} 
              onAdd={handleAddCommunityText} 
              isDarkMode={isDarkMode} 
              language={language} 
              hasAcceptedRules={userStats.hasAcceptedCommunityRules}
              onAcceptRules={() => setUserStats(prev => ({ ...prev, hasAcceptedCommunityRules: true }))}
            />
          )}

          {currentScreen === 'premium' && (
            <Premium isDarkMode={isDarkMode} language={language} onBack={() => navigate('profile')} onPurchase={handlePurchasePremium} />
          )}

          {currentScreen === 'reader' && selectedText && (
            <div className="fixed inset-0 z-[200]">
              <SpeedReader text={selectedText.content} difficulty={selectedText.difficulty} initialWpm={wpm} language={language} accountLevel={userStats.accountLevel} onFinish={handleFinishedReading} onBack={() => navigate('home')} isStrictMode={userStats.isStrictMode} />
            </div>
          )}

          {currentScreen === 'quiz' && selectedText && (
            <div className="flex-1 flex items-center justify-center p-4">
              <Quiz text={selectedText.content} onComplete={handleQuizComplete} isDarkMode={isDarkMode} language={language} isStrictMode={userStats.isStrictMode} />
            </div>
          )}

          {currentScreen === 'profile' && (
            <Profile stats={userStats} user={user} isDarkMode={isDarkMode} language={language} onOpenGallery={() => navigate('achievements')} onOpenPremium={() => navigate('premium')} onUpdateUser={(u) => setUser(prev => prev ? {...prev, ...u} : null)} onRemoveFriend={(c) => setUserStats(prev => ({...prev, friendCodes: prev.friendCodes.filter(f => f !== c)}))} />
          )}

          {currentScreen === 'leaderboard' && <Leaderboard isDarkMode={isDarkMode} language={language} userStats={userStats} onAddFriend={(c) => setUserStats(prev => ({...prev, friendCodes: [...prev.friendCodes, c]}))} />}
          
          {currentScreen === 'settings' && <Settings wpm={wpm} onWpmChange={setWpm} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} language={language} onLanguageChange={setLanguage} onLogout={() => setUser(null)} isStrictMode={userStats.isStrictMode} hasSeenWarning={userStats.hasSeenStrictModeWarning} onToggleStrictMode={(b) => setUserStats(prev => ({...prev, isStrictMode: !prev.isStrictMode, hasSeenStrictModeWarning: b ? true : prev.hasSeenStrictModeWarning}))} />}
          
          {currentScreen === 'achievements' && <AchievementsGallery achievements={ACHIEVEMENTS_DATA} onBack={() => navigate('profile')} isDarkMode={isDarkMode} language={language} />}

          {/* Premium Success Modal */}
          {showPremiumSuccess && (
            <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-slate-950/95 backdrop-blur-3xl animate-in fade-in duration-500">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-amber-500/20 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[20%] right-[20%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse-delayed" />
                </div>

                <div className={`w-full max-w-xl p-8 md:p-12 rounded-[56px] border-4 relative overflow-hidden text-center space-y-10 ${isDarkMode ? 'bg-slate-900 border-amber-500/30' : 'bg-white border-amber-100 shadow-2xl'}`}>
                    <div className="relative inline-block">
                        <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-amber-400 to-orange-600 rounded-[38px] flex items-center justify-center text-white shadow-2xl rotate-12 animate-float">
                            <Crown size={64} fill="currentColor" />
                        </div>
                        <Sparkles className="absolute -top-4 -right-4 text-amber-500 animate-spin-slow" size={32} />
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter uppercase leading-none">
                            {t.premiumSuccessTitle}
                        </h2>
                        <p className="text-xl font-medium opacity-60">
                            {t.premiumSuccessSub}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                        <BenefitItem icon={<Brain size={18} />} title={t.aiAnalysis} isDarkMode={isDarkMode} />
                        <BenefitItem icon={<Rocket size={18} />} title={t.unlimitedAccess} isDarkMode={isDarkMode} />
                        <BenefitItem icon={<Shield size={18} />} title={t.adFree} isDarkMode={isDarkMode} />
                        <BenefitItem icon={<Star size={18} />} title={t.customVoices} isDarkMode={isDarkMode} />
                    </div>

                    <button 
                        onClick={() => { setShowPremiumSuccess(false); navigate('home'); }}
                        className="w-full bg-gradient-to-r from-amber-400 to-orange-600 text-white py-6 rounded-[32px] font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3"
                    >
                        <Zap size={24} fill="white" /> {t.startEvolution}
                    </button>
                </div>
            </div>
          )}

          {/* AI Summary Modal for Premium Users */}
          {prepSummary && (
            <div className="fixed inset-0 z-[300] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in duration-300">
              <div className={`w-full max-w-lg p-10 rounded-[48px] border-2 space-y-8 ${isDarkMode ? 'bg-slate-900 border-indigo-500/30' : 'bg-white border-indigo-100 shadow-2xl'}`}>
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg animate-pulse">
                    <Shield size={40} />
                  </div>
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase">{t.aiInsight}</h3>
                  <div className={`p-6 rounded-[32px] text-left italic leading-relaxed ${isDarkMode ? 'bg-white/5 text-slate-300' : 'bg-indigo-50 text-indigo-900'}`}>
                    "{prepSummary}"
                  </div>
                  <button onClick={() => { startReading(selectedText!); setPrepSummary(null); }} className="w-full bg-indigo-600 text-white py-5 rounded-[28px] font-black text-xl hover:bg-indigo-700 shadow-xl transition-all">
                    {t.initiateReading}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>
    </div>
  );
};

const BenefitItem = ({ icon, title, isDarkMode }: { icon: React.ReactNode, title: string, isDarkMode: boolean }) => (
    <div className={`flex items-center gap-4 p-4 rounded-3xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
        <div className="text-amber-500 shrink-0">
            {icon}
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest leading-none">{title}</span>
    </div>
);

export default App;

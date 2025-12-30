
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
import { TextItem, UserStats, PlayerLevel, ReadingSession } from './types';
import { INITIAL_TEXTS, ACHIEVEMENTS_DATA } from './constants';

type AppScreen = 'home' | 'reader' | 'quiz' | 'results' | 'profile' | 'leaderboard' | 'settings' | 'community' | 'achievements';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('home');
  const [selectedText, setSelectedText] = useState<TextItem | null>(null);
  const [lastSession, setLastSession] = useState<ReadingSession | null>(null);
  const [wpm, setWpm] = useState(250);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar?: string } | null>(null);
  
  // Library and Community state
  const [libraryTexts, setLibraryTexts] = useState<TextItem[]>([]);
  const [communityTexts, setCommunityTexts] = useState<TextItem[]>([]);

  const [userStats, setUserStats] = useState<UserStats>({
    bestWpm: 450,
    averageWpm: 320,
    totalWordsRead: 12450,
    comprehensionRate: 88,
    level: PlayerLevel.SPEEDSTER,
    experience: 75,
    dailyStreak: 5,
    accountLevel: 4
  });

  // Initialize texts
  useEffect(() => {
    // Add default votes to initial texts
    const enrichedLibrary = INITIAL_TEXTS.map(t => ({
      ...t,
      votes: Math.floor(Math.random() * 50) + 10,
      userVote: null
    }));
    setLibraryTexts(enrichedLibrary);

    const mockCommunity: TextItem[] = [
      {
        id: 'c1',
        title: 'The Future of Neural Networks',
        category: 'community',
        difficulty: 'hard',
        length: 'long',
        content: "Neural networks have evolved from simple perceptrons to complex transformers capable of emergent reasoning. The bottleneck is no longer compute, but our ability to curate high-quality synthetic data for recursive improvement.",
        author: 'CyberPunk99',
        votes: 142,
        userVote: null
      },
      {
        id: 'c2',
        title: 'Why We Sleep',
        category: 'community',
        difficulty: 'easy',
        length: 'medium',
        content: "Sleep is the price we pay for plasticity. During REM, our brains simulate realities to test emotional responses, while deep sleep flushes metabolic waste through the glymphatic system.",
        author: 'BioHacker',
        votes: 89,
        userVote: 'up'
      }
    ];
    setCommunityTexts(mockCommunity);
  }, []);

  const navigate = (screen: AppScreen) => setCurrentScreen(screen);

  const handleStartReading = (text: TextItem) => {
    setSelectedText(text);
    let startingWpm = 250;
    if (text.difficulty === 'medium') startingWpm = 400;
    if (text.difficulty === 'hard') startingWpm = 600;
    
    setWpm(startingWpm);
    navigate('reader');
  };

  const handleFinishedReading = (finalWpm: number) => {
    setLastSession({
        textId: selectedText?.id || '',
        wpm: finalWpm,
        accuracy: 0,
        score: 0,
        timestamp: Date.now()
    });
    navigate('quiz');
  };

  const handleQuizComplete = (accuracy: number) => {
    if (lastSession) {
        const score = Math.round((lastSession.wpm * accuracy) / 10);
        const updatedSession = { ...lastSession, accuracy, score };
        setLastSession(updatedSession);
        
        setUserStats(prev => {
            const newExp = prev.experience + 15;
            let newLevel = prev.accountLevel;
            let finalExp = newExp;
            if (newExp >= 100) {
                newLevel += 1;
                finalExp = newExp - 100;
            }
            return {
                ...prev,
                totalWordsRead: prev.totalWordsRead + (selectedText?.content.split(' ').length || 0),
                experience: finalExp,
                accountLevel: newLevel,
                bestWpm: Math.max(prev.bestWpm, lastSession.wpm)
            };
        });
    }
    navigate('results');
  };

  const handleLogin = (userData: { name: string; email: string }) => {
    setUser(userData);
    navigate('home');
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddCommunityText = (newText: Partial<TextItem>) => {
    const fullText: TextItem = {
      id: 'c-' + Date.now(),
      title: newText.title || 'Untitled',
      content: newText.content || '',
      category: 'community',
      difficulty: 'medium',
      length: 'medium',
      author: user?.name || 'Anonymous',
      votes: 1,
      userVote: 'up'
    };
    setCommunityTexts([fullText, ...communityTexts]);
  };

  const handleVote = (id: string, direction: 'up' | 'down', isLibrary: boolean = false) => {
    const updateFn = (prev: TextItem[]) => prev.map(t => {
      if (t.id !== id) return t;
      let newVotes = t.votes || 0;
      if (t.userVote === direction) {
        newVotes += (direction === 'up' ? -1 : 1);
        return { ...t, votes: newVotes, userVote: null };
      }
      if (t.userVote) {
        newVotes += (direction === 'up' ? 2 : -2);
      } else {
        newVotes += (direction === 'up' ? 1 : -1);
      }
      return { ...t, votes: newVotes, userVote: direction };
    });

    if (isLibrary) {
      setLibraryTexts(updateFn);
    } else {
      setCommunityTexts(updateFn);
    }
  };

  if (!user) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <AuthScreen onLogin={handleLogin} isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
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
        user={{ ...user, accountLevel: userStats.accountLevel }}
      >
        <div className="flex-1 w-full max-w-6xl mx-auto h-full flex flex-col">
          {currentScreen === 'home' && (
            <TextPicker 
              onSelect={handleStartReading} 
              texts={libraryTexts} 
              onVote={(id, dir) => handleVote(id, dir, true)}
              isDarkMode={isDarkMode} 
            />
          )}

          {currentScreen === 'community' && (
            <Community 
              texts={communityTexts} 
              onSelect={handleStartReading} 
              onVote={(id, dir) => handleVote(id, dir, false)}
              onAdd={handleAddCommunityText}
              isDarkMode={isDarkMode}
            />
          )}

          {currentScreen === 'achievements' && (
            <AchievementsGallery 
              achievements={ACHIEVEMENTS_DATA} 
              onBack={() => navigate('profile')}
              isDarkMode={isDarkMode}
            />
          )}
          
          {currentScreen === 'reader' && selectedText && (
            <div className="fixed inset-0 z-50 bg-slate-900">
              <SpeedReader 
                text={selectedText.content} 
                difficulty={selectedText.difficulty}
                initialWpm={wpm} 
                accountLevel={userStats.accountLevel}
                onFinish={handleFinishedReading}
                onBack={() => navigate('home')}
              />
            </div>
          )}

          {currentScreen === 'quiz' && selectedText && (
             <div className="flex-1 flex items-center justify-center p-4">
              <div className={`w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                <Quiz 
                  text={selectedText.content} 
                  onComplete={handleQuizComplete} 
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}

          {currentScreen === 'results' && lastSession && (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className={`w-full max-w-lg p-10 flex flex-col items-center text-center space-y-8 rounded-[40px] ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-xl'}`}>
                <h2 className="text-4xl font-black text-indigo-500 italic">VICTORY!</h2>
                <div className="grid grid-cols-2 gap-6 w-full">
                    <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'} p-6 rounded-3xl`}>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Speed</p>
                        <p className="text-3xl font-black">{lastSession.wpm}<span className="text-sm ml-1 opacity-50">WPM</span></p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'} p-6 rounded-3xl`}>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Accuracy</p>
                        <p className="text-3xl font-black">{Math.round(lastSession.accuracy * 100)}<span className="text-sm ml-1 opacity-50">%</span></p>
                    </div>
                </div>
                <div className="bg-indigo-600 text-white p-8 rounded-[32px] w-full shadow-xl shadow-indigo-500/20">
                    <p className="opacity-70 font-bold uppercase text-xs tracking-widest mb-2">XP Earned</p>
                    <p className="text-5xl font-black">+{lastSession.score}</p>
                </div>
                <button 
                    onClick={() => navigate('home')}
                    className={`w-full py-5 rounded-3xl font-black text-xl active:scale-95 transition-all transform hover:-translate-y-1 ${isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}
                >
                    BACK TO HUB
                </button>
              </div>
            </div>
          )}

          {currentScreen === 'profile' && <Profile stats={userStats} user={user} isDarkMode={isDarkMode} onOpenGallery={() => navigate('achievements')} />}
          {currentScreen === 'leaderboard' && <Leaderboard isDarkMode={isDarkMode} />}
          {currentScreen === 'settings' && (
              <Settings 
                wpm={wpm} 
                onWpmChange={setWpm} 
                isDarkMode={isDarkMode} 
                onToggleTheme={() => setIsDarkMode(!isDarkMode)} 
                onLogout={handleLogout}
              />
          )}
        </div>
      </Layout>
    </div>
  );
};

export default App;

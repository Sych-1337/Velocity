
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, Plus, Minus, Lock, Volume2, VolumeX, Crown, Shield } from 'lucide-react';
import { DifficultyLevel, Language } from '../types';
import { TRANSLATIONS } from '../translations';

interface SpeedReaderProps {
  text: string;
  difficulty: DifficultyLevel;
  initialWpm: number;
  accountLevel: number;
  onFinish: (wpm: number) => void;
  onBack: () => void;
  language: Language;
  isStrictMode: boolean;
}

export const SpeedReader: React.FC<SpeedReaderProps> = ({ text, difficulty, initialWpm, accountLevel, onFinish, onBack, language, isStrictMode }) => {
  const words = useRef<string[]>(text.split(/\s+/));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [wpm, setWpm] = useState(initialWpm);
  const [isMuted, setIsMuted] = useState(true);
  const timerRef = useRef<number | null>(null);
  const synth = window.speechSynthesis;
  const t = TRANSLATIONS[language];

  const currentWord = words.current[currentIndex] || "";
  const isWarpSpeed = wpm > 550;
  const isLegendary = difficulty === 'Legendary';

  const canAdjustSpeed = accountLevel >= 5;
  
  const getMinWpm = () => {
    if (difficulty === 'Legendary') return 800;
    if (difficulty === 'Elite') return 700;
    if (difficulty === 'Master') return 600;
    return isStrictMode ? initialWpm : 50;
  };

  const minWpm = getMinWpm();
  const isAtMin = wpm <= minWpm;

  useEffect(() => {
      if (isStrictMode && countdown > 0) {
          const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
          return () => clearTimeout(timer);
      } else if (isStrictMode && countdown === 0 && !isPlaying) {
          setIsPlaying(true);
      }
  }, [isStrictMode, countdown, isPlaying]);

  const handleSpeedIncrease = () => {
    if (!canAdjustSpeed) return;
    setWpm(w => Math.min(2000, w + 25));
  };

  const handleSpeedDecrease = () => {
    if (!canAdjustSpeed) return;
    if (isAtMin) return;
    setWpm(w => Math.max(minWpm, w - 25));
  };

  const pivotIndex = Math.floor(currentWord.length / 4);
  const beforePivot = currentWord.slice(0, pivotIndex);
  const pivotChar = currentWord[pivotIndex] || "";
  const afterPivot = currentWord.slice(pivotIndex + 1);

  const tick = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= words.current.length - 1) {
        setIsPlaying(false);
        return prev;
      }
      return prev + 1;
    });

    if (!isMuted && currentIndex < words.current.length) {
      const utter = new SpeechSynthesisUtterance(words.current[currentIndex + 1] || "");
      utter.rate = Math.min(2.5, wpm / 200);
      utter.pitch = 1;
      synth.speak(utter);
    }
  }, [isMuted, currentIndex, wpm, synth]);

  useEffect(() => {
    if (isPlaying && currentIndex < words.current.length - 1) {
      const msPerWord = 60000 / wpm;
      timerRef.current = window.setInterval(tick, msPerWord);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      synth.cancel();
    };
  }, [isPlaying, wpm, currentIndex, tick, synth]);

  const togglePlay = () => {
    if (isStrictMode) return; 
    setIsPlaying(!isPlaying);
    if (!isPlaying) synth.resume();
    else synth.pause();
  };
  
  const handleReset = () => {
    if (isStrictMode) return;
    setIsPlaying(false);
    setCurrentIndex(0);
    synth.cancel();
  };

  const handleFinish = () => {
    setIsPlaying(false);
    synth.cancel();
    onFinish(wpm);
  };

  const progress = (currentIndex / words.current.length) * 100;

  return (
    <div className={`flex flex-col h-full bg-slate-950 text-white transition-all duration-700 overflow-hidden relative ${isLegendary ? 'shadow-[inset_0_0_150px_rgba(245,158,11,0.2)]' : isWarpSpeed ? 'shadow-[inset_0_0_100px_rgba(99,102,241,0.15)]' : ''}`}>
      
      {isStrictMode && countdown > 0 && (
          <div className="absolute inset-0 z-[50] flex flex-col items-center justify-center bg-slate-950/90 backdrop-blur-sm">
              <Shield size={64} className="text-rose-600 mb-6 animate-pulse" fill="rgba(225, 29, 72, 0.2)" />
              <h2 className="text-6xl font-black italic tracking-tighter mb-2">{countdown}</h2>
              <p className="text-rose-500 font-black uppercase tracking-widest text-xs">{t.protocolLockdown}</p>
          </div>
      )}

      {(isWarpSpeed || isLegendary || isStrictMode) && isPlaying && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-gradient-to-r from-transparent ${isLegendary ? 'via-amber-500/5' : isStrictMode ? 'via-rose-500/5' : 'via-indigo-500/5'} to-transparent animate-pulse`} />
        </div>
      )}

      <div className="flex items-center justify-between p-4 md:p-6 z-10">
        <button onClick={onBack} className="p-3 bg-white/5 rounded-2xl active:scale-90 transition-transform flex items-center gap-2">
          <ArrowLeft size={20} />
          {isStrictMode && <span className="text-[10px] font-black uppercase text-rose-500 hidden sm:inline">{t.abortPenalty}</span>}
        </button>
        
        <div className="flex flex-col items-center">
            {isStrictMode && (
                <div className="mb-2 flex items-center gap-2 px-3 py-1 bg-rose-600 text-white rounded-full text-[8px] font-black uppercase animate-bounce">
                    <Shield size={10} fill="white" /> {t.strictLocked}
                </div>
            )}
            <div className="flex items-center gap-3 md:gap-4">
                <button 
                  onClick={handleSpeedDecrease} 
                  disabled={!canAdjustSpeed || isAtMin}
                  className={`p-2.5 rounded-xl transition-all ${
                    !canAdjustSpeed || isAtMin ? 'opacity-20 cursor-not-allowed' : 'bg-white/5 active:scale-75'
                  }`}
                >
                  {isStrictMode ? <Lock size={16} className="text-rose-500" /> : <Minus size={16} />}
                </button>
                
                <div className="flex flex-col items-center min-w-[60px] md:min-w-[80px]">
                    <span className={`font-black text-xl md:text-2xl transition-all ${isLegendary ? 'text-amber-400' : isStrictMode ? 'text-rose-500' : isWarpSpeed ? 'text-indigo-400' : 'text-white'}`}>
                        {wpm}
                    </span>
                    <span className="text-[8px] opacity-40 uppercase font-black tracking-widest">{t.wpm}</span>
                </div>

                <button 
                  onClick={handleSpeedIncrease} 
                  disabled={!canAdjustSpeed}
                  className={`p-2.5 rounded-xl transition-all ${
                    !canAdjustSpeed ? 'opacity-20 cursor-not-allowed' : 'bg-white/5 active:scale-75'
                  }`}
                >
                  <Plus size={16} />
                </button>
            </div>
        </div>

        <button 
          onClick={() => setIsMuted(!isMuted)} 
          className={`p-3 rounded-2xl transition-all ${isMuted ? 'bg-white/5 text-slate-500' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'}`}
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-4">
        <div className={`absolute w-full max-w-sm h-32 md:h-40 pointer-events-none flex flex-col justify-between border-y transition-all duration-700 ${isLegendary ? 'border-amber-500/30' : isStrictMode ? 'border-rose-500/30' : isWarpSpeed ? 'border-indigo-500/20' : 'border-white/5'}`}>
            <div className={`w-px h-6 md:h-8 mx-auto absolute left-1/2 -top-6 md:-top-8 transform -translate-x-1/2 transition-colors ${isLegendary ? 'bg-amber-400' : isStrictMode ? 'bg-rose-500' : isWarpSpeed ? 'bg-indigo-400' : 'bg-white/10'}`} />
            <div className={`w-px h-6 md:h-8 mx-auto absolute left-1/2 -bottom-6 md:-bottom-8 transform -translate-x-1/2 transition-colors ${isLegendary ? 'bg-amber-400' : isStrictMode ? 'bg-rose-500' : isWarpSpeed ? 'bg-indigo-400' : 'bg-white/10'}`} />
        </div>

        <div className={`mono-font text-4xl sm:text-5xl md:text-7xl font-bold flex select-none tracking-tight transition-all duration-300 ${isLegendary ? 'scale-110 text-amber-50' : isStrictMode ? 'text-rose-50' : isWarpSpeed ? 'scale-105' : ''}`}>
          <span className="text-white/30 text-right flex-1">{beforePivot}</span>
          <span className={isLegendary ? 'text-amber-500 px-0.5' : isStrictMode ? 'text-rose-500 px-0.5' : 'text-indigo-500 px-0.5'}>{pivotChar}</span>
          <span className="text-white text-left flex-1">{afterPivot}</span>
        </div>

        {currentIndex === words.current.length - 1 && (
            <button 
                onClick={handleFinish}
                className={`mt-12 md:mt-20 px-8 py-4 ${isLegendary ? 'bg-amber-600' : isStrictMode ? 'bg-rose-600' : 'bg-indigo-600'} rounded-[24px] font-black animate-bounce shadow-2xl uppercase tracking-widest text-xs md:text-sm active:scale-95 transition-transform`}
            >
                {isLegendary ? t.legacyComplete : isStrictMode ? t.legacyComplete : t.finishSession}
            </button>
        )}
      </div>

      <div className="p-6 md:p-10 space-y-6 md:space-y-8 z-10 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pb-10">
        <div className="relative h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
                className={`absolute top-0 left-0 h-full ${isLegendary ? 'bg-amber-500' : isStrictMode ? 'bg-rose-500' : 'bg-indigo-600'} transition-all duration-300`} 
                style={{ width: `${progress}%` }}
            />
        </div>

        <div className="flex justify-center items-center gap-8 md:gap-10">
            <button onClick={handleReset} className={`p-4 rounded-full transition-all text-slate-400 ${isStrictMode ? 'opacity-10 cursor-not-allowed' : 'bg-white/5 hover:bg-white/10 active:scale-90'}`}>
                <RotateCcw size={24} />
            </button>
            <button 
                onClick={togglePlay} 
                className={`p-8 md:p-10 ${isPlaying ? 'bg-white/5' : isLegendary ? 'bg-amber-600' : isStrictMode ? 'bg-rose-600' : 'bg-indigo-600'} rounded-full shadow-2xl transition-all ${isStrictMode ? 'cursor-not-allowed opacity-80' : 'active:scale-95'}`}
            >
                {isStrictMode && isPlaying ? <Shield className="w-8 h-8 md:w-12 md:h-12 text-rose-500" fill="white" /> : (isPlaying ? <Pause className="w-8 h-8 md:w-12 md:h-12" fill="white" /> : <Play className="ml-1 w-8 h-8 md:w-12 md:h-12" fill="white" />)}
            </button>
            <div className="p-4 flex flex-col items-center opacity-30">
                <span className="text-[10px] md:text-sm font-black tracking-widest whitespace-nowrap">{currentIndex + 1} / {words.current.length}</span>
                <span className="text-[8px] font-black uppercase tracking-tighter">{t.data}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

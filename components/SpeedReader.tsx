
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ArrowLeft, Plus, Minus, Lock } from 'lucide-react';

interface SpeedReaderProps {
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
  initialWpm: number;
  accountLevel: number;
  onFinish: (wpm: number) => void;
  onBack: () => void;
}

export const SpeedReader: React.FC<SpeedReaderProps> = ({ text, difficulty, initialWpm, accountLevel, onFinish, onBack }) => {
  const words = useRef<string[]>(text.split(/\s+/));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [wpm, setWpm] = useState(initialWpm);
  const timerRef = useRef<number | null>(null);

  const currentWord = words.current[currentIndex] || "";
  
  // Rules for speed adjustment
  const canAdjustSpeed = accountLevel >= 5;
  const hardMinWpm = 500;
  const isAtHardMin = difficulty === 'hard' && wpm <= hardMinWpm;

  const handleSpeedIncrease = () => {
    if (!canAdjustSpeed) return;
    setWpm(w => Math.min(1000, w + 25));
  };

  const handleSpeedDecrease = () => {
    if (!canAdjustSpeed) return;
    if (difficulty === 'hard' && wpm <= hardMinWpm) return;
    setWpm(w => Math.max(50, w - 25));
  };

  // Pivot point logic (ORP - Optimal Recognition Point)
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
  }, []);

  useEffect(() => {
    if (isPlaying && currentIndex < words.current.length - 1) {
      const msPerWord = 60000 / wpm;
      timerRef.current = window.setInterval(tick, msPerWord);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, wpm, currentIndex, tick]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(0);
  };

  const handleFinish = () => {
    setIsPlaying(false);
    onFinish(wpm);
  };

  const progress = (currentIndex / words.current.length) * 100;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white transition-colors duration-500 overflow-hidden">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-6 opacity-60 hover:opacity-100 transition-opacity">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-white/10">
          <ArrowLeft />
        </button>
        
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-4">
                <button 
                  onClick={handleSpeedDecrease} 
                  disabled={!canAdjustSpeed || isAtHardMin}
                  className={`p-2 rounded-lg transition-all ${
                    !canAdjustSpeed || isAtHardMin ? 'opacity-30 cursor-not-allowed bg-white/5' : 'bg-white/10 hover:bg-white/20 active:scale-90'
                  }`}
                >
                  <Minus size={18} />
                </button>
                
                <div className="flex flex-col items-center min-w-[80px]">
                    <span className={`font-bold text-xl ${difficulty === 'hard' ? 'text-rose-400' : 'text-white'}`}>
                        {wpm}
                    </span>
                    <span className="text-[10px] opacity-50 uppercase font-black tracking-widest">WPM</span>
                </div>

                <button 
                  onClick={handleSpeedIncrease} 
                  disabled={!canAdjustSpeed}
                  className={`p-2 rounded-lg transition-all ${
                    !canAdjustSpeed ? 'opacity-30 cursor-not-allowed bg-white/5' : 'bg-white/10 hover:bg-white/20 active:scale-90'
                  }`}
                >
                  <Plus size={18} />
                </button>
            </div>
            
            {/* Restrictions Info */}
            {!canAdjustSpeed && (
              <div className="mt-2 flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-indigo-400 animate-pulse">
                <Lock size={10} /> Unlock speed at LVL 5
              </div>
            )}
            {difficulty === 'hard' && canAdjustSpeed && (
              <div className="mt-2 text-[9px] font-black uppercase tracking-widest text-rose-500">
                Min. Hard Speed: {hardMinWpm} WPM
              </div>
            )}
        </div>

        <div className="p-2 text-xs font-black uppercase tracking-widest text-indigo-500 bg-indigo-500/10 rounded-xl px-4 py-2 border border-indigo-500/20">
          {difficulty} mode
        </div>
      </div>

      {/* Reader Visualizer */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        {/* Alignment Guide Lines */}
        <div className="absolute w-1/2 h-40 pointer-events-none flex flex-col justify-between border-y border-white/5">
            <div className="w-px h-6 bg-indigo-500 mx-auto absolute left-1/2 -top-6 transform -translate-x-1/2 opacity-40" />
            <div className="w-px h-6 bg-indigo-500 mx-auto absolute left-1/2 -bottom-6 transform -translate-x-1/2 opacity-40" />
        </div>

        <div className="mono-font text-5xl md:text-6xl font-bold flex select-none tracking-tight">
          <span className="text-white/40 text-right min-w-[150px]">{beforePivot}</span>
          <span className="text-indigo-400">{pivotChar}</span>
          <span className="text-white text-left min-w-[150px]">{afterPivot}</span>
        </div>

        {currentIndex === words.current.length - 1 && (
            <button 
                onClick={handleFinish}
                className="mt-20 px-8 py-3 bg-indigo-600 rounded-full font-bold animate-bounce shadow-xl shadow-indigo-500/30 uppercase tracking-widest text-sm"
            >
                Take the Quiz
            </button>
        )}
      </div>

      {/* Progress & Controls */}
      <div className="p-10 space-y-8">
        {/* Progress Bar */}
        <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div 
                className="absolute top-0 left-0 h-full bg-indigo-500 transition-all duration-300" 
                style={{ width: `${progress}%` }}
            />
        </div>

        <div className="flex justify-center items-center gap-10">
            <button onClick={handleReset} className="p-4 bg-white/5 rounded-full hover:bg-white/10 active:scale-90 transition-all">
                <RotateCcw size={24} />
            </button>
            <button 
                onClick={togglePlay} 
                className={`p-8 ${isPlaying ? 'bg-white/10' : 'bg-indigo-600'} rounded-full shadow-2xl transition-all active:scale-95`}
            >
                {isPlaying ? <Pause size={40} fill="white" /> : <Play size={40} fill="white" className="ml-2" />}
            </button>
            <div className="p-4 flex flex-col items-center opacity-40">
                <span className="text-sm font-bold tracking-widest">{currentIndex + 1} / {words.current.length}</span>
                <span className="text-[10px] font-black uppercase">Words</span>
            </div>
        </div>
      </div>
    </div>
  );
};

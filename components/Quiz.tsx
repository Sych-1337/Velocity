
import React, { useState, useEffect, useRef } from 'react';
import { QuizQuestion, Language } from '../types';
import { generateQuizFromText } from '../services/geminiService';
import { TRANSLATIONS } from '../translations';
import { Loader2, CheckCircle2, XCircle, Timer, Shield } from 'lucide-react';

interface QuizProps {
  text: string;
  onComplete: (accuracy: number) => void;
  isDarkMode?: boolean;
  language: Language;
  isStrictMode?: boolean;
}

export const Quiz: React.FC<QuizProps> = ({ text, onComplete, isDarkMode, language, isStrictMode = false }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  const questionTimeout = isStrictMode ? 7 : 15;
  const [timeLeft, setTimeLeft] = useState(questionTimeout);
  const timerRef = useRef<number | null>(null);
  
  const t = TRANSLATIONS[language];

  useEffect(() => {
    async function initQuiz() {
      const q = await generateQuizFromText(text);
      setQuestions(q);
      setLoading(false);
    }
    initQuiz();
  }, [text]);

  useEffect(() => {
    if (loading || showFeedback) return;

    timerRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleOptionSelect(-1); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, currentIndex, showFeedback, questionTimeout]);

  const handleOptionSelect = (idx: number) => {
    if (showFeedback) return;
    if (timerRef.current) clearInterval(timerRef.current);
    
    setSelectedOption(idx);
    setShowFeedback(true);
    
    const isCorrect = idx === questions[currentIndex].correctIndex;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
        setTimeLeft(questionTimeout);
      } else {
        const accuracy = (correctCount + (isCorrect ? 1 : 0)) / questions.length;
        onComplete(accuracy);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-10 text-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{t.analyzingText}</h3>
        <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>{t.aiQuizDesc}</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const timerPercentage = (timeLeft / questionTimeout) * 100;

  return (
    <div className={`p-8 h-full flex flex-col animate-in fade-in duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-white shadow-2xl rounded-[40px]'}`}>
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                {t.questionOf.replace('{n}', (currentIndex + 1).toString()).replace('{m}', questions.length.toString())}
              </span>
              {isStrictMode && (
                  <span className="text-[8px] font-black uppercase text-rose-500 tracking-tighter flex items-center gap-1">
                      <Shield size={10} /> {t.strictTimer}
                  </span>
              )}
          </div>
          <div className="flex items-center gap-2 text-indigo-500">
            <Timer size={16} className={timeLeft < (isStrictMode ? 3 : 5) ? 'animate-pulse text-rose-500' : ''} />
            <span className={`font-mono font-black text-lg ${timeLeft < (isStrictMode ? 3 : 5) ? 'text-rose-500' : ''}`}>{timeLeft}s</span>
          </div>
        </div>
        <div className="h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${timeLeft < (isStrictMode ? 3 : 5) ? 'bg-rose-500' : 'bg-indigo-600'}`}
            style={{ width: `${timerPercentage}%` }}
          />
        </div>
      </div>

      <div className="flex-1 space-y-12 overflow-y-auto pr-2 scrollbar-hide">
        <h2 className={`text-2xl font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>{currentQ.question}</h2>
        
        <div className="space-y-4">
          {currentQ.options.map((option, idx) => {
            let stateClass = isDarkMode 
                ? "bg-slate-800 border-slate-700 text-white hover:border-indigo-500" 
                : "bg-white border-slate-200 text-slate-900 hover:border-indigo-300";

            if (showFeedback) {
                if (idx === currentQ.correctIndex) {
                    stateClass = isDarkMode 
                        ? "bg-emerald-950/40 border-emerald-500 text-emerald-400 ring-2 ring-emerald-500" 
                        : "bg-emerald-50 border-emerald-500 text-emerald-700 ring-2 ring-emerald-500";
                } else if (idx === selectedOption) {
                    stateClass = isDarkMode 
                        ? "bg-rose-950/40 border-rose-500 text-rose-400 ring-2 ring-rose-500 opacity-60" 
                        : "bg-rose-50 border-rose-500 text-rose-700 ring-2 ring-rose-500 opacity-60";
                } else {
                    stateClass = isDarkMode 
                        ? "bg-slate-800/40 border-slate-800 opacity-40" 
                        : "bg-white border-slate-100 opacity-40";
                }
            }

            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(idx)}
                disabled={showFeedback}
                className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 text-left transition-all duration-300 transform active:scale-[0.98] ${stateClass}`}
              >
                <span className="font-semibold pr-4">{option}</span>
                {showFeedback && idx === currentQ.correctIndex && <CheckCircle2 size={20} className="shrink-0" />}
                {showFeedback && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle size={20} className="shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>
      
      {timeLeft === 0 && !showFeedback && (
        <div className="mt-4 p-4 bg-rose-500/10 text-rose-500 rounded-2xl text-center font-black uppercase tracking-widest text-[10px] animate-bounce">
          {t.timeExpired}
        </div>
      )}
    </div>
  );
};

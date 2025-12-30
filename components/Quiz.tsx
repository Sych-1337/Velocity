
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';
import { generateQuizFromText } from '../services/geminiService';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

interface QuizProps {
  text: string;
  onComplete: (accuracy: number) => void;
  // Added isDarkMode prop to fix TypeScript error in App.tsx
  isDarkMode?: boolean;
}

export const Quiz: React.FC<QuizProps> = ({ text, onComplete, isDarkMode }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    async function initQuiz() {
      const q = await generateQuizFromText(text);
      setQuestions(q);
      setLoading(false);
    }
    initQuiz();
  }, [text]);

  const handleOptionSelect = (idx: number) => {
    if (showFeedback) return;
    setSelectedOption(idx);
    setShowFeedback(true);
    
    if (idx === questions[currentIndex].correctIndex) {
      setCorrectCount(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        const accuracy = (correctCount + (idx === questions[currentIndex].correctIndex ? 1 : 0)) / questions.length;
        onComplete(accuracy);
      }
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4 p-10 text-center">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Analyzing Text...</h3>
        <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} text-sm`}>Our AI is crafting a custom comprehension test for you.</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className={`p-8 h-full flex flex-col animate-in fade-in duration-500 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className="flex justify-between items-center mb-10">
        <span className="text-xs font-black uppercase tracking-widest text-slate-400">Question {currentIndex + 1} of {questions.length}</span>
        <div className="flex gap-1">
            {questions.map((_, i) => (
                <div key={i} className={`h-1.5 w-8 rounded-full ${i <= currentIndex ? 'bg-indigo-600' : (isDarkMode ? 'bg-slate-800' : 'bg-slate-100')}`} />
            ))}
        </div>
      </div>

      <div className="flex-1 space-y-12">
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
                className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 text-left transition-all duration-300 ${stateClass}`}
              >
                <span className="font-semibold">{option}</span>
                {showFeedback && idx === currentQ.correctIndex && <CheckCircle2 size={20} />}
                {showFeedback && idx === selectedOption && idx !== currentQ.correctIndex && <XCircle size={20} />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

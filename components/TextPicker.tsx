
import React, { useState } from 'react';
import { TextItem, Category } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { PlusCircle, Search, Clock, Zap, ArrowBigUp, ArrowBigDown } from 'lucide-react';

interface TextPickerProps {
  onSelect: (text: TextItem) => void;
  onVote: (id: string, direction: 'up' | 'down') => void;
  texts: TextItem[];
  isDarkMode?: boolean;
}

export const TextPicker: React.FC<TextPickerProps> = ({ onSelect, onVote, texts, isDarkMode }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [customText, setCustomText] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const filteredTexts = activeCategory === 'all' 
    ? texts 
    : texts.filter(t => t.category === activeCategory);

  const handleCustomSubmit = () => {
    if (customText.trim().length < 50) {
        alert("Please enter at least 50 words for a good reading experience.");
        return;
    }
    const newText: TextItem = {
        id: 'custom-' + Date.now(),
        title: 'User Text',
        category: 'custom',
        difficulty: 'medium',
        length: 'medium',
        content: customText,
        votes: 0,
        userVote: null
    };
    onSelect(newText);
  };

  return (
    <div className={`p-6 md:p-10 pb-20 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h2 className={`text-4xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Training Lab</h2>
          <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Select a protocol to begin your session.</p>
        </div>
        
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <CategoryTab 
              label="All" 
              active={activeCategory === 'all'} 
              onClick={() => setActiveCategory('all')} 
              icon={<Search size={16} />} 
              isDarkMode={isDarkMode}
          />
          {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => (
            <CategoryTab 
              key={cat}
              label={cat} 
              active={activeCategory === cat} 
              onClick={() => setActiveCategory(cat as Category)} 
              icon={icon} 
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Custom Text Entry (Always First) */}
        <div 
            onClick={() => setIsAdding(!isAdding)}
            className={`group relative flex flex-col justify-between p-8 rounded-[40px] cursor-pointer transition-all active:scale-[0.98] ${
                isDarkMode 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                  : 'bg-slate-900 text-white hover:bg-indigo-800'
            }`}
        >
            <div className="flex justify-between items-start mb-12">
              <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md">
                <PlusCircle size={28} />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Manual Load</div>
            </div>
            <div>
              <h3 className="text-2xl font-black mb-2">Protocol: Custom</h3>
              <p className={`text-sm opacity-70`}>Inject your own data stream for immediate analysis.</p>
            </div>
        </div>

        {filteredTexts.map(text => (
          <div 
            key={text.id}
            className={`group relative flex flex-col p-8 rounded-[40px] border transition-all ${
                isDarkMode 
                  ? 'bg-slate-900 border-slate-800 hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-500/10' 
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200'
            }`}
          >
            <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                      {CATEGORY_ICONS[text.category]}
                  </div>
                  {/* Vote controls inside the card */}
                  <div className="flex items-center bg-slate-500/10 rounded-xl p-1 px-2 gap-1">
                    <button 
                      onClick={(e) => { e.stopPropagation(); onVote(text.id, 'up'); }}
                      className={`transition-colors ${text.userVote === 'up' ? 'text-indigo-500' : 'text-slate-400 hover:text-indigo-400'}`}
                    >
                      <ArrowBigUp size={20} fill={text.userVote === 'up' ? 'currentColor' : 'none'} />
                    </button>
                    <span className={`text-xs font-black min-w-[12px] text-center ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
                      {text.votes || 0}
                    </span>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onVote(text.id, 'down'); }}
                      className={`transition-colors ${text.userVote === 'down' ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'}`}
                    >
                      <ArrowBigDown size={20} fill={text.userVote === 'down' ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                   <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${getDifficultyColor(text.difficulty, isDarkMode)}`}>
                        {text.difficulty}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                      <Clock size={12} /> {text.length === 'short' ? '2m' : text.length === 'medium' ? '5m' : '10m'}
                    </div>
                </div>
            </div>
            
            <div className="mt-auto cursor-pointer" onClick={() => onSelect(text)}>
              <h3 className={`text-xl font-black mb-2 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{text.title}</h3>
              <p className={`text-sm line-clamp-3 leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{text.content}</p>
            </div>
            
            <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
               <Zap size={20} className="text-indigo-500" />
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
              <div className={`w-full max-w-2xl p-8 rounded-[40px] space-y-6 shadow-2xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black">Manual Injection</h3>
                    <button onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-rose-500">Close</button>
                  </div>
                  <textarea 
                      className={`w-full h-64 border rounded-3xl p-6 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-base leading-relaxed ${
                          isDarkMode 
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 shadow-inner'
                      }`}
                      placeholder="Paste text here (minimum 50 words)..."
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                  />
                  <button 
                      onClick={handleCustomSubmit}
                      className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                  >
                      START PROCESSING
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

// Interface for CategoryTab component props
interface CategoryTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  isDarkMode?: boolean;
}

// Fix: Using React.FC to properly handle standard React props like 'key' when used in maps
const CategoryTab: React.FC<CategoryTabProps> = ({ label, active, onClick, icon, isDarkMode }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black whitespace-nowrap transition-all border ${
        active 
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
          : isDarkMode 
            ? 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300' 
            : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700 shadow-sm'
    }`}
  >
    <span className={active ? 'text-white' : 'text-indigo-500'}>{icon}</span>
    <span className="uppercase tracking-widest">{label}</span>
  </button>
);

const getDifficultyColor = (diff: string, isDarkMode?: boolean) => {
    switch(diff) {
        case 'easy': return isDarkMode ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-100';
        case 'medium': return isDarkMode ? 'bg-amber-950/40 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-100';
        case 'hard': return isDarkMode ? 'bg-rose-950/40 text-rose-400 border border-rose-500/20' : 'bg-rose-50 text-rose-600 border border-rose-100';
        default: return 'bg-slate-50 text-slate-600';
    }
};

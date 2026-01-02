
import React, { useState, useMemo } from 'react';
import { TextItem, Category, DifficultyLevel, Language } from '../types';
import { CATEGORY_ICONS } from '../constants';
import { TRANSLATIONS } from '../translations';
import { PlusCircle, Search, Clock, Zap, ArrowBigUp, ArrowBigDown, Filter, SortAsc } from 'lucide-react';
import { AdBanner } from './AdBanner';

interface TextPickerProps {
  onSelect: (text: TextItem) => void;
  onVote: (id: string, direction: 'up' | 'down') => void;
  texts: TextItem[];
  isDarkMode?: boolean;
  language: Language;
  isPremium?: boolean;
}

type SortOption = 'popularity' | 'title' | 'difficulty';

export const TextPicker: React.FC<TextPickerProps> = ({ onSelect, onVote, texts, isDarkMode, language, isPremium = false }) => {
  const [activeCategory, setActiveCategory] = useState<Category | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('popularity');
  
  const [customText, setCustomText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const t = TRANSLATIONS[language];

  const processedTexts = useMemo(() => {
    let result = [...texts];
    if (activeCategory !== 'all') {
      result = result.filter(t => t.category === activeCategory);
    }
    if (difficultyFilter !== 'all') {
      result = result.filter(t => t.difficulty === difficultyFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q));
    }
    const difficultyOrder: Record<string, number> = {
        'Noob': 1, 'Rookie': 2, 'Apprentice': 3, 'Competent': 4, 'Skilled': 5,
        'Advanced': 6, 'Expert': 7, 'Master': 8, 'Elite': 9, 'Legendary': 10
    };
    result.sort((a, b) => {
      if (sortOption === 'popularity') return (b.votes || 0) - (a.votes || 0);
      if (sortOption === 'title') return a.title.localeCompare(b.title);
      if (sortOption === 'difficulty') return (difficultyOrder[b.difficulty] || 0) - (difficultyOrder[a.difficulty] || 0);
      return 0;
    });
    return result;
  }, [texts, activeCategory, difficultyFilter, searchQuery, sortOption]);

  const handleCustomSubmit = () => {
    if (customText.trim().length < 50) {
        alert("Please enter at least 50 words.");
        return;
    }
    const newText: TextItem = {
        id: 'custom-' + Date.now(),
        title: t.protocolCustom,
        category: 'custom',
        difficulty: 'Competent',
        length: 'medium',
        content: customText,
        votes: 0,
        userVote: null,
        language: language
    };
    onSelect(newText);
  };

  const difficulties: DifficultyLevel[] = ['Noob', 'Rookie', 'Apprentice', 'Competent', 'Skilled', 'Advanced', 'Expert', 'Master', 'Elite', 'Legendary'];

  return (
    <div className={`p-4 md:p-10 pb-20 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1 md:space-y-2 px-1">
            <h2 className={`text-3xl md:text-4xl font-black tracking-tighter italic ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{t.labTitle}</h2>
            <p className={`text-sm md:text-lg opacity-60 font-medium`}>{t.labDesc}</p>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide snap-x touch-pan-x">
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

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-1">
            <div className="md:col-span-2 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input 
                    type="text"
                    placeholder="Search protocols..."
                    className={`w-full pl-12 pr-6 py-4 rounded-2xl border-2 outline-none transition-all focus:border-indigo-500 ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white placeholder-slate-600' : 'bg-white border-slate-100 shadow-sm'
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select 
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value as any)}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none appearance-none transition-all focus:border-indigo-500 ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-sm'
                    }`}
                >
                    <option value="all">{t.anyDifficulty}</option>
                    {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
            </div>

            <div className="relative">
                <SortAsc className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <select 
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as any)}
                    className={`w-full pl-12 pr-4 py-4 rounded-2xl border-2 outline-none appearance-none transition-all focus:border-indigo-500 ${
                        isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 shadow-sm'
                    }`}
                >
                    <option value="popularity">{t.mostVoted}</option>
                    <option value="title">{t.alphabetical}</option>
                    <option value="difficulty">{t.hardestFirst}</option>
                </select>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <div 
            onClick={() => setIsAdding(!isAdding)}
            className={`group relative flex flex-col justify-between p-6 md:p-8 rounded-[32px] md:rounded-[40px] cursor-pointer transition-all active:scale-[0.98] ${
                isDarkMode 
                  ? 'bg-indigo-600 text-white hover:bg-indigo-500' 
                  : 'bg-slate-900 text-white hover:bg-indigo-800'
            }`}
        >
            <div className="flex justify-between items-start mb-10 md:mb-12">
              <div className="p-3 md:p-4 bg-white/10 rounded-2xl md:rounded-3xl backdrop-blur-md">
                <PlusCircle size={24} className="md:w-7 md:h-7" />
              </div>
              <div className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] opacity-60">{t.manualLoad}</div>
            </div>
            <div>
              <h3 className="text-xl md:text-2xl font-black mb-1 md:mb-2">{t.protocolCustom}</h3>
              <p className={`text-xs md:text-sm opacity-70 font-medium`}>{t.manualDesc}</p>
            </div>
        </div>

        {processedTexts.map((text, idx) => (
          <React.Fragment key={text.id}>
            {idx > 0 && idx % 6 === 0 && !isPremium && (
               <div className="sm:col-span-2 lg:col-span-1">
                 <AdBanner isDarkMode={!!isDarkMode} type="card" language={language} />
               </div>
            )}
            <div 
              className={`group relative flex flex-col p-6 md:p-8 rounded-[32px] md:rounded-[40px] border transition-all active:scale-[0.98] ${
                  isDarkMode 
                    ? 'bg-slate-900 border-slate-800 hover:border-indigo-500' 
                    : 'bg-white border-slate-100 shadow-sm hover:border-indigo-200'
              }`}
            >
              <div className="flex items-start justify-between mb-6 md:mb-8">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${isDarkMode ? 'bg-slate-800 text-indigo-400' : 'bg-indigo-50 text-indigo-600'}`}>
                        {CATEGORY_ICONS[text.category]}
                    </div>
                    <div className={`flex items-center rounded-xl p-1 px-2 gap-1.5 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onVote(text.id, 'up'); }}
                        className={`transition-colors p-0.5 ${text.userVote === 'up' ? 'text-indigo-500' : 'text-slate-400'}`}
                      >
                        <ArrowBigUp size={18} fill={text.userVote === 'up' ? 'currentColor' : 'none'} />
                      </button>
                      <span className={`text-[10px] font-black min-w-[14px] text-center ${isDarkMode ? 'text-white' : 'text-slate-700'}`}>
                        {text.votes || 0}
                      </span>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onVote(text.id, 'down'); }}
                        className={`transition-colors p-0.5 ${text.userVote === 'down' ? 'text-rose-500' : 'text-slate-400'}`}
                      >
                        <ArrowBigDown size={18} fill={text.userVote === 'down' ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 md:gap-2">
                    <span className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest px-2.5 md:py-1 rounded-full border ${getDifficultyStyles(text.difficulty, isDarkMode)}`}>
                          {text.difficulty}
                      </span>
                      <div className="flex items-center gap-1 text-slate-400 text-[8px] md:text-[10px] font-black">
                        <Clock size={10} /> {text.length === 'short' ? '2m' : text.length === 'medium' ? '5m' : '10m'}
                      </div>
                  </div>
              </div>
              <div className="mt-auto cursor-pointer" onClick={() => onSelect(text)}>
                <h3 className={`text-lg md:text-xl font-black mb-1.5 leading-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{text.title}</h3>
                <p className={`text-xs md:text-sm line-clamp-3 leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{text.content}</p>
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>

      {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
              <div className={`w-full max-w-2xl p-6 md:p-8 rounded-[32px] md:rounded-[40px] space-y-6 shadow-2xl animate-in slide-in-from-bottom duration-500 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">{t.protocolEntry}</h3>
                    <button onClick={() => setIsAdding(false)} className="text-[10px] font-black uppercase tracking-widest bg-rose-500/10 text-rose-500 px-4 py-2 rounded-xl">{t.cancel}</button>
                  </div>
                  <textarea 
                      autoFocus
                      className={`w-full h-64 border-2 rounded-[24px] md:rounded-[32px] p-6 focus:border-indigo-500 outline-none transition-all text-sm md:text-base leading-relaxed ${
                          isDarkMode 
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                            : 'bg-slate-50 border-slate-100 text-slate-900 placeholder-slate-400'
                      }`}
                      placeholder={t.pasteStream}
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                  />
                  <button 
                      onClick={handleCustomSubmit}
                      className="w-full bg-indigo-600 text-white py-5 rounded-[24px] md:rounded-[32px] font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
                  >
                      {t.startProcessing}
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

interface CategoryTabProps {
  label: string;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  isDarkMode?: boolean;
}

const CategoryTab: React.FC<CategoryTabProps> = ({ label, active, onClick, icon, isDarkMode }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black whitespace-nowrap transition-all border snap-center ${
        active 
          ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20 scale-105 z-10' 
          : isDarkMode 
            ? 'bg-slate-900 border-slate-800 text-slate-500 hover:border-slate-700' 
            : 'bg-white border-slate-200 text-slate-500 shadow-sm hover:border-slate-300'
    }`}
  >
    <span className={active ? 'text-white' : 'text-indigo-500'}>{icon}</span>
    <span className="uppercase tracking-[0.15em]">{label}</span>
  </button>
);

const getDifficultyStyles = (diff: DifficultyLevel, isDarkMode?: boolean) => {
    switch(diff) {
        case 'Noob': return isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200';
        case 'Rookie': return isDarkMode ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100';
        case 'Apprentice': return isDarkMode ? 'bg-teal-950/40 text-teal-400 border-teal-500/20' : 'bg-teal-50 text-teal-600 border-teal-100';
        case 'Competent': return isDarkMode ? 'bg-blue-950/40 text-blue-400 border-blue-500/20' : 'bg-blue-50 text-blue-600 border-blue-100';
        case 'Skilled': return isDarkMode ? 'bg-indigo-950/40 text-indigo-400 border-indigo-500/20' : 'bg-indigo-50 text-indigo-600 border-indigo-100';
        case 'Advanced': return isDarkMode ? 'bg-purple-950/40 text-purple-400 border-purple-500/20' : 'bg-purple-50 text-purple-600 border-purple-100';
        case 'Expert': return isDarkMode ? 'bg-amber-950/40 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-100';
        case 'Master': return isDarkMode ? 'bg-orange-950/40 text-orange-400 border-orange-500/20' : 'bg-orange-50 text-orange-600 border-orange-100';
        case 'Elite': return isDarkMode ? 'bg-rose-950/40 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100';
        case 'Legendary': return isDarkMode ? 'bg-slate-950 text-amber-500 border-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]' : 'bg-slate-900 text-amber-400 border-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]';
        default: return 'bg-slate-50 text-slate-600';
    }
};

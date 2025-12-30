
import React, { useState } from 'react';
import { TextItem } from '../types';
import { ArrowBigUp, ArrowBigDown, Plus, MessageSquare, User, Filter, Rocket } from 'lucide-react';

interface CommunityProps {
  texts: TextItem[];
  onSelect: (text: TextItem) => void;
  onVote: (id: string, direction: 'up' | 'down') => void;
  onAdd: (text: Partial<TextItem>) => void;
  isDarkMode: boolean;
}

export const Community: React.FC<CommunityProps> = ({ texts, onSelect, onVote, onAdd, isDarkMode }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle && newContent) {
      onAdd({ title: newTitle, content: newContent });
      setNewTitle('');
      setNewContent('');
      setIsAdding(false);
    }
  };

  return (
    <div className={`p-6 md:p-10 pb-24 space-y-8 animate-in fade-in duration-500`}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className={`text-4xl font-black italic tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            COMMUNITY HUB
          </h2>
          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-500'} font-medium`}>
            Explore and rate training modules curated by the collective.
          </p>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-[28px] font-black shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Plus size={20} /> SHARE KNOWLEDGE
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {texts.map((text) => (
          <div 
            key={text.id}
            className={`group relative flex gap-6 p-6 rounded-[40px] border transition-all ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' 
                : 'bg-white border-slate-200 shadow-xl shadow-slate-200/20'
            }`}
          >
            {/* Voting Column */}
            <div className="flex flex-col items-center gap-1">
              <button 
                onClick={() => onVote(text.id, 'up')}
                className={`p-2 rounded-xl transition-colors ${
                  text.userVote === 'up' ? 'text-indigo-500 bg-indigo-500/10' : 'text-slate-400 hover:text-indigo-500'
                }`}
              >
                <ArrowBigUp size={32} fill={text.userVote === 'up' ? "currentColor" : "none"} />
              </button>
              <span className={`font-black text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                {text.votes}
              </span>
              <button 
                onClick={() => onVote(text.id, 'down')}
                className={`p-2 rounded-xl transition-colors ${
                  text.userVote === 'down' ? 'text-rose-500 bg-rose-500/10' : 'text-slate-400 hover:text-rose-500'
                }`}
              >
                <ArrowBigDown size={32} fill={text.userVote === 'down' ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Content Column */}
            <div className="flex-1 space-y-4">
              <div className="flex justify-between items-start">
                <div 
                  onClick={() => onSelect(text)}
                  className="cursor-pointer group-hover:translate-x-1 transition-transform"
                >
                  <h3 className={`text-xl font-black leading-tight mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {text.title}
                  </h3>
                  <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-500">
                    <span className="flex items-center gap-1"><User size={12} /> {text.author}</span>
                    <span className="opacity-30">•</span>
                    <span>{text.difficulty}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                  {text.length}
                </div>
              </div>
              
              <p 
                onClick={() => onSelect(text)}
                className={`text-sm line-clamp-3 leading-relaxed cursor-pointer ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}
              >
                {text.content}
              </p>

              <div className="flex items-center gap-4 pt-2">
                <button 
                  onClick={() => onSelect(text)}
                  className={`text-xs font-black uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                    isDarkMode ? 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  <Rocket size={14} /> Start Training
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-xl animate-in fade-in zoom-in duration-300">
          <div className={`w-full max-w-2xl p-8 rounded-[48px] space-y-8 shadow-2xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center">
              <h3 className="text-3xl font-black italic tracking-tighter">PUBLISH DATA</h3>
              <button onClick={() => setIsAdding(false)} className="p-3 rounded-2xl hover:bg-rose-500/10 text-rose-500 transition-colors">
                Cancel
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Protocol Title</label>
                <input 
                  autoFocus
                  className={`w-full p-6 rounded-[28px] border-2 outline-none font-bold transition-all focus:border-indigo-500 ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'
                  }`}
                  placeholder="The Essence of Flow..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Data Stream (Content)</label>
                <textarea 
                  className={`w-full h-48 p-6 rounded-[28px] border-2 outline-none font-medium transition-all focus:border-indigo-500 leading-relaxed ${
                    isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100'
                  }`}
                  placeholder="Paste your text here... (Min 50 words recommended)"
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white py-6 rounded-[28px] font-black text-xl hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95"
              >
                INITIATE UPLOAD
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};


import React, { useState, useMemo } from 'react';
import { Trophy, Medal, Globe, Users, Plus, X, Search, UserPlus, Shield } from 'lucide-react';
import { Language, UserStats } from '../types';
import { TRANSLATIONS } from '../translations';
import { GLOBAL_LEADERS } from '../constants';

interface LeaderboardProps {
    isDarkMode?: boolean;
    language: Language;
    userStats: UserStats;
    onAddFriend: (code: string) => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ isDarkMode, language, userStats, onAddFriend }) => {
    const [scope, setScope] = useState<'global' | 'friends'>('global');
    const [division, setDivision] = useState<'regular' | 'strict'>('regular');
    const [isAdding, setIsAdding] = useState(false);
    const [friendCode, setFriendCode] = useState('');
    const [error, setError] = useState('');
    const t = TRANSLATIONS[language];

    const playersWithStatus = useMemo(() => {
        return GLOBAL_LEADERS.map((p, idx) => ({
            ...p,
            isStrict: idx % 3 === 0 
        }));
    }, []);

    const filteredPlayers = useMemo(() => {
        const source = scope === 'global' ? playersWithStatus : playersWithStatus.filter(u => userStats.friendCodes.includes(u.code));
        return source
            .filter(p => division === 'strict' ? p.isStrict : true)
            .sort((a, b) => b.points - a.points);
    }, [scope, division, playersWithStatus, userStats.friendCodes]);

    const handleAdd = () => {
        if (friendCode.length !== 5) {
            setError(t.idCodeInvalid);
            return;
        }
        
        const found = GLOBAL_LEADERS.find(u => u.code === friendCode);
        if (!found) {
            setError(t.userNotFound);
            return;
        }

        if (friendCode === userStats.idCode) {
            setError(t.cantAddSelf);
            return;
        }

        onAddFriend(friendCode);
        setIsAdding(false);
        setFriendCode('');
        setError('');
    };

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500 relative">
            <div className={`p-6 pb-10 space-y-6 ${isDarkMode ? 'bg-slate-950' : 'bg-indigo-600 text-white'}`}>
                <div className="flex justify-between items-center">
                    <h2 className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? 'text-indigo-400' : 'text-white'}`}>{t.navLeaderboard}</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-black/20 rounded-xl p-1">
                            <button 
                                onClick={() => setDivision('regular')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${division === 'regular' ? 'bg-white text-indigo-600 shadow-lg' : 'text-white/60'}`}
                            >
                                {t.regular}
                            </button>
                            <button 
                                onClick={() => setDivision('strict')}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all flex items-center gap-1.5 ${division === 'strict' ? 'bg-rose-600 text-white shadow-lg' : 'text-white/60'}`}
                            >
                                <Shield size={10} /> {t.strict}
                            </button>
                        </div>
                        <Trophy className="text-amber-400" />
                    </div>
                </div>
                
                <div className={`flex p-1 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-indigo-700/50'}`}>
                    <button 
                        onClick={() => setScope('global')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${scope === 'global' ? 'bg-white text-indigo-700 shadow-lg' : 'text-indigo-200'}`}
                    >
                        <Globe size={18} /> {t.globalTab}
                    </button>
                    <button 
                        onClick={() => setScope('friends')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${scope === 'friends' ? 'bg-white text-indigo-700 shadow-lg' : 'text-indigo-200'}`}
                    >
                        <Users size={18} /> {t.friendsTab}
                    </button>
                </div>
            </div>

            <div className={`flex-1 -mt-4 rounded-t-[32px] px-4 pt-6 space-y-4 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                {scope === 'friends' && (
                    <div className="px-2">
                        <button 
                            onClick={() => setIsAdding(true)}
                            className={`w-full flex items-center justify-center gap-3 py-4 rounded-[24px] border-2 border-dashed font-black uppercase tracking-widest text-xs transition-all active:scale-95 ${
                                isDarkMode ? 'border-slate-800 bg-slate-800/20 text-indigo-400 hover:bg-slate-800/40' : 'border-slate-200 bg-slate-50 text-indigo-600 hover:bg-slate-100'
                            }`}
                        >
                            <Plus size={18} /> {t.addFriend}
                        </button>
                    </div>
                )}

                {filteredPlayers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-30 text-center space-y-4">
                        <Users size={64} strokeWidth={1} />
                        <div>
                            <p className="font-black uppercase tracking-widest text-xs">{division === 'strict' ? t.noStrictElite : t.noConnections}</p>
                            <p className="text-[10px] font-bold">{t.connectionDesc}</p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2 pb-10">
                        {filteredPlayers.map((player, idx) => (
                            <div 
                                key={player.id} 
                                className={`flex items-center gap-4 p-4 rounded-3xl transition-all border-2 ${
                                    player.isStrict && division === 'strict' 
                                        ? (isDarkMode ? 'border-rose-600/30 bg-rose-600/5' : 'border-rose-100 bg-rose-50/50')
                                        : 'border-transparent'
                                } ${
                                    isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                                }`}
                            >
                                <div className="w-8 text-center font-black text-slate-500">
                                    {idx === 0 && <Medal className="text-amber-400 mx-auto" size={20} />}
                                    {idx === 1 && <Medal className="text-slate-400 mx-auto" size={20} />}
                                    {idx === 2 && <Medal className="text-amber-700 mx-auto" size={20} />}
                                    {idx > 2 && idx + 1}
                                </div>
                                <div className={`relative w-12 h-12 rounded-2xl flex items-center justify-center font-bold border shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}>
                                    {player.avatar}
                                    {player.isStrict && (
                                        <div className="absolute -top-1 -right-1 bg-rose-600 text-white p-1 rounded-full border-2 border-white dark:border-slate-900 shadow-lg">
                                            <Shield size={8} fill="white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h4 className={`font-bold truncate ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{player.name}</h4>
                                        {player.isStrict && (
                                            <span className="bg-rose-600/10 text-rose-600 text-[6px] font-black uppercase px-1.5 py-0.5 rounded border border-rose-600/20">{t.strict}</span>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-slate-500 font-semibold">{player.wpm} {t.wpm} Best</p>
                                </div>
                                <div className="text-right">
                                    <p className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{player.points.toLocaleString()}</p>
                                    <p className="text-[8px] font-black text-indigo-500 tracking-widest uppercase">XP</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isAdding && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className={`w-full max-w-sm p-8 rounded-[40px] shadow-2xl space-y-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white'}`}>
                        <div className="flex justify-between items-center">
                            <h3 className="text-2xl font-black italic tracking-tighter uppercase">{t.addSpeedster}</h3>
                            <button onClick={() => setIsAdding(false)} className="p-2 rounded-full hover:bg-rose-500/10 text-rose-500">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">{t.idCodeLabel}</label>
                                <div className="relative">
                                    <input 
                                        autoFocus
                                        type="text"
                                        maxLength={5}
                                        className={`w-full p-5 rounded-[24px] border-2 outline-none font-mono font-black text-2xl tracking-[0.5em] text-center transition-all focus:border-indigo-500 ${
                                            isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'
                                        }`}
                                        placeholder="00000"
                                        value={friendCode}
                                        onChange={(e) => {
                                            setFriendCode(e.target.value.replace(/\D/g, ''));
                                            setError('');
                                        }}
                                    />
                                    {error && <p className="text-rose-500 text-[10px] font-black uppercase text-center mt-2">{error}</p>}
                                </div>
                            </div>

                            <button 
                                onClick={handleAdd}
                                className="w-full bg-indigo-600 text-white py-5 rounded-[24px] font-black text-lg hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-3"
                            >
                                <UserPlus size={20} /> {t.syncConnection}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

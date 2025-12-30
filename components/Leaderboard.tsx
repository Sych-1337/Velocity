
import React, { useState } from 'react';
import { Trophy, Medal, Globe, Users } from 'lucide-react';

const MOCK_LEADERS = [
    { rank: 1, name: 'SpeedDemon', points: 42100, wpm: 850, avatar: 'SD' },
    { rank: 2, name: 'LibraryGhost', points: 38500, wpm: 720, avatar: 'LG' },
    { rank: 3, name: 'ReadFastDieYoung', points: 35000, wpm: 910, avatar: 'RF' },
    { rank: 4, name: 'You (John Doe)', points: 32450, wpm: 450, avatar: 'JD', isSelf: true },
    { rank: 5, name: 'BookWorm99', points: 29800, wpm: 540, avatar: 'BW' },
    { rank: 6, name: 'FastThinker', points: 25000, wpm: 600, avatar: 'FT' },
];

interface LeaderboardProps {
    isDarkMode?: boolean;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ isDarkMode }) => {
    const [scope, setScope] = useState<'global' | 'friends'>('global');

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            <div className={`p-6 pb-10 space-y-6 ${isDarkMode ? 'bg-slate-950' : 'bg-indigo-600 text-white'}`}>
                <div className="flex justify-between items-center">
                    <h2 className={`text-2xl font-black italic tracking-tighter ${isDarkMode ? 'text-indigo-400' : 'text-white'}`}>LEADERBOARD</h2>
                    <Trophy className="text-amber-400" />
                </div>
                
                <div className={`flex p-1 rounded-2xl ${isDarkMode ? 'bg-slate-800' : 'bg-indigo-700/50'}`}>
                    <button 
                        onClick={() => setScope('global')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${scope === 'global' ? 'bg-white text-indigo-700' : 'text-indigo-200'}`}
                    >
                        <Globe size={18} /> Global
                    </button>
                    <button 
                        onClick={() => setScope('friends')}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold transition-all ${scope === 'friends' ? 'bg-white text-indigo-700' : 'text-indigo-200'}`}
                    >
                        <Users size={18} /> Friends
                    </button>
                </div>
            </div>

            <div className={`flex-1 -mt-4 rounded-t-[32px] px-4 pt-6 space-y-2 overflow-y-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                {MOCK_LEADERS.map((player) => (
                    <div 
                        key={player.rank} 
                        className={`flex items-center gap-4 p-4 rounded-3xl transition-all ${
                            player.isSelf 
                              ? isDarkMode ? 'bg-indigo-950/40 border-2 border-indigo-500/30' : 'bg-indigo-50 border-2 border-indigo-200 shadow-lg shadow-indigo-100' 
                              : isDarkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-50'
                        }`}
                    >
                        <div className="w-8 text-center font-black text-slate-500">
                            {player.rank === 1 && <Medal className="text-amber-400 mx-auto" />}
                            {player.rank === 2 && <Medal className="text-slate-400 mx-auto" />}
                            {player.rank === 3 && <Medal className="text-amber-700 mx-auto" />}
                            {player.rank > 3 && player.rank}
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                            {player.avatar}
                        </div>
                        <div className="flex-1">
                            <h4 className={`font-bold ${player.isSelf ? (isDarkMode ? 'text-indigo-300' : 'text-indigo-700') : (isDarkMode ? 'text-slate-200' : 'text-slate-800')}`}>{player.name}</h4>
                            <p className="text-xs text-slate-500 font-semibold">{player.wpm} WPM Best</p>
                        </div>
                        <div className="text-right">
                            <p className={`font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{player.points.toLocaleString()}</p>
                            <p className="text-[10px] font-bold text-indigo-500 tracking-widest uppercase">Points</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

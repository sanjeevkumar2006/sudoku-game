import React, { useState } from 'react';
import { X, Trophy, Medal, Crown } from 'lucide-react';
import type { Difficulty, GameStats } from '../types/sudoku';
import { sound } from '../utils/sound';

interface LeaderboardModalProps {
  stats: GameStats;
  onClose: () => void;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  time: string;
  date: string;
  difficulty: Difficulty;
  isUser?: boolean;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ stats, onClose }) => {
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty>('medium');

  const mockCompetitors: Record<Difficulty, { name: string; timeSec: number }[]> = {
    easy: [
      { name: 'Aria_Solves', timeSec: 92 },
      { name: 'Kaelen_Prime', timeSec: 115 },
      { name: 'Zenith99', timeSec: 138 },
      { name: 'NovaPuzzler', timeSec: 160 },
      { name: 'CipherMind', timeSec: 190 },
    ],
    medium: [
      { name: 'Vortex_Math', timeSec: 210 },
      { name: 'QuantumSudoku', timeSec: 245 },
      { name: 'Aria_Solves', timeSec: 278 },
      { name: 'ShadowLogician', timeSec: 320 },
      { name: 'LogicQueen', timeSec: 360 },
    ],
    hard: [
      { name: 'Grandmaster_X', timeSec: 390 },
      { name: 'DeepThought', timeSec: 440 },
      { name: 'Vortex_Math', timeSec: 495 },
      { name: 'NexusSeeker', timeSec: 540 },
      { name: 'OmegaGrid', timeSec: 610 },
    ],
    expert: [
      { name: 'ApexLogic', timeSec: 580 },
      { name: 'DeepThought', timeSec: 650 },
      { name: 'Grandmaster_X', timeSec: 720 },
      { name: 'TitanSolver', timeSec: 810 },
      { name: 'NeuroGrid', timeSec: 940 },
    ],
  };

  const formatSecs = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s.toString().padStart(2, '0')}s`;
  };

  const userBestTime = stats.byDifficulty[filterDifficulty]?.bestTime || 0;

  const competitors = [...mockCompetitors[filterDifficulty]];
  if (userBestTime > 0) {
    competitors.push({ name: 'You (Player)', timeSec: userBestTime });
  }
  competitors.sort((a, b) => a.timeSec - b.timeSec);

  const entries: LeaderboardEntry[] = competitors.map((c, idx) => ({
    rank: idx + 1,
    name: c.name,
    time: formatSecs(c.timeSec),
    date: 'Recent',
    difficulty: filterDifficulty,
    isUser: c.name.includes('You'),
  }));

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="w-4 h-4 text-amber-400" />;
    if (rank === 2) return <Medal className="w-4 h-4 text-slate-300" />;
    if (rank === 3) return <Medal className="w-4 h-4 text-amber-600" />;
    return <span className="font-mono text-xs text-slate-400">#{rank}</span>;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl relative animate-pop text-slate-100 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Global Leaderboard</h3>
              <p className="text-xs text-slate-400">Hall of Fame & Speed Records</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onClose();
            }}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800/80 rounded-2xl my-4 border border-slate-700/60 shrink-0">
          {(['easy', 'medium', 'hard', 'expert'] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => {
                sound.playTap();
                setFilterDifficulty(d);
              }}
              className={`py-2 text-xs font-bold capitalize rounded-xl transition-all ${
                filterDifficulty === d
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto space-y-2 py-2 pr-1 flex-1">
          {entries.map((entry) => (
            <div
              key={`${entry.name}-${entry.rank}`}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                entry.isUser
                  ? 'bg-purple-950/60 border-purple-400 ring-1 ring-purple-400/50 shadow-lg'
                  : 'bg-slate-800/40 border-slate-800 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-7 flex items-center justify-center">{getRankBadge(entry.rank)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-bold ${
                        entry.isUser ? 'text-cyan-300 font-extrabold' : 'text-slate-200'
                      }`}
                    >
                      {entry.name}
                    </span>
                    {entry.isUser && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/30 text-purple-200 px-1.5 py-0.2 rounded-full border border-purple-400/40">
                        You
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 capitalize">{entry.difficulty}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="font-mono font-bold text-amber-300 text-sm">{entry.time}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="mt-4 w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm transition-all shrink-0"
        >
          Close Leaderboard
        </button>
      </div>
    </div>
  );
};

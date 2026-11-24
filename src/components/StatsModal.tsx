import React, { useState } from 'react';
import { X, BarChart3 } from 'lucide-react';
import type { Difficulty, GameStats } from '../types/sudoku';
import { sound } from '../utils/sound';

interface StatsModalProps {
  stats: GameStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = ({ stats, onClose }) => {
  const [selectedTab, setSelectedTab] = useState<Difficulty>('medium');

  const formatTime = (secs: number) => {
    if (secs === 0) return '--:--';
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const diffStats = stats.byDifficulty[selectedTab] || { played: 0, won: 0, bestTime: 0, totalTime: 0 };
  const diffWinRate = diffStats.played > 0 ? Math.round((diffStats.won / diffStats.played) * 100) : 0;
  const avgTime = diffStats.won > 0 ? Math.round(diffStats.totalTime / diffStats.won) : 0;

  const totalWinRate = stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  const difficulties: Difficulty[] = ['easy', 'medium', 'hard', 'expert'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl relative animate-pop text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Player Statistics</h3>
              <p className="text-xs text-slate-400">Detailed performance records</p>
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

        {/* Global Summary Cards */}
        <div className="grid grid-cols-4 gap-2.5 my-4">
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Played</span>
            <span className="text-lg font-bold font-mono text-white mt-1 block">{stats.gamesPlayed}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Won</span>
            <span className="text-lg font-bold font-mono text-emerald-400 mt-1 block">{stats.gamesWon}</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Win Rate</span>
            <span className="text-lg font-bold font-mono text-cyan-400 mt-1 block">{totalWinRate}%</span>
          </div>
          <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
            <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Best Streak</span>
            <span className="text-lg font-bold font-mono text-amber-300 mt-1 block">{stats.bestStreak}</span>
          </div>
        </div>

        {/* Difficulty Selector Tabs */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-800/80 rounded-2xl mb-4 border border-slate-700/60">
          {difficulties.map((d) => (
            <button
              key={d}
              onClick={() => {
                sound.playTap();
                setSelectedTab(d);
              }}
              className={`py-2 text-xs font-bold capitalize rounded-xl transition-all ${
                selectedTab === d
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Selected Difficulty Breakdown */}
        <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 space-y-3.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Puzzles Played</span>
            <span className="font-mono font-bold text-white">{diffStats.played}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Puzzles Solved</span>
            <span className="font-mono font-bold text-emerald-400">{diffStats.won}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Difficulty Win Rate</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${diffWinRate}%` }}
                />
              </div>
              <span className="font-mono font-bold text-cyan-400">{diffWinRate}%</span>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Best Completion Time</span>
            <span className="font-mono font-bold text-amber-300">{formatTime(diffStats.bestTime)}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400">Average Completion Time</span>
            <span className="font-mono font-bold text-slate-300">{formatTime(avgTime)}</span>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="mt-6 w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm transition-all"
        >
          Close Statistics
        </button>
      </div>
    </div>
  );
};

import React from 'react';
import {
  Play,
  Calendar,
  Flame,
  Zap,
  BarChart3,
  HelpCircle,
  Clock,
  Sparkles,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';
import type { Difficulty, GameStats, SavedGameState } from '../types/sudoku';
import { sound } from '../utils/sound';

interface HomeDashboardProps {
  stats: GameStats;
  savedGame: SavedGameState | null;
  dailyCompletedToday: boolean;
  onStartGame: (diff: Difficulty) => void;
  onStartDaily: () => void;
  onResumeGame: () => void;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
  onOpenLeaderboard: () => void;
  onOpenHowToPlay: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  stats,
  savedGame,
  dailyCompletedToday,
  onStartGame,
  onStartDaily,
  onResumeGame,
  onOpenStats,
  onOpenHowToPlay,
}) => {
  const winRate =
    stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;

  const allBestTimes = Object.values(stats.byDifficulty)
    .map((d) => d.bestTime)
    .filter((t) => t > 0);
  const bestOverallTime = allBestTimes.length > 0 ? Math.min(...allBestTimes) : 0;

  const formatTime = (secs: number) => {
    if (secs === 0) return '--:--';
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const difficulties: {
    id: Difficulty;
    name: string;
    description: string;
    badgeColor: string;
    gradient: string;
    glow: string;
    stars: number;
  }[] = [
    {
      id: 'easy',
      name: 'Easy',
      description: 'Relaxed & beginner friendly with abundant hints',
      badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      gradient: 'from-emerald-500/20 via-teal-500/10 to-transparent hover:border-emerald-500/50',
      glow: 'group-hover:shadow-emerald-500/20',
      stars: 1,
    },
    {
      id: 'medium',
      name: 'Medium',
      description: 'Classic puzzle balance requiring basic deductions',
      badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      gradient: 'from-blue-500/20 via-cyan-500/10 to-transparent hover:border-blue-500/50',
      glow: 'group-hover:shadow-blue-500/20',
      stars: 2,
    },
    {
      id: 'hard',
      name: 'Hard',
      description: 'Deep logic, candidate marking & intermediate techniques',
      badgeColor: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      gradient: 'from-orange-500/20 via-amber-500/10 to-transparent hover:border-orange-500/50',
      glow: 'group-hover:shadow-orange-500/20',
      stars: 3,
    },
    {
      id: 'expert',
      name: 'Expert',
      description: 'Master tier for veteran solvers. True intellectual test',
      badgeColor: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      gradient: 'from-rose-500/20 via-purple-600/10 to-transparent hover:border-rose-500/50',
      glow: 'group-hover:shadow-rose-500/20',
      stars: 4,
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 flex flex-col gap-6 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/40 via-slate-900 to-indigo-950/50 border border-purple-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-purple-500/15 via-cyan-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-300 text-xs font-bold tracking-wide uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span>Premium Sudoku Experience</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Sharpen Your Mind with{' '}
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                Sudoku Master
              </span>
            </h1>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Guaranteed unique puzzles, real-time smart hints, intuitive pencil notes, and
              customizable aesthetics designed for both casual and master solvers.
            </p>
          </div>

          <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
            <button
              onClick={() => {
                sound.playTap();
                onStartGame('medium');
              }}
              className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:from-purple-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group"
            >
              <Play className="w-4 h-4 fill-white group-hover:translate-x-0.5 transition-transform" />
              <span>Quick Play</span>
            </button>

            <button
              onClick={() => {
                sound.playTap();
                onOpenHowToPlay();
              }}
              className="px-4 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-4 h-4 text-purple-400" />
              <span>How to Play</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Cards Row: Saved Game + Daily Challenge */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedGame ? (
          <div className="rounded-3xl bg-slate-900/80 border border-purple-500/40 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  Game in Progress
                </span>
                <span className="text-xs font-mono text-cyan-300 font-bold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTime(savedGame.timer)}
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mt-3 capitalize">
                {savedGame.isDaily ? 'Daily Challenge' : `${savedGame.difficulty} Mode`}
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Mistakes: {savedGame.mistakes}/3 • Hints Used: {savedGame.hintsUsed}
              </p>
            </div>

            <button
              onClick={() => {
                sound.playTap();
                onResumeGame();
              }}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-md shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Continue Puzzle</span>
            </button>
          </div>
        ) : (
          <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-5 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
                  No Active Game
                </span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-200 mt-3">Ready for a New Challenge?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Choose any difficulty below to launch a newly generated unique puzzle!
              </p>
            </div>
            <button
              onClick={() => {
                sound.playTap();
                onStartGame('easy');
              }}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4 text-emerald-400" />
              <span>Start Casual Game</span>
            </button>
          </div>
        )}

        {/* Daily Challenge Card */}
        <div className="rounded-3xl bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/40 border border-indigo-500/30 p-5 backdrop-blur-xl shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                <span>Daily Challenge</span>
              </span>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-400">
                <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>Streak: {stats.currentStreak}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mt-3">{todayStr}</h3>
            <p className="text-xs text-slate-400 mt-1">
              Deterministic community puzzle refreshed daily. Keep your streak alive!
            </p>
          </div>

          {dailyCompletedToday ? (
            <div className="mt-5 py-2.5 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm font-bold flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>Completed Today! Great Job</span>
            </div>
          ) : (
            <button
              onClick={() => {
                sound.playTap();
                onStartDaily();
              }}
              className="mt-5 w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-cyan-300" />
              <span>Play Today&apos;s Challenge</span>
            </button>
          )}
        </div>
      </div>

      {/* Difficulty Selection Section */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Select Difficulty</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">Guaranteed Single Solution</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => {
                sound.playTap();
                onStartGame(diff.id);
              }}
              className={`p-4 rounded-3xl bg-slate-900/70 border border-slate-800 bg-gradient-to-b ${diff.gradient} text-left transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] shadow-lg ${diff.glow} flex flex-col justify-between group`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${diff.badgeColor}`}
                  >
                    {diff.name}
                  </span>
                  <div className="flex text-amber-400 text-xs">
                    {'★'.repeat(diff.stars)}
                  </div>
                </div>
                <h4 className="text-base font-bold text-white mt-3 group-hover:text-cyan-300 transition-colors">
                  {diff.name} Sudoku
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {diff.description}
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs font-semibold text-slate-300 group-hover:text-white">
                <span>Play Now</span>
                <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Statistics Dashboard Banner */}
      <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800/90 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Your Career Stats</h3>
          </div>
          <button
            onClick={() => {
              sound.playTap();
              onOpenStats();
            }}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
          >
            <span>Full Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Played
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-white mt-1 block">
              {stats.gamesPlayed}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Completed
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 mt-1 block">
              {stats.gamesWon}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Win Rate
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 mt-1 block">
              {winRate}%
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Best Time
            </span>
            <span className="text-base sm:text-lg font-bold font-mono text-amber-300 mt-2 block">
              {formatTime(bestOverallTime)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Streak
            </span>
            <span className="text-xl sm:text-2xl font-bold font-mono text-orange-400 mt-1 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-orange-400 inline" />
              {stats.currentStreak}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

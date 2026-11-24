import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Clock, AlertCircle, Lightbulb, Play, Home, Award } from 'lucide-react';
import type { Achievement, Difficulty } from '../types/sudoku';
import { sound } from '../utils/sound';

interface VictoryModalProps {
  difficulty: Difficulty;
  timeTaken: number;
  mistakes: number;
  hintsUsed: number;
  newAchievements: Achievement[];
  onPlayAgain: () => void;
  onGoHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  difficulty,
  timeTaken,
  mistakes,
  hintsUsed,
  newAchievements,
  onPlayAgain,
  onGoHome,
}) => {
  useEffect(() => {
    sound.playWin();

    const end = Date.now() + 2.5 * 1000;
    const colors = ['#8B5CF6', '#3B82F6', '#06B6D4', '#EC4899', '#F97316', '#10B981', '#FDE047'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, []);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins}m ${s}s`;
  };

  const calculateStars = () => {
    if (mistakes === 0 && hintsUsed === 0) return 3;
    if (mistakes <= 1 && hintsUsed <= 2) return 2;
    return 1;
  };
  const stars = calculateStars();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-purple-500/40 shadow-2xl shadow-purple-950/80 text-center relative overflow-hidden animate-pop">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none" />

        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4 rounded-3xl bg-gradient-to-tr from-amber-500 via-purple-600 to-pink-500 p-1 shadow-xl shadow-amber-500/20">
          <div className="w-full h-full bg-slate-950 rounded-[20px] flex items-center justify-center">
            <Trophy className="w-10 h-10 text-amber-400 animate-bounce" />
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Outstanding Victory!
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          You brilliantly cracked this {difficulty.toUpperCase()} Sudoku puzzle!
        </p>

        <div className="flex items-center justify-center gap-1.5 my-4">
          {[1, 2, 3].map((star) => (
            <span
              key={star}
              className={`text-2xl ${star <= stars ? 'text-amber-400 scale-110' : 'text-slate-700'}`}
            >
              ★
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2.5 my-4 p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-400 text-[11px] font-semibold">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Time</span>
            </div>
            <span className="font-mono font-bold text-slate-100 text-sm mt-1">
              {formatTime(timeTaken)}
            </span>
          </div>

          <div className="flex flex-col items-center border-x border-slate-700/50">
            <div className="flex items-center gap-1 text-slate-400 text-[11px] font-semibold">
              <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
              <span>Mistakes</span>
            </div>
            <span className="font-mono font-bold text-slate-100 text-sm mt-1">
              {mistakes}
            </span>
          </div>

          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-slate-400 text-[11px] font-semibold">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>Hints</span>
            </div>
            <span className="font-mono font-bold text-slate-100 text-sm mt-1">
              {hintsUsed}
            </span>
          </div>
        </div>

        {newAchievements && newAchievements.length > 0 && (
          <div className="mb-5 p-3 rounded-2xl bg-purple-950/60 border border-purple-500/40 text-left">
            <div className="flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider mb-1">
              <Award className="w-4 h-4" />
              <span>Achievement Unlocked!</span>
            </div>
            {newAchievements.map((ach) => (
              <div key={ach.id} className="text-xs text-slate-200 font-semibold">
                ✨ {ach.title} — {ach.description}
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={() => {
              sound.playTap();
              onPlayAgain();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Play Next</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onGoHome();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-purple-400" />
            <span>Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};

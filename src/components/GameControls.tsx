import React from 'react';
import {
  RotateCcw,
  RotateCw,
  Eraser,
  Pencil,
  Lightbulb,
  Pause,
  Play,
  RefreshCw,
  PlusCircle,
  Clock,
  AlertCircle,
} from 'lucide-react';
import type { Difficulty, GameSettings, HintResult, ThemeConfig } from '../types/sudoku';
import { sound } from '../utils/sound';

interface GameControlsProps {
  difficulty: Difficulty;
  isDaily: boolean;
  timer: number;
  isPaused: boolean;
  mistakes: number;
  hintsUsed: number;
  isNotesMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  remainingDigits: Record<number, number>;
  activeHint: HintResult | null;
  settings: GameSettings;
  theme: ThemeConfig;
  onNumberInput: (num: number) => void;
  onErase: () => void;
  onToggleNotes: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onRequestHint: () => void;
  onCloseHint: () => void;
  onTogglePause: () => void;
  onRestart: () => void;
  onNewGame: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  isDaily,
  timer,
  isPaused,
  mistakes,
  hintsUsed,
  isNotesMode,
  canUndo,
  canRedo,
  remainingDigits,
  activeHint,
  settings,
  onNumberInput,
  onErase,
  onToggleNotes,
  onUndo,
  onRedo,
  onRequestHint,
  onCloseHint,
  onTogglePause,
  onRestart,
  onNewGame,
}) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const difficultyColors: Record<Difficulty, string> = {
    easy: 'from-emerald-500 to-teal-500 text-emerald-300 border-emerald-500/30',
    medium: 'from-blue-500 to-cyan-500 text-blue-300 border-blue-500/30',
    hard: 'from-orange-500 to-amber-500 text-orange-300 border-orange-500/30',
    expert: 'from-rose-500 to-purple-600 text-rose-300 border-rose-500/30',
  };

  return (
    <div className="w-full max-w-[480px] sm:max-w-[510px] mx-auto flex flex-col gap-3 select-none">
      {/* Top Status Banner */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
        {/* Difficulty Badge */}
        <div className="flex items-center gap-1.5">
          <span
            className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider border ${
              difficultyColors[difficulty] || difficultyColors.medium
            } bg-slate-800/70`}
          >
            {isDaily ? 'Daily Challenge' : difficulty}
          </span>
        </div>

        {/* Mistakes Counter */}
        <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold">
          <AlertCircle className={`w-4 h-4 ${mistakes > 0 ? 'text-rose-400' : 'text-slate-400'}`} />
          <span className="text-slate-400">Mistakes:</span>
          <span className={`font-mono ${mistakes > 0 ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>
            {mistakes}
            {settings.threeMistakesMode ? '/3' : ''}
          </span>
        </div>

        {/* Timer & Pause */}
        {settings.showTimer && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playTap();
                onTogglePause();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-all text-xs font-mono font-bold border border-slate-700/60 shadow-sm"
              title={isPaused ? 'Resume Game' : 'Pause Game'}
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>{formatTime(timer)}</span>
              {isPaused ? <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3 h-3 text-slate-400" />}
            </button>
          </div>
        )}
      </div>

      {/* Active Hint Tooltip / Modal if open */}
      {activeHint && (
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/90 via-indigo-900/90 to-purple-950/90 border border-purple-500/40 shadow-xl backdrop-blur-md animate-pop">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-300 shrink-0 animate-bounce" />
              <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                Hint: {activeHint.technique}
              </span>
            </div>
            <button
              onClick={onCloseHint}
              className="text-xs text-slate-400 hover:text-slate-200 font-bold px-2 py-0.5 rounded-lg bg-slate-800/60"
            >
              Dismiss
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed">
            {activeHint.explanation}
          </p>
        </div>
      )}

      {/* Actions Toolbar */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        <button
          onClick={() => {
            sound.playTap();
            onUndo();
          }}
          disabled={!canUndo || isPaused}
          className={`flex flex-col items-center justify-center py-2.5 rounded-2xl border transition-all duration-150 ${
            canUndo && !isPaused
              ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60 text-slate-200 hover:scale-105 active:scale-95'
              : 'bg-slate-900/40 border-slate-800/40 text-slate-600 cursor-not-allowed opacity-50'
          }`}
          title="Undo Move (Ctrl+Z)"
        >
          <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          <span className="text-[10px] sm:text-xs font-semibold mt-1">Undo</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onRedo();
          }}
          disabled={!canRedo || isPaused}
          className={`flex flex-col items-center justify-center py-2.5 rounded-2xl border transition-all duration-150 ${
            canRedo && !isPaused
              ? 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60 text-slate-200 hover:scale-105 active:scale-95'
              : 'bg-slate-900/40 border-slate-800/40 text-slate-600 cursor-not-allowed opacity-50'
          }`}
          title="Redo Move (Ctrl+Y)"
        >
          <RotateCw className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          <span className="text-[10px] sm:text-xs font-semibold mt-1">Redo</span>
        </button>

        <button
          onClick={() => {
            sound.playErase();
            onErase();
          }}
          disabled={isPaused}
          className="flex flex-col items-center justify-center py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-rose-300 hover:scale-105 active:scale-95 transition-all duration-150"
          title="Erase (Backspace / Delete)"
        >
          <Eraser className="w-4 h-4 sm:w-5 sm:h-5 text-rose-400" />
          <span className="text-[10px] sm:text-xs font-semibold mt-1">Erase</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onToggleNotes();
          }}
          disabled={isPaused}
          className={`relative flex flex-col items-center justify-center py-2.5 rounded-2xl border transition-all duration-150 ${
            isNotesMode
              ? 'bg-purple-600 border-purple-400 text-white shadow-lg shadow-purple-600/40 scale-105 ring-2 ring-purple-400/50'
              : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/60 text-slate-200 hover:scale-105 active:scale-95'
          }`}
          title="Toggle Notes / Pencil Mode (N)"
        >
          <Pencil className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
          <span className="text-[10px] sm:text-xs font-semibold mt-1">
            Notes {isNotesMode ? 'ON' : 'OFF'}
          </span>
          {isNotesMode && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          )}
        </button>

        <button
          onClick={() => {
            sound.playHint();
            onRequestHint();
          }}
          disabled={isPaused}
          className="flex flex-col items-center justify-center py-2.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-amber-300 hover:scale-105 active:scale-95 transition-all duration-150"
          title="Smart Hint (H)"
        >
          <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          <span className="text-[10px] sm:text-xs font-semibold mt-1">
            Hint {hintsUsed > 0 ? `(${hintsUsed})` : ''}
          </span>
        </button>
      </div>

      {/* Number Pad (1-9) */}
      <div className="grid grid-cols-9 gap-1 sm:gap-2 p-1.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md">
        {Array.from({ length: 9 }).map((_, idx) => {
          const num = idx + 1;
          const remaining = remainingDigits[num] ?? 9;
          const isExhausted = remaining <= 0;

          return (
            <button
              key={num}
              type="button"
              disabled={isExhausted || isPaused}
              onClick={() => {
                if (isNotesMode) {
                  sound.playNote();
                } else {
                  sound.playNumber(num);
                }
                onNumberInput(num);
              }}
              className={`flex flex-col items-center justify-center py-2.5 sm:py-3 rounded-xl sm:rounded-2xl transition-all duration-150 select-none ${
                isExhausted
                  ? 'bg-slate-900/40 text-slate-600 opacity-40 cursor-not-allowed border border-slate-800/20'
                  : 'bg-slate-800/90 hover:bg-purple-600/40 border border-slate-700/60 text-slate-100 font-extrabold hover:border-purple-400 hover:scale-105 active:scale-95 shadow-md'
              }`}
              title={`Place ${num} (${remaining} remaining)`}
            >
              <span className="text-lg sm:text-2xl font-['JetBrains_Mono',monospace] leading-none">
                {num}
              </span>
              <span className="text-[9px] sm:text-[10px] text-slate-400 mt-0.5 leading-none font-semibold">
                {isExhausted ? '✓' : remaining}
              </span>
            </button>
          );
        })}
      </div>

      {/* Secondary Controls: Restart & New Game */}
      <div className="flex items-center justify-between gap-2 px-1">
        <button
          onClick={() => {
            sound.playTap();
            onRestart();
          }}
          disabled={isPaused}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/60 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 text-xs font-semibold transition-all hover:scale-105 active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          <span>Restart</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onNewGame();
          }}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-600/80 hover:bg-purple-500 border border-purple-400/50 text-white text-xs font-semibold shadow-md shadow-purple-600/20 transition-all hover:scale-105 active:scale-95"
        >
          <PlusCircle className="w-3.5 h-3.5 text-cyan-300" />
          <span>New Game</span>
        </button>
      </div>
    </div>
  );
};

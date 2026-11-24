import React from 'react';
import { AlertTriangle, RotateCcw, PlusCircle, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/sound';

interface GameOverModalProps {
  onRestart: () => void;
  onNewGame: () => void;
  onContinueRelaxed: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  onRestart,
  onNewGame,
  onContinueRelaxed,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm p-6 rounded-3xl bg-slate-900 border border-rose-500/40 shadow-2xl text-center animate-pop">
        <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <h3 className="text-xl font-extrabold text-white">Three Mistakes Made</h3>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          You reached the 3-mistake limit. Don&apos;t worry, Sudoku takes patience!
        </p>

        <div className="flex flex-col gap-2.5 mt-5">
          <button
            onClick={() => {
              sound.playTap();
              onContinueRelaxed();
            }}
            className="py-2.5 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm transition-all shadow-md shadow-purple-600/30 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-cyan-300" />
            <span>Continue in Casual Mode</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onRestart();
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 text-purple-400" />
            <span>Restart Puzzle</span>
          </button>

          <button
            onClick={() => {
              sound.playTap();
              onNewGame();
            }}
            className="py-2.5 px-4 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-800 text-slate-400 font-medium text-xs transition-all flex items-center justify-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Start New Game</span>
          </button>
        </div>
      </div>
    </div>
  );
};


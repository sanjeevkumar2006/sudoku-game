import React from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { sound } from '../utils/sound';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
  timer: number;
}

export const PauseOverlay: React.FC<PauseOverlayProps> = ({ onResume, onRestart, timer }) => {
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 rounded-3xl bg-slate-950/85 backdrop-blur-md border border-purple-500/20 animate-pop">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-xl shadow-purple-600/20">
          <Play className="w-8 h-8 fill-purple-400 ml-1" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">Game Paused</h2>
        <p className="text-slate-400 text-sm mt-1">Take a breath, your progress is safely saved!</p>
        <div className="mt-3 inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-sm font-bold">
          Elapsed: {formatTime(timer)}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-6 w-full max-w-xs">
        <button
          onClick={() => {
            sound.playTap();
            onResume();
          }}
          className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-purple-600/30 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Resume Game</span>
        </button>

        <button
          onClick={() => {
            sound.playTap();
            onRestart();
          }}
          className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-4 h-4 text-purple-400" />
          <span>Restart</span>
        </button>
      </div>
    </div>
  );
};


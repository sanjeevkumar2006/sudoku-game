import React from 'react';
import { X, CheckCircle, Sparkles, BookOpen, Layers } from 'lucide-react';
import { sound } from '../utils/sound';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-purple-500/30 shadow-2xl relative animate-pop text-slate-100 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">How to Play Sudoku</h3>
              <p className="text-xs text-slate-400">Rules, techniques, and smart tips</p>
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

        <div className="overflow-y-auto space-y-4 py-4 pr-1 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 font-bold text-cyan-300 text-sm mb-1">
              <CheckCircle className="w-4 h-4 text-cyan-400" />
              <span>1. The Core Objective</span>
            </div>
            <p>
              Fill the 9×9 grid so that every <strong>row</strong>, every <strong>column</strong>, and every <strong>3×3 box</strong> contains all numbers from <strong>1 to 9</strong> without any repetitions.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 font-bold text-purple-300 text-sm mb-1">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>2. Pencil Notes Mode</span>
            </div>
            <p>
              Click the <strong>Notes/Pencil</strong> button (or press key <strong>N</strong>) to toggle candidate marking. In notes mode, entering numbers marks potential candidates in miniature 3×3 grids inside empty cells.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 font-bold text-amber-300 text-sm mb-1">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>3. Strategy: Naked Single</span>
            </div>
            <p>
              If a cell has 8 different numbers already present in its intersecting row, column, and 3×3 box, only 1 valid number remains. That number must go in that cell!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="flex items-center gap-2 font-bold text-emerald-300 text-sm mb-1">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>4. Strategy: Hidden Single</span>
            </div>
            <p>
              Look at a 3×3 box or row. If a certain number (e.g., 7) can only legally fit into a single cell within that box because other positions are blocked, place it there!
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <h4 className="font-bold text-white text-sm mb-2">Keyboard Shortcuts</h4>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div><strong className="text-purple-400">1–9:</strong> Place Number</div>
              <div><strong className="text-purple-400">Arrows:</strong> Move Cell</div>
              <div><strong className="text-purple-400">Backspace:</strong> Erase</div>
              <div><strong className="text-purple-400">N:</strong> Notes Mode</div>
              <div><strong className="text-purple-400">Ctrl+Z:</strong> Undo</div>
              <div><strong className="text-purple-400">H:</strong> Smart Hint</div>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="mt-2 w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shrink-0"
        >
          Got it! Let&apos;s Play
        </button>
      </div>
    </div>
  );
};

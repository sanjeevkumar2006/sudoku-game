import React, { memo } from 'react';
import type { CellCoord, GameSettings, Grid, NotesGrid, ThemeConfig } from '../types/sudoku';
import { sound } from '../utils/sound';

interface SudokuBoardProps {
  board: Grid;
  initialBoard: Grid;
  notes: NotesGrid;
  selectedCell: CellCoord | null;
  onSelectCell: (coord: CellCoord) => void;
  conflicts: Set<string>;
  mistakeCells: Set<string>;
  hintCell: CellCoord | null;
  settings: GameSettings;
  theme: ThemeConfig;
  isPaused: boolean;
}

export const SudokuBoard: React.FC<SudokuBoardProps> = memo(({
  board,
  initialBoard,
  notes,
  selectedCell,
  onSelectCell,
  conflicts,
  mistakeCells,
  hintCell,
  settings,
  isPaused,
}) => {
  const selectedValue = selectedCell ? board[selectedCell.row][selectedCell.col] : 0;

  const handleCellClick = (r: number, c: number) => {
    if (isPaused) return;
    sound.playTap();
    onSelectCell({ row: r, col: c });
  };

  return (
    <div className="relative w-full max-w-[440px] sm:max-w-[480px] md:max-w-[510px] mx-auto aspect-square p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl shadow-2xl transition-all duration-300 backdrop-blur-xl border border-white/10 select-none bg-slate-900/80">
      {/* 9x9 Grid Container */}
      <div className="w-full h-full grid grid-cols-9 grid-rows-9 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-800/40 border border-slate-700/50">
        {Array.from({ length: 9 }).map((_, r) =>
          Array.from({ length: 9 }).map((_, c) => {
            const val = board[r][c];
            const isInitial = initialBoard[r][c] !== 0;
            const isSelected = selectedCell?.row === r && selectedCell?.col === c;
            const isSameRow = selectedCell?.row === r;
            const isSameCol = selectedCell?.col === c;
            const isSameBox =
              selectedCell &&
              Math.floor(selectedCell.row / 3) === Math.floor(r / 3) &&
              Math.floor(selectedCell.col / 3) === Math.floor(c / 3);
            const isRelatedArea = settings.highlightAreas && (isSameRow || isSameCol || isSameBox);

            const isMatchingNumber =
              settings.highlightMatching && selectedValue !== 0 && val === selectedValue;
            const isConflict = settings.highlightDuplicates && conflicts.has(`${r},${c}`);
            const isMistake = mistakeCells.has(`${r},${c}`);
            const isHinted = hintCell?.row === r && hintCell?.col === c;

            // Border styling to mark 3x3 boxes cleanly
            const borderRight = (c + 1) % 3 === 0 && c !== 8 ? 'border-r-2 sm:border-r-[3px] border-slate-600/80' : 'border-r border-slate-800/50';
            const borderBottom = (r + 1) % 3 === 0 && r !== 8 ? 'border-b-2 sm:border-b-[3px] border-slate-600/80' : 'border-b border-slate-800/50';

            // Background & text class computation
            let bgClass = 'bg-slate-900/60 hover:bg-slate-800/80';
            let textClass = isInitial ? 'text-purple-300 font-extrabold' : 'text-cyan-400 font-bold';

            if (settings.darkMode) {
              if (isInitial) {
                bgClass = 'bg-slate-900/80';
                textClass = 'text-purple-200 font-black';
              } else {
                bgClass = 'bg-slate-900/50';
                textClass = 'text-cyan-300 font-bold';
              }
            } else {
              if (isInitial) {
                bgClass = 'bg-slate-100 text-purple-900 font-extrabold';
                textClass = 'text-purple-900 font-black';
              } else {
                bgClass = 'bg-white text-blue-600 font-bold';
                textClass = 'text-blue-600 font-bold';
              }
            }

            if (isRelatedArea && !isSelected) {
              bgClass = settings.darkMode ? 'bg-purple-950/35' : 'bg-purple-100/60';
            }

            if (isMatchingNumber && !isSelected) {
              bgClass = settings.darkMode
                ? 'bg-purple-600/35 ring-1 ring-purple-400/50'
                : 'bg-purple-200 ring-1 ring-purple-500';
            }

            if (isConflict || isMistake) {
              bgClass = 'bg-rose-500/25 ring-2 ring-rose-500/80 animate-shake';
              textClass = 'text-rose-400 font-extrabold';
            }

            if (isHinted) {
              bgClass = 'bg-amber-500/30 ring-2 ring-amber-400 animate-pulse';
            }

            if (isSelected) {
              bgClass = settings.darkMode
                ? 'bg-purple-600/50 ring-2 sm:ring-[3px] ring-purple-400 z-10'
                : 'bg-purple-300 ring-2 ring-purple-600 z-10';
            }

            const cellNotes = notes[r][c];

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => handleCellClick(r, c)}
                className={`relative flex items-center justify-center cursor-pointer transition-colors duration-150 text-base sm:text-xl md:text-2xl font-['JetBrains_Mono',monospace] ${borderRight} ${borderBottom} ${bgClass}`}
                aria-label={`Cell Row ${r + 1} Col ${c + 1}, Value ${val || 'Empty'}`}
              >
                {val !== 0 ? (
                  <span
                    className={`transform transition-transform duration-100 ${
                      isSelected ? 'scale-110' : 'scale-100'
                    } ${textClass}`}
                  >
                    {val}
                  </span>
                ) : cellNotes && cellNotes.length > 0 ? (
                  <div className="w-full h-full p-0.5 sm:p-1 grid grid-cols-3 grid-rows-3 pointer-events-none">
                    {Array.from({ length: 9 }).map((_, idx) => {
                      const noteNum = idx + 1;
                      const hasNote = cellNotes.includes(noteNum);
                      return (
                        <div
                          key={noteNum}
                          className="flex items-center justify-center text-[8px] sm:text-[10px] md:text-[11px] font-semibold text-slate-400 leading-none"
                        >
                          {hasNote ? noteNum : ''}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
});

SudokuBoard.displayName = 'SudokuBoard';

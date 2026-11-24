import React from 'react';
import { X, Settings as SettingsIcon, Palette, ShieldAlert, Trash2, Eye } from 'lucide-react';
import type { GameSettings, ThemeId } from '../types/sudoku';
import { THEMES } from '../utils/themes';
import { sound } from '../utils/sound';

interface SettingsModalProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onResetStats: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  onUpdateSettings,
  onResetStats,
  onClose,
}) => {
  const handleToggle = (key: keyof GameSettings) => {
    sound.playToggle();
    onUpdateSettings({ [key]: !settings[key] });
  };

  const handleTheme = (theme: ThemeId) => {
    sound.playToggle();
    onUpdateSettings({ theme });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg p-6 rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl relative animate-pop text-slate-100 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-300">
              <SettingsIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Game Settings</h3>
              <p className="text-xs text-slate-400">Visuals, assists, and audio preferences</p>
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

        <div className="overflow-y-auto space-y-4 py-4 pr-1 flex-1 text-sm">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-purple-400" />
              <span>Colour Theme</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(THEMES).map((thm) => (
                <button
                  key={thm.id}
                  onClick={() => handleTheme(thm.id)}
                  className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                    settings.theme === thm.id
                      ? 'bg-purple-600/30 border-purple-400 text-white ring-1 ring-purple-400'
                      : 'bg-slate-800/60 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{thm.name}</span>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-white/20"
                    style={{ backgroundColor: thm.accent }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-cyan-400" />
              <span>Visual Assists</span>
            </span>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block text-xs sm:text-sm">
                  Auto-Check Mistakes
                </span>
                <span className="text-[11px] text-slate-400">Instantly flag numbers that conflict with solution</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoCheckMistakes}
                onChange={() => handleToggle('autoCheckMistakes')}
                className="w-5 h-5 accent-purple-600 cursor-pointer rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block text-xs sm:text-sm">
                  Highlight Duplicates
                </span>
                <span className="text-[11px] text-slate-400">Show duplicate entries in the same row/col/box</span>
              </div>
              <input
                type="checkbox"
                checked={settings.highlightDuplicates}
                onChange={() => handleToggle('highlightDuplicates')}
                className="w-5 h-5 accent-purple-600 cursor-pointer rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block text-xs sm:text-sm">
                  Highlight Related Cells
                </span>
                <span className="text-[11px] text-slate-400">Highlight selected cell&apos;s row, column & 3×3 box</span>
              </div>
              <input
                type="checkbox"
                checked={settings.highlightAreas}
                onChange={() => handleToggle('highlightAreas')}
                className="w-5 h-5 accent-purple-600 cursor-pointer rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block text-xs sm:text-sm">
                  Highlight Matching Digits
                </span>
                <span className="text-[11px] text-slate-400">Glow all identical digits across the board</span>
              </div>
              <input
                type="checkbox"
                checked={settings.highlightMatching}
                onChange={() => handleToggle('highlightMatching')}
                className="w-5 h-5 accent-purple-600 cursor-pointer rounded"
              />
            </div>
          </div>

          <div className="space-y-3 pt-2 border-t border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Game Rules & Sound</span>
            </span>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block text-xs sm:text-sm">
                  3-Mistakes Limit Mode
                </span>
                <span className="text-[11px] text-slate-400">Game over if 3 incorrect entries are made</span>
              </div>
              <input
                type="checkbox"
                checked={settings.threeMistakesMode}
                onChange={() => handleToggle('threeMistakesMode')}
                className="w-5 h-5 accent-purple-600 cursor-pointer rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block text-xs sm:text-sm">
                  Sound Effects
                </span>
                <span className="text-[11px] text-slate-400">Synthesized audio for clicks and wins</span>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={() => handleToggle('soundEnabled')}
                className="w-5 h-5 accent-purple-600 cursor-pointer rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-200 block text-xs sm:text-sm">
                  Show Timer
                </span>
                <span className="text-[11px] text-slate-400">Display elapsed time during gameplay</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showTimer}
                onChange={() => handleToggle('showTimer')}
                className="w-5 h-5 accent-purple-600 cursor-pointer rounded"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all game statistics and streaks?')) {
                  onResetStats();
                }
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Reset Career Statistics</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => {
            sound.playTap();
            onClose();
          }}
          className="mt-2 w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shrink-0"
        >
          Save & Close
        </button>
      </div>
    </div>
  );
};

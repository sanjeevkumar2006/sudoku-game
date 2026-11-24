import React from 'react';
import { Volume2, VolumeX, Moon, Sun, HelpCircle, Settings as SettingsIcon, Trophy, Award, BarChart3, Grid3X3, ArrowLeft } from 'lucide-react';
import type { GameSettings, ThemeId } from '../types/sudoku';
import { THEMES } from '../utils/themes';
import { sound } from '../utils/sound';

interface HeaderProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  currentView: 'home' | 'game';
  onNavigateHome: () => void;
  onOpenStats: () => void;
  onOpenAchievements: () => void;
  onOpenLeaderboard: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onUpdateSettings,
  currentView,
  onNavigateHome,
  onOpenStats,
  onOpenAchievements,
  onOpenLeaderboard,
  onOpenHowToPlay,
  onOpenSettings,
}) => {
  const toggleSound = () => {
    sound.enabled = !settings.soundEnabled;
    onUpdateSettings({ soundEnabled: !settings.soundEnabled });
    if (!settings.soundEnabled) {
      sound.playToggle();
    }
  };

  const toggleDarkMode = () => {
    sound.playToggle();
    onUpdateSettings({ darkMode: !settings.darkMode });
  };

  const handleThemeChange = (t: ThemeId) => {
    sound.playToggle();
    onUpdateSettings({ theme: t });
  };

  return (
    <header className="w-full max-w-5xl mx-auto px-4 py-3 flex items-center justify-between transition-all">
      {/* Left: Branding & Back Button */}
      <div className="flex items-center gap-3">
        {currentView === 'game' ? (
          <button
            onClick={() => {
              sound.playTap();
              onNavigateHome();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-200 text-sm font-semibold transition-all duration-200 shadow-sm hover:scale-105 active:scale-95"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-4 h-4 text-purple-400" />
            <span className="hidden sm:inline">Home</span>
          </button>
        ) : null}

        <div
          onClick={() => {
            sound.playTap();
            onNavigateHome();
          }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/25 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Grid3X3 className="w-5 h-5 text-purple-400 group-hover:text-cyan-300 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent">
                Sudoku Master
              </span>
              <span className="hidden md:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block -mt-0.5">Modern • Intelligent • Aesthetic</p>
          </div>
        </div>
      </div>

      {/* Right: Quick actions & Navigation */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Themes picker dropdown */}
        <div className="relative group">
          <select
            value={settings.theme}
            onChange={(e) => handleThemeChange(e.target.value as ThemeId)}
            className="appearance-none bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold px-2.5 py-1.5 pr-6 rounded-xl border border-slate-700/60 text-slate-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
            aria-label="Theme selector"
          >
            {Object.values(THEMES).map((thm) => (
              <option key={thm.id} value={thm.id} className="bg-slate-900 text-slate-200">
                {thm.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-1.5 text-slate-400">
            <span className="text-[10px]">▼</span>
          </div>
        </div>

        {/* Leaderboard */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenLeaderboard();
          }}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-amber-400 transition-all hover:scale-105 active:scale-95"
          title="Leaderboards"
        >
          <Trophy className="w-4 h-4" />
        </button>

        {/* Achievements */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenAchievements();
          }}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-purple-400 transition-all hover:scale-105 active:scale-95"
          title="Achievements"
        >
          <Award className="w-4 h-4" />
        </button>

        {/* Statistics */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenStats();
          }}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-cyan-400 transition-all hover:scale-105 active:scale-95"
          title="Statistics"
        >
          <BarChart3 className="w-4 h-4" />
        </button>

        {/* Sound toggle */}
        <button
          onClick={toggleSound}
          className={`p-2 rounded-xl border transition-all hover:scale-105 active:scale-95 ${
            settings.soundEnabled
              ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700/60 text-emerald-400'
              : 'bg-slate-800/40 hover:bg-slate-800 border-slate-800 text-slate-500'
          }`}
          title={settings.soundEnabled ? 'Mute Sound FX' : 'Enable Sound FX'}
        >
          {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-amber-300 transition-all hover:scale-105 active:scale-95"
          title={settings.darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {settings.darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* How to Play */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenHowToPlay();
          }}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 transition-all hover:scale-105 active:scale-95"
          title="How to Play"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        {/* Settings */}
        <button
          onClick={() => {
            sound.playTap();
            onOpenSettings();
          }}
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 text-slate-300 transition-all hover:scale-105 active:scale-95"
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

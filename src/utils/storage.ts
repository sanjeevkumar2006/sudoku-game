import type {
  Achievement,
  DailyChallengeStatus,
  Difficulty,
  GameSettings,
  GameStats,
  SavedGameState,
} from '../types/sudoku';

const STORAGE_KEYS = {
  ACTIVE_GAME: 'sudoku_active_game_v1',
  STATS: 'sudoku_stats_v1',
  SETTINGS: 'sudoku_settings_v1',
  DAILY: 'sudoku_daily_v1',
  ACHIEVEMENTS: 'sudoku_achievements_v1',
};

export const DEFAULT_SETTINGS: GameSettings = {
  darkMode: true,
  theme: 'cosmic',
  soundEnabled: true,
  animationsEnabled: true,
  autoCheckMistakes: true,
  highlightDuplicates: true,
  highlightAreas: true,
  highlightMatching: true,
  threeMistakesMode: true,
  showTimer: true,
};

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
  lastPlayedDate: '',
  byDifficulty: {
    easy: { played: 0, won: 0, bestTime: 0, totalTime: 0 },
    medium: { played: 0, won: 0, bestTime: 0, totalTime: 0 },
    hard: { played: 0, won: 0, bestTime: 0, totalTime: 0 },
    expert: { played: 0, won: 0, bestTime: 0, totalTime: 0 },
  },
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_win',
    title: 'First Step to Mastery',
    description: 'Complete your first Sudoku puzzle',
    iconName: 'Trophy',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'speed_demon',
    title: 'Speed Demon',
    description: 'Solve any puzzle in under 5 minutes (300s)',
    iconName: 'Zap',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'flawless',
    title: 'Flawless Mind',
    description: 'Solve a puzzle without making any mistakes',
    iconName: 'ShieldCheck',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'expert_victor',
    title: 'Grandmaster',
    description: 'Win a puzzle on Expert difficulty',
    iconName: 'Crown',
    unlocked: false,
    progress: 0,
    target: 1,
  },
  {
    id: 'daily_champion',
    title: 'Daily Dedication',
    description: 'Complete 3 Daily Challenges',
    iconName: 'CalendarCheck',
    unlocked: false,
    progress: 0,
    target: 3,
  },
  {
    id: 'streak_five',
    title: 'Unstoppable Momentum',
    description: 'Achieve a winning streak of 5 games',
    iconName: 'Flame',
    unlocked: false,
    progress: 0,
    target: 5,
  },
  {
    id: 'ten_wins',
    title: 'Sudoku Veteran',
    description: 'Win 10 Sudoku puzzles in total',
    iconName: 'Award',
    unlocked: false,
    progress: 0,
    target: 10,
  },
  {
    id: 'no_hints',
    title: 'Pure Intuition',
    description: 'Solve a Hard or Expert puzzle without using any hints',
    iconName: 'Sparkles',
    unlocked: false,
    progress: 0,
    target: 1,
  },
];

export function loadSavedGame(): SavedGameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_GAME);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.board && !parsed.isCompleted) {
      return parsed as SavedGameState;
    }
  } catch {
    // Ignore
  }
  return null;
}

export function saveActiveGame(state: SavedGameState | null) {
  try {
    if (!state || state.isCompleted) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_GAME);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_GAME, JSON.stringify(state));
    }
  } catch {
    // Ignore
  }
}

export function clearActiveGame() {
  try {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_GAME);
  } catch {
    // Ignore
  }
}

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // Fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings) {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATS,
        ...parsed,
        byDifficulty: {
          ...DEFAULT_STATS.byDifficulty,
          ...(parsed.byDifficulty || {}),
        },
      };
    }
  } catch {
    // Fallback
  }
  return DEFAULT_STATS;
}

export function recordGameWin(
  difficulty: Difficulty,
  timeTaken: number,
  mistakes: number,
  hintsUsed: number
): { stats: GameStats; newlyUnlocked: Achievement[] } {
  const stats = loadStats();
  const achievements = loadAchievements();
  const today = new Date().toISOString().split('T')[0];

  stats.gamesPlayed++;
  stats.gamesWon++;

  stats.currentStreak++;
  if (stats.currentStreak > stats.bestStreak) {
    stats.bestStreak = stats.currentStreak;
  }
  stats.lastPlayedDate = today;

  const diffStats = stats.byDifficulty[difficulty] || { played: 0, won: 0, bestTime: 0, totalTime: 0 };
  diffStats.played++;
  diffStats.won++;
  diffStats.totalTime += timeTaken;
  if (diffStats.bestTime === 0 || timeTaken < diffStats.bestTime) {
    diffStats.bestTime = timeTaken;
  }
  stats.byDifficulty[difficulty] = diffStats;

  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch {}

  const newlyUnlocked: Achievement[] = [];

  achievements.forEach((ach) => {
    if (ach.unlocked) return;

    if (ach.id === 'first_win') {
      ach.progress = stats.gamesWon;
      if (ach.progress >= ach.target) {
        ach.unlocked = true;
        ach.unlockedAt = today;
        newlyUnlocked.push(ach);
      }
    } else if (ach.id === 'speed_demon') {
      if (timeTaken <= 300) {
        ach.progress = 1;
        ach.unlocked = true;
        ach.unlockedAt = today;
        newlyUnlocked.push(ach);
      }
    } else if (ach.id === 'flawless') {
      if (mistakes === 0) {
        ach.progress = 1;
        ach.unlocked = true;
        ach.unlockedAt = today;
        newlyUnlocked.push(ach);
      }
    } else if (ach.id === 'expert_victor') {
      if (difficulty === 'expert') {
        ach.progress = 1;
        ach.unlocked = true;
        ach.unlockedAt = today;
        newlyUnlocked.push(ach);
      }
    } else if (ach.id === 'streak_five') {
      ach.progress = stats.currentStreak;
      if (stats.currentStreak >= 5) {
        ach.unlocked = true;
        ach.unlockedAt = today;
        newlyUnlocked.push(ach);
      }
    } else if (ach.id === 'ten_wins') {
      ach.progress = stats.gamesWon;
      if (stats.gamesWon >= 10) {
        ach.unlocked = true;
        ach.unlockedAt = today;
        newlyUnlocked.push(ach);
      }
    } else if (ach.id === 'no_hints') {
      if ((difficulty === 'hard' || difficulty === 'expert') && hintsUsed === 0) {
        ach.progress = 1;
        ach.unlocked = true;
        ach.unlockedAt = today;
        newlyUnlocked.push(ach);
      }
    }
  });

  saveAchievements(achievements);
  return { stats, newlyUnlocked };
}

export function recordGameLoss(difficulty: Difficulty) {
  const stats = loadStats();
  stats.gamesPlayed++;
  stats.currentStreak = 0;
  if (stats.byDifficulty[difficulty]) {
    stats.byDifficulty[difficulty].played++;
  }
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch {}
  return stats;
}

export function loadAchievements(): Achievement[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    if (raw) {
      const stored: Achievement[] = JSON.parse(raw);
      return INITIAL_ACHIEVEMENTS.map((initial) => {
        const found = stored.find((s) => s.id === initial.id);
        return found ? { ...initial, ...found } : initial;
      });
    }
  } catch {}
  return INITIAL_ACHIEVEMENTS;
}

export function saveAchievements(achievements: Achievement[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  } catch {}
}

export function loadDailyStatuses(): Record<string, DailyChallengeStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {};
}

export function recordDailyCompletion(date: string, timeTaken: number, mistakes: number, difficulty: Difficulty) {
  const all = loadDailyStatuses();
  all[date] = { date, completed: true, timeTaken, mistakes, difficulty };
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(all));
  } catch {}

  const achievements = loadAchievements();
  const completedCount = Object.values(all).filter((d) => d.completed).length;
  const dailyAch = achievements.find((a) => a.id === 'daily_champion');
  if (dailyAch && !dailyAch.unlocked) {
    dailyAch.progress = completedCount;
    if (completedCount >= dailyAch.target) {
      dailyAch.unlocked = true;
      dailyAch.unlockedAt = date;
    }
    saveAchievements(achievements);
  }
}

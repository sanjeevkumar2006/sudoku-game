export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type Grid = number[][]; // 9x9 numbers 0-9
export type NotesGrid = number[][][]; // 9x9 arrays of numbers [1..9]

export interface CellCoord {
  row: number;
  col: number;
}

export interface Move {
  row: number;
  col: number;
  prevValue: number;
  newValue: number;
  prevNotes: number[];
  newNotes: number[];
}

export type ThemeId = 'cosmic' | 'emerald' | 'sunset' | 'cyberpunk' | 'classic';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  icon: string;
  bgGradient: string;
  cardBg: string;
  boardBg: string;
  cellBg: string;
  cellInitialBg: string;
  cellInitialText: string;
  cellUserText: string;
  selectedBg: string;
  highlightRelatedBg: string;
  highlightMatchingBg: string;
  conflictBg: string;
  conflictText: string;
  primaryBtn: string;
  accent: string;
}

export interface GameSettings {
  darkMode: boolean;
  theme: ThemeId;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  autoCheckMistakes: boolean;
  highlightDuplicates: boolean;
  highlightAreas: boolean; // row, column, box
  highlightMatching: boolean;
  threeMistakesMode: boolean; // 3 strikes mode vs relaxed
  showTimer: boolean;
}

export interface DifficultyStats {
  played: number;
  won: number;
  bestTime: number; // in seconds, 0 if none
  totalTime: number;
}

export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  bestStreak: number;
  lastPlayedDate: string; // YYYY-MM-DD
  byDifficulty: Record<Difficulty, DifficultyStats>;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  target: number;
}

export interface DailyChallengeStatus {
  date: string; // YYYY-MM-DD
  completed: boolean;
  timeTaken: number;
  mistakes: number;
  difficulty: Difficulty;
}

export interface SavedGameState {
  board: Grid;
  initialBoard: Grid;
  solution: Grid;
  notes: NotesGrid;
  difficulty: Difficulty;
  isDaily: boolean;
  dailyDate?: string;
  timer: number;
  mistakes: number;
  hintsUsed: number;
  history: Move[];
  historyIndex: number;
  createdAt: number;
  isCompleted: boolean;
}

export interface HintResult {
  row: number;
  col: number;
  value: number;
  technique: string;
  explanation: string;
}


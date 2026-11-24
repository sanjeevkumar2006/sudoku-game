import React, { useState, useEffect, useCallback, useRef } from 'react';
import type {
  Achievement,
  CellCoord,
  Difficulty,
  GameSettings,
  GameStats,
  Grid,
  HintResult,
  Move,
  NotesGrid,
  SavedGameState,
} from './types/sudoku';
import {
  cloneGrid,
  cloneNotes,
  createEmptyGrid,
  createEmptyNotes,
  generateDailySudoku,
  generateSudoku,
  getConflictCells,
  getRemainingDigitCounts,
  getSmartHint,
  isBoardCompleted,
} from './engine/sudoku';
import {
  clearActiveGame,
  DEFAULT_STATS,
  loadAchievements,
  loadDailyStatuses,
  loadSavedGame,
  loadSettings,
  loadStats,
  recordDailyCompletion,
  recordGameLoss,
  recordGameWin,
  saveActiveGame,
  saveSettings,
} from './utils/storage';
import { THEMES } from './utils/themes';
import { sound } from './utils/sound';

import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { SudokuBoard } from './components/SudokuBoard';
import { GameControls } from './components/GameControls';
import { PauseOverlay } from './components/PauseOverlay';
import { VictoryModal } from './components/VictoryModal';
import { GameOverModal } from './components/GameOverModal';
import { StatsModal } from './components/StatsModal';
import { AchievementsModal } from './components/AchievementsModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { SettingsModal } from './components/SettingsModal';

export const App: React.FC = () => {
  // App view
  const [currentView, setCurrentView] = useState<'home' | 'game'>('home');

  // Persistence & Config
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const [stats, setStats] = useState<GameStats>(() => loadStats());
  const [achievements, setAchievements] = useState<Achievement[]>(() => loadAchievements());
  const [savedGame, setSavedGame] = useState<SavedGameState | null>(() => loadSavedGame());

  // Active Game State
  const [board, setBoard] = useState<Grid>(() => createEmptyGrid());
  const [initialBoard, setInitialBoard] = useState<Grid>(() => createEmptyGrid());
  const [solution, setSolution] = useState<Grid>(() => createEmptyGrid());
  const [notes, setNotes] = useState<NotesGrid>(() => createEmptyNotes());
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [isDaily, setIsDaily] = useState<boolean>(false);
  const [dailyDate, setDailyDate] = useState<string>('');

  const [selectedCell, setSelectedCell] = useState<CellCoord | null>(null);
  const [isNotesMode, setIsNotesMode] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);

  // Undo / Redo History
  const [history, setHistory] = useState<Move[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Hint & Error Tracking
  const [activeHint, setActiveHint] = useState<HintResult | null>(null);
  const [mistakeCells, setMistakeCells] = useState<Set<string>>(new Set());

  // Modals
  const [showVictory, setShowVictory] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  const [showStatsModal, setShowStatsModal] = useState<boolean>(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState<boolean>(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState<boolean>(false);
  const [showHowToPlayModal, setShowHowToPlayModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  // Timer Ref
  const timerRef = useRef<number | null>(null);

  // Active Theme
  const theme = THEMES[settings.theme] || THEMES.cosmic;

  // Sound sync
  useEffect(() => {
    sound.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Update Dark Mode on <html> root element
  useEffect(() => {
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  // Check if daily challenge completed today
  const todayStr = new Date().toISOString().split('T')[0];
  const dailyStatuses = loadDailyStatuses();
  const dailyCompletedToday = !!dailyStatuses[todayStr]?.completed;

  // Timer interval handling
  useEffect(() => {
    if (currentView === 'game' && !isPaused && !showVictory && !showGameOver) {
      timerRef.current = window.setInterval(() => {
        setTimer((t) => t + 1);
      }, 1000);
    } else if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentView, isPaused, showVictory, showGameOver]);

  // Auto-save active game to localStorage
  useEffect(() => {
    if (currentView === 'game' && !showVictory && !showGameOver && solution[0][0] !== 0) {
      const activeState: SavedGameState = {
        board,
        initialBoard,
        solution,
        notes,
        difficulty,
        isDaily,
        dailyDate,
        timer,
        mistakes,
        hintsUsed,
        history,
        historyIndex,
        createdAt: Date.now(),
        isCompleted: false,
      };
      saveActiveGame(activeState);
      setSavedGame(activeState);
    }
  }, [
    currentView,
    board,
    initialBoard,
    solution,
    notes,
    difficulty,
    isDaily,
    dailyDate,
    timer,
    mistakes,
    hintsUsed,
    history,
    historyIndex,
    showVictory,
    showGameOver,
  ]);

  // Start a new standard game
  const handleStartGame = useCallback(
    (diff: Difficulty) => {
      const { puzzle, solution: solved } = generateSudoku(diff);
      setBoard(cloneGrid(puzzle));
      setInitialBoard(cloneGrid(puzzle));
      setSolution(cloneGrid(solved));
      setNotes(createEmptyNotes());
      setDifficulty(diff);
      setIsDaily(false);
      setDailyDate('');
      setTimer(0);
      setIsPaused(false);
      setMistakes(0);
      setHintsUsed(0);
      setHistory([]);
      setHistoryIndex(-1);
      setSelectedCell({ row: 0, col: 0 });
      setActiveHint(null);
      setMistakeCells(new Set());
      setShowVictory(false);
      setShowGameOver(false);
      setNewAchievements([]);
      setCurrentView('game');
    },
    []
  );

  // Start Daily Challenge
  const handleStartDaily = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    const { puzzle, solution: solved, difficulty: diff } = generateDailySudoku(today);
    setBoard(cloneGrid(puzzle));
    setInitialBoard(cloneGrid(puzzle));
    setSolution(cloneGrid(solved));
    setNotes(createEmptyNotes());
    setDifficulty(diff);
    setIsDaily(true);
    setDailyDate(today);
    setTimer(0);
    setIsPaused(false);
    setMistakes(0);
    setHintsUsed(0);
    setHistory([]);
    setHistoryIndex(-1);
    setSelectedCell({ row: 0, col: 0 });
    setActiveHint(null);
    setMistakeCells(new Set());
    setShowVictory(false);
    setShowGameOver(false);
    setNewAchievements([]);
    setCurrentView('game');
  }, []);

  // Resume saved in-progress game
  const handleResumeGame = useCallback(() => {
    const saved = loadSavedGame();
    if (!saved) return;
    setBoard(saved.board);
    setInitialBoard(saved.initialBoard);
    setSolution(saved.solution);
    setNotes(saved.notes);
    setDifficulty(saved.difficulty);
    setIsDaily(saved.isDaily);
    setDailyDate(saved.dailyDate || '');
    setTimer(saved.timer);
    setIsPaused(false);
    setMistakes(saved.mistakes);
    setHintsUsed(saved.hintsUsed);
    setHistory(saved.history || []);
    setHistoryIndex(saved.historyIndex ?? -1);
    setSelectedCell({ row: 0, col: 0 });
    setActiveHint(null);
    setMistakeCells(new Set());
    setShowVictory(false);
    setShowGameOver(false);
    setNewAchievements([]);
    setCurrentView('game');
  }, []);

  // Check Victory
  const checkGameCompletion = useCallback(
    (currentGrid: Grid) => {
      if (isBoardCompleted(currentGrid, solution)) {
        clearActiveGame();
        setSavedGame(null);
        setShowVictory(true);

        const result = recordGameWin(difficulty, timer, mistakes, hintsUsed);
        setStats(result.stats);
        setNewAchievements(result.newlyUnlocked);
        setAchievements(loadAchievements());

        if (isDaily && dailyDate) {
          recordDailyCompletion(dailyDate, timer, mistakes, difficulty);
        }
      }
    },
    [solution, difficulty, timer, mistakes, hintsUsed, isDaily, dailyDate]
  );

  // Handle cell number input
  const handleNumberInput = useCallback(
    (num: number) => {
      if (!selectedCell || isPaused || showVictory || showGameOver) return;
      const { row, col } = selectedCell;

      if (initialBoard[row][col] !== 0) return;

      if (isNotesMode) {
        const currentNotes = [...notes[row][col]];
        const exists = currentNotes.includes(num);
        const newNotes = exists
          ? currentNotes.filter((n) => n !== num)
          : [...currentNotes, num].sort((a, b) => a - b);

        const move: Move = {
          row,
          col,
          prevValue: board[row][col],
          newValue: board[row][col],
          prevNotes: currentNotes,
          newNotes,
        };

        const updatedNotes = cloneNotes(notes);
        updatedNotes[row][col] = newNotes;
        setNotes(updatedNotes);

        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(move);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
        return;
      }

      const prevValue = board[row][col];
      if (prevValue === num) return;

      const newBoard = cloneGrid(board);
      newBoard[row][col] = num;

      const prevCellNotes = [...notes[row][col]];
      const updatedNotes = cloneNotes(notes);
      updatedNotes[row][col] = [];

      if (settings.autoCheckMistakes && num !== solution[row][col]) {
        const newMistakeCount = mistakes + 1;
        setMistakes(newMistakeCount);
        sound.playError();

        setMistakeCells((prev) => {
          const next = new Set(prev);
          next.add(`${row},${col}`);
          return next;
        });

        if (settings.threeMistakesMode && newMistakeCount >= 3) {
          recordGameLoss(difficulty);
          setStats(loadStats());
          setShowGameOver(true);
        }
      } else {
        setMistakeCells((prev) => {
          const next = new Set(prev);
          next.delete(`${row},${col}`);
          return next;
        });
      }

      const move: Move = {
        row,
        col,
        prevValue,
        newValue: num,
        prevNotes: prevCellNotes,
        newNotes: [],
      };

      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(move);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);

      setBoard(newBoard);
      setNotes(updatedNotes);

      if (activeHint && activeHint.row === row && activeHint.col === col) {
        setActiveHint(null);
      }

      checkGameCompletion(newBoard);
    },
    [
      selectedCell,
      isPaused,
      showVictory,
      showGameOver,
      initialBoard,
      isNotesMode,
      notes,
      board,
      history,
      historyIndex,
      settings.autoCheckMistakes,
      settings.threeMistakesMode,
      solution,
      mistakes,
      difficulty,
      activeHint,
      checkGameCompletion,
    ]
  );

  // Handle cell erase
  const handleErase = useCallback(() => {
    if (!selectedCell || isPaused || showVictory || showGameOver) return;
    const { row, col } = selectedCell;

    if (initialBoard[row][col] !== 0) return;

    const prevValue = board[row][col];
    const prevCellNotes = [...notes[row][col]];

    if (prevValue === 0 && prevCellNotes.length === 0) return;

    const newBoard = cloneGrid(board);
    newBoard[row][col] = 0;

    const updatedNotes = cloneNotes(notes);
    updatedNotes[row][col] = [];

    setMistakeCells((prev) => {
      const next = new Set(prev);
      next.delete(`${row},${col}`);
      return next;
    });

    const move: Move = {
      row,
      col,
      prevValue,
      newValue: 0,
      prevNotes: prevCellNotes,
      newNotes: [],
    };

    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(move);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    setBoard(newBoard);
    setNotes(updatedNotes);
  }, [selectedCell, isPaused, showVictory, showGameOver, initialBoard, board, notes, history, historyIndex]);

  // Undo
  const handleUndo = useCallback(() => {
    if (historyIndex < 0 || isPaused) return;
    const move = history[historyIndex];

    const newBoard = cloneGrid(board);
    newBoard[move.row][move.col] = move.prevValue;

    const updatedNotes = cloneNotes(notes);
    updatedNotes[move.row][move.col] = [...move.prevNotes];

    setBoard(newBoard);
    setNotes(updatedNotes);
    setSelectedCell({ row: move.row, col: move.col });
    setHistoryIndex(historyIndex - 1);
  }, [historyIndex, isPaused, history, board, notes]);

  // Redo
  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1 || isPaused) return;
    const move = history[historyIndex + 1];

    const newBoard = cloneGrid(board);
    newBoard[move.row][move.col] = move.newValue;

    const updatedNotes = cloneNotes(notes);
    updatedNotes[move.row][move.col] = [...move.newNotes];

    setBoard(newBoard);
    setNotes(updatedNotes);
    setSelectedCell({ row: move.row, col: move.col });
    setHistoryIndex(historyIndex + 1);
  }, [historyIndex, history, isPaused, board, notes]);

  // Request Smart Hint
  const handleRequestHint = useCallback(() => {
    if (isPaused || showVictory || showGameOver) return;
    const hint = getSmartHint(board, solution);
    if (hint) {
      setActiveHint(hint);
      setSelectedCell({ row: hint.row, col: hint.col });
      setHintsUsed((h) => h + 1);
    }
  }, [isPaused, showVictory, showGameOver, board, solution]);

  // Restart current puzzle
  const handleRestart = useCallback(() => {
    setBoard(cloneGrid(initialBoard));
    setNotes(createEmptyNotes());
    setTimer(0);
    setIsPaused(false);
    setMistakes(0);
    setHintsUsed(0);
    setHistory([]);
    setHistoryIndex(-1);
    setActiveHint(null);
    setMistakeCells(new Set());
    setShowVictory(false);
    setShowGameOver(false);
  }, [initialBoard]);

  // Keyboard navigation & controls
  useEffect(() => {
    if (currentView !== 'game') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'z' || e.key === 'Z')) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
        return;
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || e.key === 'Y')) {
        e.preventDefault();
        handleRedo();
        return;
      }

      if (/^[1-9]$/.test(e.key)) {
        e.preventDefault();
        handleNumberInput(parseInt(e.key, 10));
        return;
      }

      if (e.key === 'Backspace' || e.key === 'Delete') {
        e.preventDefault();
        handleErase();
        return;
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setIsNotesMode((m) => !m);
        sound.playTap();
        return;
      }

      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        handleRequestHint();
        return;
      }

      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        setIsPaused((p) => !p);
        sound.playTap();
        return;
      }

      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        setSelectedCell((curr) => {
          if (!curr) return { row: 0, col: 0 };
          let { row, col } = curr;
          if (e.key === 'ArrowUp') row = (row + 8) % 9;
          if (e.key === 'ArrowDown') row = (row + 1) % 9;
          if (e.key === 'ArrowLeft') col = (col + 8) % 9;
          if (e.key === 'ArrowRight') col = (col + 1) % 9;
          sound.playTap();
          return { row, col };
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    currentView,
    handleUndo,
    handleRedo,
    handleNumberInput,
    handleErase,
    handleRequestHint,
  ]);

  const conflicts = settings.highlightDuplicates ? getConflictCells(board) : new Set<string>();
  const remainingDigits = getRemainingDigitCounts(board);

  const handleUpdateSettings = (newSettings: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      return updated;
    });
  };

  const handleResetStats = () => {
    localStorage.removeItem('sudoku_stats_v1');
    setStats(DEFAULT_STATS);
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-500 bg-gradient-to-br ${
        theme.bgGradient
      } ${settings.darkMode ? 'text-slate-100' : 'text-slate-900 bg-slate-50'}`}
    >
      <Header
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        currentView={currentView}
        onNavigateHome={() => {
          setCurrentView('home');
          setActiveHint(null);
        }}
        onOpenStats={() => setShowStatsModal(true)}
        onOpenAchievements={() => setShowAchievementsModal(true)}
        onOpenLeaderboard={() => setShowLeaderboardModal(true)}
        onOpenHowToPlay={() => setShowHowToPlayModal(true)}
        onOpenSettings={() => setShowSettingsModal(true)}
      />

      <main className="flex-1 flex flex-col items-center justify-center py-2 px-2 sm:px-4">
        {currentView === 'home' ? (
          <HomeDashboard
            stats={stats}
            savedGame={savedGame}
            dailyCompletedToday={dailyCompletedToday}
            onStartGame={handleStartGame}
            onStartDaily={handleStartDaily}
            onResumeGame={handleResumeGame}
            onOpenStats={() => setShowStatsModal(true)}
            onOpenAchievements={() => setShowAchievementsModal(true)}
            onOpenLeaderboard={() => setShowLeaderboardModal(true)}
            onOpenHowToPlay={() => setShowHowToPlayModal(true)}
          />
        ) : (
          <div className="w-full max-w-4xl mx-auto flex flex-col lg:flex-row items-center lg:items-start justify-center gap-5 sm:gap-6">
            <div className="relative w-full max-w-[440px] sm:max-w-[480px] md:max-w-[510px]">
              <SudokuBoard
                board={board}
                initialBoard={initialBoard}
                notes={notes}
                selectedCell={selectedCell}
                onSelectCell={setSelectedCell}
                conflicts={conflicts}
                mistakeCells={mistakeCells}
                hintCell={activeHint ? { row: activeHint.row, col: activeHint.col } : null}
                settings={settings}
                theme={theme}
                isPaused={isPaused}
              />

              {isPaused && (
                <PauseOverlay
                  timer={timer}
                  onResume={() => setIsPaused(false)}
                  onRestart={handleRestart}
                />
              )}
            </div>

            <div className="w-full max-w-[480px] sm:max-w-[510px]">
              <GameControls
                difficulty={difficulty}
                isDaily={isDaily}
                timer={timer}
                isPaused={isPaused}
                mistakes={mistakes}
                hintsUsed={hintsUsed}
                isNotesMode={isNotesMode}
                canUndo={historyIndex >= 0}
                canRedo={historyIndex < history.length - 1}
                remainingDigits={remainingDigits}
                activeHint={activeHint}
                settings={settings}
                theme={theme}
                onNumberInput={handleNumberInput}
                onErase={handleErase}
                onToggleNotes={() => setIsNotesMode((m) => !m)}
                onUndo={handleUndo}
                onRedo={handleRedo}
                onRequestHint={handleRequestHint}
                onCloseHint={() => setActiveHint(null)}
                onTogglePause={() => setIsPaused((p) => !p)}
                onRestart={handleRestart}
                onNewGame={() => handleStartGame(difficulty)}
              />
            </div>
          </div>
        )}
      </main>

      <footer className="w-full text-center py-3 text-[11px] text-slate-500 font-medium">
        Sudoku Master Pro • Handcrafted with Precision & Modern Aesthetics
      </footer>

      {showVictory && (
        <VictoryModal
          difficulty={difficulty}
          timeTaken={timer}
          mistakes={mistakes}
          hintsUsed={hintsUsed}
          newAchievements={newAchievements}
          onPlayAgain={() => handleStartGame(difficulty)}
          onGoHome={() => {
            setShowVictory(false);
            setCurrentView('home');
          }}
        />
      )}

      {showGameOver && (
        <GameOverModal
          onRestart={handleRestart}
          onNewGame={() => handleStartGame(difficulty)}
          onContinueRelaxed={() => {
            handleUpdateSettings({ threeMistakesMode: false });
            setShowGameOver(false);
          }}
        />
      )}

      {showStatsModal && <StatsModal stats={stats} onClose={() => setShowStatsModal(false)} />}
      {showAchievementsModal && (
        <AchievementsModal
          achievements={achievements}
          onClose={() => setShowAchievementsModal(false)}
        />
      )}
      {showLeaderboardModal && (
        <LeaderboardModal stats={stats} onClose={() => setShowLeaderboardModal(false)} />
      )}
      {showHowToPlayModal && (
        <HowToPlayModal onClose={() => setShowHowToPlayModal(false)} />
      )}
      {showSettingsModal && (
        <SettingsModal
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          onResetStats={handleResetStats}
          onClose={() => setShowSettingsModal(false)}
        />
      )}
    </div>
  );
};

export default App;

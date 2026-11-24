import type { Difficulty, Grid, HintResult, NotesGrid } from '../types/sudoku';

/**
 * Creates an empty 9x9 grid
 */
export function createEmptyGrid(): Grid {
  return Array.from({ length: 9 }, () => Array(9).fill(0));
}

/**
 * Creates an empty 9x9 notes grid (each cell has array of candidate numbers)
 */
export function createEmptyNotes(): NotesGrid {
  return Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => []));
}

/**
 * Deep clones a 9x9 grid
 */
export function cloneGrid(grid: Grid): Grid {
  return grid.map(row => [...row]);
}

/**
 * Deep clones 9x9 notes grid
 */
export function cloneNotes(notes: NotesGrid): NotesGrid {
  return notes.map(row => row.map(cell => [...cell]));
}

/**
 * Validates if placing `num` at `(row, col)` is legally permitted in the standard Sudoku rules
 */
export function isValidPlacement(grid: Grid, row: number, col: number, num: number): boolean {
  for (let c = 0; c < 9; c++) {
    if (c !== col && grid[row][c] === num) return false;
  }
  for (let r = 0; r < 9; r++) {
    if (r !== row && grid[r][col] === num) return false;
  }
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const curR = boxRow + r;
      const curC = boxCol + c;
      if ((curR !== row || curC !== col) && grid[curR][curC] === num) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Pseudo-random number generator for seeded daily puzzles (Mulberry32)
 */
export function createPRNG(seed: number) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Shuffles an array using an optional PRNG
 */
function shuffleArray<T>(array: T[], prng?: () => number): T[] {
  const result = [...array];
  const rand = prng || Math.random;
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Solves a Sudoku grid using backtracking.
 * If randomize is true, numbers are tried in shuffled order.
 */
export function solveGrid(grid: Grid, randomize = false, prng?: () => number): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        let nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
        if (randomize) {
          nums = shuffleArray(nums, prng);
        }
        for (const num of nums) {
          if (isValidPlacement(grid, r, c, num)) {
            grid[r][c] = num;
            if (solveGrid(grid, randomize, prng)) {
              return true;
            }
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

/**
 * Counts the number of solutions to a Sudoku grid, stopping early if limit is reached.
 * Used to ensure EXACTLY ONE UNIQUE SOLUTION.
 */
export function countSolutions(grid: Grid, limit = 2): number {
  let count = 0;

  function backtrack(r = 0, c = 0): boolean {
    if (r === 9) {
      count++;
      return count >= limit;
    }
    const nextR = c === 8 ? r + 1 : r;
    const nextC = c === 8 ? 0 : c + 1;

    if (grid[r][c] !== 0) {
      return backtrack(nextR, nextC);
    }

    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(grid, r, c, num)) {
        grid[r][c] = num;
        if (backtrack(nextR, nextC)) return true;
        grid[r][c] = 0;
      }
    }
    return false;
  }

  backtrack();
  return count;
}

/**
 * Generates a full solved valid Sudoku board
 */
export function generateFullSolvedBoard(prng?: () => number): Grid {
  const board = createEmptyGrid();
  // Fill 3 diagonal boxes first for speed
  for (let box = 0; box < 9; box += 3) {
    const nums = shuffleArray([1, 2, 3, 4, 5, 6, 7, 8, 9], prng);
    let idx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        board[box + r][box + c] = nums[idx++];
      }
    }
  }
  solveGrid(board, true, prng);
  return board;
}

/**
 * Clues target count for each difficulty
 */
const CLUES_BY_DIFFICULTY: Record<Difficulty, { minClues: number; maxClues: number }> = {
  easy: { minClues: 38, maxClues: 44 },
  medium: { minClues: 31, maxClues: 36 },
  hard: { minClues: 26, maxClues: 30 },
  expert: { minClues: 23, maxClues: 26 },
};

/**
 * Generates a valid Sudoku puzzle with guaranteed UNIQUE solution.
 */
export function generateSudoku(difficulty: Difficulty, seed?: number): { puzzle: Grid; solution: Grid } {
  const prng = seed !== undefined ? createPRNG(seed) : undefined;
  const rand = prng || Math.random;

  const fullSolution = generateFullSolvedBoard(prng);
  const puzzle = cloneGrid(fullSolution);

  const { minClues, maxClues } = CLUES_BY_DIFFICULTY[difficulty];
  const targetClues = Math.floor(minClues + rand() * (maxClues - minClues + 1));

  // Generate list of all 81 positions
  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  const shuffledPositions = shuffleArray(positions, prng);

  let remainingClues = 81;

  for (const [r, c] of shuffledPositions) {
    if (remainingClues <= targetClues) break;

    const originalVal = puzzle[r][c];
    puzzle[r][c] = 0;

    // Check if the puzzle still has exactly one solution
    const testGrid = cloneGrid(puzzle);
    const solutions = countSolutions(testGrid, 2);

    if (solutions !== 1) {
      // Revert if uniqueness is violated
      puzzle[r][c] = originalVal;
    } else {
      remainingClues--;
    }
  }

  return { puzzle, solution: fullSolution };
}

/**
 * Generates Daily Sudoku based on date string (YYYY-MM-DD)
 */
export function generateDailySudoku(dateStr: string): { puzzle: Grid; solution: Grid; difficulty: Difficulty } {
  // Convert date string to integer seed
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash * 31 + dateStr.charCodeAt(i)) & 0xffffffff;
  }
  const seed = Math.abs(hash);

  // Rotate difficulty by day of week
  const date = new Date(dateStr);
  const day = isNaN(date.getDay()) ? 0 : date.getDay();
  // Mon: Easy, Tue: Medium, Wed: Hard, Thu: Medium, Fri: Hard, Sat: Expert, Sun: Expert
  const difficultyMap: Difficulty[] = ['expert', 'easy', 'medium', 'hard', 'medium', 'hard', 'expert'];
  const difficulty = difficultyMap[day] || 'medium';

  const { puzzle, solution } = generateSudoku(difficulty, seed);
  return { puzzle, solution, difficulty };
}

/**
 * Finds all conflicting cells (duplicate numbers in same row, column, or 3x3 box)
 */
export function getConflictCells(grid: Grid): Set<string> {
  const conflicts = new Set<string>();

  // Check rows
  for (let r = 0; r < 9; r++) {
    const seen = new Map<number, number[]>();
    for (let c = 0; c < 9; c++) {
      const val = grid[r][c];
      if (val !== 0) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(c);
      }
    }
    for (const cols of seen.values()) {
      if (cols.length > 1) {
        for (const c of cols) conflicts.add(`${r},${c}`);
      }
    }
  }

  // Check cols
  for (let c = 0; c < 9; c++) {
    const seen = new Map<number, number[]>();
    for (let r = 0; r < 9; r++) {
      const val = grid[r][c];
      if (val !== 0) {
        if (!seen.has(val)) seen.set(val, []);
        seen.get(val)!.push(r);
      }
    }
    for (const rows of seen.values()) {
      if (rows.length > 1) {
        for (const r of rows) conflicts.add(`${r},${c}`);
      }
    }
  }

  // Check 3x3 boxes
  for (let b = 0; b < 9; b++) {
    const boxRow = Math.floor(b / 3) * 3;
    const boxCol = (b % 3) * 3;
    const seen = new Map<number, [number, number][]>();

    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const curR = boxRow + r;
        const curC = boxCol + c;
        const val = grid[curR][curC];
        if (val !== 0) {
          if (!seen.has(val)) seen.set(val, []);
          seen.get(val)!.push([curR, curC]);
        }
      }
    }

    for (const cellList of seen.values()) {
      if (cellList.length > 1) {
        for (const [r, c] of cellList) conflicts.add(`${r},${c}`);
      }
    }
  }

  return conflicts;
}

/**
 * Calculates candidates (valid numbers) for an empty cell
 */
export function getCandidates(grid: Grid, row: number, col: number): number[] {
  if (grid[row][col] !== 0) return [];
  const candidates: number[] = [];
  for (let n = 1; n <= 9; n++) {
    if (isValidPlacement(grid, row, col, n)) {
      candidates.push(n);
    }
  }
  return candidates;
}

/**
 * Intelligent Hint generator
 */
export function getSmartHint(currentGrid: Grid, solutionGrid: Grid): HintResult | null {
  // 1. Search for Naked Singles
  let bestCell: { row: number; col: number; candidates: number[] } | null = null;

  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === 0) {
        const candidates = getCandidates(currentGrid, r, c);
        if (candidates.length === 1 && candidates[0] === solutionGrid[r][c]) {
          return {
            row: r,
            col: c,
            value: candidates[0],
            technique: 'Naked Single',
            explanation: `Row ${r + 1}, Column ${c + 1} can only be ${candidates[0]} because all other numbers (1-9) are already present in its row, column, or 3×3 box.`,
          };
        }
        if (!bestCell || candidates.length < bestCell.candidates.length) {
          bestCell = { row: r, col: c, candidates };
        }
      }
    }
  }

  // 2. Search for Hidden Singles in 3x3 boxes
  for (let b = 0; b < 9; b++) {
    const boxRow = Math.floor(b / 3) * 3;
    const boxCol = (b % 3) * 3;

    for (let num = 1; num <= 9; num++) {
      const possibleCells: [number, number][] = [];
      for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
          const cr = boxRow + r;
          const cc = boxCol + c;
          if (currentGrid[cr][cc] === 0 && isValidPlacement(currentGrid, cr, cc, num)) {
            possibleCells.push([cr, cc]);
          }
        }
      }

      if (possibleCells.length === 1) {
        const [r, c] = possibleCells[0];
        if (solutionGrid[r][c] === num) {
          return {
            row: r,
            col: c,
            value: num,
            technique: 'Hidden Single (Box)',
            explanation: `In this 3×3 box, the number ${num} can only be placed at Row ${r + 1}, Column ${c + 1}.`,
          };
        }
      }
    }
  }

  // 3. Fallback: Cell with minimum candidates from solution
  if (bestCell) {
    const correctVal = solutionGrid[bestCell.row][bestCell.col];
    return {
      row: bestCell.row,
      col: bestCell.col,
      value: correctVal,
      technique: 'Direct Solution Reveal',
      explanation: `Revealing Row ${bestCell.row + 1}, Column ${bestCell.col + 1} = ${correctVal} to advance your progress.`,
    };
  }

  return null;
}

/**
 * Checks if the board is completely and correctly solved
 */
export function isBoardCompleted(currentGrid: Grid, solutionGrid: Grid): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (currentGrid[r][c] === 0 || currentGrid[r][c] !== solutionGrid[r][c]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Counts how many of each digit (1-9) remain to be placed
 */
export function getRemainingDigitCounts(grid: Grid): Record<number, number> {
  const counts: Record<number, number> = { 1: 9, 2: 9, 3: 9, 4: 9, 5: 9, 6: 9, 7: 9, 8: 9, 9: 9 };
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = grid[r][c];
      if (val >= 1 && val <= 9) {
        counts[val]--;
      }
    }
  }
  return counts;
}

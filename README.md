# 🎮 Sudoku Master Pro — Modern, Colourful & Intelligent Sudoku

A high-performance, aesthetically pleasing, modern Sudoku gaming application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Web Audio API**.

Designed to deliver a full-featured gaming platform experience with vibrant themes, rich sound effects, real mathematical backtracking puzzle generation with guaranteed single solutions, intelligent hints, and deep player statistics.

---

## ✨ Features Overview

### 1. 🎨 Design & UI/UX
- **Vibrant Colour Palette**: Purple, Blue, Cyan, Pink, Orange, and Green accents with subtle glassmorphism and soft shadows.
- **5 Custom Board Themes**:
  - 🌌 **Cosmic Nebula** (Deep Violet & Indigo glow)
  - 🌿 **Emerald Lagoon** (Lush Mint & Teal ocean)
  - 🌅 **Sunset Horizon** (Sunset Orange & Rose Pink)
  - ⚡ **Cyberpunk Neon** (Neon Cyan, Magenta & Electric Blue)
  - 🛡️ **Royal Classic** (Elegant Indigo & Slate)
- **Light & Dark Mode**: Seamless toggle preserving high contrast and eye comfort.
- **Responsive Layout**: Pixel-perfect on desktop, tablet, and mobile devices.

### 2. 🧠 Intelligent Sudoku Engine
- **Guaranteed Unique Solution**: Real backtracking solver ensures every puzzle has exactly one valid solution.
- **4 Distinct Difficulties**:
  - **Easy**: ~38–44 given clues
  - **Medium**: ~31–36 given clues
  - **Hard**: ~26–30 given clues
  - **Expert**: ~23–26 given clues
- **Deterministic Daily Challenge**: Seeded PRNG generates the same challenge for all players daily.
- **Smart Hint System**: Analyzes *Naked Singles*, *Hidden Singles*, and logical reductions with clear textual explanations.
- **Real-Time Conflict Detection**: Instantly detects duplicate numbers in rows, columns, and 3×3 boxes.
- **Candidate Notes / Pencil Mode**: Miniature 3×3 grid candidate markings inside cells with toggle support.

### 3. 🎯 Game Controls & Keyboard Shortcuts
- **Interactive Number Pad (1–9)** with remaining count counters that automatically mark completed numbers.
- **Full History**: Multi-level **Undo** and **Redo** for both values and pencil notes.
- **Mistake Management**: 3-strikes challenge mode vs. casual mode with auto-mistake validation.
- **Timer & Pause**: Frosted glass pause overlay that protects game progress and stops the clock.
- **Keyboard Shortcuts**:
  - `1–9`: Place number (or candidate in notes mode)
  - `Arrow Keys`: Move selected cell
  - `Backspace` / `Delete`: Erase cell or notes
  - `N`: Toggle Pencil/Notes mode
  - `H`: Request smart hint
  - `Space` / `P`: Pause / Resume game
  - `Ctrl + Z`: Undo move
  - `Ctrl + Y` or `Ctrl + Shift + Z`: Redo move

### 4. 🔊 Web Audio API Procedural Synthesizer
- Zero external MP3/WAV dependencies! Uses browser `AudioContext` for instant, lag-free audio feedback:
  - Gentle tap sound on cell selection
  - Pentatonic pop when placing numbers
  - Soft wooden pencil tick for candidate notes
  - Upbeat victory fanfare arpeggio on puzzle completion
  - Error buzz on invalid placement
  - Quick mute/unmute toggle in header and settings

### 5. 🏆 Progression & Career Statistics
- **Auto-Save**: Continues ongoing puzzles seamlessly on return.
- **Career Dashboard**:
  - Games played, completed, and win percentage
  - Best completion time per difficulty
  - Current streak and best streak tracking
- **8 Unlockable Achievements**: First Win, Speed Demon (<5 min), Flawless (0 mistakes), Grandmaster (Expert win), Daily Champion, and more.
- **Global Leaderboard**: Simulated hall-of-fame times integrated with player's personal records.
- **How to Play Guide**: In-game visual tutorial on rules, naked singles, and hidden singles.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for Production
```bash
npm run build
```

### 4. Preview the Production Build
```bash
npm run preview
```

---

## 🛠️ Tech Stack
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Confetti Celebration**: [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Audio Engine**: Web Audio API Synthesizer
- **Storage**: LocalStorage API

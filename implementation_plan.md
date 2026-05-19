# Tic-Tac-Toe AI Web Application Implementation Plan

This document outlines the architecture, design, and implementation steps for building the multi-page Tic-Tac-Toe AI web application using vanilla HTML, CSS, and JavaScript.

## User Review Required

> [!IMPORTANT]
> Please review the proposed approach for the 4x4 AI. While a 3x3 Minimax AI is perfectly solvable and can be made completely unbeatable, the game tree for a 4x4 board is too large to explore fully in the browser (16! states). 
> 
> To ensure the app remains responsive, I propose using Minimax with Alpha-Beta Pruning and a **depth limit** (e.g., depth of 4 or 5) combined with a scoring heuristic for 4x4 mode. The AI will still be highly intelligent but might take a second to calculate moves on the larger board. Is this acceptable?

## Proposed Changes

We will build the application as a Single Page Application (SPA) using a single `index.html` file. Different "pages" will be implemented as `<section>` elements whose visibility is toggled via JavaScript.

### Application Core & Structure

#### [NEW] `index.html`
- Contains the semantic HTML structure for all 7 views:
  1. **Welcome View**: Title, subtitle, floating illustrations, "Next" button.
  2. **Instructions View**: Rules of the game, AI explanation, "Back"/"Next" buttons.
  3. **Select Play Mode View**: PvC vs PvP cards.
  4. **Select Board Size View**: 3x3 vs 4x4 cards.
  5. **Ready to Play View**: Summary of settings, "Start Game" button.
  6. **Game View**: Dynamic board container, turn indicator, reset button.
  7. **Winner View**: Result message, celebratory animations (confetti), "Play Again"/"Home" buttons.
- Imports Google Fonts (`Poppins`).
- Links to `style.css` and `script.js`.

#### [NEW] `style.css`
- **Design System**:
  - CSS Variables for light pastel colors (sky blue, mint green, lavender, peach, soft yellow).
  - Dark background colors will be strictly avoided.
  - Global font family set to `Poppins, sans-serif`.
- **Layout & Responsiveness**:
  - CSS Flexbox and Grid to ensure centering and responsiveness across mobile and desktop.
- **Aesthetics (Glassmorphism)**:
  - Cards and containers will use semi-transparent white backgrounds with `backdrop-filter: blur(10px)`.
  - Soft drop shadows to elevate elements.
- **Animations**:
  - Keyframe animations for floating background blobs/shapes.
  - Smooth fade-in and slide-up transitions when navigating between views.
  - Hover effects on buttons and interactive cards (scaling, glow).
  - Board cell filling animations and winning line highlights.
  - Confetti animation for the winner page.

#### [NEW] `script.js`
- **State Management**:
  - Variables to track `currentPage`, `gameMode`, `boardSize`, `boardState`, `currentPlayer` (X or O), and `gameActive`.
- **Navigation Logic**:
  - Functions to hide all views and show a specific view with transitions.
- **Game Logic**:
  - Dynamic generation of the board grid (CSS Grid columns set dynamically based on size).
  - Win checking logic that works for both 3x3 and 4x4 matrices (checking rows, columns, and diagonals).
  - Logic to switch turns and detect draws.
- **AI Implementation**:
  - A robust `getBestMove(board, player)` function.
  - **Minimax Algorithm**: Evaluates all possible moves.
  - **Alpha-Beta Pruning**: Added to optimize the search tree.
  - Depth limiting for the 4x4 board with a heuristic evaluation function to prevent browser freezing.
- **Event Listeners**:
  - Attach click handlers to all navigation buttons, mode/size cards, and the game board cells.

## Verification Plan

### Automated/Manual Verification
- I will start a local HTTP server to preview the application if needed, or simply render it.
- **Navigation Test**: Verify seamless flow from Welcome -> Instructions -> Mode -> Size -> Ready -> Game -> Result.
- **Game Mode Test**: Play PvP to ensure turns switch correctly and win/draw detection works.
- **AI Test (3x3)**: Play against the AI and ensure it blocks wins, takes wins, and is impossible to beat.
- **AI Test (4x4)**: Ensure the 4x4 mode generates a 16-cell board and the AI responds intelligently without freezing the browser.
- **Responsiveness Test**: Inspect the layout on smaller viewport sizes to ensure the grid and text scale properly.
- **Design Verification**: Confirm that the color palette strictly follows the light pastel theme and employs glassmorphic elements and animations.

# Tic-Tac-Toe AI Implementation Walkthrough

The multi-page Tic-Tac-Toe AI application has been successfully implemented and is ready for use!

## Features Completed

### 1. Modern Glassmorphism Design
- Implemented a cohesive **pastel color palette** featuring sky blue, mint green, lavender, peach, and soft yellow. No dark backgrounds were used.
- Utilized CSS variables to maintain a consistent aesthetic.
- The UI leverages **glassmorphism**, featuring semi-transparent backgrounds with a backdrop-filter blur for the main cards and buttons, providing a highly premium and modern feel.
- Added animated, floating pastel shapes in the background for a dynamic user experience.

### 2. Multi-Page Navigation Flow
The single-page application (SPA) architecture allows seamless, rapid navigation through 7 distinct views:
1. **Welcome**: Landing screen with the title and mock board.
2. **Instructions**: Rules and a brief explanation of the Minimax AI.
3. **Play Mode**: Selection between Player vs Computer (PvC) and Player vs Player (PvP).
4. **Board Size**: Selection between the classic 3x3 mode and the extended 4x4 mode.
5. **Ready**: Summary confirmation before launching the game.
6. **Game Board**: The interactive board.
7. **Winner/Congratulations**: A celebratory screen featuring dynamic falling confetti, emojis, and a clear result message.

### 3. Minimax AI Implementation
- **3x3 Classic Mode**: The AI employs a full Minimax algorithm. It evaluates all possibilities until a terminal state is reached, ensuring it is mathematically **unbeatable**.
- **4x4 Extended Mode**: To prevent the browser from freezing on a 16-cell grid (which has a huge game tree of 16!), the Minimax algorithm is implemented with **Alpha-Beta Pruning** and limited to a depth of 4. It uses a robust heuristic evaluation function to make intelligent moves instantly.

### 4. Code Structure
The project was structured simply and efficiently as requested:
- `index.html`: Contains all 7 views and structured semantic HTML.
- `style.css`: Contains the responsive layouts, animations, and the complete design system.
- `script.js`: Handles all the state management (e.g., active view, active player, board array), the Minimax AI logic, and DOM manipulation (like the custom confetti function).



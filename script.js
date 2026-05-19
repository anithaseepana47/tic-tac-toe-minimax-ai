/*
 * Tic-Tac-Toe AI - Script
 * Handles navigation, state, game logic, and AI.
 */

// --- STATE ---
let gameState = {
    mode: null, // 'pvc' or 'pvp'
    size: null, // 3 or 4
    board: [],
    currentPlayer: 'X',
    isGameActive: false,
    aiPlayer: 'O',
    humanPlayer: 'X'
};

// --- DOM ELEMENTS ---
const views = document.querySelectorAll('.view');
const boardElement = document.getElementById('game-board');
const turnIndicator = document.getElementById('turn-indicator');
const summaryMode = document.getElementById('summary-mode');
const summarySize = document.getElementById('summary-size');
const resultMessage = document.getElementById('result-message');
const resultEmoji = document.getElementById('result-emoji');
const confettiContainer = document.getElementById('confetti');

// --- NAVIGATION ---
function navigate(viewId) {
    views.forEach(view => view.classList.remove('active'));
    document.getElementById(viewId).classList.add('active');
    
    // Clear confetti when leaving result page
    if(viewId !== 'view-result') {
        confettiContainer.innerHTML = '';
    }
}

function selectMode(mode) {
    gameState.mode = mode;
    // Update active class on cards
    const cards = document.querySelectorAll('#view-mode .option-card');
    cards.forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');
}

function selectSize(size) {
    gameState.size = size;
    // Update active class on cards
    const cards = document.querySelectorAll('#view-board-size .option-card');
    cards.forEach(card => card.classList.remove('selected'));
    event.currentTarget.classList.add('selected');

    // Update Summary
    summaryMode.innerText = gameState.mode === 'pvc' ? 'Player vs Computer' : 'Player vs Player';
    summarySize.innerText = `${size} × ${size}`;
}

function navigateNextFromMode() {
    if (gameState.mode) {
        navigate('view-board-size');
    } else {
        alert("Please select a play mode to continue.");
    }
}

function navigateNextFromSize() {
    if (gameState.size) {
        navigate('view-ready');
    } else {
        alert("Please select a board size to continue.");
    }
}

// --- GAME LOGIC ---
function startGame() {
    gameState.board = Array(gameState.size * gameState.size).fill(null);
    gameState.currentPlayer = 'X';
    gameState.isGameActive = true;
    
    setupBoard();
    updateTurnIndicator();
    navigate('view-game');
}

function setupBoard() {
    boardElement.innerHTML = '';
    boardElement.className = `board size-${gameState.size}`;
    
    for (let i = 0; i < gameState.size * gameState.size; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', () => handleCellClick(i));
        boardElement.appendChild(cell);
    }
}

function updateTurnIndicator() {
    if (gameState.mode === 'pvc' && gameState.currentPlayer === gameState.aiPlayer) {
        turnIndicator.innerText = "AI is thinking...";
    } else {
        turnIndicator.innerText = `Player ${gameState.currentPlayer}'s Turn`;
    }
}

function handleCellClick(index) {
    if (!gameState.isGameActive || gameState.board[index] !== null) return;
    if (gameState.mode === 'pvc' && gameState.currentPlayer === gameState.aiPlayer) return;

    makeMove(index, gameState.currentPlayer);

    if (!gameState.isGameActive) return; // Game over check inside makeMove

    gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
    updateTurnIndicator();

    if (gameState.mode === 'pvc' && gameState.currentPlayer === gameState.aiPlayer) {
        setTimeout(aiMove, 50); // slight delay for UI update
    }
}

function makeMove(index, player) {
    gameState.board[index] = player;
    const cell = boardElement.children[index];
    cell.innerText = player;
    cell.classList.add('occupied', player.toLowerCase());

    checkResult();
}

function restartGame() {
    startGame();
}

function playAgain() {
    startGame();
}

// --- WIN CHECK LOGIC ---
function checkResult() {
    const winnerData = checkWinner(gameState.board, gameState.size);
    
    if (winnerData) {
        gameState.isGameActive = false;
        highlightWinningCells(winnerData.line);
        setTimeout(() => showResult(winnerData.winner), 1000);
    } else if (!gameState.board.includes(null)) {
        gameState.isGameActive = false;
        setTimeout(() => showResult('Draw'), 1000);
    }
}

function checkWinner(board, size) {
    let lines = getWinningLines(size);
    
    for (let line of lines) {
        let first = board[line[0]];
        if (first === null) continue;
        
        let isWinningLine = true;
        for (let i = 1; i < size; i++) {
            if (board[line[i]] !== first) {
                isWinningLine = false;
                break;
            }
        }
        
        if (isWinningLine) {
            return { winner: first, line: line };
        }
    }
    return null;
}

function getWinningLines(size) {
    let lines = [];
    // Rows
    for (let r = 0; r < size; r++) {
        let row = [];
        for (let c = 0; c < size; c++) row.push(r * size + c);
        lines.push(row);
    }
    // Cols
    for (let c = 0; c < size; c++) {
        let col = [];
        for (let r = 0; r < size; r++) col.push(r * size + c);
        lines.push(col);
    }
    // Diagonals
    let diag1 = [], diag2 = [];
    for (let i = 0; i < size; i++) {
        diag1.push(i * size + i);
        diag2.push(i * size + (size - 1 - i));
    }
    lines.push(diag1);
    lines.push(diag2);
    
    return lines;
}

function highlightWinningCells(line) {
    line.forEach(index => {
        boardElement.children[index].classList.add('winner');
    });
}

function showResult(result) {
    navigate('view-result');
    if (result === 'Draw') {
        resultEmoji.innerText = '🤝';
        resultMessage.innerText = "It's a Draw!";
    } else {
        if (gameState.mode === 'pvc') {
            if (result === gameState.humanPlayer) {
                resultEmoji.innerText = '🎉';
                resultMessage.innerText = "Congratulations! You Won!";
                createConfetti();
            } else {
                resultEmoji.innerText = '🤖';
                resultMessage.innerText = "AI Wins! Better luck next time!";
            }
        } else {
            resultEmoji.innerText = '🏆';
            resultMessage.innerText = `Player ${result} Wins!`;
            createConfetti();
        }
    }
}

// --- AI LOGIC (MINIMAX) ---
function aiMove() {
    let bestMove;
    if (gameState.size === 3) {
        // Full minimax
        bestMove = getBestMove(gameState.board, gameState.aiPlayer, 0, -Infinity, Infinity, 9);
    } else {
        // Depth-limited minimax with heuristic for 4x4
        bestMove = getBestMove(gameState.board, gameState.aiPlayer, 0, -Infinity, Infinity, 4);
    }
    
    makeMove(bestMove.index, gameState.aiPlayer);

    if (gameState.isGameActive) {
        gameState.currentPlayer = gameState.humanPlayer;
        updateTurnIndicator();
    }
}

function getBestMove(board, player, depth, alpha, beta, maxDepth) {
    let availableSpots = board.reduce((acc, el, idx) => el === null ? acc.concat(idx) : acc, []);

    let winnerData = checkWinner(board, gameState.size);
    if (winnerData) {
        if (winnerData.winner === gameState.humanPlayer) return { score: -100 + depth };
        else if (winnerData.winner === gameState.aiPlayer) return { score: 100 - depth };
    } else if (availableSpots.length === 0) {
        return { score: 0 };
    }
    
    if (depth >= maxDepth) {
        return { score: evaluateBoard(board) };
    }

    let moves = [];

    // Optional: Sort moves to improve alpha-beta pruning (e.g. check center first)
    // For simplicity, we just iterate.

    for (let i = 0; i < availableSpots.length; i++) {
        let move = {};
        move.index = availableSpots[i];
        board[availableSpots[i]] = player;

        if (player === gameState.aiPlayer) {
            let result = getBestMove(board, gameState.humanPlayer, depth + 1, alpha, beta, maxDepth);
            move.score = result.score;
            alpha = Math.max(alpha, move.score);
        } else {
            let result = getBestMove(board, gameState.aiPlayer, depth + 1, alpha, beta, maxDepth);
            move.score = result.score;
            beta = Math.min(beta, move.score);
        }

        board[availableSpots[i]] = null;
        moves.push(move);
        
        if (beta <= alpha) {
            break; // Prune
        }
    }

    let bestMove;
    if (player === gameState.aiPlayer) {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    // Fallback if no best move found (should not happen, but safe to have)
    if (bestMove === undefined) {
        return moves[0];
    }
    return moves[bestMove];
}

// Heuristic Evaluation for depth-limited search (4x4)
function evaluateBoard(board) {
    let score = 0;
    let lines = getWinningLines(gameState.size);
    
    for (let line of lines) {
        let aiCount = 0;
        let humanCount = 0;
        
        for (let index of line) {
            if (board[index] === gameState.aiPlayer) aiCount++;
            else if (board[index] === gameState.humanPlayer) humanCount++;
        }
        
        if (aiCount > 0 && humanCount === 0) {
            score += Math.pow(10, aiCount);
        } else if (humanCount > 0 && aiCount === 0) {
            score -= Math.pow(10, humanCount);
        }
    }
    return score;
}

// --- EFFECTS ---
function createConfetti() {
    const colors = ['#AEE2FF', '#C1FFD7', '#E0BBE4', '#FFDFD3', '#FFFACD', '#FF9AA2'];
    for (let i = 0; i < 100; i++) {
        let confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Randomize
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
        confetti.style.animationDelay = Math.random() * 2 + 's';
        
        confettiContainer.appendChild(confetti);
    }
    
    // Add keyframe for fall if not exists
    if (!document.getElementById('confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.innerHTML = `
            @keyframes fall {
                0% { transform: translateY(-10vh) rotate(0deg); opacity: 1; }
                100% { transform: translateY(110vh) rotate(360deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

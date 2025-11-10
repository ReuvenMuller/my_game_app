document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('gameBoard');
    const statusElement = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');

    // 'X' is always the Player, 'O' is always the AI
    const PLAYER = 'X';
    const AI = 'O';

    let boardState = Array(9).fill(null);
    let currentPlayer = PLAYER;
    let isGameActive = true;

    // Winning combinations
    const WINNING_CONDITIONS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    // --- GAME SETUP AND RENDERING ---

    function renderBoard() {
        boardElement.innerHTML = '';
        boardState.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = index;
            cell.textContent = value;
            if (value === 'X') {
                cell.classList.add('x');
            } else if (value === 'O') {
                cell.classList.add('o');
            }
            cell.addEventListener('click', handleCellClick);
            boardElement.appendChild(cell);
        });
        updateStatus();
    }

    function updateCellVisual(index, player) {
        const cell = boardElement.querySelector(`[data-index="${index}"]`);
        if (cell) {
            cell.textContent = player;
            cell.classList.add(player === PLAYER ? 'x' : 'o');
        }
    }

    // --- PLAYER AND GAME FLOW ---

    function handleCellClick(event) {
        const index = parseInt(event.target.dataset.index);

        // Only allow move if it's the player's turn, game is active, and cell is empty
        if (currentPlayer !== PLAYER || boardState[index] || !isGameActive) {
            return;
        }

        makeMove(index, PLAYER);
        checkForWinner();

        // If the game is still active, start the AI's turn
        if (isGameActive) {
            currentPlayer = AI;
            updateStatus();
            setTimeout(aiMove, 500); // Slight delay for better UX
        }
    }

    function makeMove(index, player) {
        boardState[index] = player;
        updateCellVisual(index, player);
    }

    function checkForWinner() {
        const result = checkGameState(boardState);
        if (result === PLAYER) {
            statusElement.innerHTML = `Player <span class="x">X</span> has won!`;
            isGameActive = false;
        } else if (result === AI) {
            statusElement.innerHTML = `Computer <span class="o">O</span> has won!`;
            isGameActive = false;
        } else if (result === 'draw') {
            statusElement.textContent = "It's a Draw!";
            isGameActive = false;
        }
    }

    function updateStatus() {
        if (isGameActive) {
            statusElement.innerHTML = `Your turn: <span class="${currentPlayer === PLAYER ? 'x' : 'o'}">${currentPlayer}</span>`;
        }
    }

    function resetGame() {
        boardState = Array(9).fill(null);
        currentPlayer = PLAYER;
        isGameActive = true;
        renderBoard();
    }

    // Event listener for the reset button
    resetButton.addEventListener('click', resetGame);

    // Initial board render
    renderBoard();

    // --- AI LOGIC (Minimax Algorithm) ---

    function checkGameState(board) {
        // Check for winner
        for (const [a, b, c] of WINNING_CONDITIONS) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a]; // Returns 'X' or 'O'
            }
        }

        // Check for draw
        if (!board.includes(null)) {
            return 'draw';
        }

        // Game still ongoing
        return null;
    }

    function getEmptySpots(board) {
        return board.map((val, index) => val === null ? index : null).filter(val => val !== null);
    }

    function minimax(newBoard, player) {
        const availableSpots = getEmptySpots(newBoard);
        const gameState = checkGameState(newBoard);

        // 1. Base Cases (Terminal States)
        if (gameState === PLAYER) return { score: -10 };
        if (gameState === AI) return { score: 10 };
        if (gameState === 'draw') return { score: 0 };

        let moves = [];

        // 2. Loop through available spots
        for (let i = 0; i < availableSpots.length; i++) {
            let move = {};
            move.index = availableSpots[i];
            newBoard[availableSpots[i]] = player;

            // 3. Recursive Call
            if (player === AI) {
                let result = minimax(newBoard, PLAYER);
                move.score = result.score;
            } else {
                let result = minimax(newBoard, AI);
                move.score = result.score;
            }

            // 4. Clean up (undo the move)
            newBoard[availableSpots[i]] = null;
            moves.push(move);
        }

        // 5. Evaluation (Find the best move)
        let bestMove;
        if (player === AI) {
            // Maximize AI score
            let bestScore = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            // Minimize Player score
            let bestScore = Infinity;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }

        return moves[bestMove];
    }

    function aiMove() {
        if (!isGameActive) return;

        // Use Minimax to find the best move (index)
        const bestSpot = minimax(boardState, AI);
        
        // Execute the move
        makeMove(bestSpot.index, AI);
        checkForWinner();

        // Switch back to the Player
        if (isGameActive) {
            currentPlayer = PLAYER;
            updateStatus();
        }
    }
});
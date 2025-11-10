document.addEventListener('DOMContentLoaded', () => {
    // Get references to the key DOM elements
    const boardElement = document.getElementById('gameBoard');
    const statusElement = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');

    // Initialize game state variables
    let boardState = Array(9).fill(null); // Array representing the 9 cells (null, 'X', or 'O')
    let currentPlayer = 'X';
    let isGameActive = true;

    // The eight possible winning combinations (indices of the board array)
    const WINNING_CONDITIONS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    /**
     * Clears and recreates the 9 game cells based on the current boardState.
     */
    function renderBoard() {
        boardElement.innerHTML = '';
        boardState.forEach((value, index) => {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = index; // Store the cell's index
            cell.textContent = value;
            
            // Add player-specific class for styling
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

    /**
     * Handles a click on a game cell.
     */
    function handleCellClick(event) {
        const index = parseInt(event.target.dataset.index);

        // Check if the cell is already occupied or if the game is over
        if (boardState[index] || !isGameActive) {
            return;
        }

        // Update the board state and the cell's visual content
        boardState[index] = currentPlayer;
        event.target.textContent = currentPlayer;
        event.target.classList.add(currentPlayer === 'X' ? 'x' : 'o');

        checkForWinner();

        // Switch player if the game is still active
        if (isGameActive) {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateStatus();
        }
    }

    /**
     * Checks all winning conditions after a move.
     */
    function checkForWinner() {
        let roundWon = false;
        
        for (const winCondition of WINNING_CONDITIONS) {
            const [a, b, c] = winCondition;
            
            let valA = boardState[a];
            let valB = boardState[b];
            let valC = boardState[c];

            // Skip if any cell in the condition is empty
            if (valA === null || valB === null || valC === null) {
                continue;
            }
            // Check if all three cells are the same player
            if (valA === valB && valB === valC) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            // Display winner with the correct color
            statusElement.innerHTML = `Player <span class="${currentPlayer === 'X' ? 'x' : 'o'}">${currentPlayer}</span> has won!`;
            isGameActive = false;
            return;
        }

        // Check for a Draw (if no nulls are left and no winner)
        if (!boardState.includes(null)) {
            statusElement.textContent = "It's a Draw!";
            isGameActive = false;
            return;
        }
    }

    /**
     * Updates the status message displayed above the board.
     */
    function updateStatus() {
        if (isGameActive) {
            statusElement.innerHTML = `Player <span class="${currentPlayer === 'X' ? 'x' : 'o'}">${currentPlayer}</span>'s turn`;
        }
    }

    /**
     * Resets the game to its initial state.
     */
    function resetGame() {
        boardState = Array(9).fill(null);
        currentPlayer = 'X';
        isGameActive = true;
        renderBoard();
    }

    // Attach event listener to the reset button
    resetButton.addEventListener('click', resetGame);

    // Initial board render when the page loads
    renderBoard();
});
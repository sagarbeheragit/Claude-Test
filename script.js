// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- STATE MANAGEMENT ---
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restart-button');
    const cells = document.querySelectorAll('.cell');

    // The single source of truth for the board state (null, 'X', or 'O')
    let boardState = Array(9).fill(null);
    let currentPlayer = 'X';
    let isGameActive = true;

    // Winning combinations: indices of the board array that form a line
    const WINNING_COMBINATIONS = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal \
        [2, 4, 6]  // Diagonal /
    ];

    // --- GAME FLOW FUNCTIONS ---

    /**
     * Updates the DOM element associated with the given index.
     * @param {number} index - The index of the cell (0-8).
     * @param {string} playerSymbol - The symbol ('X' or 'O').
     */
    const updateView = (index, playerSymbol) => {
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        if (cell) {
            cell.textContent = playerSymbol;
            cell.classList.add(playerSymbol);
        }
    };

    /**
     * Checks the board state against all winning combinations.
     * @returns {boolean|null} True if a winner is found, false if no winner, null if game is ongoing.
     */
    const checkWinner = () => {
        for (const combo of WINNING_COMBINATIONS) {
            const [a, b, c] = combo;
            if (boardState[a] &&
                boardState[a] === boardState[b] &&
                boardState[a] === boardState[c]) {

                // A winner is found
                updateView(a, boardState[a]);
                updateView(b, boardState[b]);
                updateView(c, boardState[c]);
                return true;
            }
        }
        return false;
    };

    /**
     * Updates the status message and checks if the game has ended.
     * @returns {boolean} True if the game has ended (win or draw), false otherwise.
     */
    const checkGameEnd = () => {
        if (checkWinner()) {
            const winner = boardState.find(cell => cell) === 'X' ? 'Player X' : 'Player O';
            statusDisplay.textContent = `Player ${winner} Wins!`;
            isGameActive = false;
            return true;
        }

        // Check for Draw (No nulls and no winner)
        if (!boardState.includes(null)) {
            statusDisplay.textContent = 'It\'s a Draw!';
            isGameActive = false;
            return true;
        }

        return false;
    };

    /**
     * Switches the active player and updates the status display.
     */
    const switchPlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    };

    /**
     * Handles a player's move on a cell.
     * @param {Event} event - The click event object.
     */
    const handleCellClick = (event) => {
        const cell = event.target.closest('.cell');
        if (!cell || !isGameActive) return;

        const index = parseInt(cell.dataset.index);

        // 1. Check Validity: Is the cell already taken?
        if (boardState[index] !== null) {
            return;
        }

        // 2. Update State
        boardState[index] = currentPlayer;

        // 3. Update View
        updateView(index, currentPlayer);

        // 4. Check Outcome
        if (checkGameEnd()) {
            // Game over (Win or Draw)
            return;
        }

        // 5. Handle Next Turn
        switchPlayer();
    };

    /**
     * Resets the entire game to its initial state.
     */
    const resetGame = () => {
        boardState.fill(null);
        currentPlayer = 'X';
        isGameActive = true;

        // Reset view
        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell'; // Reset classes to remove X/O styling
        });

        statusDisplay.textContent = "Player X's turn";
    };

    // --- EVENT LISTENERS ---
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', resetGame);

    // Initial call to set up the state on load
    resetGame();
});

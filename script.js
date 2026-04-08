document.addEventListener('DOMContentLoaded', () => {
    const statusDisplay = document.getElementById('status');
    const restartButton = document.getElementById('restart-button');
    const cells = document.querySelectorAll('.cell');
    const scoreXEl = document.getElementById('score-x');
    const scoreOEl = document.getElementById('score-o');
    const scoreDrawEl = document.getElementById('score-draw');

    let boardState = Array(9).fill(null);
    let currentPlayer = 'X';
    let isGameActive = true;

    // Score tracking
    let scores = { X: 0, O: 0, draws: 0 };

    const WINNING_COMBINATIONS = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]              // Diagonals
    ];

    const updateScoreboard = () => {
        scoreXEl.textContent = scores.X;
        scoreOEl.textContent = scores.O;
        scoreDrawEl.textContent = scores.draws;
    };

    const updateView = (index, playerSymbol) => {
        const cell = document.querySelector(`.cell[data-index="${index}"]`);
        if (cell) {
            cell.textContent = playerSymbol;
            cell.classList.add(playerSymbol);
        }
    };

    const highlightWinningCells = (combination) => {
        combination.forEach(index => {
            const cell = document.querySelector(`.cell[data-index="${index}"]`);
            if (cell) {
                cell.classList.add('winning');
            }
        });
    };

    const checkWinner = () => {
        for (const combo of WINNING_COMBINATIONS) {
            const [a, b, c] = combo;
            if (boardState[a] &&
                boardState[a] === boardState[b] &&
                boardState[a] === boardState[c]) {
                return { winner: boardState[a], combination: combo };
            }
        }
        return null;
    };

    const checkGameEnd = () => {
        const result = checkWinner();
        if (result) {
            statusDisplay.innerHTML = `
                <span class="status-icon">🏆</span>
                <span class="status-text">Player ${result.winner} Wins!</span>
            `;
            statusDisplay.classList.add('winner');
            highlightWinningCells(result.combination);
            scores[result.winner]++;
            updateScoreboard();
            isGameActive = false;
            return true;
        }

        if (!boardState.includes(null)) {
            statusDisplay.innerHTML = `
                <span class="status-icon">🤝</span>
                <span class="status-text">It's a Draw!</span>
            `;
            statusDisplay.classList.add('draw');
            scores.draws++;
            updateScoreboard();
            isGameActive = false;
            return true;
        }

        return false;
    };

    const switchPlayer = () => {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        const icon = currentPlayer === 'X' ? '🎯' : '💫';
        statusDisplay.innerHTML = `
            <span class="status-icon">${icon}</span>
            <span class="status-text">Player ${currentPlayer}'s turn</span>
        `;
    };

    const handleCellClick = (event) => {
        const cell = event.target.closest('.cell');
        if (!cell || !isGameActive) return;

        const index = parseInt(cell.dataset.index);

        if (boardState[index] !== null) {
            return;
        }

        boardState[index] = currentPlayer;
        updateView(index, currentPlayer);

        if (checkGameEnd()) {
            return;
        }

        switchPlayer();
    };

    const resetGame = () => {
        boardState.fill(null);
        currentPlayer = 'X';
        isGameActive = true;

        cells.forEach(cell => {
            cell.textContent = '';
            cell.className = 'cell';
        });

        statusDisplay.innerHTML = `
            <span class="status-icon">🎮</span>
            <span class="status-text">Player X's turn</span>
        `;
        statusDisplay.classList.remove('winner', 'draw');
    };

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', resetGame);

    resetGame();
});

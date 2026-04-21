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
    let gameMode = 'human'; // 'human' | 'computer'
    let aiPlayer = 'O';
    let difficulty = 'medium'; // 'easy' | 'medium' | 'difficult' | 'impossible'

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
        const icon = currentPlayer === 'X' ? '🎮' : '🤖';
        statusDisplay.innerHTML = `
            <span class="status-icon">${icon}</span>
            <span class="status-text">PLAYER ${currentPlayer}'S TURN</span>
        `;

        // Update turn indicator
        updateTurnIndicator();
    };

    const updateTurnIndicator = () => {
        const xScoreEl = document.querySelector('.player-x-score');
        const oScoreEl = document.querySelector('.player-o-score');

        if (currentPlayer === 'X') {
            xScoreEl.classList.add('active-glow');
            oScoreEl.classList.remove('active-glow');
        } else {
            xScoreEl.classList.remove('active-glow');
            oScoreEl.classList.add('active-glow');
        }
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

        // Trigger AI move after human plays in computer mode
        if (gameMode === 'computer' && isGameActive) {
            setTimeout(makeAIMove, 500);
        }
    };

    const getBestMove = () => {
        switch (difficulty) {
            case 'easy':
                return getRandomMove();
            case 'medium':
                return getOpportunisticMove();
            case 'difficult':
                return getSmartMove();
            case 'impossible':
                return getMinimaxMove();
            default:
                return getRandomMove();
        }
    };

    const getRandomMove = () => {
        const emptyIndices = boardState
            .map((cell, i) => cell === null ? i : null)
            .filter(i => i !== null);

        if (emptyIndices.length === 0) return -1;
        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    };

    const getOpportunisticMove = () => {
        const emptyIndices = boardState
            .map((cell, i) => cell === null ? i : null)
            .filter(i => i !== null);

        if (emptyIndices.length === 0) return -1;

        // Check if AI can win immediately
        for (const index of emptyIndices) {
            boardState[index] = aiPlayer;
            const result = checkWinner();
            boardState[index] = null;
            if (result && result.winner === aiPlayer) {
                return index;
            }
        }

        // Check if player can win next turn and block
        const humanPlayer = aiPlayer === 'O' ? 'X' : 'O';
        for (const index of emptyIndices) {
            boardState[index] = humanPlayer;
            const result = checkWinner();
            boardState[index] = null;
            if (result && result.winner === humanPlayer) {
                return index;
            }
        }

        // Otherwise random
        return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    };

    const makeAIMove = () => {
        if (gameMode !== 'computer' || currentPlayer !== aiPlayer || !isGameActive) return;

        const bestMove = getBestMove();
        if (bestMove === -1) return;

        boardState[bestMove] = aiPlayer;
        updateView(bestMove, aiPlayer);

        if (!checkGameEnd()) {
            switchPlayer();
        }
    };

    const getSmartMove = () => {
        const emptyIndices = boardState
            .map((cell, i) => cell === null ? i : null)
            .filter(i => i !== null);

        if (emptyIndices.length === 0) return -1;

        // 15% chance of random move (mistake)
        if (Math.random() < 0.15) {
            return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
        }

        // Rate each available move
        let bestMove = -1;
        let bestScore = -Infinity;

        for (const index of emptyIndices) {
            let score = 0;

            // Check if this move wins
            boardState[index] = aiPlayer;
            const winResult = checkWinner();
            boardState[index] = null;
            if (winResult && winResult.winner === aiPlayer) {
                return index; // Always take winning move
            }

            // Check if need to block player win
            const humanPlayer = aiPlayer === 'O' ? 'X' : 'O';
            boardState[index] = humanPlayer;
            const blockResult = checkWinner();
            boardState[index] = null;
            if (blockResult && blockResult.winner === humanPlayer) {
                score += 50; // High priority to block
            }

            // Score for creating 2-in-a-row setups
            boardState[index] = aiPlayer;
            if (checkTwoInARow(aiPlayer)) {
                score += 25;
            }
            boardState[index] = null;

            // Prefer center
            if (index === 4) score += 10;

            // Prefer corners
            if ([0, 2, 6, 8].includes(index)) score += 5;

            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }

        return bestMove !== -1 ? bestMove : emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    };

    const checkTwoInARow = (player) => {
        for (const combo of WINNING_COMBINATIONS) {
            const [a, b, c] = combo;
            const values = [boardState[a], boardState[b], boardState[c]];
            const playerCount = values.filter(v => v === player).length;
            const emptyCount = values.filter(v => v === null).length;
            if (playerCount === 2 && emptyCount === 1) {
                return true;
            }
        }
        return false;
    };

    const getMinimaxMove = () => {
        const emptyIndices = boardState
            .map((cell, i) => cell === null ? i : null)
            .filter(i => i !== null);

        if (emptyIndices.length === 0) return -1;

        let bestScore = -Infinity;
        let bestMove = -1;

        for (const index of emptyIndices) {
            boardState[index] = aiPlayer;
            const score = minimax(0, false);
            boardState[index] = null;

            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }

        return bestMove;
    };

    const minimax = (depth, isMaximizing) => {
        // Check terminal states
        const result = checkWinner();
        if (result) {
            return result.winner === aiPlayer ? 10 - depth : depth - 10;
        }

        if (!boardState.includes(null)) {
            return 0; // Draw
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < boardState.length; i++) {
                if (boardState[i] === null) {
                    boardState[i] = aiPlayer;
                    const score = minimax(depth + 1, false);
                    boardState[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            const humanPlayer = aiPlayer === 'O' ? 'X' : 'O';
            for (let i = 0; i < boardState.length; i++) {
                if (boardState[i] === null) {
                    boardState[i] = humanPlayer;
                    const score = minimax(depth + 1, true);
                    boardState[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    const setGameMode = (mode) => {
        gameMode = mode;
        resetGame();
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
            <span class="status-text">PLAYER X'S TURN</span>
        `;
        statusDisplay.classList.remove('winner', 'draw');

        // Reset turn indicator
        updateTurnIndicator();
    };

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', resetGame);

    // Mode toggle listeners
    const modeToggles = document.querySelectorAll('input[name="game-mode"]');
    const toggleTrack = document.querySelector('.toggle-track');
    const difficultySelector = document.getElementById('difficulty-selector');
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');

    modeToggles.forEach(toggle => {
        toggle.addEventListener('change', () => {
            if (toggle.value === 'computer') {
                toggleTrack.classList.add('computer-mode');
                difficultySelector.style.display = 'flex';
                // Reset to medium difficulty
                difficulty = 'medium';
                difficultyButtons.forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.level === 'medium');
                });
            } else {
                toggleTrack.classList.remove('computer-mode');
                difficultySelector.style.display = 'none';
            }
            setGameMode(toggle.value);
        });
    });

    // Difficulty selector listeners
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            difficultyButtons.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            // Update difficulty state
            difficulty = btn.dataset.level;
            // Reset game when difficulty changes
            resetGame();
        });
    });

    resetGame();
});

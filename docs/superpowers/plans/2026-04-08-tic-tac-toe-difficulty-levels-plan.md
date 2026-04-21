# Tic Tac Toe Difficulty Levels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 4 difficulty levels (Easy, Medium, Difficult, Impossible) to the computer opponent with distinct AI behaviors for each level.

**Architecture:** Implement a strategy-based AI system where `getBestMove()` dispatches to different algorithms based on difficulty: random (Easy), opportunistic blocking/winning (Medium), smart moves with occasional mistakes (Difficult), and perfect minimax (Impossible).

**Tech Stack:** Vanilla JavaScript, no external dependencies.

---

## File Structure

**Files to Modify:**
- `index.html` - Add difficulty selector UI (lines 45-62, after game-mode toggle)
- `style.css` - Add difficulty selector styles
- `script.js` - Implement AI strategies, add difficulty state management

**Files to Create:** None (all changes fit within existing architecture)

---

## Task 1: HTML - Add Difficulty Selector UI

**Files:**
- Modify: `index.html:45-62`

- [ ] **Step 1: Add difficulty selector after game-mode toggle**

Insert this HTML block after the closing `</div>` of `.game-mode` (after line 62):

```html
<div class="difficulty-selector" id="difficulty-selector" style="display: none;">
    <span class="difficulty-label">LEVEL:</span>
    <div class="difficulty-buttons">
        <button class="difficulty-btn" data-level="easy">Easy</button>
        <button class="difficulty-btn active" data-level="medium">Medium</button>
        <button class="difficulty-btn" data-level="difficult">Difficult</button>
        <button class="difficulty-btn" data-level="impossible">Impossible</button>
    </div>
</div>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: add difficulty selector UI structure"
```

---

## Task 2: CSS - Style Difficulty Selector

**Files:**
- Modify: `style.css` - Add styles at end of file before closing brace

- [ ] **Step 1: Add difficulty selector styles**

Add these styles to `style.css`:

```css
/* Difficulty Selector */
.difficulty-selector {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    margin: 20px 0;
    padding: 15px 20px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(0, 255, 255, 0.2);
    border-radius: 12px;
    backdrop-filter: blur(10px);
}

.difficulty-label {
    font-family: 'Orbitron', sans-serif;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 2px;
    color: rgba(0, 255, 255, 0.8);
    text-transform: uppercase;
}

.difficulty-buttons {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: center;
}

.difficulty-btn {
    font-family: 'Rajdhani', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 8px 16px;
    border: 1px solid rgba(0, 255, 255, 0.3);
    background: rgba(0, 0, 0, 0.5);
    color: rgba(0, 255, 255, 0.7);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.difficulty-btn:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: rgba(0, 255, 255, 0.6);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
}

.difficulty-btn.active {
    background: rgba(0, 255, 255, 0.2);
    border-color: #00ffff;
    color: #00ffff;
    box-shadow: 0 0 15px rgba(0, 255, 255, 0.5);
}

.difficulty-btn[data-level="impossible"].active {
    background: rgba(255, 0, 128, 0.2);
    border-color: #ff0080;
    color: #ff0080;
    box-shadow: 0 0 15px rgba(255, 0, 128, 0.5);
}

.difficulty-btn[data-level="impossible"]:hover {
    background: rgba(255, 0, 128, 0.1);
    border-color: #ff0080;
    box-shadow: 0 0 10px rgba(255, 0, 128, 0.3);
}
```

- [ ] **Step 2: Commit**

```bash
git add style.css
git commit -m "style: add difficulty selector styling with arcade theme"
```

---

## Task 3: JavaScript - Add Difficulty State and UI Handlers

**Files:**
- Modify: `script.js:1-20` (add state), `script.js:163-207` (add handlers)

- [ ] **Step 1: Add difficulty state variable**

Add after line 12 (`let gameMode = 'human';`):

```javascript
let difficulty = 'medium'; // 'easy' | 'medium' | 'difficult' | 'impossible'
```

- [ ] **Step 2: Add difficulty selector event handlers**

Add after line 207 (before `resetGame();`):

```javascript
// Difficulty selector listeners
const difficultySelector = document.getElementById('difficulty-selector');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');

// Show/hide based on game mode
if (gameMode === 'computer') {
    difficultySelector.style.display = 'flex';
}

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

// Update show/hide logic for mode toggle
const originalModeChange = modeToggles.forEach;
```

- [ ] **Step 3: Update mode toggle to show/hide difficulty selector**

Modify the mode toggle change handler (around lines 198-206) to add:

```javascript
if (toggle.value === 'computer') {
    toggleTrack.classList.add('computer-mode');
    difficultySelector.style.display = 'flex';
} else {
    toggleTrack.classList.remove('computer-mode');
    difficultySelector.style.display = 'none';
}
```

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: add difficulty state and selector event handlers"
```

---

## Task 4: JavaScript - Implement Easy and Medium AI Strategies

**Files:**
- Modify: `script.js:139-161` (replace `getBestMove` and `makeAIMove`)

- [ ] **Step 1: Replace `getBestMove` with difficulty dispatcher**

Replace the entire `getBestMove` function (lines 139-147) with:

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add script.js
git commit -m "feat: implement Easy and Medium AI strategies"
```

---

## Task 5: JavaScript - Implement Difficult AI Strategy

**Files:**
- Modify: `script.js` - Add `getSmartMove` function after `getOpportunisticMove`

- [ ] **Step 1: Add getSmartMove function**

Add after `getOpportunisticMove` function:

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add script.js
git commit -m "feat: implement Difficult AI with mistake chance and move rating"
```

---

## Task 6: JavaScript - Implement Impossible AI (Minimax)

**Files:**
- Modify: `script.js` - Add minimax functions after `checkTwoInARow`

- [ ] **Step 1: Add minimax algorithm**

Add after `checkTwoInARow` function:

```javascript
const getMinimaxMove = () => {
    const emptyIndices = boardState
        .map((cell, i) => cell === null ? i : null)
        .filter(i => i !== null);
    
    if (emptyIndices.length === 0) return -1;
    
    let bestScore = -Infinity;
    let bestMove = -1;
    
    for (const index of emptyIndices) {
        boardState[index] = aiPlayer;
        const score = minimax(boardState, 0, false);
        boardState[index] = null;
        
        if (score > bestScore) {
            bestScore = score;
            bestMove = index;
        }
    }
    
    return bestMove;
};

const minimax = (board, depth, isMaximizing) => {
    // Check terminal states
    const result = checkWinner();
    if (result) {
        return result.winner === aiPlayer ? 10 - depth : depth - 10;
    }
    
    if (!board.includes(null)) {
        return 0; // Draw
    }
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = aiPlayer;
                const score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        const humanPlayer = aiPlayer === 'O' ? 'X' : 'O';
        for (let i = 0; i < board.length; i++) {
            if (board[i] === null) {
                board[i] = humanPlayer;
                const score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
};
```

- [ ] **Step 2: Commit**

```bash
git add script.js
git commit -m "feat: implement Impossible AI with minimax algorithm"
```

---

## Task 7: Update Mode Toggle to Reset Difficulty UI

**Files:**
- Modify: `script.js:198-206` (mode toggle handler)

- [ ] **Step 1: Update mode toggle to reset difficulty button states**

Modify the mode toggle change handler to also reset the active button:

```javascript
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
```

- [ ] **Step 2: Commit**

```bash
git add script.js
git commit -m "fix: reset difficulty UI when toggling game mode"
```

---

## Task 8: Manual Testing

**Files:** None (testing task)

- [ ] **Step 1: Test Easy difficulty**

1. Open `index.html` in browser
2. Select "👤 VS 🤖" mode
3. Click "Easy" button
4. Play multiple games - AI should make random moves with no pattern
5. Verify AI doesn't block obvious wins or take winning moves consistently

- [ ] **Step 2: Test Medium difficulty**

1. Click "Medium" button
2. Play games where you set up 2-in-a-row - AI should block
3. Set up scenarios where AI can win - it should take winning moves
4. Verify AI doesn't plan ahead (should miss forks)

- [ ] **Step 3: Test Difficult difficulty**

1. Click "Difficult" button
2. Verify AI usually makes smart moves but occasionally makes mistakes
3. AI should set up 2-in-a-row opportunities
4. Play 5-10 games to observe ~85% smart play rate

- [ ] **Step 4: Test Impossible difficulty**

1. Click "Impossible" button
2. Play multiple games - should never lose (best case is draw)
3. Verify AI always blocks and always takes winning opportunities
4. Try known minimax test scenarios

- [ ] **Step 5: Test UI interactions**

1. Switch between Human and Computer modes - difficulty selector should show/hide
2. Switch difficulties mid-game - game should reset
3. Verify active button styling updates correctly
4. Test "Impossible" button has distinct red glow when active

---

## Task 9: Final Verification and Cleanup

**Files:** All modified files

- [ ] **Step 1: Verify all files are committed**

```bash
git status
```

Expected: Clean working tree with no uncommitted changes

- [ ] **Step 2: Verify git history**

```bash
git log --oneline -6
```

Expected: 6 commits matching the commit messages in tasks above

- [ ] **Step 3: Final playthrough**

Play one complete game on each difficulty level to confirm everything works together.

# Tic Tac Toe Difficulty Levels Design

**Date:** 2026-04-08  
**Author:** Claude Code  
**Status:** Approved

## Overview

Add 4 difficulty levels to the computer opponent: Easy, Medium, Difficult, and Impossible. Each level provides progressively smarter AI behavior with distinct gameplay characteristics.

## Difficulty Behaviors

### Easy
- **Behavior:** Pure random moves
- **Characteristics:** Never blocks, never wins intentionally, picks any empty cell uniformly
- **Win rate vs human:** Very low (~25% accounting for random chance)

### Medium
- **Behavior:** Opportunistic, short-sighted
- **Characteristics:**
  - Wins immediately if it has 2-in-a-row (takes winning move)
  - Blocks immediately if player has 2-in-a-row
  - Otherwise plays randomly
  - Does not plan ahead or recognize forks/traps
- **Win rate vs human:** Moderate (~40-50%)

### Difficult
- **Behavior:** Mostly smart with occasional mistakes
- **Characteristics:**
  - Always wins if possible
  - Always blocks if player has 2-in-a-row
  - Tries to create 2-in-a-row opportunities
  - ~85% optimal move selection, ~15% random mistakes
- **Win rate vs human:** High (~60-70%)

### Impossible
- **Behavior:** Perfect minimax algorithm
- **Characteristics:**
  - Evaluates all possible future game states
  - Never makes a mistake
  - Best human can achieve is a draw
- **Win rate vs human:** 0% (all games are draws or AI wins)

## Architecture

### AI Decision Flow

```
makeAIMove()
  └─> getBestMove(difficulty)
       ├─> Easy: randomMove()
       ├─> Medium: opportunisticMove()
       │    ├─ Check: can AI win now? → take it
       │    ├─ Check: can player win next? → block
       │    └─ Otherwise: random
       ├─> Difficult: smartMoveWithMistakes()
       │    ├─ 85% chance: ratedMove() (see below)
       │    └─ 15% chance: randomMove()
       └─> Impossible: minimax()
            └─ Full game tree evaluation
```

### Move Rating System (for Difficult)

Moves are scored based on:
1. **Win opportunity:** +100 if this move wins
2. **Block necessity:** +50 if blocks opponent's win
3. **Setup value:** +25 if creates 2-in-a-row
4. **Center preference:** +10 for center cell (4)
5. **Corner preference:** +5 for corners (0,2,6,8)

### Minimax Algorithm (for Impossible)

Standard minimax with alpha-beta pruning:
- Maximize AI score (+10 for win, -10 for loss, 0 for draw)
- Recursive evaluation of all possible moves
- Depth tracking for optimal path selection

## UI Changes

### HTML Structure

Add difficulty selector that appears when computer mode is active:

```html
<div class="difficulty-selector">
    <span class="difficulty-label">LEVEL:</span>
    <div class="difficulty-buttons">
        <button class="difficulty-btn active" data-level="easy">Easy</button>
        <button class="difficulty-btn" data-level="medium">Medium</button>
        <button class="difficulty-btn" data-level="difficult">Difficult</button>
        <button class="difficulty-btn" data-level="impossible">Impossible</button>
    </div>
</div>
```

### CSS Styling

- Match existing arcade aesthetic (neon colors, glow effects)
- Active difficulty button shows glow/highlight
- Hidden by default, visible when `gameMode === 'computer'`

### JavaScript Changes

**New state:**
```javascript
let difficulty = 'medium'; // 'easy' | 'medium' | 'difficult' | 'impossible'
```

**New functions:**
- `getBestMove()` - dispatcher based on difficulty
- `getRandomMove()` - Easy strategy
- `getOpportunisticMove()` - Medium strategy
- `getSmartMove()` - Difficult strategy (with mistake chance)
- `getMinimaxMove()` - Impossible strategy
- `minimax(board, depth, isMaximizing)` - recursive helper
- `evaluateBoard()` - score terminal states

**Modified functions:**
- `makeAIMove()` - calls `getBestMove()` with current difficulty
- Mode toggle - shows/hides difficulty selector

## File Changes

- `index.html` - Add difficulty selector UI
- `style.css` - Add difficulty selector styles
- `script.js` - Implement AI strategies, add difficulty state

## Testing Considerations

- Each difficulty should be testable by playing multiple games
- Impossible mode should never lose (verify through automated tests)
- Easy mode should have no pattern to moves
- Medium should block obvious wins but miss forks
- Difficult should occasionally make mistakes

## Future Enhancements (Out of Scope)

- AI move delay customization per difficulty
- Statistics tracking per difficulty level
- Achievement system for beating Impossible mode

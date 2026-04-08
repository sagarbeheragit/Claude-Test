# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tic Tac Toe browser game built with vanilla HTML, CSS, and JavaScript. No build process or dependencies required.

## Commands

```bash
# Open game in browser
open index.html

# Serve locally with live reload (optional)
npx serve .
# or
python -m http.server 8000
```

## Architecture

**Single-page application structure:**
- `index.html` — Game layout with scoreboard, status display, 3x3 grid, and restart button
- `style.css` — Modern UI with gradient backgrounds, animations (pop-in, pulse), responsive design
- `script.js` — Game logic with state management, win detection, score tracking

**Game state flow:**
1. `boardState` array (9 elements) is single source of truth
2. `handleCellClick` validates move → updates state → updates view → checks end condition
3. `checkWinner` tests 8 winning combinations, returns winner + combination for highlighting
4. Scores persist across games (X wins, O wins, draws)

**Key patterns:**
- Event delegation on cells via `querySelectorAll`
- CSS classes `.X` and `.O` for styling marks
- `.winning` class triggers animation on winning cells
- Status display uses emoji icons + text, updated via `innerHTML`

# Tic Tac Toe

A modern, polished Tic Tac Toe game with single-player (vs Computer) and two-player modes.

## Features

- 🎮 **Two Game Modes**: Play against a friend or challenge the AI
- 🏆 **Score Tracking**: Keeps track of wins for X, O, and draws
- ✨ **Smooth Animations**: Pop-in effects and winning cell highlights
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Gradient backgrounds and glass-morphism design

## How to Play

### Two Player Mode (👤 vs 👤)
1. Players take turns clicking cells
2. X goes first
3. First to get 3 in a row wins

### Single Player Mode (👤 vs 🤖)
1. Select the computer mode button
2. You play as X, computer plays as O
3. Computer responds after your move
4. Try to beat the AI!

## Running the Game

### Option 1: Direct Open
```bash
open index.html
```

### Option 2: Local Server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .
```

Then navigate to `http://localhost:8000`

## Project Structure

```
├── index.html    # Game layout and UI structure
├── style.css     # Styling with animations and responsive design
├── script.js     # Game logic and AI opponent
└── README.md     # This file
```

## AI Behavior

The computer opponent uses a random move strategy, selecting any available empty cell. This provides a casual challenge that can be beaten with strategy.

## Technologies

- Vanilla HTML5, CSS3, JavaScript (ES6+)
- Google Fonts (Poppins)
- No build process or dependencies required

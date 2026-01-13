# 3D Pacman Game

A fully playable 3D Pacman game built with Three.js and JavaScript.

## Features

- 🎮 Classic Pacman gameplay in 3D
- 👻 Four AI-controlled ghosts
- 🌟 Pellet collection system
- 📊 Score tracking
- ❤️ Multiple lives system
- 🎯 Win/lose conditions
- 🕹️ Smooth keyboard controls

## How to Play

1. Open `index.html` in a modern web browser
2. Click "START GAME" to begin
3. Use **Arrow Keys** or **WASD** to move Pacman
4. Collect all yellow pellets while avoiding the colored ghosts
5. You have 3 lives - don't let the ghosts catch you!
6. Collect all pellets to win the game

## Controls

- **Arrow Keys** or **WASD**: Move Pacman
- **ESC**: Pause (pause functionality can be added)

## Running the Game

Simply open `index.html` in any modern web browser. No build process or server required!

Alternatively, you can serve it with a local server:
```bash
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

## Technologies Used

- **Three.js**: 3D graphics rendering
- **JavaScript**: Game logic and controls
- **HTML5/CSS3**: UI and styling

## Game Mechanics

- **Pacman**: Yellow sphere that the player controls
- **Ghosts**: Four colored enemies (red, magenta, cyan, orange) that chase Pacman
- **Pellets**: Yellow collectibles worth 10 points each
- **Walls**: Blue barriers forming the maze
- **Lives**: Start with 3 lives, lose one when caught by a ghost
- **Scoring**: 10 points per pellet collected

## Future Enhancements

- Power pellets that let Pacman eat ghosts
- Multiple levels with increasing difficulty
- Sound effects and music
- Better ghost AI with different personalities
- High score tracking
- Mobile touch controls

Enjoy playing 3D Pacman! 🎮
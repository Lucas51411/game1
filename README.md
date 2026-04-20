# 🐍 Snake Game

A classic Snake game built with HTML5 Canvas, CSS, and JavaScript. Guide the snake to eat food, grow longer, and achieve the highest score!

## 🎮 How to Play

1. Open `index.html` in your web browser
2. Use arrow keys (⬆️⬇️⬅️➡️) to control the snake
3. Eat the red food to grow and increase your score
4. Avoid hitting the walls or the snake's own body
5. Try to beat your high score!

## 🕹️ Controls

- **Arrow Keys**: Move the snake up, down, left, right
- **Spacebar**: Pause/Resume the game
- **Pause Button**: Pause/Resume the game
- **New Game Button**: Start a fresh game
- **Play Again Button**: Restart after game over

## ✨ Features

- **Smooth gameplay** with canvas-based rendering
- **Score tracking** with persistent high scores
- **Responsive design** that works on desktop and mobile
- **Pause functionality** to take breaks
- **Game over detection** with collision checking
- **Food spawning** that avoids the snake's body
- **Modern UI** with beautiful styling and animations

## 🚀 Getting Started

Simply open the `index.html` file in any modern web browser. No installation or setup required!

```bash
# Clone or download this repository
# Then open in browser:
open index.html
```

## 🎯 Game Rules

1. The snake starts small and grows by eating food
2. Each food eaten adds 10 points to your score
3. The game ends if the snake hits:
   - The walls (boundaries of the game area)
   - Its own body
4. High scores are automatically saved in your browser

## 🏗️ Project Structure

```
snake-game/
├── index.html          # Main game page
├── css/
│   └── style.css       # Game styling and responsive design
├── js/
│   └── game.js         # Core game logic and Snake class
├── LICENSE             # MIT License
└── README.md           # This file
```

## 🛠️ Technical Details

- **Pure JavaScript**: No frameworks or libraries required
- **HTML5 Canvas**: Smooth 60fps rendering
- **CSS Grid**: Responsive layout
- **Local Storage**: High score persistence
- **ES6 Classes**: Modern JavaScript structure

## 🎨 Customization

You can easily customize the game by modifying:

- **Game speed**: Change `gameSpeed` variable in `game.js`
- **Colors**: Update color values in `style.css`
- **Canvas size**: Modify canvas dimensions in `index.html`
- **Grid size**: Adjust `gridSize` in the `SnakeGame` class

## 📱 Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## 🤝 Contributing

Feel free to fork this project and submit pull requests for improvements:

- Better graphics or animations
- Sound effects
- Different difficulty levels
- Power-ups or special foods
- Multiplayer support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Enjoy playing Snake! 🐍🎮
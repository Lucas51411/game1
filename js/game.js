// Snake Game Logic
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.scoreElement = document.getElementById('score');
        this.highScoreElement = document.getElementById('highScore');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        this.restartBtn = document.getElementById('restartBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // Game settings
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;

        // Initialize game state
        this.initGame();
        this.setupEventListeners();
        this.loadHighScore();
        this.gameLoop();
    }

    initGame() {
        // Snake starts in the middle
        this.snake = [
            { x: 10, y: 10 }
        ];

        // Initial direction
        this.dx = 0;
        this.dy = 0;

        // Food position
        this.food = this.generateFood();

        // Game state
        this.score = 0;
        this.gameRunning = true;
        this.gamePaused = false;

        // Update score display
        this.updateScore();

        // Hide game over screen
        this.gameOverElement.style.display = 'none';
    }

    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.isSnakePosition(food.x, food.y));

        return food;
    }

    isSnakePosition(x, y) {
        return this.snake.some(segment => segment.x === x && segment.y === y);
    }

    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.gamePaused) return;

            // Prevent default arrow key scrolling
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }

            this.changeDirection(e.code);
        });

        // Pause/Resume with spacebar
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePause();
            }
        });

        // Button event listeners
        this.restartBtn.addEventListener('click', () => {
            this.initGame();
        });

        this.pauseBtn.addEventListener('click', () => {
            this.togglePause();
        });

        this.resetBtn.addEventListener('click', () => {
            this.initGame();
        });
    }

    changeDirection(keyCode) {
        const goingUp = this.dy === -1;
        const goingDown = this.dy === 1;
        const goingRight = this.dx === 1;
        const goingLeft = this.dx === -1;

        switch (keyCode) {
            case 'ArrowLeft':
                if (!goingRight) {
                    this.dx = -1;
                    this.dy = 0;
                }
                break;
            case 'ArrowUp':
                if (!goingDown) {
                    this.dx = 0;
                    this.dy = -1;
                }
                break;
            case 'ArrowRight':
                if (!goingLeft) {
                    this.dx = 1;
                    this.dy = 0;
                }
                break;
            case 'ArrowDown':
                if (!goingUp) {
                    this.dx = 0;
                    this.dy = 1;
                }
                break;
        }
    }

    togglePause() {
        if (!this.gameRunning) return;

        this.gamePaused = !this.gamePaused;
        this.pauseBtn.textContent = this.gamePaused ? 'Resume' : 'Pause';

        if (this.gamePaused) {
            // Draw pause overlay
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '30px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        }
    }

    update() {
        if (!this.gameRunning || this.gamePaused) return;

        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };

        // Check wall collisions
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }

        // Check self collision
        if (this.isSnakePosition(head.x, head.y)) {
            this.gameOver();
            return;
        }

        this.snake.unshift(head);

        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.updateScore();
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#2d3748';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#48bb78';
        this.snake.forEach((segment, index) => {
            // Head is slightly different color
            if (index === 0) {
                this.ctx.fillStyle = '#38a169';
            } else {
                this.ctx.fillStyle = '#48bb78';
            }

            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });

        // Draw food
        this.ctx.fillStyle = '#e53e3e';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );

        // Draw food highlight (make it look more appealing)
        this.ctx.fillStyle = '#fc8181';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 6,
            this.gridSize - 6
        );
    }

    gameOver() {
        this.gameRunning = false;
        this.pauseBtn.textContent = 'Pause';
        this.pauseBtn.disabled = true;

        // Update high score
        const currentHighScore = this.getHighScore();
        if (this.score > currentHighScore) {
            this.setHighScore(this.score);
            this.highScoreElement.textContent = this.score;
        }

        // Show game over screen
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.style.display = 'block';

        // Re-enable pause button after a short delay
        setTimeout(() => {
            this.pauseBtn.disabled = false;
        }, 1000);
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
    }

    getHighScore() {
        return parseInt(localStorage.getItem('snakeHighScore')) || 0;
    }

    setHighScore(score) {
        localStorage.setItem('snakeHighScore', score);
    }

    loadHighScore() {
        const highScore = this.getHighScore();
        this.highScoreElement.textContent = highScore;
    }

    gameLoop() {
        this.update();
        this.draw();

        // Game speed (slower = easier)
        const gameSpeed = 150; // milliseconds
        setTimeout(() => {
            this.gameLoop();
        }, gameSpeed);
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
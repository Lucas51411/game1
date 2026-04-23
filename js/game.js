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
        
        // Mobile control buttons
        this.upBtn = document.getElementById('upBtn');
        this.downBtn = document.getElementById('downBtn');
        this.leftBtn = document.getElementById('leftBtn');
        this.rightBtn = document.getElementById('rightBtn');

        // Level system elements
        this.levelElement = document.getElementById('level');
        this.progressFillElement = document.getElementById('progressFill');
        this.progressTextElement = document.getElementById('progressText');
        this.levelUpNotification = document.getElementById('levelUpNotification');
        this.newLevelDisplay = document.getElementById('newLevelDisplay');

        // Leaderboard elements
        this.leaderboardList = document.getElementById('leaderboardList');
        this.clearLeaderboardBtn = document.getElementById('clearLeaderboardBtn');

        // Game settings
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;

        // Level system settings
        this.pointsPerLevel = 300; // Points needed to advance to next level
        this.initialSpeed = 180; // Starting speed (slower = easier)
        this.speedIncreasePerLevel = 25; // Speed increase per level
        this.minSpeed = 60; // Fastest possible speed (difficulty cap)

        // Game loop control
        this.gameLoopId = null;

        // Initialize game state
        this.initGame();
        this.setupEventListeners();
        this.loadHighScore();
        this.loadLeaderboard();
        this.startGameLoop();
    }

    initGame() {
        // FORCE stop any existing game loop immediately
        this.stopGameLoop();
        this.gameRunning = false; // Force stop current game
        
        // Wait a moment to ensure old loop is completely stopped
        setTimeout(() => {
            // Snake starts in the middle
            this.snake = [
                { x: 10, y: 10 }
            ];

            // Initial direction - start moving right automatically
            this.dx = 1;
            this.dy = 0;

            // Food position
            this.food = this.generateFood();

            // Game state
            this.score = 0;
            this.gameRunning = true;
            this.gamePaused = false;
            this.gameStarted = false;

            // Reset level system
            this.level = 1;
            this.currentSpeed = this.initialSpeed;

            // Update UI displays
            this.updateScore();
            this.updateLevel();
            this.updateProgressBar();

            // Hide game over screen
            this.gameOverElement.style.display = 'none';

            // Enable pause button
            this.pauseBtn.disabled = false;
            this.pauseBtn.textContent = 'Pause';

            // Start game automatically after a brief moment
            setTimeout(() => {
                this.gameStarted = true;
            }, 1000);

            // Start fresh game loop
            this.startGameLoop();
        }, 100); // Small delay to ensure cleanup
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

            // Start the game when first arrow key is pressed
            if (!this.gameStarted && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                this.gameStarted = true;
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

        // Mobile button event listeners
        this.upBtn.addEventListener('click', () => {
            this.handleMobileDirection('ArrowUp');
        });

        this.downBtn.addEventListener('click', () => {
            this.handleMobileDirection('ArrowDown');
        });

        this.leftBtn.addEventListener('click', () => {
            this.handleMobileDirection('ArrowLeft');
        });

        this.rightBtn.addEventListener('click', () => {
            this.handleMobileDirection('ArrowRight');
        });

        // Touch events for better mobile responsiveness
        [this.upBtn, this.downBtn, this.leftBtn, this.rightBtn].forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                btn.classList.add('active');
            });

            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                btn.classList.remove('active');
            });
        });

        // Leaderboard button event listener
        this.clearLeaderboardBtn.addEventListener('click', () => {
            this.clearLeaderboard();
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

    handleMobileDirection(direction) {
        if (!this.gameRunning || this.gamePaused) return;

        // Start the game when first mobile button is pressed
        if (!this.gameStarted) {
            this.gameStarted = true;
        }

        this.changeDirection(direction);
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
        if (!this.gameRunning || this.gamePaused || !this.gameStarted) return;

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
            this.increaseSpeed(); // Increase speed every time food is eaten!
            this.checkLevelProgression();
            this.updateProgressBar();
            this.food = this.generateFood();
        } else {
            this.snake.pop();
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#2d3748';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Show start message if game hasn't started
        if (!this.gameStarted && this.gameRunning && !this.gamePaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = 'white';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('🎮 GET READY!', this.canvas.width / 2, this.canvas.height / 2 - 20);
            this.ctx.font = '16px Arial';
            this.ctx.fillText('Game starts in a moment...', this.canvas.width / 2, this.canvas.height / 2 + 20);
            this.ctx.fillText('Use ⬆️⬇️⬅️➡️ to control', this.canvas.width / 2, this.canvas.height / 2 + 45);
            return;
        }

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

        // Draw food (temporarily back to simple red cube for testing)
        this.ctx.fillStyle = '#e53e3e';
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );

        // Draw food highlight
        this.ctx.fillStyle = '#fc8181';
        this.ctx.fillRect(
            this.food.x * this.gridSize + 2,
            this.food.y * this.gridSize + 2,
            this.gridSize - 6,
            this.gridSize - 6
        );
    }

    drawApple(x, y, size) {
        const ctx = this.ctx;
        const centerX = x + size / 2;
        const centerY = y + size / 2;
        const radius = (size - 4) / 2;

        // Save the current context state
        ctx.save();

        // Draw apple body (red gradient)
        const appleGradient = ctx.createRadialGradient(
            centerX - radius * 0.3, centerY - radius * 0.3, 0,
            centerX, centerY, radius
        );
        appleGradient.addColorStop(0, '#ff6b6b');
        appleGradient.addColorStop(0.7, '#e53e3e');
        appleGradient.addColorStop(1, '#c53030');

        ctx.fillStyle = appleGradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.9, 0, 2 * Math.PI);
        ctx.fill();

        // Draw apple indent at the top (using arc instead of ellipse)
        ctx.fillStyle = '#c53030';
        ctx.beginPath();
        ctx.arc(centerX, y + size * 0.2, radius * 0.2, 0, Math.PI);
        ctx.fill();

        // Draw stem (brown)
        ctx.fillStyle = '#8b4513';
        ctx.fillRect(centerX - 1, y + size * 0.1, 2, size * 0.15);

        // Draw leaf (green) - using arc instead of ellipse
        ctx.fillStyle = '#48bb78';
        ctx.beginPath();
        ctx.arc(centerX + radius * 0.4, y + size * 0.15, radius * 0.2, 0, 2 * Math.PI);
        ctx.fill();

        // Draw apple shine/highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(centerX - radius * 0.3, centerY - radius * 0.3, radius * 0.3, 0, 2 * Math.PI);
        ctx.fill();

        // Restore the context state
        ctx.restore();
    }

    gameOver() {
        this.gameRunning = false;
        this.pauseBtn.textContent = 'Pause';
        this.pauseBtn.disabled = true;

        // Stop the game loop
        this.stopGameLoop();

        // Update high score
        const currentHighScore = this.getHighScore();
        if (this.score > currentHighScore) {
            this.setHighScore(this.score);
            this.highScoreElement.textContent = this.score;
        }

        // Save to leaderboard (only if player scored points)
        if (this.score > 0) {
            this.saveToLeaderboard(this.score, this.level);
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

    startGameLoop() {
        if (this.gameLoopId) {
            clearTimeout(this.gameLoopId);
        }
        this.gameLoop();
    }

    gameLoop() {
        // Double check that we should still be running
        if (!this.gameRunning && this.gameStarted) {
            this.stopGameLoop();
            return;
        }
        
        this.update();
        this.draw();

        // Continue the loop only if the game is still running
        if (this.gameRunning || !this.gameStarted) {
            // Use dynamic speed that increases with each food eaten
            this.gameLoopId = setTimeout(() => {
                this.gameLoop();
            }, this.currentSpeed);
        } else {
            this.stopGameLoop();
        }
    }

    stopGameLoop() {
        if (this.gameLoopId) {
            clearTimeout(this.gameLoopId);
            this.gameLoopId = null;
        }
    }

    // NEW: Increase speed every time food is eaten
    increaseSpeed() {
        // Decrease delay time to increase speed (faster = lower number) - 50% less aggressive
        this.currentSpeed = Math.max(this.minSpeed, this.currentSpeed - 4);
        
        // Visual feedback - show speed increase notification
        this.showSpeedIncrease();
    }

    // NEW: Show visual feedback when speed increases
    showSpeedIncrease() {
        // Create a temporary speed notification
        const notification = document.createElement('div');
        notification.textContent = '🚀 SPEED UP!';
        notification.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #ff6b6b, #ee5a24);
            color: white;
            padding: 10px 15px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: speedNotification 1.5s ease-out forwards;
        `;
        
        // Add CSS animation for the notification
        const style = document.createElement('style');
        style.textContent = `
            @keyframes speedNotification {
                0% { transform: translateY(-20px) scale(0.8); opacity: 0; }
                20% { transform: translateY(0) scale(1.1); opacity: 1; }
                80% { transform: translateY(0) scale(1); opacity: 1; }
                100% { transform: translateY(-10px) scale(0.9); opacity: 0; }
            }
        `;
        
        if (!document.querySelector('#speed-notification-style')) {
            style.id = 'speed-notification-style';
            document.head.appendChild(style);
        }
        
        // Add to game container
        const gameContainer = document.querySelector('.game-container');
        gameContainer.style.position = 'relative';
        gameContainer.appendChild(notification);
        
        // Remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 1500);
    }

    // NEW: Check if player has reached a new level
    checkLevelProgression() {
        const newLevel = Math.floor(this.score / this.pointsPerLevel) + 1;
        
        if (newLevel > this.level) {
            this.level = newLevel;
            this.updateLevel();
            this.showLevelUpNotification();
            
            // Extra speed boost on level up - 50% less aggressive
            this.currentSpeed = Math.max(this.minSpeed, this.currentSpeed - 7);
        }
    }

    // NEW: Update level display
    updateLevel() {
        this.levelElement.textContent = this.level;
    }

    // NEW: Update progress bar towards next level
    updateProgressBar() {
        const currentLevelScore = this.score % this.pointsPerLevel;
        const progressPercent = (currentLevelScore / this.pointsPerLevel) * 100;
        
        this.progressFillElement.style.width = progressPercent + '%';
        this.progressTextElement.textContent = `${currentLevelScore} / ${this.pointsPerLevel}`;
    }

    // NEW: Show level up notification
    showLevelUpNotification() {
        this.newLevelDisplay.textContent = this.level;
        this.levelUpNotification.style.display = 'block';

        // Hide notification after 2 seconds
        setTimeout(() => {
            this.levelUpNotification.style.display = 'none';
        }, 2000);
    }

    // LEADERBOARD SYSTEM
    // Load and display leaderboard from localStorage
    loadLeaderboard() {
        this.updateLeaderboard();
    }

    // Get leaderboard data from localStorage
    getLeaderboard() {
        const leaderboard = localStorage.getItem('snakeLeaderboard');
        return leaderboard ? JSON.parse(leaderboard) : [];
    }

    // Save new score to leaderboard
    saveToLeaderboard(score, level) {
        const leaderboard = this.getLeaderboard();
        const timestamp = new Date().toISOString();

        // Add new entry
        const newEntry = {
            score: score,
            level: level,
            timestamp: timestamp,
            id: Date.now() // Simple unique ID
        };

        leaderboard.push(newEntry);

        // Sort by score (highest first), then by level (highest first)
        leaderboard.sort((a, b) => {
            if (a.score !== b.score) {
                return b.score - a.score; // Higher score first
            }
            return b.level - a.level; // If scores are equal, higher level first
        });

        // Keep only top 10 scores
        const topScores = leaderboard.slice(0, 10);

        // Save back to localStorage
        localStorage.setItem('snakeLeaderboard', JSON.stringify(topScores));

        // Update the display
        this.updateLeaderboard(newEntry.id);
    }

    // Update leaderboard visual display
    updateLeaderboard(highlightId = null) {
        const leaderboard = this.getLeaderboard();

        // Clear current leaderboard display
        this.leaderboardList.innerHTML = '';

        if (leaderboard.length === 0) {
            // Show empty state
            const emptyEntry = document.createElement('div');
            emptyEntry.className = 'leaderboard-entry empty';
            emptyEntry.innerHTML = `
                <span class="rank">-</span>
                <span class="score">No scores yet</span>
                <span class="level">-</span>
            `;
            this.leaderboardList.appendChild(emptyEntry);
            return;
        }

        // Display each leaderboard entry
        leaderboard.forEach((entry, index) => {
            const rank = index + 1;
            const entryElement = document.createElement('div');
            entryElement.className = 'leaderboard-entry';

            // Highlight new score briefly
            if (highlightId && entry.id === highlightId) {
                entryElement.classList.add('highlight');

                // Remove highlight after animation
                setTimeout(() => {
                    entryElement.classList.remove('highlight');
                }, 2000);
            }

            entryElement.innerHTML = `
                <span class="rank" data-rank="${rank}">${rank}</span>
                <span class="score">${entry.score}</span>
                <span class="level">${entry.level}</span>
            `;

            this.leaderboardList.appendChild(entryElement);
        });
    }

    // Clear all leaderboard data
    clearLeaderboard() {
        // Confirm with user before clearing
        if (confirm('Are you sure you want to clear the entire leaderboard? This cannot be undone.')) {
            localStorage.removeItem('snakeLeaderboard');
            this.updateLeaderboard();

            // Show confirmation notification
            this.showLeaderboardClearedNotification();
        }
    }

    // Show confirmation that leaderboard was cleared
    showLeaderboardClearedNotification() {
        const notification = document.createElement('div');
        notification.textContent = '🗑️ Leaderboard Cleared!';
        notification.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(45deg, #e53e3e, #c53030);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            font-weight: bold;
            font-size: 16px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
            z-index: 2000;
            animation: fadeInOut 2s ease-out forwards;
        `;

        // Add CSS animation for the notification
        if (!document.querySelector('#clear-notification-style')) {
            const style = document.createElement('style');
            style.id = 'clear-notification-style';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
                    20%, 80% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
                    100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(notification);

        // Remove after animation
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 2000);
    }
}

// Start the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
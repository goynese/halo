/**
 * Halo: Combat Evolved Mini-Games
 * A collection of simple mini-games based on Halo story events
 */

// Main minigame controller
const HaloMiniGames = {
    // Current game instance
    currentGame: null,
    
    // Game container element
    gameContainer: null,
    
    // Initialize the mini-game system
    init: function() {
        // Create game container if it doesn't exist
        if (!this.gameContainer) {
            this.gameContainer = document.createElement('div');
            this.gameContainer.id = 'minigame-container';
            this.gameContainer.className = 'minigame-container';
            
            // Add to the page after the story content
            const storyContent = document.querySelector('.story-content');
            if (storyContent) {
                storyContent.appendChild(this.gameContainer);
            }
        }
        
        // Determine which game to load based on the current page
        this.loadGameForCurrentPage();
    },
    
    // Load the appropriate game for the current page
    loadGameForCurrentPage: function() {
        const path = window.location.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1);
        
        // Clear the container
        this.gameContainer.innerHTML = '';
        
        // Add game title
        const gameTitle = document.createElement('h3');
        gameTitle.className = 'minigame-title';
        gameTitle.textContent = 'UNSC COMBAT SIMULATION';
        this.gameContainer.appendChild(gameTitle);
        
        // Create game canvas
        const canvas = document.createElement('canvas');
        canvas.id = 'game-canvas';
        canvas.width = 800;
        canvas.height = 400;
        this.gameContainer.appendChild(canvas);
        
        // Add game controls info
        const controls = document.createElement('div');
        controls.className = 'game-controls';
        this.gameContainer.appendChild(controls);
        
        // Add start button
        const startButton = document.createElement('button');
        startButton.className = 'game-button';
        startButton.textContent = 'START SIMULATION';
        this.gameContainer.appendChild(startButton);
        
        // Initialize the appropriate game based on the current page
        switch(filename) {
            case 'story1.html': // First Encounter
                this.currentGame = new FirstEncounterGame(canvas, controls, startButton);
                break;
            case 'story2.html': // Beach Assault
                this.currentGame = new BeachAssaultGame(canvas, controls, startButton);
                break;
            case 'story3.html': // Flood Reveal
                this.currentGame = new FloodEscapeGame(canvas, controls, startButton);
                break;
            case 'story4.html': // Warthog Escape
                this.currentGame = new WarthogRaceGame(canvas, controls, startButton);
                break;
            case 'story5.html': // Guilty Spark
                this.currentGame = new MonitorMazeGame(canvas, controls, startButton);
                break;
            case 'story6.html': // Covenant Elite
                this.currentGame = new EliteCombatGame(canvas, controls, startButton);
                break;
            case 'story7.html': // Cortana
                this.currentGame = new DataHackGame(canvas, controls, startButton);
                break;
            case 'story8.html': // Captain Keyes
                this.currentGame = new CaptainRescueGame(canvas, controls, startButton);
                break;
            case 'story9.html': // Sergeant Johnson
                this.currentGame = new MarineDefenseGame(canvas, controls, startButton);
                break;
            case 'story10.html': // Marine's Story
                this.currentGame = new SurvivalGame(canvas, controls, startButton);
                break;
            default:
                // No game for this page
                this.gameContainer.innerHTML = '<p class="no-game">No combat simulation available for this page.</p>';
                return;
        }
        
        // Initialize the game
        if (this.currentGame) {
            this.currentGame.init();
        }
    }
};

// Base Game class that all mini-games inherit from
class BaseGame {
    constructor(canvas, controlsElement, startButton) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.controlsElement = controlsElement;
        this.startButton = startButton;
        this.isRunning = false;
        this.animationFrame = null;
        
        // Bind the start game method to the button
        this.startButton.addEventListener('click', () => this.startGame());
    }
    
    init() {
        // Set up controls info
        this.controlsElement.innerHTML = this.getControlsHTML();
        
        // Draw initial screen
        this.drawTitleScreen();
    }
    
    getControlsHTML() {
        return '<p>Use arrow keys to move. Space to shoot.</p>';
    }
    
    drawTitleScreen() {
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.fillStyle = '#0a0e14';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw title
        ctx.fillStyle = '#00ccff';
        ctx.font = '30px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(this.getGameTitle(), this.canvas.width / 2, 100);
        
        // Draw instructions
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '16px Roboto, sans-serif';
        ctx.fillText('Click START SIMULATION to begin', this.canvas.width / 2, 150);
        
        // Draw game preview
        this.drawGamePreview();
    }
    
    drawGamePreview() {
        // Override in subclasses to draw a preview of the game
    }
    
    getGameTitle() {
        return 'HALO COMBAT SIMULATION';
    }
    
    startGame() {
        this.isRunning = true;
        this.startButton.textContent = 'RESTART SIMULATION';
        this.gameLoop();
    }
    
    stopGame() {
        this.isRunning = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        // Update game state
        this.update();
        
        // Render the game
        this.render();
        
        // Continue the game loop
        this.animationFrame = requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        // Override in subclasses to update game state
    }
    
    render() {
        // Override in subclasses to render the game
    }
}

// First Encounter - A simple shooter where Master Chief fights Covenant on the Pillar of Autumn
class FirstEncounterGame extends BaseGame {
    constructor(canvas, controlsElement, startButton) {
        super(canvas, controlsElement, startButton);
        
        this.player = {
            x: 50,
            y: this.canvas.height / 2,
            width: 30,
            height: 50,
            speed: 5,
            bullets: []
        };
        
        this.enemies = [];
        this.enemySpawnTimer = 0;
        this.score = 0;
    }
    
    getGameTitle() {
        return 'FIRST ENCOUNTER: DEFEND THE AUTUMN';
    }
    
    getControlsHTML() {
        return '<p>Arrow keys to move Master Chief. Space to fire assault rifle.</p>';
    }
    
    drawGamePreview() {
        const ctx = this.ctx;
        
        // Draw player representation
        ctx.fillStyle = '#00cc00'; // Green for Master Chief
        ctx.fillRect(100, this.canvas.height / 2 - 25, 30, 50);
        
        // Draw enemy representation
        ctx.fillStyle = '#9900cc'; // Purple for Covenant
        ctx.fillRect(600, this.canvas.height / 2 - 20, 40, 40);
        
        // Draw bullet representation
        ctx.fillStyle = '#ffcc00'; // Yellow for bullets
        ctx.fillRect(150, this.canvas.height / 2, 20, 5);
    }
    
    startGame() {
        super.startGame();
        
        // Reset game state
        this.player.x = 50;
        this.player.y = this.canvas.height / 2;
        this.player.bullets = [];
        this.enemies = [];
        this.enemySpawnTimer = 0;
        this.score = 0;
        
        // Set up keyboard controls
        this.setupControls();
    }
    
    setupControls() {
        // Key states
        this.keys = {
            up: false,
            down: false,
            left: false,
            right: false,
            space: false
        };
        
        // Key down handler
        window.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.keys.up = true;
                    break;
                case 'ArrowDown':
                    this.keys.down = true;
                    break;
                case 'ArrowLeft':
                    this.keys.left = true;
                    break;
                case 'ArrowRight':
                    this.keys.right = true;
                    break;
                case ' ':
                    if (!this.keys.space) {
                        this.keys.space = true;
                        this.fireBullet();
                    }
                    break;
            }
        });
        
        // Key up handler
        window.addEventListener('keyup', (e) => {
            switch(e.key) {
                case 'ArrowUp':
                    this.keys.up = false;
                    break;
                case 'ArrowDown':
                    this.keys.down = false;
                    break;
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
                case ' ':
                    this.keys.space = false;
                    break;
            }
        });
    }
    
    fireBullet() {
        this.player.bullets.push({
            x: this.player.x + this.player.width,
            y: this.player.y + this.player.height / 2 - 2.5,
            width: 20,
            height: 5,
            speed: 10
        });
    }
    
    spawnEnemy() {
        this.enemies.push({
            x: this.canvas.width,
            y: Math.random() * (this.canvas.height - 40),
            width: 40,
            height: 40,
            speed: 2 + Math.random() * 3
        });
    }
    
    update() {
        // Move player based on key states
        if (this.keys.up) this.player.y -= this.player.speed;
        if (this.keys.down) this.player.y += this.player.speed;
        if (this.keys.left) this.player.x -= this.player.speed;
        if (this.keys.right) this.player.x += this.player.speed;
        
        // Keep player in bounds
        if (this.player.y < 0) this.player.y = 0;
        if (this.player.y > this.canvas.height - this.player.height) this.player.y = this.canvas.height - this.player.height;
        if (this.player.x < 0) this.player.x = 0;
        if (this.player.x > this.canvas.width - this.player.width) this.player.x = this.canvas.width - this.player.width;
        
        // Update bullets
        for (let i = this.player.bullets.length - 1; i >= 0; i--) {
            const bullet = this.player.bullets[i];
            bullet.x += bullet.speed;
            
            // Remove bullets that go off screen
            if (bullet.x > this.canvas.width) {
                this.player.bullets.splice(i, 1);
            }
        }
        
        // Spawn enemies
        this.enemySpawnTimer++;
        if (this.enemySpawnTimer >= 60) { // Spawn every 60 frames (about 1 second)
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }
        
        // Update enemies
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.x -= enemy.speed;
            
            // Check for collision with bullets
            for (let j = this.player.bullets.length - 1; j >= 0; j--) {
                const bullet = this.player.bullets[j];
                
                if (this.checkCollision(bullet, enemy)) {
                    this.enemies.splice(i, 1);
                    this.player.bullets.splice(j, 1);
                    this.score += 10;
                    break;
                }
            }
            
            // Check for collision with player
            if (this.checkCollision(this.player, enemy)) {
                this.gameOver();
                return;
            }
            
            // Remove enemies that go off screen
            if (enemy.x + enemy.width < 0) {
                this.enemies.splice(i, 1);
            }
        }
    }
    
    checkCollision(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    gameOver() {
        this.stopGame();
        
        // Draw game over screen
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.fillStyle = '#0a0e14';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw game over message
        ctx.fillStyle = '#ff0000';
        ctx.font = '30px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('SIMULATION TERMINATED', this.canvas.width / 2, 100);
        
        // Draw score
        ctx.fillStyle = '#00ccff';
        ctx.fillText(`SCORE: ${this.score}`, this.canvas.width / 2, 150);
        
        // Draw restart message
        ctx.fillStyle = '#e0e0e0';
        ctx.font = '16px Roboto, sans-serif';
        ctx.fillText('Click RESTART SIMULATION to try again', this.canvas.width / 2, 200);
    }
    
    render() {
        const ctx = this.ctx;
        
        // Clear canvas
        ctx.fillStyle = '#0a0e14';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw player
        ctx.fillStyle = '#00cc00'; // Green for Master Chief
        ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // Draw bullets
        ctx.fillStyle = '#ffcc00'; // Yellow for bullets
        for (const bullet of this.player.bullets) {
            ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        }
        
        // Draw enemies
        ctx.fillStyle = '#9900cc'; // Purple for Covenant
        for (const enemy of this.enemies) {
            ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        }
        
        // Draw score
        ctx.fillStyle = '#00ccff';
        ctx.font = '20px Orbitron, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`SCORE: ${this.score}`, 20, 30);
    }
}

// Beach Assault - A game where you control a Warthog on the beach, avoiding obstacles and enemies
class BeachAssaultGame extends BaseGame {
    getGameTitle() { return 'BEACH ASSAULT: WARTHOG RUN'; }
    getControlsHTML() { return '<p>Up/Down arrows to steer the Warthog. Avoid obstacles and Covenant forces.</p>'; }
}

// Placeholder classes for other games
class FloodEscapeGame extends BaseGame {
    getGameTitle() { return 'FLOOD CONTAINMENT BREACH'; }
    getControlsHTML() { return '<p>Arrow keys to move. Avoid Flood infection forms.</p>'; }
}

class WarthogRaceGame extends BaseGame {
    getGameTitle() { return 'FINAL COUNTDOWN: ESCAPE RUN'; }
    getControlsHTML() { return '<p>Left/Right arrows to steer. Avoid falling debris.</p>'; }
}

class MonitorMazeGame extends BaseGame {
    getGameTitle() { return 'MONITOR MAZE: LIBRARY NAVIGATION'; }
    getControlsHTML() { return '<p>Arrow keys to navigate the maze. Find the Index.</p>'; }
}

class EliteCombatGame extends BaseGame {
    getGameTitle() { return 'ELITE COMBAT TRAINING'; }
    getControlsHTML() { return '<p>Arrow keys to move. Space to use Energy Sword.</p>'; }
}

class DataHackGame extends BaseGame {
    getGameTitle() { return 'CORTANA: DATA INFILTRATION'; }
    getControlsHTML() { return '<p>Match the symbols to hack Covenant systems.</p>'; }
}

class CaptainRescueGame extends BaseGame {
    getGameTitle() { return 'CAPTAIN RESCUE MISSION'; }
    getControlsHTML() { return '<p>Arrow keys to move. Space to shoot. Find Captain Keyes.</p>'; }
}

class MarineDefenseGame extends BaseGame {
    getGameTitle() { return 'MARINE DEFENSE: HOLD THE LINE'; }
    getControlsHTML() { return '<p>Arrow keys to move. Space to shoot. Defend your position.</p>'; }
}

class SurvivalGame extends BaseGame {
    getGameTitle() { return 'MARINE SURVIVAL: LAST STAND'; }
    getControlsHTML() { return '<p>Arrow keys to move. Space to shoot. Survive as long as possible.</p>'; }
}

// Initialize mini-games when the page loads
document.addEventListener('DOMContentLoaded', function() {
    HaloMiniGames.init();
});

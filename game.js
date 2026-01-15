// Game state
let canvas, ctx;
let pacman, ghosts = [];
let walls = [], pellets = [];
let score = 0, lives = 3;
let gameStarted = false;
let gameOver = false;
let keys = {};

// Game constants
const MAZE_SIZE = 20;
const CELL_SIZE = 1;  // Size of each grid cell
const CELL_CENTER_OFFSET = 0.5;  // Offset to center of cell
const PACMAN_SPEED = 3;
const GHOST_SPEED = 2;

// Maze layout (1 = wall, 0 = path, 2 = pellet)
const mazeLayout = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,1,2,2,2,1,1,2,2,2,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,0,1,1,0,1,1,1,2,1,1,1,1],
    [1,2,2,2,2,1,0,0,0,0,0,0,0,0,1,2,2,2,2,1],
    [1,2,1,1,2,1,0,1,1,0,0,1,1,0,1,2,1,1,2,1],
    [1,2,2,2,2,0,0,1,0,0,0,0,1,0,0,2,2,2,2,1],
    [1,2,1,1,2,1,0,1,1,1,1,1,1,0,1,2,1,1,2,1],
    [1,2,2,2,2,1,0,0,0,0,0,0,0,0,1,2,2,2,2,1],
    [1,1,1,1,2,1,1,1,0,1,1,0,1,1,1,2,1,1,1,1],
    [1,2,2,2,2,1,2,2,2,1,1,2,2,2,1,2,2,2,2,1],
    [1,2,1,1,2,1,2,1,1,1,1,1,1,2,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,2,1,1,1,2,1,1,2,1,1,1,2,1,1,2,1],
    [1,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,1],
    [1,2,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,2,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Initialize game
function init() {
    // Create canvas
    canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.insertBefore(canvas, document.body.firstChild);
    ctx = canvas.getContext('2d');

    // Initialize game objects
    initMaze();
    initPacman();
    initGhosts();

    // Event listeners
    window.addEventListener('resize', onWindowResize);
    document.addEventListener('keydown', (e) => { 
        keys[e.key.toLowerCase()] = true; 
        e.preventDefault();
    });
    document.addEventListener('keyup', (e) => { 
        keys[e.key.toLowerCase()] = false; 
        e.preventDefault();
    });

    // Start animation loop
    animate();
}

function initMaze() {
    // Create walls and pellets
    for (let z = 0; z < MAZE_SIZE; z++) {
        for (let x = 0; x < MAZE_SIZE; x++) {
            const cellValue = mazeLayout[z][x];
            
            if (cellValue === 1) {
                walls.push({ x, z });
            } else if (cellValue === 2) {
                pellets.push({ x, z, collected: false });
            }
        }
    }
}

function initPacman() {
    pacman = {
        x: 1.5,  // Center of cell (1, 1)
        z: 1.5,  // Center of cell (1, 1)
        velocityX: 0,
        velocityZ: 0,
        angle: 0
    };
}

function initGhosts() {
    const ghostColors = ['#ff0000', '#ff00ff', '#00ffff', '#ffaa00'];
    const ghostPositions = [
        { x: 18.5, z: 1.5 },   // Center of cells
        { x: 18.5, z: 18.5 },
        { x: 1.5, z: 18.5 },
        { x: 9.5, z: 9.5 }
    ];

    for (let i = 0; i < 4; i++) {
        ghosts.push({
            x: ghostPositions[i].x,
            z: ghostPositions[i].z,
            velocityX: 0,
            velocityZ: 0,
            color: ghostColors[i],
            targetDirection: Math.random() * Math.PI * 2
        });
    }
}

function startGame() {
    gameStarted = true;
    document.getElementById('startScreen').style.display = 'none';
}

// Make functions globally accessible
window.startGame = startGame;

function restartGame() {
    // Reset game state
    score = 0;
    lives = 3;
    gameOver = false;
    gameStarted = true;
    
    // Update UI
    document.getElementById('score').textContent = score;
    document.getElementById('lives').textContent = lives;
    document.getElementById('gameOver').style.display = 'none';
    
    // Reset Pacman
    pacman.x = 1.5;
    pacman.z = 1.5;
    pacman.velocityX = 0;
    pacman.velocityZ = 0;
    
    // Reset ghosts
    const ghostPositions = [
        { x: 18.5, z: 1.5 },
        { x: 18.5, z: 18.5 },
        { x: 1.5, z: 18.5 },
        { x: 9.5, z: 9.5 }
    ];
    ghosts.forEach((ghost, i) => {
        ghost.x = ghostPositions[i].x;
        ghost.z = ghostPositions[i].z;
        ghost.velocityX = 0;
        ghost.velocityZ = 0;
    });
    
    // Reset pellets
    pellets.forEach(pellet => {
        pellet.collected = false;
    });
}

function updatePacman(deltaTime) {
    if (!gameStarted || gameOver) return;

    // Handle input
    let targetVelX = 0, targetVelZ = 0;
    
    if (keys['arrowup'] || keys['w']) {
        targetVelZ = -PACMAN_SPEED * deltaTime;
        pacman.angle = -Math.PI / 2;
    } else if (keys['arrowdown'] || keys['s']) {
        targetVelZ = PACMAN_SPEED * deltaTime;
        pacman.angle = Math.PI / 2;
    }
    
    if (keys['arrowleft'] || keys['a']) {
        targetVelX = -PACMAN_SPEED * deltaTime;
        pacman.angle = Math.PI;
    } else if (keys['arrowright'] || keys['d']) {
        targetVelX = PACMAN_SPEED * deltaTime;
        pacman.angle = 0;
    }
    
    // Apply velocity
    const newX = pacman.x + targetVelX;
    const newZ = pacman.z + targetVelZ;
    
    // Check collision with walls
    if (!checkWallCollision(newX, pacman.z)) {
        pacman.x = newX;
    }
    if (!checkWallCollision(pacman.x, newZ)) {
        pacman.z = newZ;
    }
    
    // Keep Pacman in bounds
    pacman.x = Math.max(0, Math.min(MAZE_SIZE - 1, pacman.x));
    pacman.z = Math.max(0, Math.min(MAZE_SIZE - 1, pacman.z));
    
    // Check pellet collection
    checkPelletCollection();
    
    // Check ghost collision
    checkGhostCollision();
}

function updateGhosts(deltaTime) {
    if (!gameStarted || gameOver) return;

    ghosts.forEach(ghost => {
        // Simple AI: move towards Pacman with some randomness
        const dx = pacman.x - ghost.x;
        const dz = pacman.z - ghost.z;
        
        // Add some randomness
        if (Math.random() < 0.02) {
            ghost.targetDirection = Math.random() * Math.PI * 2;
        } else if (Math.random() < 0.8) {
            ghost.targetDirection = Math.atan2(dz, dx);
        }
        
        // Move ghost
        const newX = ghost.x + Math.cos(ghost.targetDirection) * GHOST_SPEED * deltaTime;
        const newZ = ghost.z + Math.sin(ghost.targetDirection) * GHOST_SPEED * deltaTime;
        
        // Check collision with walls
        if (!checkWallCollision(newX, ghost.z)) {
            ghost.x = newX;
        } else {
            ghost.targetDirection = Math.random() * Math.PI * 2;
        }
        
        if (!checkWallCollision(ghost.x, newZ)) {
            ghost.z = newZ;
        } else {
            ghost.targetDirection = Math.random() * Math.PI * 2;
        }
        
        // Keep ghost in bounds
        ghost.x = Math.max(0, Math.min(MAZE_SIZE - 1, ghost.x));
        ghost.z = Math.max(0, Math.min(MAZE_SIZE - 1, ghost.z));
    });
}

function checkWallCollision(x, z) {
    const collisionRadius = 0.4;
    
    // Check all walls for collision
    for (let wall of walls) {
        // Find the closest point on the wall square to Pacman's position
        // Wall occupies grid cell from (wall.x, wall.z) to (wall.x + CELL_SIZE, wall.z + CELL_SIZE)
        const closestX = Math.max(wall.x, Math.min(x, wall.x + CELL_SIZE));
        const closestZ = Math.max(wall.z, Math.min(z, wall.z + CELL_SIZE));
        
        // Calculate distance from Pacman to closest point on wall
        const dx = x - closestX;
        const dz = z - closestZ;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        // Check if Pacman's collision circle overlaps with the wall
        if (distance < collisionRadius) {
            return true;
        }
    }
    return false;
}

function checkPelletCollection() {
    const collectionRadius = 0.6;
    pellets.forEach(pellet => {
        if (!pellet.collected) {
            // Pellet center is at (pellet.x + CELL_CENTER_OFFSET, pellet.z + CELL_CENTER_OFFSET)
            const dx = pacman.x - (pellet.x + CELL_CENTER_OFFSET);
            const dz = pacman.z - (pellet.z + CELL_CENTER_OFFSET);
            const distance = Math.sqrt(dx * dx + dz * dz);
            
            if (distance < collectionRadius) {
                pellet.collected = true;
                score += 10;
                document.getElementById('score').textContent = score;
                
                // Check win condition
                if (pellets.every(p => p.collected)) {
                    endGame(true);
                }
            }
        }
    });
}

function checkGhostCollision() {
    const collisionRadius = 0.8;
    ghosts.forEach(ghost => {
        const dx = pacman.x - ghost.x;
        const dz = pacman.z - ghost.z;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance < collisionRadius) {
            lives--;
            document.getElementById('lives').textContent = lives;
            
            if (lives <= 0) {
                endGame(false);
            } else {
                // Reset Pacman position
                pacman.x = 1.5;
                pacman.z = 1.5;
                
                // Give player brief invincibility by resetting ghost positions
                const ghostPositions = [
                    { x: 18.5, z: 1.5 },
                    { x: 18.5, z: 18.5 },
                    { x: 1.5, z: 18.5 },
                    { x: 9.5, z: 9.5 }
                ];
                ghosts.forEach((ghost, i) => {
                    ghost.x = ghostPositions[i].x;
                    ghost.z = ghostPositions[i].z;
                });
            }
        }
    });
}

// Make restartGame globally accessible
window.restartGame = restartGame;

function endGame(won) {
    gameOver = true;
    gameStarted = false;
    const finalScoreElement = document.getElementById('finalScore');
    finalScoreElement.textContent = score;
    
    const gameOverElement = document.getElementById('gameOver');
    // Clear existing content
    gameOverElement.innerHTML = '';
    
    // Create elements safely
    const heading = document.createElement('h1');
    heading.textContent = won ? 'YOU WIN!' : 'GAME OVER';
    
    const paragraph = document.createElement('p');
    paragraph.textContent = 'Final Score: ' + score;
    
    const button = document.createElement('button');
    button.className = 'button';
    button.textContent = won ? 'PLAY AGAIN' : 'TRY AGAIN';
    button.onclick = restartGame;
    
    gameOverElement.appendChild(heading);
    gameOverElement.appendChild(paragraph);
    gameOverElement.appendChild(button);
    gameOverElement.style.display = 'block';
}

// Convert grid coordinates to isometric screen coordinates
function toIso(x, z) {
    const scale = 25;
    const offsetX = canvas.width / 2;
    const offsetY = canvas.height / 3;
    
    return {
        x: offsetX + (x - z) * scale,
        y: offsetY + (x + z) * scale / 2
    };
}

function drawMaze() {
    // Draw walls
    walls.forEach(wall => {
        const pos = toIso(wall.x, wall.z);
        const height = 40;
        
        ctx.fillStyle = '#0040ff';
        ctx.strokeStyle = '#0060ff';
        ctx.lineWidth = 2;
        
        // Draw 3D wall cube (isometric)
        // Top face
        ctx.beginPath();
        const topPos = toIso(wall.x, wall.z);
        const topRight = toIso(wall.x + 1, wall.z);
        const topLeft = toIso(wall.x, wall.z + 1);
        const topFar = toIso(wall.x + 1, wall.z + 1);
        
        ctx.moveTo(topPos.x, topPos.y - height);
        ctx.lineTo(topRight.x, topRight.y - height);
        ctx.lineTo(topFar.x, topFar.y - height);
        ctx.lineTo(topLeft.x, topLeft.y - height);
        ctx.closePath();
        ctx.fillStyle = '#0060ff';
        ctx.fill();
        ctx.stroke();
        
        // Right face
        ctx.beginPath();
        ctx.moveTo(topRight.x, topRight.y - height);
        ctx.lineTo(topRight.x, topRight.y);
        ctx.lineTo(topFar.x, topFar.y);
        ctx.lineTo(topFar.x, topFar.y - height);
        ctx.closePath();
        ctx.fillStyle = '#0040ff';
        ctx.fill();
        ctx.stroke();
        
        // Left face
        ctx.beginPath();
        ctx.moveTo(topPos.x, topPos.y - height);
        ctx.lineTo(topPos.x, topPos.y);
        ctx.lineTo(topLeft.x, topLeft.y);
        ctx.lineTo(topLeft.x, topLeft.y - height);
        ctx.closePath();
        ctx.fillStyle = '#0030dd';
        ctx.fill();
        ctx.stroke();
    });
    
    // Draw pellets
    pellets.forEach(pellet => {
        if (!pellet.collected) {
            const pos = toIso(pellet.x + CELL_CENTER_OFFSET, pellet.z + CELL_CENTER_OFFSET);
            const pulse = Math.sin(Date.now() * 0.005) * 2 + 5;
            
            ctx.beginPath();
            ctx.arc(pos.x, pos.y - 5, pulse, 0, Math.PI * 2);
            ctx.fillStyle = '#ffff00';
            ctx.fill();
            
            // Glow effect
            ctx.beginPath();
            ctx.arc(pos.x, pos.y - 5, pulse + 3, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 0, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

function drawPacman() {
    const pos = toIso(pacman.x, pacman.z);
    const radius = 12;
    const mouthAngle = Math.abs(Math.sin(Date.now() * 0.01)) * 0.3;
    
    // Draw Pacman
    ctx.beginPath();
    ctx.arc(pos.x, pos.y - 10, radius, 
            pacman.angle + mouthAngle, 
            pacman.angle + Math.PI * 2 - mouthAngle);
    ctx.lineTo(pos.x, pos.y - 10);
    ctx.closePath();
    ctx.fillStyle = '#ffff00';
    ctx.fill();
    
    // Shadow
    ctx.beginPath();
    ctx.ellipse(pos.x, pos.y + 5, radius * 0.8, radius * 0.3, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();
    
    // Eye
    const eyeX = pos.x + Math.cos(pacman.angle) * radius * 0.4;
    const eyeY = pos.y - 10 + Math.sin(pacman.angle) * radius * 0.4 - radius * 0.3;
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#000';
    ctx.fill();
}

function drawGhosts() {
    ghosts.forEach(ghost => {
        const pos = toIso(ghost.x, ghost.z);
        const radius = 12;
        
        // Draw ghost body
        ctx.beginPath();
        ctx.arc(pos.x, pos.y - 15, radius, Math.PI, 0);
        ctx.lineTo(pos.x + radius, pos.y);
        
        // Wavy bottom
        const waves = 4;
        for (let i = 0; i < waves; i++) {
            const waveX = pos.x + radius - (radius * 2 / waves) * i;
            const waveY = pos.y + (i % 2 === 0 ? 3 : 0);
            ctx.lineTo(waveX - radius / waves, waveY);
        }
        ctx.lineTo(pos.x - radius, pos.y);
        ctx.closePath();
        
        ctx.fillStyle = ghost.color;
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Eyes
        const eyeOffset = 4;
        [-eyeOffset, eyeOffset].forEach(offset => {
            // White of eye
            ctx.beginPath();
            ctx.arc(pos.x + offset, pos.y - 18, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#fff';
            ctx.fill();
            
            // Pupil (looking at Pacman)
            const dx = pacman.x - ghost.x;
            const dz = pacman.z - ghost.z;
            const angle = Math.atan2(dz, dx);
            const pupilX = pos.x + offset + Math.cos(angle) * 2;
            const pupilY = pos.y - 18 + Math.sin(angle) * 2;
            
            ctx.beginPath();
            ctx.arc(pupilX, pupilY, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#000';
            ctx.fill();
        });
        
        // Shadow
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y + 5, radius * 0.8, radius * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fill();
    });
}

function render() {
    // Clear canvas
    ctx.fillStyle = '#000033';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid floor
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= MAZE_SIZE; i++) {
        const start = toIso(i, 0);
        const end = toIso(i, MAZE_SIZE);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
        
        const start2 = toIso(0, i);
        const end2 = toIso(MAZE_SIZE, i);
        ctx.beginPath();
        ctx.moveTo(start2.x, start2.y);
        ctx.lineTo(end2.x, end2.y);
        ctx.stroke();
    }
    
    // Draw game objects (order matters for proper layering)
    drawMaze();
    drawPacman();
    drawGhosts();
}

let lastTime = Date.now();

function animate() {
    requestAnimationFrame(animate);
    
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;
    
    updatePacman(deltaTime);
    updateGhosts(deltaTime);
    
    render();
}

function onWindowResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize game when page loads
window.addEventListener('load', init);

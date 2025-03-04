// Player object with pixel position
let player = {
    x: 0,
    y: 0,
    pixelX: 0,
    pixelY: 0
};

// Load player image
const playerImg = new Image();
playerImg.src = "assets/standingRight.png";
playerImg.onload = () => {
    drawMaze(); // Draw player once the image loads
};

// Movement settings
let currentKey = null; // Tracks the current active key
let isMoving = false;
const moveSpeed = 2; // Pixels per frame
let movementDisabled = false; // Flag to disable player movement

// Disable player movement
function disablePlayerMovement() {
    movementDisabled = true;
}

// Enable player movement
function enablePlayerMovement() {
    movementDisabled = false;
}

function resetGame() {
    resetTimer(); // Reset the timer
    resetPlayer(); // Reset player position
    setup(); // Regenerate the maze
    resetHelpTries();
    defaultLightbulbs()
    disableHelpButton();
    hasPlayerMoved=false;
}


/// Track last horizontal movement (left or right) for standing pose
let lastStandingDirection = "standingRight";

// Listen for keyup (release)
document.addEventListener("keyup", (e) => {
   
        if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
            // Track only the last left or right movement
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
                lastStandingDirection = e.key === "ArrowLeft" ? "standingLeft" : "standingRight";
            }
    
            // Get current cell to check for walls
            let currentCell = grid[getIndex(player.x, player.y)];
    
            // Check if the player is trapped by walls on both sides (left & right or top & bottom)
            let horizontalBlocked = currentCell.walls.left && currentCell.walls.right;
            let verticalBlocked = currentCell.walls.top && currentCell.walls.bottom;
    
            // If no movement OR player is trapped, reset to last standing pose
            if (!isMoving || currentKey === null || horizontalBlocked || verticalBlocked) {
                lastDirection = lastStandingDirection;
                ctx.clearRect(0, 0, canvas.width, canvas.height); // Remove any extra ghost images
                drawMaze(); // Redraw maze to clear any duplicated images
                drawPlayer(); // Ensure only the correct standing image is displayed
            }
    
            // Clear active key only if the key released is the currently active one
            if (e.key === currentKey) {
                lastDirection = lastStandingDirection;
                currentKey = null;
            }
        }
});





// Reset player position when the maze resets
function resetPlayer() {
    player.x = 0;
    player.y = 0;
    player.pixelX = 0;
    player.pixelY = 0;
    lastDirection = "standingRight"; // Default to standingRight when reset
    lastStandingDirection = "standingRight"; // Ensure standingRight is used
    stepCounter = 0; // Reset animation counter
    isMoving = false;
    currentKey = null;
    movementDisabled = false;
    timerStarted = false; // Ensure the timer can start fresh
    drawMaze(); // Redraw maze to clear any ghost images
    drawPlayer(); // Ensure correct standing sprite
}

// Move player with smooth pixel-by-pixel movement
function movePlayer() {
    if (!currentKey || isMoving) return; // If no key is held or already moving, stop movement

    let dx = 0, dy = 0;

    if (currentKey === "ArrowRight") { dx = 1; dy = 0; }
    else if (currentKey === "ArrowLeft") { dx = -1; dy = 0; }
    else if (currentKey === "ArrowDown") { dx = 0; dy = 1; }
    else if (currentKey === "ArrowUp") { dx = 0; dy = -1; }
    else return; // Ignore other keys

    let newX = player.x + dx;
    let newY = player.y + dy;
    let currentIndex = getIndex(player.x, player.y);
    let newIndex = getIndex(newX, newY);

    if (newIndex === -1) return; // Out of bounds

    let currentCell = grid[currentIndex];

    // **Check if movement is allowed (no walls in the way)**
    if (dx === 1 && currentCell.walls.right) return; // Right wall
    if (dx === -1 && currentCell.walls.left) return; // Left wall
    if (dy === 1 && currentCell.walls.bottom) return; // Bottom wall
    if (dy === -1 && currentCell.walls.top) return; // Top wall

    // **Start smooth pixel-by-pixel movement**
    smoothMove(newX, newY);
}

// Smoothly move player pixel by pixel
function smoothMove(targetX, targetY) {
    let endPixelX = targetX * cellSize;
    let endPixelY = targetY * cellSize;

    isMoving = true; // Lock movement

    function animate() {
        let dx = Math.sign(endPixelX - player.pixelX) * moveSpeed;
        let dy = Math.sign(endPixelY - player.pixelY) * moveSpeed;

        if (Math.abs(endPixelX - player.pixelX) <= moveSpeed) {
            player.pixelX = endPixelX;
            dx = 0;
        }
        if (Math.abs(endPixelY - player.pixelY) <= moveSpeed) {
            player.pixelY = endPixelY;
            dy = 0;
        }

        player.pixelX += dx;
        player.pixelY += dy;
        drawMaze();

        if (player.pixelX !== endPixelX || player.pixelY !== endPixelY) {
            requestAnimationFrame(animate);
        } else {
            player.x = targetX;
            player.y = targetY;
            isMoving = false;
            drawMaze();

            if (currentKey) 
                movePlayer();
            
            if (player.x === cols - 1 && player.y === rows - 1) {
                disablePlayerMovement(); // Disable movement when player wins
                stopTimer(); // Stop the timerrrr
                swal("🎉 Finish!", "You have escaped the maze! \n Congratulations on completing this task \n hope you liked it!", "success").then(() => {
                    resetGame();
                });
            }
        }
    }
    animate();
}


const images = {
    standingRight: new Image(),
    standingLeft: new Image(),
    up1: new Image(),
    up2: new Image(),
    down1: new Image(),
    down2: new Image(),
    right1: new Image(),
    right2: new Image(),
    right3: new Image(),
    left1: new Image(),
    left2: new Image(),
    left3: new Image()
};

images.standingRight.src = "assets/standingRight.png";
images.standingLeft.src = "assets/standingLeft.png";
images.up1.src = "assets/up.png";
images.up2.src = "assets/up2.png";
images.down1.src = "assets/down.png";
images.down2.src = "assets/down2.png";
images.right1.src = "assets/right1.png";
images.right2.src = "assets/right2.png";
images.right3.src = "assets/right3.png";
images.left1.src = "assets/left1.png";
images.left2.src = "assets/left2.png";
images.left3.src = "assets/left3.png";


let lastDirection = "standingRight"; // Track last movement direction
let frameSwitch = false; // Toggle animation frame for up movement
let frameCounter = 0; // Count frames to switch every 2 frames
let stepCounter = 0; // Counter to track cell movement

function drawPlayer() {
    ctx.save();

    if (lastDirection === "up") {
        ctx.drawImage(stepCounter % 2 === 0 ? images.up1 : images.up2, player.pixelX, player.pixelY, cellSize, cellSize);
    } else if (lastDirection === "down") {
        ctx.drawImage(stepCounter % 2 === 0 ? images.down1 : images.down2, player.pixelX, player.pixelY, cellSize, cellSize);
    } else if (lastDirection === "left") {
        let leftIndex = stepCounter % 3 + 1;
        ctx.drawImage(images[`left${leftIndex}`], player.pixelX, player.pixelY, cellSize, cellSize);
    } else if (lastDirection === "right") {
        let rightIndex = stepCounter % 3 + 1;
        ctx.drawImage(images[`right${rightIndex}`], player.pixelX, player.pixelY, cellSize, cellSize);
    } else {
        // Default standing pose based on last direction
        ctx.drawImage(lastStandingDirection === "standingLeft" ? images.standingLeft : images.standingRight, player.pixelX, player.pixelY, cellSize, cellSize);
    }

    ctx.restore();
}

function movePlayer() {
    if (!currentKey || isMoving) return; // If no key is held or already moving, stop movement

    let dx = 0, dy = 0;

    if (currentKey === "ArrowRight") { dx = 1; dy = 0; }
    else if (currentKey === "ArrowLeft") { dx = -1; dy = 0; }
    else if (currentKey === "ArrowDown") { dx = 0; dy = 1; }
    else if (currentKey === "ArrowUp") { dx = 0; dy = -1; }
    else return; // Ignore other keys

    let newX = player.x + dx;
    let newY = player.y + dy;
    let currentIndex = getIndex(player.x, player.y);
    let newIndex = getIndex(newX, newY);

    if (newIndex === -1) return; // Out of bounds

    let currentCell = grid[currentIndex];

    // **Check if movement is allowed (no walls in the way)**
    if (dx === 1 && currentCell.walls.right) return; // Right wall
    if (dx === -1 && currentCell.walls.left) return; // Left wall
    if (dy === 1 && currentCell.walls.bottom) return; // Bottom wall
    if (dy === -1 && currentCell.walls.top) return; // Top wall

    // **Start the timer on the first movement**
    if (!timerStarted) { 
        startTimer(); 
        timerStarted = true; // Ensure it only starts once
    }

    // Increment stepCounter for animation effect
    stepCounter++;

    // **Start smooth pixel-by-pixel movement**
    smoothMove(newX, newY);
}





document.addEventListener("keydown", (e) => {
    if (movementDisabled) return;
       

    if (["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"].includes(e.key)) {
        lastDirection = e.key === "ArrowLeft" ? "left" 
                     : e.key === "ArrowUp" ? "up" 
                     : e.key === "ArrowDown" ? "down" 
                     : "right";
                     startTimer();
                     enableHelpButton();
                     
                   
    }

    if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
        currentKey = e.key;
        if (!isMoving) 
            movePlayer();
    }
});
const originalDrawMaze = drawMaze;
drawMaze = function () {
    originalDrawMaze();
    drawPlayer();
};

// Reset button resets the timer and the maze
document.querySelector(".resetButton").addEventListener("click", () => {
    resetGame();
});

document.addEventListener("keydown", (event) => {
    if (event.key.toLowerCase() === "r")
        resetGame();
});

function teleportToFinish() {
    let finishCell = grid[grid.length - 1]; // The finish cell
    let possiblePositions = [];

    // Check valid neighbors around the finish line
    if (!finishCell.walls.left) possiblePositions.push({ x: finishCell.x - 1, y: finishCell.y });
    if (!finishCell.walls.right) possiblePositions.push({ x: finishCell.x + 1, y: finishCell.y });
    if (!finishCell.walls.top) possiblePositions.push({ x: finishCell.x, y: finishCell.y - 1 });
    if (!finishCell.walls.bottom) possiblePositions.push({ x: finishCell.x, y: finishCell.y + 1 });

    if (possiblePositions.length > 0) {
        let { x, y } = possiblePositions[0]; // Pick the first valid position

        // Teleport player
        player.x = x;
        player.y = y;
        player.pixelX = x * cellSize;
        player.pixelY = y * cellSize;

        drawMaze(); // Redraw everything to update player position
    }
}


function findShortestPath() {
    let start = grid[getIndex(player.x, player.y)]; // Start position
    let end = grid[grid.length - 1]; // End position
    let queue = [[start]]; // BFS queue
    let visited = new Set(); // Track visited cells

    visited.add(start);

    while (queue.length > 0) {
        let path = queue.shift(); // Get first path in queue
        let current = path[path.length - 1]; // Last cell in the path

        if (current === end) {
            return path; // Return shortest path found
        }

        for (let dir of directions) {
            let nx = current.x + dir.x;
            let ny = current.y + dir.y;
            let index = getIndex(nx, ny);

            if (index !== -1) {
                let nextCell = grid[index];

                // Ensure movement is valid (no walls blocking the way)
                let canMove =
                    (dir.x === 1 && !current.walls.right) ||  // Move Right
                    (dir.x === -1 && !current.walls.left) ||  // Move Left
                    (dir.y === 1 && !current.walls.bottom) || // Move Down
                    (dir.y === -1 && !current.walls.top);     // Move Up

                if (canMove && !visited.has(nextCell)) {
                    visited.add(nextCell);
                    queue.push([...path, nextCell]); // Add new path to queue
                }
            }
        }
    }

    return []; // No valid path found
}
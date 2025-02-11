// Player object
let player = { x: 0, y: 0 };

// Load player image
const playerImg = new Image();
playerImg.src = "assets/player.png";
playerImg.onload = () => {
    drawMaze(); // Draw player once the image loads
};

// Prevent double movement
let isMoving = false;
const moveSpeed = 8; // Speed of smooth movement
const frameRate = 10; // Lower values = faster movement

// Listen for key presses
document.addEventListener("keydown", (e) => {
    if (e.key === "r") {
        setup(); // Reset the maze
        resetPlayer(); // Reset the player
    } else if (!isMoving && ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
        movePlayer(e.key);
    }
});

// Reset player position when the maze resets
function resetPlayer() {
    player.x = 0;
    player.y = 0;
    drawMaze(); // Redraw the maze with player at (0,0)
}

// Move player with smooth animation
function movePlayer(key) {
    if (isMoving) return; // Prevent multiple moves at once

    let dx = 0, dy = 0;

    if (key === "ArrowRight") dx = 1;
    if (key === "ArrowLeft") dx = -1;
    if (key === "ArrowDown") dy = 1;
    if (key === "ArrowUp") dy = -1;

    let newX = player.x + dx;
    let newY = player.y + dy;
    let currentIndex = getIndex(player.x, player.y);
    let newIndex = getIndex(newX, newY);

    if (newIndex === -1) return; // Out of bounds, do nothing

    let currentCell = grid[currentIndex];
    let newCell = grid[newIndex];

    // **Check if movement is allowed (no walls in the way)**
    if (dx === 1 && currentCell.walls.right) return; // Right wall
    if (dx === -1 && currentCell.walls.left) return; // Left wall
    if (dy === 1 && currentCell.walls.bottom) return; // Bottom wall
    if (dy === -1 && currentCell.walls.top) return; // Top wall

    // **If movement is allowed, move smoothly**
    smoothMove(newX, newY);
}


// Smoothly move player pixel-by-pixel
function smoothMove(targetX, targetY) {
    let startX = player.x * cellSize;
    let startY = player.y * cellSize;
    let endX = targetX * cellSize;
    let endY = targetY * cellSize;
    let step = 0;
    
    isMoving = true;  // Lock movement at start

    function animate() {
        if (step >= cellSize) {
            player.x = targetX;
            player.y = targetY;
            drawMaze();
            isMoving = false; // Unlock movement after finishing animation

            // Check for win condition
            if (player.x === cols - 1 && player.y === rows - 1) {
                setTimeout(() => alert("🎉 You reached the goal! 🎉"), 100);
            }
            return;
        }

        drawMaze();
        let interpolatedX = startX + (endX - startX) * (step / cellSize);
        let interpolatedY = startY + (endY - startY) * (step / cellSize);

        ctx.drawImage(playerImg, interpolatedX + (cellSize - 20) / 2, interpolatedY + (cellSize - 20) / 2, 20, 20);

        step += moveSpeed;
        setTimeout(animate, frameRate);
    }

    animate();
}

// Draw the player on top of the maze
function drawPlayer() {
    ctx.drawImage(
        playerImg,
        player.x * cellSize + (cellSize - 20) / 2, // Center player image in the cell
        player.y * cellSize + (cellSize - 20) / 2,
        20, 20 // Resize to 20x20 pixels
    );
}

// Modify drawMaze to always draw the player
const originalDrawMaze = drawMaze;
drawMaze = function () {
    originalDrawMaze(); // Draw the maze first
    drawPlayer(); // Then draw the player on top
};

// Ensure reset button resets player too
document.querySelector(".resetButton").addEventListener("click", () => {
    setup();
    resetPlayer();
});

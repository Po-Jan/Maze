// Player object with pixel position
let player = {
    x: 0,
    y: 0,
    pixelX: 0,
    pixelY: 0
};

// Load player image
const playerImg = new Image();
playerImg.src = "assets/player.png";
playerImg.onload = () => {
    drawMaze(); // Draw player once the image loads
};

// Movement settings
let currentKey = null; // Tracks the current active key
let isMoving = false;
const moveSpeed = 2; // Pixels per frame

// Listen for keydown (press)
document.addEventListener("keydown", (e) => {
    if (["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
        currentKey = e.key; // Always overwrite with the latest key
        if (!isMoving) movePlayer(); // Move instantly on press
    }
});

// Listen for keyup (release)
document.addEventListener("keyup", (e) => {
    if (e.key === currentKey) {
        currentKey = null; // Only clear if it's the active key
    }
});

// Reset player position when the maze resets
function resetPlayer() {
    player.x = 0;
    player.y = 0;
    player.pixelX = 0;
    player.pixelY = 0;
    drawMaze();
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

        // Ensure strict one-direction movement
        if (dx !== 0 && dy !== 0) {
            if (Math.abs(endPixelX - player.pixelX) > Math.abs(endPixelY - player.pixelY)) {
                dy = 0; // Keep only horizontal movement
            } else {
                dx = 0; // Keep only vertical movement
            }
        }

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
            requestAnimationFrame(animate); // Continue animation
        } else {
            // Set player’s logical position in the grid
            player.x = targetX;
            player.y = targetY;
            isMoving = false; // Unlock movement
            drawMaze(); // Final draw to snap into position

            // **If another key is pressed, move immediately**
            if (currentKey) movePlayer();

            // **Check for win condition**
            if (player.x === cols - 1 && player.y === rows - 1) {
                swal("🎉 Finish!", "You have escaped the maze!", "success").then(() => {
                    resetPlayer(); // Reset player position
                    setup(); // Regenerate the maze (optional)
                });
            }

        }
    }

    animate();
}

// Draw the player on top of the maze
function drawPlayer() {
    ctx.drawImage(
        playerImg,
        player.pixelX + (cellSize - 20) / 2, // Center player image in the cell
        player.pixelY + (cellSize - 20) / 2,
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

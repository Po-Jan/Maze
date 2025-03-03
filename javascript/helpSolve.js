function solveMaze() {
    // Reset and redraw the maze before drawing the solution
    drawMaze();

    let start = grid[getIndex(player.x, player.y)]; // Start from the player's current position
    let end = grid[grid.length - 1]; // Bottom-right cell (End)
    let queue = [[start]]; // BFS queue
    let visited = new Set(); // Track visited cells
    let cameFrom = new Map(); // Store paths

    visited.add(start);

    while (queue.length > 0) {
        let path = queue.shift(); // Get the first path in queue
        let current = path[path.length - 1]; // Last cell in the current path

        if (current === end) {
            drawSolutionPath(path); // Draw final solution path

            // Clear the solution after 2 seconds
            setTimeout(() => {
                drawMaze(); // Redraw maze to remove solution
            }, 2000);

            return;
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
                    cameFrom.set(nextCell, current); // Track previous cell
                    queue.push([...path, nextCell]); // Add extended path to queue
                }
            }
        }
    }
}

// **Draw the solution path from the player to the finish**
function drawSolutionPath(path) {
    ctx.strokeStyle = "rgba(135, 206, 250, 0.85)"; // Sky Blue
    ctx.lineWidth = 26; // Increased thickness for visibility
    ctx.lineCap = "round"; // Smooth line ends

    ctx.beginPath();

    // Start the line from the player's position
    ctx.moveTo(path[0].x * cellSize + cellSize / 2, path[0].y * cellSize + cellSize / 2);

    for (let i = 1; i < path.length - 1; i++) { // Avoid overlapping end cell
        let cell = path[i];
        ctx.lineTo(cell.x * cellSize + cellSize / 2, cell.y * cellSize + cellSize / 2);
    }

    ctx.stroke();
}






let hasPlayerMoved = false; // Tracks if player has moved

// Disable help button at the start
helpButton.disabled = true;

function disableHelpButton(){
    helpButton.disabled = true;
}

// Enable help button after first movement
function enableHelpButton() {
    if (!hasPlayerMoved) {
        hasPlayerMoved = true;
        helpButton.disabled = false; 
    }
}

document.getElementById("helpButton").addEventListener("click", () => {
    if(helpButton.disabled == false){
        solveMaze();
    }
});

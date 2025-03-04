function solveMaze() {
    let path = findShortestPath();
    if (path.length > 0) {
        drawSolutionPath(path); // Draw the solution path

        // Clear the solution after 2 seconds
        setTimeout(() => {
            drawMaze(); // Redraw maze to remove solution
        }, 2000);
    }
}


function drawSolutionPath(path, fadeIn = true) {
    let opacity = fadeIn ? 0 : 0.85; // Start from 0 for fade-in, 0.85 for fade-out
    let step = fadeIn ? 0.05 : -0.05; // Increase for fade-in, decrease for fade-out
    let duration = 500; // 0.5 seconds
    let interval = 16; // ~60 FPS
    let iterations = duration / interval;
    let count = 0;

    function animate() {
        ctx.save(); // Save current state (to avoid affecting the maze)
        ctx.globalAlpha = opacity; // Apply opacity to only the solution path

        ctx.strokeStyle = "rgba(135, 206, 250, 1)"; // Sky Blue (full color, opacity controlled by globalAlpha)
        ctx.lineWidth = cellSize-25;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(path[0].x * cellSize + cellSize / 2, path[0].y * cellSize + cellSize / 2);

        for (let i = 1; i < path.length - 1; i++) {
            let cell = path[i];
            ctx.lineTo(cell.x * cellSize + cellSize / 2, cell.y * cellSize + cellSize / 2);
        }

        ctx.stroke();
        ctx.restore(); // Restore previous state (so maze is unaffected)

        opacity += step;
        count++;

        if (count < iterations) {
            requestAnimationFrame(animate);
        }
    }

    animate();
}








let hasPlayerMoved = false; // Tracks if player has moved
let helptries=3;

function resetHelpTries(){
    helptries=3
}
// Disable help button at the start
disableHelpButton();

function disableHelpButton(){
    helpButton.disabled = true;
}

// Enable help button after first movement
function enableHelpButton() {
    if (!hasPlayerMoved&&helptries>0) {
        hasPlayerMoved = true;
        helpButton.disabled = false; 
    }
}

const lightbulb1=document.getElementById("lightbulb1");
const lightbulb2=document.getElementById("lightbulb2");
const lightbulb3=document.getElementById("lightbulb3");

function defaultLightbulbs(){
    lightbulb1.classList.remove("displayNone");
    lightbulb2.classList.remove("displayNone");
    lightbulb3.classList.remove("displayNone");
}

function helpButtonFunction() {
    if (helpButton.disabled == false && helptries > 0 && timeLeft > 4000) {
        solveMaze();
        reduceTime();
        helptries--;

        if (helptries == 2)
            lightbulb1.classList.add("displayNone");
        else if (helptries == 1)
            lightbulb2.classList.add("displayNone");
        else if (helptries == 0)
            lightbulb3.classList.add("displayNone");

        disableHelpButton();
        // Enable the button after 3 seconds
        setTimeout(() => {
            helpButton.disabled = false; 
        }, 3000);
    }
}



document.getElementById("helpButton").addEventListener("click", () => {
    if(helpButton.disabled == false)
    helpButtonFunction();
});




document.addEventListener("keydown", (event) => {
     if (event.key.toLowerCase() === "h")
        if(helpButton.disabled == false)
        helpButtonFunction();
});

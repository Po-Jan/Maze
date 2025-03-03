// Timer settings
let cas=40;
let timeLeft = cas * 1000; // 40 seconds in milliseconds
let timerInterval;
let timerStarted = false; // Tracks if the timer has started
const timerDisplay = document.getElementById("TIMER");


let validStartMoves = [];

function findValidStartMoves() {
    let startCell = grid[getIndex(0, 0)]; // Get the starting cell (0,0)
    validStartMoves = [];

    if (!startCell.walls.right) validStartMoves.push("ArrowRight");
    if (!startCell.walls.left) validStartMoves.push("ArrowLeft");
    if (!startCell.walls.bottom) validStartMoves.push("ArrowDown");
    if (!startCell.walls.top) validStartMoves.push("ArrowUp");
}

// Function to format time as mm:ss:ms
function formatTime(ms) {
    let minutes = Math.floor(ms / 60000); // Get minutes
    let seconds = Math.floor((ms % 60000) / 1000); // Get seconds
    let milliseconds = Math.floor((ms % 1000) / 10); // Get milliseconds (2 digits)
    return `${minutes}:${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;
}

// Function to start the countdown
function startTimer() {
    if (timerStarted) return; // Prevent multiple starts
    timerStarted = true;
    let startTime = Date.now();
    let endTime = startTime + timeLeft;

    function updateTimer() {
        if (!timerStarted) return; // Stop updating if reset

        let now = Date.now();
        timeLeft = Math.max(endTime - now, 0); // Prevent negative time

        timerDisplay.textContent = formatTime(timeLeft); // Update display

        if (timeLeft > 0) {
            timerInterval = requestAnimationFrame(updateTimer); // Keep updating smoothly
        } else {
            timerDisplay.textContent = "0:00:00"; // Stop at 0
            stopGame(); // Stop player movement when time is up
        }
    }

    updateTimer(); // Start the countdown
}

// Function to reset the timer
function resetTimer() {
    cancelAnimationFrame(timerInterval); // Stop any running timer
    timeLeft = cas * 1000; // Reset to 40 seconds
    timerStarted = false; // Allow timer to start again
    timerDisplay.textContent = formatTime(timeLeft); // Reset display
}

// Function to stop the timer without resetting
function stopTimer() {
    cancelAnimationFrame(timerInterval); // Stop the animation frame
    timerStarted = false; // Allow restart if needed
}


// Stop the game when time runs out
function stopGame() {
    disablePlayerMovement();
    swal("⏳ Time's up!", "Try again!", "error").then(() => {
        resetTimer(); // Reset the timer after alert
        setup(); // Reset the maze/game
        resetPlayer();
    });
}

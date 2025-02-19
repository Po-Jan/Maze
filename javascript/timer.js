// Timer settings
let timeLeft = 40 * 1000; // 40 seconds in milliseconds
let timerInterval;
let timerStarted = false; // Tracks if the timer has started
const timerDisplay = document.getElementById("TIMER");

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
    timeLeft = 40 * 1000; // Reset to 40 seconds
    timerStarted = false; // Allow timer to start again
    timerDisplay.textContent = formatTime(timeLeft); // Reset display
}

// Stop the game when time runs out
function stopGame() {
    resetTimer();
    swal("⏳ Time's up!", "Try again!", "error").then(() => {
        setup(); // Reset the maze/game
    });
}

// Listen for movement (starts timer when player moves)
document.addEventListener("keydown", (e) => {
    if (!timerStarted && ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) {
        startTimer(); // Start when first movement happens
    }
});

// Reset button resets the timer and the maze
document.querySelector(".resetButton").addEventListener("click", () => {
    resetTimer(); // Reset the timer when clicking reset
    setup(); // Reset the maze
});

// Timer settings
let cas = 40; // Initial timer value (40 seconds)
let timeLeft = cas * 1000; // Convert to milliseconds
let timerInterval;
let timerStarted = false;
const timerDisplay = document.getElementById("TIMER");
const helpButton = document.getElementById("helpButton");

// Function to format time as mm:ss:ms
function formatTime(ms) {
    let minutes = Math.floor(ms / 60000);
    let seconds = Math.floor((ms % 60000) / 1000);
    let milliseconds = Math.floor((ms % 1000) / 10);
    return `${minutes}:${seconds.toString().padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;
}

// Function to start/restart the countdown timer
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
            timerInterval = requestAnimationFrame(updateTimer);
        } else {
            timerDisplay.textContent = "0:00:00"; // Stop at 0
            stopGame(); // Stop player movement when time is up
        }
    }

    updateTimer();
}

// Function to stop the timer without resetting
function stopTimer() {
    cancelAnimationFrame(timerInterval);
    timerStarted = false;
}

// Function to decrease time by 5 seconds while timer is running
function reduceTime() {
    if (timerStarted) {
        stopTimer(); // Stop the timer first

        // Reduce time by 5 seconds, ensuring it doesn't go negative
        
            timeLeft = Math.max(timeLeft - 4000, 0);

        if (timeLeft === 0) {
            stopGame(); // End game if time runs out
        } else {
            startTimer(); // Restart timer with updated time
        }
    }
}

function bestPossibleTime() {
    let path = findShortestPath();
    if (path.length > 0) {
        return (path.length - 1) * playerSpeed; // Best possible time in milliseconds
    }
    return Infinity; // If no valid path is found
}

// Function to reset the timer
function resetTimer() {
    stopTimer();
    timeLeft = cas * 1000; // Reset to initial 40 seconds
    timerDisplay.textContent = formatTime(timeLeft);
}


// Stop the game when time runs out
function stopGame() {
    disablePlayerMovement();
    swal("⏳ Time's up dude!\n   ", "Try again!\n Better luck next time\n buddy.", "error").then(() => {
        resetGame();
    });
}

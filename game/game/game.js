// Set the target time for 30 minutes (in seconds)
const targetTime = 30 * 60; // 30 minutes in seconds
let timeElapsed = 0; // Time that has passed, starting from 0 seconds

// Function to update the timer
function updateTimer() {
  let minutes = Math.floor(timeElapsed / 60);
  let seconds = timeElapsed % 60;

  // Format seconds to always show two digits
  seconds = seconds < 10 ? "0" + seconds : seconds;

  // Display the time on the page
  document.getElementById("timer").textContent = `${minutes}:${seconds}`;

  // Increment the time by one second
  if (timeElapsed < targetTime) {
    timeElapsed++;
  }
}

// Update the timer every second
setInterval(updateTimer, 1000);

// Get references to the pause menu and buttons
const pauseMenu = document.getElementById("pauseMenu");
const resumeButton = document.getElementById("resumeButton");
const quitButton = document.getElementById("quitButton");

// Variable to track the pause state
let isPaused = false;

// Function to toggle the pause menu
function togglePause() {
  isPaused = !isPaused; // Toggle the pause state
  if (isPaused) {
    pauseMenu.classList.remove("hidden"); // Show the pause menu
    console.log("Game Paused");
  } else {
    pauseMenu.classList.add("hidden"); // Hide the pause menu
    console.log("Game Resumed");
  }
}

// Event listener for the Escape key
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    togglePause(); // Toggle pause when Escape is pressed
  }
});

// Event listener for the resume button
resumeButton.addEventListener("click", () => {
  togglePause(); // Toggle pause when the resume button is clicked
});

// Game loop (Example)
function gameLoop() {
  if (!isPaused) {
    // Your game logic goes here
    console.log("Game is running...");
  }
  requestAnimationFrame(gameLoop); // Keep the loop running
}

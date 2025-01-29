

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
const timerElement = document.getElementById("timer"); // Assuming you have an element for the timer

// Variables to track the pause state and other game state
let isPaused = false;
let keyStates = {}; // To store key states (up, down, left, right, etc.)
let savedSpeed = 0; // To save player speed when paused

// Function to toggle the pause menu
function togglePause() {
  isPaused = !isPaused; // Toggle the pause state
  if (isPaused) {
    pauseMenu.classList.remove("hidden"); // Show the pause menu
    console.log("Game Paused");
    savedSpeed = player.speed; // Save current speed
    player.speed = 0; // Stop player movement
  } else {
    pauseMenu.classList.add("hidden"); // Hide the pause menu
    console.log("Game Resumed");
    player.speed = savedSpeed; // Restore player speed
  }
}

// Event listener for the Escape key to toggle pause
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    togglePause(); // Toggle pause when Escape is pressed
  }
});

// Event listener for the resume button
resumeButton.addEventListener("click", () => {
  togglePause(); // Resume game when resume button is clicked
});



// Event listener for key down (movement keys)
document.addEventListener("keydown", (event) => {
  if (!isPaused) {
    keyStates[event.key] = true; // Record the key as pressed if not paused
  }
});

// Event listener for key up (movement keys)
document.addEventListener("keyup", (event) => {
  if (!isPaused) {
    keyStates[event.key] = false; // Record the key as released if not paused
  }
});

// Game loop with pause functionality
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (player.health <= 0) {
    // Handle game over logic here
    console.log("Game Over");
    return;
  }

  if (!isPaused) {
    // Only update game state when not paused
    player.move(keyStates);
    enemies.forEach((enemy) => enemy.move(player));
    checkWaveCompletion();
  }
   

  // Always draw elements (but they won't move when paused)
  player.draw(ctx);
  enemies.forEach((enemy) => enemy.draw(ctx));

  // Draw UI elements (health, XP, etc.)
  ctx.fillStyle = "grey";
  ctx.fillRect(20, 20, 300, 20);
  ctx.fillStyle = "blue";
  ctx.fillRect(20, 20, (300 * xp) / xpToLevelUp, 20);
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Wave: ${wave}`, 20, 40);
  ctx.fillText(`Health: ${player.health}`, 20, 70);
  ctx.fillText(`Level: ${level}`, 20, 100);

  requestAnimationFrame(update);
}

// Function to check if the wave is complete
function checkWaveCompletion() {
  // Implement your wave completion logic here
  // For example, check if all enemies are defeated, etc.
  console.log("Checking wave completion...");
}

// Modify the attack click handler to respect pause
document.addEventListener("click", () => {
  if (!isPaused) {
    player.attack();
  }
});

// Start the timer
updateTimer();
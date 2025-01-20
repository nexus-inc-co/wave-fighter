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

// Event listener for the quit button
quitButton.addEventListener("click", () => {
  alert("Quitting the game..."); // Alert when quitting
  close();
});

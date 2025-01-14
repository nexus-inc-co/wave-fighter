const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player;
let keys = {};

class Character {
  constructor(x, y) {
    this.x = x; // X position
    this.y = y; // Y position
    this.width = 75; // Width of the character
    this.height = 90; // Height of the character
    this.image = new Image(); // Create a new image object
    this.image.src = ""; // Initially no image
    this.speed = 4; // Movement speed
    this.currentFrame = 0; // Current frame for animation
    this.frameCount = 3; // Total number of frames in the walking animation
    this.frameWidth = 500; // Width of each frame
    this.frameHeight = 600; // Height of each frame
    this.animationSpeed = 10; // Speed of the animation
    this.animationCounter = 0; // Counter to control frame switching
    this.isMoving = false; // Track if the character is moving
    this.facingLeft = false; // Track if the character is facing left
  }

  selectCharacter(character) {
    switch (character) {
      case "character1":
        this.image.src = "Fotos/sprites/character_sprites.png";
        break; // Add break statements
      case "character2":
        this.image.src = "Fotos/sprites/character_sprites2.png";
        break;
      case "character3":
        this.image.src = "Fotos/sprites/character_sprites3.png"; // Adjust path
        break;
      default:
        break;
    }

    // Load the new image and reset the frame
    this.image.onload = () => {
      this.currentFrame = 0; // Reset frame on character change
    };
  }

  draw(ctx) {
    ctx.save(); // Save the current context state
    if (this.facingLeft) {
      ctx.translate(this.x + this.width, this.y); // Move to the right edge of the character
      ctx.scale(-1, 1); // Flip the context horizontally
      ctx.drawImage(
        this.image,
        this.currentFrame * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight,
        0,
        0,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(
        this.image,
        this.currentFrame * this.frameWidth,
        0,
        this.frameWidth,
        this.frameHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
    }
    ctx.restore(); // Restore the context to its original state
  }

  move(keys) {
    this.isMoving = false; // Reset moving state
    if (keys["w"] && this.y > 0) {
      this.y -= this.speed; // Move up
      this.isMoving = true; // Set moving state
    }
    if (keys["s"] && this.y < canvas.height - this.height) {
      this.y += this.speed; // Move down
      this.isMoving = true; // Set moving state
    }
    if (keys["a"] && this.x > 0) {
      this.x -= this.speed; // Move left
      this.isMoving = true; // Set moving state
      this.facingLeft = true; // Set facing direction
    }
    if (keys["d"] && this.x < canvas.width - this.width) {
      this.x += this.speed; // Move right
      this.isMoving = true; // Set moving state
      this.facingLeft = false; // Set facing direction
    }
    if (this.isMoving) {
      this.animationCounter++;
      if (this.animationCounter >= this.animationSpeed) {
        this.currentFrame = (this.currentFrame + 1) % this.frameCount; // Loop through frames
        this.animationCounter = 0; // Reset the counter
      }
    } else {
      this.currentFrame = 0; // Reset to the standing frame if not moving
    }
  }
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true; // Track key presses
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false; // Track key releases
});

// Character selection function
function selectCharacter(character) {
  player.selectCharacter(character);
}

// Initialize the game
function init() {
  player = new Character(canvas.width / 2, canvas.height / 2); // Create a new character at the center of the canvas
  selectCharacter("character1"); // Set a default character
  update(); // Start the game loop
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
  player.move(keys); // Move the player based on key inputs
  player.draw(ctx); // Draw the player on the canvas
  requestAnimationFrame(update); // Request the next frame
}

// Example of character selection via keyboard input
document.addEventListener("keydown", (e) => {
  if (e.key === "1") {
    selectCharacter("character1"); // Select character 1
  } else if (e.key === "2") {
    selectCharacter("character2"); // Select character 2
  } else if (e.key === "3") {
    selectCharacter("character3"); // Select character 3
  }
});

init(); // Initialize the game

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player;
let keys = {};
let enemies = [];
let wave = 1;
let enemyCount = 5;
let waveActive = true;
let attackCooldown = false;
let xp = 0;
let xpToLevelUp = 100;
let level = 1;
let showHitboxes = true; // Toggle hitbox visibility

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.health = 100;
    this.width = 90;
    this.height = 110;
    this.image = new Image();
    this.speed = 4;
    this.currentFrame = 0;
    this.frameCount = 10;
    this.frameWidth = 500;
    this.frameHeight = 600;
    this.animationSpeed = 16;
    this.animationCounter = 0;
    this.isMoving = false;
    this.facingLeft = false;
    this.attackRange = 150;
    this.attackPower = 50;
    this.isAttacking = false;
    this.hitbox = { x: 0, y: 0, width: 90, height: 110 }; // Default hitbox
  }

  draw(ctx) {
    ctx.save();
    if (this.facingLeft) {
      ctx.translate(this.x + this.width, this.y);
      ctx.scale(-1, 1);
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
    ctx.restore();

    // Draw health bar
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y - 10, this.width, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y - 10, (this.width * this.health) / 100, 5);

    // Draw attack range if attacking
    if (this.isAttacking) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      ctx.fillRect(
        this.x - this.attackRange,
        this.y - this.attackRange,
        this.width + this.attackRange * 2,
        this.height + this.attackRange * 2
      );
    }

    // Draw hitbox
    if (showHitboxes) {
      ctx.strokeStyle = "blue";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        this.x + this.hitbox.x,
        this.y + this.hitbox.y,
        this.hitbox.width,
        this.hitbox.height
      );
    }
  }

  move(keys) {
    this.isMoving = false;
    if (keys["w"] && this.y > 0) {
      this.y -= this.speed;
      this.isMoving = true;
    }
    if (keys["s"] && this.y < canvas.height - this.height) {
      this.y += this.speed;
      this.isMoving = true;
    }
    if (keys["a"] && this.x > 0) {
      this.x -= this.speed;
      this.isMoving = true;
      this.facingLeft = true;
    }
    if (keys["d"] && this.x < canvas.width - this.width) {
      this.x += this.speed;
      this.isMoving = true;
      this.facingLeft = false;
    }
    if (this.isMoving) {
      this.animationCounter++;
      if (this.animationCounter >= this.animationSpeed) {
        this.currentFrame = (this.currentFrame + 1) % this.frameCount;
        this.animationCounter = 0;
      }
    } else {
      this.currentFrame = 0;
    }
  }

  attack() {
    if (attackCooldown) return;

    attackCooldown = true;
    this.isAttacking = true;

    setTimeout(() => {
      this.isAttacking = false;
      attackCooldown = false;
    }, 500);

    enemies = enemies.filter((enemy) => {
      const dx = this.x - enemy.x;
      const dy = this.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= this.attackRange) {
        enemy.health -= this.attackPower;

        if (enemy.health <= 0) {
          xp += 10;
          if (xp >= xpToLevelUp) {
            levelUp();
          }
          return false;
        }
      }

      return true;
    });
  }
}

class Tank extends Character {
  constructor(x, y) {
    super(x, y);
    this.width = 300;
    this.height = 400;
    this.speed = 2;
    this.image.src = "../Fotos/paladin/Walk/spr_PaladinWalk_strip10.png";
    this.frameWidth = 128;
    this.frameHeight = 128;
    this.attackPower = 20;
    this.attackRange = 80;
    this.frameCount = 10;
    this.hitbox = { x: 80, y: 50, width: 130, height: 160 }; // Custom hitbox
  }
}

class Assassin extends Character {
  constructor(x, y) {
    super(x, y);
    this.width = 300;
    this.height = 400;
    this.speed = 4;
    this.image.src = "../Fotos/Martial Hero/Martial Hero/Sprites/Run.png";
    this.frameWidth = 200;
    this.frameHeight = 200;
    this.attackPower = 25;
    this.attackRange = 50;
    this.frameCount = 8;
    this.hitbox = { x: 100, y: 130, width: 100, height: 130 }; // Custom hitbox
  }
}

class Warrior extends Character {
  constructor(x, y) {
    super(x, y);
    this.width = 320;
    this.height = 420;
    this.speed = 3;
    this.image.src = "../Fotos/sheets/spr_Walk_strip.png";
    this.frameWidth = 170;
    this.frameHeight = 170;
    this.attackPower = 50;
    this.attackRange = 150;
    this.animationSpeed = 16;
    this.frameCount = 8;
    this.hitbox = { x: 120, y: 90, width: 90, height: 120 }; // Custom hitbox
  }
}

// Create a function to switch characters
function changeCharacterImage(characterName) {
  let newCharacter;

  switch (characterName) {
    case "Warrior":
      newCharacter = new Warrior(player.x, player.y);
      break;
    case "Assassin":
      newCharacter = new Assassin(player.x, player.y); // Mage as Assassin for now
      break;
    case "Tank":
      newCharacter = new Tank(player.x, player.y); // Rogue as Tank for now
      break;
    default:
      return;
  }

  // Apply the new character as the player
  player = newCharacter;
}

window.onload = function () {
  const selectedCharacter = localStorage.getItem("selectedCharacter");

  if (selectedCharacter) {
    switch (selectedCharacter.toLowerCase()) {
      case "tank":
        window.selectedCharacter = "Tank";
        break;
      case "assassin":
        window.selectedCharacter = "Assassin";
        break;
      case "warrior":
        window.selectedCharacter = "Warrior";
        break;
      default:
        alert("Unknown character selected!");
        return;
    }
  }
};

document.addEventListener("keydown", (e) => {
  if (e.key === "u" && player.coins >= 10) {
    // Press 'u' to upgrade if you have enough coins
    player.coins -= 10;
    player.health += 10;
    alert(`Upgraded! Health: ${player.health}, Coins: ${player.coins}`);
  }
});

let coins = localStorage.getItem("coins")
  ? parseInt(localStorage.getItem("coins"))
  : 0;
function updateCoinDisplay() {
  document.getElementById("coinDisplay").textContent = `Coins: ${coins}`;
}
window.onload = function () {
  updateCoinDisplay();
};

setInterval(() => {
  if (window.selectedCharacter) {
    changeCharacterImage(window.selectedCharacter);
    window.selectedCharacter = null;
  }
}, 100);

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = 2;
    this.image = new Image();
    this.image.src = "../Fotos/enemies/enemie1.png";
    this.health = 50;
    this.lastAttackTime = 0;
    this.attackCooldown = 1000;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    // Draw health bar
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y - 5, this.width, 5);
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y - 5, (this.width * this.health) / 50, 5);
  }

  move(player) {
    // Calculate the actual position of the player's hitbox on the screen
    const playerHitboxX = player.x + player.hitbox.x;
    const playerHitboxY = player.y + player.hitbox.y;

    // Get the center of the player's hitbox
    const playerCenterX = playerHitboxX + player.hitbox.width / 2;
    const playerCenterY = playerHitboxY + player.hitbox.height / 2;

    // Get the center of the enemy
    const enemyCenterX = this.x + this.width / 2;
    const enemyCenterY = this.y + this.height / 2;

    // Calculate direction vector
    const dx = playerCenterX - enemyCenterX;
    const dy = playerCenterY - enemyCenterY;

    // Calculate the distance to avoid dividing by zero
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      // Normalize the direction vector and move toward the player
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }

    // Attempt to attack if cooldown is over
    if (Date.now() - this.lastAttackTime >= this.attackCooldown) {
      this.attack(player);
    }
  }

  checkCollision(player) {
    // Calculate the actual position of the player's hitbox on the screen
    const playerHitboxX = player.x + player.hitbox.x;
    const playerHitboxY = player.y + player.hitbox.y;

    // Check for overlap between the enemy and the player's hitbox
    return (
      this.x + this.width > playerHitboxX && // Right side of enemy overlaps left side of hitbox
      this.x < playerHitboxX + player.hitbox.width && // Left side of enemy overlaps right side of hitbox
      this.y + this.height > playerHitboxY && // Bottom of enemy overlaps top of hitbox
      this.y < playerHitboxY + player.hitbox.height // Top of enemy overlaps bottom of hitbox
    );
  }
  a;

  attack(player) {
    if (this.checkCollision(player)) {
      player.health -= 5; // Apply damage to the player
      this.lastAttackTime = Date.now(); // Update attack cooldown
      console.log("Player attacked! Health:", player.health); // Debugging
    }
  }
}

function spawnEnemies(count) {
  enemies = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    enemies.push(new Enemy(x, y));
  }
}

function checkWaveCompletion() {
  if (enemies.length === 0) {
    wave++;
    enemyCount += 2;
    spawnEnemies(enemyCount);
  }
}

function init() {
  player = new Tank(canvas.width / 2, canvas.height / 2);
  spawnEnemies(enemyCount);
  update();
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});
document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});
document.addEventListener("click", () => {
  player.attack();
});

init();

function showGameOverButtons() {
  const buttonContainer = document.getElementById("game-over-button");
  const restartButton = document.getElementById("Button1");
  const quitButton = document.getElementById("Button2");

  // Show the button container when game over
  buttonContainer.style.display = "block";

  restartButton.onclick = () => {
    buttonContainer.style.display = "none"; // Hide buttons
    init(); // Restart the game
  };

  quitButton.onclick = () => {
    buttonContainer.style.display = "none"; // Hide buttons
  };
}

// Modify the update function to include the Game Over logic
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.move(keys);
  player.draw(ctx);
  enemies.forEach((enemy) => {
    enemy.move(player);
    enemy.draw(ctx);
  });
  checkWaveCompletion();

  // Game Over logic
  if (player.health <= 0) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);

    // Show Game Over buttons
    showGameOverButtons();
    return;
  }

  requestAnimationFrame(update);
}
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.move(keys);
  player.draw(ctx);
  enemies.forEach((enemy) => {
    enemy.move(player);
    enemy.draw(ctx);
  });
  checkWaveCompletion();
  ctx.fillStyle = "grey";
  ctx.fillRect(20, 20, 300, 20);
  ctx.fillStyle = "blue";
  ctx.fillRect(20, 20, (300 * xp) / xpToLevelUp, 20);
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Wave: ${wave}`, 20, 40);
  ctx.fillText(`Health: ${player.health}`, 20, 70);
  ctx.fillText(`Level: ${level}`, 20, 100);

  if (player.health <= 0) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);

    // Disable further game updates (no more movement or attacks)
    return;
  }

  requestAnimationFrame(update);
}

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player;
let keys = {};
let enemies = [];
let wave = 1;
let enemyCount = 5; // Initial number of enemies
let waveActive = true;
let attackCooldown = false;
let xp = 0; // Player's experience points
let xpToLevelUp = 100; // XP needed for next level
let level = 1; // Player's level

// Base Character Class
class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.health = 100; // Player's initial health
    this.width = 75; // Default width
    this.height = 90; // Default height
    this.image = new Image();
    this.speed = 4; // Default speed
    this.currentFrame = 0;
    this.frameCount = 10;
    this.frameWidth = 500; // Default frame width for animation
    this.frameHeight = 600; // Default frame height for animation
    this.animationSpeed = 16; // Default animation speed
    this.animationCounter = 0;
    this.isMoving = false;
    this.facingLeft = false;
    this.attackRange = 150; // Range of attack
    this.attackPower = 50; // Damage dealt by an attack
    this.isAttacking = false; // Track whether player is attacking
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
    ctx.fillRect(this.x, this.y - 10, this.width, 5); // Background (full health bar)
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y - 10, (this.width * this.health) / 100, 5); // Current health

    // Draw attack box if the player is attacking
    if (this.isAttacking) {
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Red transparent color
      ctx.fillRect(
        this.x - this.attackRange,
        this.y - this.attackRange,
        this.width + this.attackRange * 2,
        this.height + this.attackRange * 2
      ); // Player's attack box
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

    // Reset attack cooldown after 500ms
    setTimeout(() => {
      this.isAttacking = false;
      attackCooldown = false;
    }, 500);

    // Check for enemies in attack range
    enemies = enemies.filter((enemy) => {
      const dx = this.x - enemy.x;
      const dy = this.y - enemy.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance <= this.attackRange) {
        enemy.health -= this.attackPower; // Damage the enemy
        console.log("Enemy hit!");

        if (enemy.health <= 0) {
          console.log("Enemy defeated!");
          xp += 10; // Gain XP for killing an enemy
          if (xp >= xpToLevelUp) {
            levelUp();
          }
          return false; // Remove enemy if health is 0 or less
        }
      }

      return true; // Keep enemy if still alive
    });
  }
}

// Level up function
function levelUp() {
  level++;
  xp = 0; // Reset XP after leveling up
  xpToLevelUp += 50; // Increase XP required for next level
  console.log("Level Up! New level: " + level);
}

// Tank Class
class Tank extends Character {
  constructor(x, y) {
    super(x, y);
    this.width = 300; // Tank-specific dimensions
    this.height = 360;
    this.speed = 3; // Tank is slower
    this.image.src = "../Fotos/sheets/spr_Walk_strip.png";
    this.frameWidth = 170; // Tank-specific sprite frame size
    this.frameHeight = 170;
    this.attackPower = 50; // Tank deals more damage
    this.attackRange = 150; // Tank has slightly more range
    this.animationSpeed = 16;
    this.frameCount = 8;
  }
}

// Assassin Class
class Assassin extends Character {
  constructor(x, y) {
    super(x, y);
    this.width = 70; // Assassin-specific dimensions
    this.height = 85;
    this.speed = 6; // Assassin is faster
    this.image.src = "../Fotos/sprites/character_sprites2.png";
    this.frameWidth = 500; // Assassin-specific sprite frame size
    this.frameHeight = 600;
    this.attackPower = 20; // Assassin deals less damage
    this.attackRange = 80; // Assassin has a wider range
  }
}

// Warrior Class
class Warrior extends Character {
  constructor(x, y) {
    super(x, y);
    this.width = 90; // Warrior-specific dimensions
    this.height = 110;
    this.speed = 4; // Balanced speed
    this.image.src = "../Fotos/sprites/character_sprites3.png";
    this.frameWidth = 527; // Warrior-specific sprite frame size
    this.frameHeight = 510;
    this.attackPower = 25; // Warrior's damage
    this.attackRange = 50; // Warrior's range
  }
}

// Enemy Class
class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.speed = 2; // Speed of enemies
    this.image = new Image();
    this.image.src = "../Fotos/enemies/enemie1.png";
    this.health = 50; // Enemy health
    this.lastAttackTime = 0; // Time of the last attack (in milliseconds)
    this.attackCooldown = 1000; // 1 second cooldown for attacking
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);

    // Draw health bar
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y - 5, this.width, 5); // Background (full health bar)
    ctx.fillStyle = "green";
    ctx.fillRect(this.x, this.y - 5, (this.width * this.health) / 50, 5); // Current health

    // Draw attack hitbox if ready to attack
    const currentTime = Date.now();
    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
      // If cooldown is over, show attack range
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)"; // Red transparent color
      ctx.fillRect(this.x - 30, this.y - 30, this.width + 60, this.height + 60); // Attack hitbox
    }
  }

  move(player) {
    // Move toward the player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
      this.x += (dx / distance) * this.speed;
      this.y += (dy / distance) * this.speed;
    }

    // Check if it's time for this enemy to attack
    const currentTime = Date.now();
    if (currentTime - this.lastAttackTime >= this.attackCooldown) {
      this.attack(player); // Enemy attacks if cooldown is over
    }
  }

  // Check for collision with the player
  checkCollision(player) {
    return (
      this.x < player.x + player.width &&
      this.x + this.width > player.x &&
      this.y < player.y + player.height &&
      this.y + this.height > player.y
    );
  }

  // Attack player
  attack(player) {
    if (this.checkCollision(player)) {
      player.health -= 0; // Damage the player on attack
      console.log("Player hit! Health: " + player.health);
      this.lastAttackTime = Date.now(); // Reset attack cooldown
    }
  }
}

// Spawn enemies for a wave
function spawnEnemies(count) {
  enemies = [];
  for (let i = 0; i < count; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    enemies.push(new Enemy(x, y));
  }
}

// Check if all enemies are defeated
function checkWaveCompletion() {
  if (enemies.length === 0) {
    wave++;
    enemyCount += 2; // Increase enemy count for the next wave
    spawnEnemies(enemyCount);
  }
}

// Initialize the game
function init() {
  player = new Tank(canvas.width / 2, canvas.height / 2);
  spawnEnemies(enemyCount);
  update();
}

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw and update player
  player.move(keys);
  player.draw(ctx);

  // Draw and update enemies
  enemies.forEach((enemy) => {
    enemy.move(player);
    enemy.draw(ctx);
  });

  // Check wave completion
  checkWaveCompletion();

  // Draw XP Bar
  ctx.fillStyle = "grey";
  ctx.fillRect(20, 20, 300, 20); // Background XP bar
  ctx.fillStyle = "blue";
  ctx.fillRect(20, 20, (300 * xp) / xpToLevelUp, 20); // Current XP

  // Display wave, health, and level information
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText(`Wave: ${wave}`, 20, 40);
  ctx.fillText(`Health: ${player.health}`, 20, 70);
  ctx.fillText(`Level: ${level}`, 20, 100);

  // Game over condition
  if (player.health <= 0) {
    ctx.fillStyle = "red";
    ctx.font = "48px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
    return; // Stop the game loop
  }

  requestAnimationFrame(update);
}

// Event listeners for character selection, movement, and attack
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

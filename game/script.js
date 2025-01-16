const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player;
let keys = {};

class Character {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 75;
    this.height = 90;
    this.image = new Image();
    this.image.src = "";
    this.speed = 4;
    this.currentFrame = 0;
    this.frameCount = 3;
    this.frameWidth = 500;
    this.frameHeight = 600;
    this.animationSpeed = 16;
    this.animationCounter = 0;
    this.isMoving = false;
    this.facingLeft = false;
  }

  selectCharacter(character) {
    switch (character) {
      case "character1":
        this.image.src = "../Fotos/sprites/sprites4.png";
        break;
      case "character2":
        this.image.src = "../Fotos/sprites/character_sprites2.png";
        break;
      case "character3":
        this.image.src = "assets/character_sprites3.png";
        break;
      default:
        break;
    }
    this.image.onload = () => {
      this.currentFrame = 0;
      console.log("Image loaded:", this.image.src);
    };
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
}

document.addEventListener("keydown", (e) => {
  keys[e.key] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

function init() {
  player = new Character(canvas.width / 2, canvas.height / 2);
  player.selectCharacter("character1");
  update();
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  player.move(keys);
  player.draw(ctx);
  requestAnimationFrame(update);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "1") {
    player.selectCharacter("character1");
  } else if (e.key === "2") {
    player.selectCharacter("character2");
  } else if (e.key === "3") {
    player.selectCharacter("character3");
  }
});

init();

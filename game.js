const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let gameSpeed = 6;
let gravity = 0.6;
let score = 0;
let gameOver = false;

// Dog
const dog = {
  x: 50,
  y: 220,
  width: 40,
  height: 40,
  velocityY: 0,
  jumping: false
};

// Treats
let treats = [];

function spawnTreat() {
  const size = Math.random() > 0.5 ? 30 : 50; // different sizes
  treats.push({
    x: canvas.width,
    y: 260 - size,
    width: size,
    height: size
  });
}

setInterval(spawnTreat, 1500);

// Controls
document.addEventListener("keydown", e => {
  if (e.code === "Space" && !dog.jumping) {
    dog.velocityY = -12;
    dog.jumping = true;
  }

  if (gameOver && e.code === "Space") {
    resetGame();
  }
});

function update() {
  if (gameOver) return;

  // Dog physics
  dog.velocityY += gravity;
  dog.y += dog.velocityY;

  if (dog.y >= 220) {
    dog.y = 220;
    dog.jumping = false;
  }

  // Move treats
  treats.forEach(t => t.x -= gameSpeed);
  treats = treats.filter(t => t.x + t.width > 0);

  // Collision detection
  treats.forEach(t => {
    if (
      dog.x < t.x + t.width &&
      dog.x + dog.width > t.x &&
      dog.y < t.y + t.height &&
      dog.y + dog.height > t.y
    ) {
      gameOver = true;
    }
  });

  score++;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.fillStyle = "#888";
  ctx.fillRect(0, 260, canvas.width, 5);

  // Dog
  ctx.fillStyle = "#8B4513";
  ctx.fillRect(dog.x, dog.y, dog.width, dog.height);

  // Treats
  ctx.fillStyle = "#d2691e";
  treats.forEach(t =>
    ctx.fillRect(t.x, t.y, t.width, t.height)
  );

  // Score
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 20, 30);

  // Game over text
  if (gameOver) {
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", 280, 150);
    ctx.font = "20px Arial";
    ctx.fillText("Press SPACE to restart", 290, 180);
  }
}

function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

function resetGame() {
  treats = [];
  score = 0;
  gameOver = false;
  dog.y = 220;
  dog.velocityY = 0;
}

loop();

// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamaños
const playerWidth = 100,
  playerHeight = 100;
const obstacleWidth = 20,
  obstacleHeight = 40;
const hitboxWidth = 40,
  hitboxHeight = 40;
const groundY = canvas.height * 0.92;

// Sprite y animación
const runImg = new Image();
runImg.src = "assets/run.png";
let frameIndex = 0;
let frameTick = 0;

// Background
const bgImg = new Image();
bgImg.src = "assets/bg.png";
let bgX = 0;

// Estado jugador
let velocityY = 0;
let playerX = 50;
let playerY = 50;
let isOnGround = false;

// Estado Juego
let obstacleY = groundY - 40;
let colision = false;
let gameOver = false;
let score = 0;
let obstacles = [];
let frameCount = 0;
let spawnThreshold = 10;
let highScore = Number(localStorage.getItem("highScore")) || 0;

// Salto
document.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    if (gameOver) {
      restartGame();
    } else if (isOnGround) {
      velocityY = -10;
      isOnGround = false;
    }
  }
});

function gameLoop() {
  colision = false;
  score += 1;
  frameCount += 1;

  frameTick += 1;
  if (frameTick >= 10) {
    frameIndex = (frameIndex + 1) % 8;
    frameTick = 0;
  }

  if (frameCount >= spawnThreshold) {
    obstacles.push({ x: canvas.width });
    frameCount = 0;
    spawnThreshold = Math.random() * 100 + 100;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);
  bgX -= 2;
  if (bgX <= -canvas.width) {
    bgX = 0;
  }

  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score, 10, 20);

  // Gravedad
  velocityY = velocityY + 0.25;
  playerY = playerY + velocityY;

  // Suelo
  if (playerY + playerHeight >= groundY) {
    playerY = groundY - playerHeight;
    velocityY = 0;
    isOnGround = true;
  } else {
    isOnGround = false;
  }

  // Posicionamiento hitbox dentro del sprite
  const hitboxX = playerX + (playerWidth - hitboxWidth) / 2;
  const hitboxY = playerY + (playerHeight - hitboxHeight) / 2;

  //Movimiento obstaculos y detector de colisión
  obstacles.forEach(function (obstacle) {
    obstacle.x -= 2;

    // Colisión AABB para cada obstáculo
    if (
      hitboxX < obstacle.x + obstacleWidth &&
      hitboxX + hitboxWidth > obstacle.x &&
      hitboxY < obstacleY + obstacleHeight &&
      hitboxY + hitboxHeight > obstacleY
    ) {
      colision = true;
    }
  });
  obstacles = obstacles.filter(function (obstacle) {
    return obstacle.x + obstacleWidth > 0;
  });

  obstacles.forEach(function (obstacle) {
    ctx.fillStyle = "grey";
    ctx.fillRect(obstacle.x, obstacleY, obstacleWidth, obstacleHeight);
    ctx.fillStyle = "black";
  });

  ctx.drawImage(
    runImg,
    frameIndex * 128, // qué fotograma recortar de la imagen
    0,
    128,
    128,
    playerX, // dónde y a qué tamaño pintarlo
    playerY,
    playerWidth,
    playerHeight,
  );

  if (colision) {
    gameOver = true;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore);
    }
  }

  ctx.fillText("High Score: " + highScore, 10, 40);

  if (gameOver) {
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.font = "35px sans-serif";
    ctx.fillText("Game Over", canvas.width / 2, 150);
    ctx.font = "25px sans-serif";
    ctx.fillText("Press Space to restart", canvas.width / 2, 200);
    ctx.textAlign = "left";
  }

  if (!gameOver) {
    requestAnimationFrame(gameLoop);
  }
}

function restartGame() {
  velocityY = 0;
  playerX = 50;
  playerY = 50;
  isOnGround = false;
  obstacleY = groundY - 40;
  colision = false;
  gameOver = false;
  score = 0;
  obstacles = [];
  frameCount = 0;
  spawnThreshold = 10;
  gameLoop();
}

gameLoop();

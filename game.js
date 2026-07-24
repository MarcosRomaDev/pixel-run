// Canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// Tamaños
const playerWidth = 150,
  playerHeight = 150;

const obstacleWidth = 50,
  obstacleHeight = 88;

const hitboxWidth = 40,
  hitboxHeight = 40;
const groundY = canvas.height * 0.92;

// Sprite y animación
const runImg = new Image();
runImg.src = "assets/run.png";
const jumpImg = new Image();
jumpImg.src = "assets/jump.png";

let frameIndex = 0;
let frameTick = 0;

// Obstaculo
const obstacleFrames = [];
for (let i = 1; i <= 10; i++) {
  const num = String(i).padStart(2, "0");
  const img = new Image();
  img.src = `assets/obstacle/unavoidable_spikes_just_roller_${num}.png`;
  obstacleFrames.push(img);
}
let obstacleFrameIndex = 0;
let obstacleFrameTick = 0;

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
let obstacleY = groundY - obstacleHeight;
let colision = false;
let gameOver = false;
let score = 0;
let obstacles = [];
let frameCount = 0;
let spawnThreshold = 10;
let highScore = Number(localStorage.getItem("highScore")) || 0;
let gameSpeed = 2;

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
//-----------------------------------------------------------------------------------------
function gameLoop() {
  colision = false;
  score += 1;
  frameCount += 1;
  frameTick += 1;
  gameSpeed = 2 + score * 0.00025;

  if (frameTick >= 10) {
    frameIndex = (frameIndex + 1) % 8;
    frameTick = 0;
  }

  if (frameCount >= spawnThreshold) {
    obstacles.push({ x: canvas.width });
    frameCount = 0;
    spawnThreshold = (Math.random() * 75 + 200) * (2 / gameSpeed);
  }

  obstacleFrameTick += 1;
  if (obstacleFrameTick >= 10) {
    obstacleFrameIndex = (obstacleFrameIndex + 1) % 10;
    obstacleFrameTick = 0;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, bgX, 0, canvas.width, canvas.height);
  ctx.drawImage(bgImg, bgX + canvas.width, 0, canvas.width, canvas.height);
  bgX -= gameSpeed * 0.5;
  if (bgX <= -canvas.width) {
    bgX = 0;
  }

  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score, 10, 20);

  // Gravedad
  velocityY = velocityY + 0.225;
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
    obstacle.x -= gameSpeed;

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
    ctx.drawImage(
      obstacleFrames[obstacleFrameIndex],
      obstacle.x,
      obstacleY,
      obstacleWidth,
      obstacleHeight,
    );
  });

  let currentImg = runImg;
  if (!isOnGround) {
    currentImg = jumpImg;
  }
  ctx.drawImage(
    currentImg,
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
  obstacleY = groundY - obstacleHeight;
  colision = false;
  gameOver = false;
  score = 0;
  obstacles = [];
  frameCount = 0;
  spawnThreshold = 10;
  gameSpeed = 2;
  gameLoop();
}

gameLoop();

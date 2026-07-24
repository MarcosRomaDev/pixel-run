const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Tamaños fijos de cada rectángulo
const playerWidth = 40,
  playerHeight = 40;
const obstacleWidth = 20,
  obstacleHeight = 40;

let velocityY = 0;
let playerX = 50;
let playerY = 50;
let isOnGround = false;
let obstacleY = canvas.height - 40;
let colision = false;
let gameOver = false;
let score = 0;
let obstacles = [];
let frameCount = 0;
let spawnThreshold = 10;
let highScore = Number(localStorage.getItem("highScore")) || 0;

// Salto: solo si isOnGround es true
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
  colision = false; // se resetea cada frame, antes de comprobar de nuevo
  score += 1;
  frameCount += 1;

  if (frameCount >= spawnThreshold) {
    obstacles.push({ x: canvas.width });
    frameCount = 0;
    spawnThreshold = Math.random() * 100 + 100; // ajusta los números a tu gusto
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "20px sans-serif";
  ctx.fillText("Score: " + score, 10, 20);

  // Gravedad: acelera hacia abajo y mueve al jugador en Y
  velocityY = velocityY + 0.25;
  playerY = playerY + velocityY;

  // Suelo: si el jugador llega abajo, se para ahí y puede volver a saltar
  if (playerY + 40 >= canvas.height) {
    playerY = canvas.height - 40;
    velocityY = 0;
    isOnGround = true;
  } else {
    isOnGround = false;
  }

  //Movimiento obstaculos y detector de colisión
  obstacles.forEach(function (obstacle) {
    obstacle.x -= 2;
    // Colisión AABB para cada obstáculo
    if (
      playerX < obstacle.x + obstacleWidth &&
      playerX + playerWidth > obstacle.x &&
      playerY < obstacleY + obstacleHeight &&
      playerY + playerHeight > obstacleY
    ) {
      colision = true;
    }
  });
  obstacles = obstacles.filter(function (obstacle) {
    return obstacle.x + obstacleWidth > 0;
  });

  obstacles.forEach(function (obstacle) {
    ctx.fillStyle = "black";
    ctx.fillRect(obstacle.x, obstacleY, obstacleWidth, obstacleHeight);
  });

  ctx.fillStyle = "red";
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

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
  obstacleY = canvas.height - 40;
  colision = false;
  gameOver = false;
  score = 0;
  obstacles = [];
  frameCount = 0;
  spawnThreshold = 10;
  gameLoop();
}

gameLoop();

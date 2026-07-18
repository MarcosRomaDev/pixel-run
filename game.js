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
let obstacleX = 800;
let obstacleY = canvas.height - 40;
let colision = false;

// Salto: solo si isOnGround es true
document.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    if (isOnGround) {
      velocityY = -10;
      isOnGround = false;
    }
  }
});

function gameLoop() {
  colision = false; // se resetea cada frame, antes de comprobar de nuevo

  ctx.clearRect(0, 0, canvas.width, canvas.height);

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

  // Colisión AABB: hay choque si se solapan a la vez en X y en Y
  if (
    playerX < obstacleX + obstacleWidth &&
    playerX + playerWidth > obstacleX &&
    playerY < obstacleY + obstacleHeight &&
    playerY + playerHeight > obstacleY
  ) {
    colision = true;
  }

  if (colision) {
    console.log("Game Over");
  }

  // El obstáculo avanza hacia el jugador cada frame
  obstacleX = obstacleX - 2;

  ctx.fillStyle = "black";
  ctx.fillRect(obstacleX, obstacleY, obstacleWidth, obstacleHeight);

  ctx.fillStyle = "red";
  ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

  requestAnimationFrame(gameLoop);
}

gameLoop();

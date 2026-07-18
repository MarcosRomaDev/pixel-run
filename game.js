const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let velocityY = 0;
let playerX = 50;
let playerY = 50;
let isOnGround = false;

document.addEventListener("keydown", function (event) {
  if (event.key === " ") {
    if (isOnGround) {
      velocityY = -10;
      isOnGround = false;
    }
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  velocityY = velocityY + 0.5;
  playerY = playerY + velocityY;

  if (playerY + 40 >= canvas.height) {
    playerY = canvas.height - 40;
    velocityY = 0;
    isOnGround = true;
  } else {
    isOnGround = false;
  }

  ctx.fillStyle = "red";
  ctx.fillRect(playerX, playerY, 40, 40);

  requestAnimationFrame(gameLoop);
}

gameLoop();

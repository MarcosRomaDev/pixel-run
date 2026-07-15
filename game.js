const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let playerX = 50;

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowLeft") {
    playerX = playerX - 10;
  }

  if (event.key === "ArrowRight") {
    playerX = playerX + 10;
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "red";
  ctx.fillRect(playerX, 50, 40, 40);

  requestAnimationFrame(gameLoop);
}

gameLoop();

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

function gameLoop() {
  ctx.fillStyle = "red";
  ctx.fillRect(50, 50, 40, 40);

  requestAnimationFrame(gameLoop);
}

gameLoop();

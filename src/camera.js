export function createCamera(width, height) {
  return { x: 0, y: 0, width, height };
}

export function updateCamera(cam, player, levelWidth, levelHeight) {
  const targetX = player.x - cam.width / 2 + player.w / 2;
  const targetY = player.y - cam.height / 2 + player.h / 2;

  cam.x += (targetX - cam.x) * 0.1;
  cam.y += (targetY - cam.y) * 0.08;

  cam.x = Math.max(0, Math.min(cam.x, levelWidth - cam.width));
  cam.y = Math.max(0, Math.min(cam.y, levelHeight - cam.height));
}

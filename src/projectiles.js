export function createProjectile(x, y, direction) {
  return {
    x, y, w: 10, h: 6,
    vx: direction * 8,
    vy: 0,
    alive: true,
  };
}

export function updateProjectiles(projectiles, platforms) {
  for (const p of projectiles) {
    if (!p.alive) continue;
    p.x += p.vx;
    p.y += p.vy;

    for (const plat of platforms) {
      if (p.x < plat.x + plat.w && p.x + p.w > plat.x &&
          p.y < plat.y + plat.h && p.y + p.h > plat.y) {
        p.alive = false;
      }
    }

    if (p.x < -50 || p.x > 10000) p.alive = false;
  }
}

export function drawProjectile(ctx, proj, camX, camY) {
  if (!proj.alive) return;
  const x = proj.x - camX;
  const y = proj.y - camY;

  ctx.fillStyle = '#44ff44';
  ctx.fillRect(x, y, proj.w, proj.h);
  ctx.fillStyle = '#88ff88';
  ctx.fillRect(x + 2, y + 1, proj.w - 4, proj.h - 2);
  ctx.fillStyle = '#aaffaa';
  ctx.fillRect(x + 4, y + 2, 2, 2);
}

export function createSpider(x, y) {
  return { type: 'spider', x, y, w: 22, h: 16, vx: -1.2, vy: 0, alive: true, animFrame: 0, animTimer: 0 };
}

export function createMalware(x, y) {
  return { type: 'malware', x, y, w: 24, h: 24, vx: -1, vy: 0, alive: true, animFrame: 0, animTimer: 0, platformY: y };
}

export function createSpamBot(x, y) {
  return { type: 'spambot', x, y, w: 20, h: 20, vx: -1.8, vy: 0, alive: true, animFrame: 0, animTimer: 0, bounceTimer: 0 };
}

export function createRansomwareBlock(x, y) {
  return { type: 'ransomware', x, y, w: 28, h: 28, vx: -0.6, vy: 0, alive: true, animFrame: 0, animTimer: 0 };
}

export function updateEnemy(enemy, platforms) {
  if (!enemy.alive) return;

  enemy.animTimer++;
  if (enemy.animTimer % 12 === 0) enemy.animFrame = (enemy.animFrame + 1) % 2;

  enemy.vy += 0.6;
  if (enemy.vy > 12) enemy.vy = 12;

  enemy.x += enemy.vx;

  for (const p of platforms) {
    const top = enemy.y + enemy.h > p.y && enemy.y < p.y + 4;
    if (top && enemy.x + enemy.w > p.x && enemy.x < p.x + p.w) {
      enemy.y = p.y - enemy.h;
      enemy.vy = 0;
    }
  }

  enemy.y += enemy.vy;

  for (const p of platforms) {
    if (enemy.x < p.x + p.w && enemy.x + enemy.w > p.x) {
      if (enemy.y + enemy.h > p.y && enemy.y < p.y + p.h) {
        if (enemy.vy > 0) {
          enemy.y = p.y - enemy.h;
          enemy.vy = 0;
        } else if (enemy.vy < 0) {
          enemy.y = p.y + p.h;
          enemy.vy = 0;
        }
      }
    }
  }

  for (const p of platforms) {
    if (enemy.y + enemy.h > p.y + 2 && enemy.y < p.y + p.h - 2) {
      if (enemy.x + enemy.w > p.x && enemy.x + enemy.w < p.x + 10) {
        enemy.vx = -Math.abs(enemy.vx);
      }
      if (enemy.x < p.x + p.w && enemy.x > p.x + p.w - 10) {
        enemy.vx = Math.abs(enemy.vx);
      }
    }
  }
}

export function drawEnemy(ctx, enemy, camX, camY) {
  if (!enemy.alive) return;

  const x = enemy.x - camX;
  const y = enemy.y - camY;

  if (enemy.type === 'spider') {
    ctx.fillStyle = '#664422';
    ctx.fillRect(x + 4, y + 4, 14, 8);
    ctx.fillStyle = '#885533';
    ctx.fillRect(x + 6, y + 2, 10, 8);
    ctx.fillStyle = '#ff2222';
    ctx.fillRect(x + 8, y + 4, 2, 2);
    ctx.fillRect(x + 12, y + 4, 2, 2);
    ctx.fillStyle = '#443322';
    if (enemy.animFrame === 0) {
      ctx.fillRect(x, y + 6, 4, 2);
      ctx.fillRect(x + 18, y + 6, 4, 2);
      ctx.fillRect(x + 2, y + 8, 4, 2);
      ctx.fillRect(x + 16, y + 8, 4, 2);
      ctx.fillRect(x, y + 10, 4, 2);
      ctx.fillRect(x + 18, y + 10, 4, 2);
      ctx.fillRect(x + 2, y + 12, 4, 2);
      ctx.fillRect(x + 16, y + 12, 4, 2);
    } else {
      ctx.fillRect(x, y + 8, 4, 2);
      ctx.fillRect(x + 18, y + 8, 4, 2);
      ctx.fillRect(x + 2, y + 6, 4, 2);
      ctx.fillRect(x + 16, y + 6, 4, 2);
      ctx.fillRect(x, y + 12, 4, 2);
      ctx.fillRect(x + 18, y + 12, 4, 2);
      ctx.fillRect(x + 2, y + 10, 4, 2);
      ctx.fillRect(x + 16, y + 10, 4, 2);
    }
  } else if (enemy.type === 'malware') {
    ctx.fillStyle = '#8822aa';
    ctx.fillRect(x + 2, y + 2, 20, 20);
    ctx.fillStyle = '#aa44cc';
    ctx.fillRect(x + 4, y + 4, 16, 16);
    ctx.fillStyle = '#ff0';
    ctx.fillRect(x + 8, y + 6, 8, 2);
    ctx.fillRect(x + 11, y + 8, 2, 4);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(x + 6, y + 14, 12, 2);
  } else if (enemy.type === 'spambot') {
    ctx.fillStyle = '#ff8800';
    ctx.fillRect(x + 2, y + 2, 16, 16);
    ctx.fillStyle = '#ffaa44';
    ctx.fillRect(x + 4, y + 4, 12, 12);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 6, y + 6, 3, 3);
    ctx.fillRect(x + 11, y + 6, 3, 3);
    ctx.fillStyle = '#ff4400';
    ctx.fillRect(x, y, 2, 2);
    ctx.fillRect(x + 18, y, 2, 2);
  } else if (enemy.type === 'ransomware') {
    ctx.fillStyle = '#222';
    ctx.fillRect(x, y, 28, 28);
    ctx.fillStyle = '#444';
    ctx.fillRect(x + 2, y + 2, 24, 24);
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(x + 8, y + 6, 12, 10);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 10, y + 8, 3, 3);
    ctx.fillRect(x + 15, y + 8, 3, 3);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(x + 10, y + 12, 8, 2);
    ctx.fillStyle = '#666';
    ctx.fillRect(x + 4, y + 18, 20, 4);
    ctx.fillStyle = '#888';
    ctx.fillRect(x + 6, y + 19, 16, 2);
  }
}

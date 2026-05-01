const GRAVITY = 0.6;
const MAX_FALL = 12;
const MOVE_SPEED = 5;
const JUMP_FORCE = -12;
const FRICTION = 0.82;

export function createPlayer(x, y, character) {
  return {
    x, y, w: 20, h: character === 'mark' ? 30 : 26,
    vx: 0, vy: 0,
    grounded: false,
    hittingCeiling: false,
    facing: 1,
    lives: 3,
    score: 0,
    hasFirewall: false,
    invincible: 0,
    animFrame: 0,
    animTimer: 0,
    character: character || 'steve',
  };
}

export function updatePlayer(player, input) {
  const left = input('ArrowLeft') || input('KeyA');
  const right = input('ArrowRight') || input('KeyD');
  const jump = input('Space') || input('ArrowUp') || input('KeyW');
  const shoot = input('KeyX');

  if (left) { player.vx -= 1.2; player.facing = -1; }
  if (right) { player.vx += 1.2; player.facing = 1; }

  if (!left && !right) {
    player.vx *= FRICTION;
    if (Math.abs(player.vx) < 0.3) player.vx = 0;
  }

  player.vx = Math.max(-MOVE_SPEED, Math.min(MOVE_SPEED, player.vx));

  if (jump && player.grounded) {
    player.vy = JUMP_FORCE;
    player.grounded = false;
    player.jumpPressed = true;
  } else {
    player.jumpPressed = false;
  }

  if (shoot && player.hasFirewall) {
    player.shootRequested = true;
  }

  player.vy += GRAVITY;
  if (player.vy > MAX_FALL) player.vy = MAX_FALL;

  player.grounded = false;
  player.hittingCeiling = false;

  player.animTimer++;
  if (Math.abs(player.vx) > 0.5 && player.grounded) {
    if (player.animTimer % 8 === 0) player.animFrame = (player.animFrame + 1) % 2;
  } else {
    player.animFrame = 0;
  }

  if (player.invincible > 0) player.invincible--;

  player.shootRequested = false;
}

export function drawPlayer(ctx, player, camX, camY) {
  if (player.invincible > 0 && Math.floor(player.invincible / 4) % 2 === 0) return;

  const x = player.x - camX;
  const y = player.y - camY;
  const f = player.facing;
  const isMark = player.character === 'mark';

  const bodyH = isMark ? 16 : 12;
  const legY = y + bodyH + 4;
  const totalH = isMark ? 30 : 26;

  if (isMark) {
    ctx.fillStyle = '#222';
    ctx.fillRect(x + 5, y, 10, 6);

    ctx.fillStyle = '#33aa66';
    ctx.fillRect(x + 4, y + 6, 12, 14);

    ctx.fillStyle = '#ffcc88';
    ctx.fillRect(x + 5, y + 2, 10, 6);

    ctx.fillStyle = '#222';
    ctx.fillRect(x + (f > 0 ? 10 : 5), y + 3, 2, 2);
    ctx.fillRect(x + 4, y + 4, 4, 1);
    ctx.fillRect(x + 12, y + 4, 4, 1);

    ctx.fillStyle = '#228855';
    ctx.fillRect(x + 2, y + 20, 16, 8);

    ctx.fillStyle = '#1a6644';
    if (player.animFrame === 0) {
      ctx.fillRect(x + 2, y + 28, 6, 2);
      ctx.fillRect(x + 12, y + 28, 6, 2);
    } else {
      ctx.fillRect(x + 0, y + 28, 6, 2);
      ctx.fillRect(x + 14, y + 28, 6, 2);
    }
  } else {
    ctx.fillStyle = '#664422';
    ctx.fillRect(x + 5, y, 10, 5);

    ctx.fillStyle = '#3388ff';
    ctx.fillRect(x + 4, y + 5, 12, 11);

    ctx.fillStyle = '#ffcc88';
    ctx.fillRect(x + 5, y, 10, 6);

    ctx.fillStyle = '#222';
    ctx.fillRect(x + (f > 0 ? 10 : 5), y + 2, 2, 2);

    ctx.fillStyle = '#2244aa';
    ctx.fillRect(x + 2, y + 16, 16, 8);

    ctx.fillStyle = '#1a3388';
    if (player.animFrame === 0) {
      ctx.fillRect(x + 2, y + 24, 6, 2);
      ctx.fillRect(x + 12, y + 24, 6, 2);
    } else {
      ctx.fillRect(x + 0, y + 24, 6, 2);
      ctx.fillRect(x + 14, y + 24, 6, 2);
    }
  }

  if (player.hasFirewall) {
    ctx.fillStyle = '#44ff44';
    ctx.fillRect(x + 6, y + 10, 8, 2);
  }
}

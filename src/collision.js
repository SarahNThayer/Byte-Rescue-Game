export function aabb(a, b) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function resolveX(entity, platform) {
  if (aabb(entity, platform)) {
    const overlapLeft = (entity.x + entity.w) - platform.x;
    const overlapRight = (platform.x + platform.w) - entity.x;
    if (overlapLeft < overlapRight) {
      entity.x = platform.x - entity.w;
    } else {
      entity.x = platform.x + platform.w;
    }
    entity.vx = 0;
  }
}

export function resolveY(entity, platform) {
  if (aabb(entity, platform)) {
    const overlapTop = (entity.y + entity.h) - platform.y;
    const overlapBottom = (platform.y + platform.h) - entity.y;
    if (overlapTop < overlapBottom) {
      entity.y = platform.y - entity.h;
      entity.vy = 0;
      entity.grounded = true;
    } else {
      entity.y = platform.y + platform.h;
      entity.vy = 0;
      entity.hittingCeiling = true;
    }
  }
}

export function platformBetween(entity, other, platforms) {
  const left = Math.max(entity.x, other.x);
  const right = Math.min(entity.x + entity.w, other.x + other.w);
  if (left >= right) return false;

  const top = Math.min(entity.y, other.y);
  const bottom = Math.max(entity.y + entity.h, other.y + other.h);

  for (const p of platforms) {
    if (p.x + p.w > left && p.x < right) {
      if (p.y + p.h > top && p.y < bottom) return true;
    }
  }
  return false;
}

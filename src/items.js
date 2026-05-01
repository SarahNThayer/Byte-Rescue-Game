export function createCoffeeCup(x, y) {
  return { type: 'coffee', x, y, w: 12, h: 14, collected: false, bobOffset: 0 };
}

export function createAccessKey(x, y) {
  return { type: 'key', x, y, w: 16, h: 12, collected: false, bobOffset: 2 };
}

export function createFirewallUpgrade(x, y) {
  return { type: 'firewall', x, y, w: 18, h: 16, collected: false, bobOffset: 4 };
}

export function updateItems(items, time) {
  for (const item of items) {
    if (!item.collected) {
      item.bobOffset += 0.03;
    }
  }
}

export function drawItem(ctx, item, camX, camY, time) {
  if (item.collected) return;

  const bob = Math.sin(item.bobOffset + time * 0.005) * 3;
  const x = item.x - camX;
  const y = item.y - camY + bob;

  if (item.type === 'coffee') {
    ctx.fillStyle = '#cc8844';
    ctx.fillRect(x + 2, y + 4, 8, 10);
    ctx.fillStyle = '#aa6622';
    ctx.fillRect(x, y + 2, 12, 4);
    ctx.fillStyle = '#663311';
    ctx.fillRect(x + 3, y + 5, 6, 6);
    ctx.fillStyle = '#ddd';
    ctx.fillRect(x + 10, y + 6, 2, 6);
    ctx.fillRect(x + 10, y + 4, 4, 2);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 4, y - 2, 1, 2);
    ctx.fillRect(x + 7, y - 3, 1, 3);
  } else if (item.type === 'key') {
    ctx.fillStyle = '#ffdd00';
    ctx.fillRect(x + 6, y + 2, 8, 3);
    ctx.fillRect(x + 12, y + 2, 3, 8);
    ctx.fillRect(x + 10, y + 7, 5, 2);
    ctx.fillStyle = '#ffaa00';
    ctx.fillRect(x, y, 8, 8);
    ctx.fillStyle = '#444';
    ctx.fillRect(x + 2, y + 2, 4, 4);
  } else if (item.type === 'firewall') {
    ctx.fillStyle = '#22aa22';
    ctx.fillRect(x + 2, y + 2, 14, 12);
    ctx.fillStyle = '#44ff44';
    ctx.fillRect(x + 4, y + 4, 10, 8);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 7, y + 5, 4, 6);
    ctx.fillRect(x + 5, y + 7, 8, 2);
    ctx.fillStyle = '#22aa22';
    ctx.fillRect(x + 8, y, 2, 2);
    ctx.fillRect(x + 6, y + 14, 2, 2);
    ctx.fillRect(x + 10, y + 14, 2, 2);
  }
}

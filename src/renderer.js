//const logoImg = new Image();
//logoImg.src = './assets/ITHawaii8bitc.png'; // Path to your local jpeg
export const logoImg = new Image();
logoImg.src = './assets/ITHawaii8bitc.png'; // Make sure the path matches your folder structure

export function drawBackground(ctx, level, camX) {
  const grad = ctx.createLinearGradient(0, 0, 0, 480);
  grad.addColorStop(0, level.bgColor1);
  grad.addColorStop(1, level.bgColor2);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 800, 480);

  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  for (let i = 0; i < 40; i++) {
    const bx = ((i * 137 + 50) % 2000) - (camX * 0.1) % 2000;
    const by = (i * 89 + 30) % 200;
    ctx.fillRect(bx, by, 2, 2);
  }

  const cx = camX * 0.2;
  ctx.fillStyle = 'rgba(40,60,80,0.5)';
  for (let i = 0; i < 12; i++) {
    const bx = (i * 180 + 30) - cx % 2160;
    const bh = 60 + (i * 37) % 120;
    ctx.fillRect(bx, 480 - bh - 60, 50 + (i * 13) % 40, bh);
  }

  const cx2 = camX * 0.4;
  ctx.fillStyle = 'rgba(30,50,70,0.7)';
  for (let i = 0; i < 15; i++) {
    const bx = (i * 140 + 20) - cx2 % 2100;
    const bh = 40 + (i * 29) % 80;
    ctx.fillRect(bx, 480 - bh - 60, 60 + (i * 17) % 30, bh);
    ctx.fillStyle = 'rgba(100,150,200,0.15)';
    for (let wy = 0; wy < bh - 10; wy += 12) {
      for (let wx = 8; wx < 50; wx += 14) {
        ctx.fillRect(bx + wx, 480 - bh - 60 + wy + 4, 6, 6);
      }
    }
    ctx.fillStyle = 'rgba(30,50,70,0.7)';
  }

  ctx.fillStyle = '#2a3a4a';
  for (let i = 0; i < 8; i++) {
    const bx = (i * 200 + 50) - (camX * 0.6) % 1600;
    ctx.fillRect(bx, 476, 30, 4);
    ctx.fillStyle = '#555';
    ctx.fillRect(bx, 478, 2, 2);
    ctx.fillStyle = '#2a3a4a';
  }
}

export function drawPlatforms(ctx, platforms, camX) {
  for (const p of platforms) {
    const x = p.x - camX;
    if (x > -p.w && x < 850) {
      if (p.h >= 60) {
        ctx.fillStyle = '#444';
        ctx.fillRect(x, p.y, p.w, p.h);
        ctx.fillStyle = '#666';
        ctx.fillRect(x, p.y, p.w, 4);
        ctx.fillStyle = '#555';
        for (let i = 0; i < p.w; i += 20) {
          ctx.fillRect(x + i, p.y + 4, 1, p.h - 4);
        }
      } else {
        ctx.fillStyle = '#556';
        ctx.fillRect(x, p.y, p.w, p.h);
        ctx.fillStyle = '#778';
        ctx.fillRect(x, p.y, p.w, 3);
        ctx.fillStyle = '#445';
        ctx.fillRect(x + 2, p.y + 3, p.w - 4, 2);
      }
    }
  }
}

export function drawExitGate(ctx, gate, camX, unlocked) {
  const x = gate.x - camX;
  const y = gate.y;

  ctx.fillStyle = unlocked ? '#44ff44' : '#666';
  ctx.fillRect(x, y, gate.w, gate.h);
  ctx.fillStyle = unlocked ? '#88ff88' : '#888';
  ctx.fillRect(x + 4, y + 4, gate.w - 8, gate.h - 8);
  ctx.fillStyle = unlocked ? '#aaffaa' : '#aaa';

  if (unlocked) {
    ctx.fillRect(x + 10, y + 10, 20, 40);
    ctx.fillStyle = '#fff';
    ctx.fillRect(x + 15, y + 20, 10, 2);
    ctx.fillRect(x + 19, y + 16, 2, 10);
  } else {
    ctx.fillRect(x + 10, y + 10, 8, 20);
    ctx.fillRect(x + 22, y + 10, 8, 20);
    ctx.fillStyle = '#ff4444';
    ctx.fillRect(x + 14, y + 25, 12, 2);
  }
}

export function drawTeleportNodes(ctx, nodes, camX, time) {
  for (const n of nodes) {
    const x = n.x - camX;
    const y = n.y;
    const pulse = Math.sin(time * 0.01) * 3;

    ctx.fillStyle = '#4488ff';
    ctx.fillRect(x - 2 + pulse, y - 2 + pulse, n.w + 4 - pulse * 2, n.h + 4 - pulse * 2);
    ctx.fillStyle = '#88bbff';
    ctx.fillRect(x + 2, y + 2, n.w - 4, n.h - 4);
    ctx.fillStyle = '#aaddff';
    ctx.fillRect(x + 6, y + 6, n.w - 12, n.h - 12);
  }
}

export function drawHUD(ctx, player, level, keysCollected) {
  let hearts = '';
  for (let i = 0; i < player.lives; i++) hearts += '♥';
  document.getElementById('hud-lives').textContent = 'LIVES: ' + hearts;
  document.getElementById('hud-level').textContent = level.name;
  document.getElementById('hud-keys').textContent = 'KEYS: ' + keysCollected + '/' + level.keysRequired;
  document.getElementById('hud-score').textContent = 'SCORE: ' + player.score;
}

export function updateMuteButton(muted) {
  const btn = document.getElementById('mute-btn');
  if (btn) btn.textContent = muted ? '🔇' : '🔊';
}

export function showOverlay(title, subtitle, showRestart, showBlink, blinkText) {
  const overlay = document.getElementById('overlay');
  overlay.classList.remove('hidden');
  overlay.querySelector('h1').textContent = title;
  overlay.querySelector('h2').textContent = subtitle || ''; // add an or src="assets/ITHawaii8bitc.png" id="logo-source"

  const btn = document.getElementById('restart-btn');
  btn.style.display = showRestart ? 'block' : 'none';

  const blink = overlay.querySelector('.blink');
  if (blinkText) {
    blink.textContent = blinkText;
    blink.style.display = 'block';
  } else if (showBlink) {
    blink.style.display = 'block';
  } else {
    blink.style.display = 'none';
  }

  const ps = overlay.querySelectorAll('p:not(.blink)');
  ps.forEach(p => p.style.display = 'none');
}

export function hideOverlay() {
  document.getElementById('overlay').classList.add('hidden');
}

export function drawTitleScreen(ctx, time) {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, 800, 480);

  for (let i = 0; i < 50; i++) {
    const sx = (i * 97 + time * 0.1) % 800;
    const sy = (i * 53) % 480;
    ctx.fillStyle = `rgba(255,255,255,${0.1 + (Math.sin(time * 0.01 + i) * 0.1)})`;
    ctx.fillRect(sx, sy, 2, 2);
  }

  ctx.fillStyle = '#44ffaa';
  ctx.font = 'bold 48px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BYTE RESCUE', 400, 140);

  ctx.fillStyle = '#ffdd44';
  ctx.font = '20px monospace';
  ctx.fillText('vs The Glitch King', 400, 180);

  ctx.fillStyle = '#88aacc';
  ctx.font = '14px monospace';
  ctx.fillText('Arrow Keys / WASD — Move', 400, 240);
  ctx.fillText('Space — Jump', 400, 260);
  ctx.fillText('X — Shoot (with Firewall Upgrade)', 400, 280);
  ctx.fillText('Stomp enemies from above!', 400, 300);

  const blink = Math.sin(time * 0.005) > 0;
  if (blink) {
    ctx.fillStyle = '#ffdd44';
    ctx.font = '18px monospace';
    ctx.fillText('Press SPACE or ENTER to Start', 400, 380);
  }
  ctx.textAlign = 'left';

 
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, 800, 480);

  if (logoImg.complete) {
    const targetWidth = 300; // Choose how wide you want the logo
    const aspectRatio = 4096 / 1188;
    const targetHeight = targetWidth / aspectRatio;
    
    ctx.save();
    ctx.imageSmoothingEnabled = false; // Keeps it 8-bit/crisp
    
    // Draw centered horizontally (400 - half width) 
    // and placed above the "BYTE RESCUE" text (Y = 20)
    ctx.globalAlpha = 1.0; // still bleeds because image is transparent
    ctx.drawImage(
      logoImg, 
      400 - (targetWidth / 2), 20, 
      targetWidth, targetHeight
    );
    ctx.restore();
  }
}

// export function drawTitleScreen(ctx, time) {
//   // 1. Draw Background & Stars FIRST
//   ctx.fillStyle = '#0a0a1a';
//   ctx.fillRect(0, 0, 800, 480);

//   for (let i = 0; i < 50; i++) {
//     const sx = (i * 97 + time * 0.1) % 800;
//     const sy = (i * 53) % 480;
//     ctx.fillStyle = `rgba(255,255,255,${0.1 + (Math.sin(time * 0.01 + i) * 0.1)})`;
//     ctx.fillRect(sx, sy, 2, 2);
//   }

//   // 2. Draw all your text...
//   ctx.fillStyle = '#44ffaa';
//   ctx.font = 'bold 48px monospace';
//   ctx.textAlign = 'center';
//   ctx.fillText('BYTE RESCUE', 400, 140);
//   // ... (rest of your text calls)

//   // 3. Draw the Logo LAST so it sits on top of everything
//   if (logoImg.complete) {
//     const targetWidth = 300;
//     const aspectRatio = 4096 / 1188;
//     const targetHeight = targetWidth / aspectRatio;
    
//     ctx.save(); 
//     // This ensures no transparency from other parts of the game leaks in
//     ctx.globalAlpha = 1.0; 
//     ctx.imageSmoothingEnabled = false;
//     ctx.drawImage(
//       logoImg, 
//       400 - (targetWidth / 2), 20, 
//       targetWidth, targetHeight
//     );
//     ctx.restore(); 
//   }

//   ctx.textAlign = 'left';
// }

export function drawCharSelect(ctx, time) {
  ctx.fillStyle = '#0a0a1a';
  ctx.fillRect(0, 0, 800, 480);

  ctx.fillStyle = '#44ffaa';
  ctx.font = 'bold 32px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SELECT OPERATOR', 400, 80);

  ctx.fillStyle = '#3388ff';
  ctx.fillRect(200, 140, 40, 52);
  ctx.fillStyle = '#664422';
  ctx.fillRect(210, 140, 20, 10);
  ctx.fillStyle = '#ffcc88';
  ctx.fillRect(210, 142, 20, 12);
  ctx.fillStyle = '#222';
  ctx.fillRect(220, 144, 4, 4);
  ctx.fillStyle = '#2244aa';
  ctx.fillRect(204, 192, 32, 16);
  ctx.fillStyle = '#fff';
  ctx.font = '24px monospace';
  ctx.fillText('STEVE', 220, 230);
  ctx.fillStyle = '#aaa';
  ctx.font = '14px monospace';
  ctx.fillText('Fast & Agile', 220, 250);

  ctx.fillStyle = '#33aa66';
  ctx.fillRect(560, 130, 40, 60);
  ctx.fillStyle = '#222';
  ctx.fillRect(570, 130, 20, 12);
  ctx.fillStyle = '#ffcc88';
  ctx.fillRect(570, 134, 20, 12);
  ctx.fillStyle = '#222';
  ctx.fillRect(580, 136, 4, 4);
  ctx.fillRect(564, 137, 8, 2);
  ctx.fillRect(588, 137, 8, 2);
  ctx.fillStyle = '#228855';
  ctx.fillRect(564, 190, 32, 16);
  ctx.fillStyle = '#fff';
  ctx.font = '24px monospace';
  ctx.fillText('MARK', 580, 230);
  ctx.fillStyle = '#aaa';
  ctx.font = '14px monospace';
  ctx.fillText('Tough & Steady', 580, 250);

  const blink = Math.sin(time * 0.005) > 0;
  if (blink) {
    ctx.fillStyle = '#ffdd44';
    ctx.font = '16px monospace';
    ctx.fillText('Press 1 for Steve, 2 for Mark', 400, 350);
  }
  ctx.textAlign = 'left';
}

export function drawVan(ctx, vanX, vanY, time) {
  ctx.fillStyle = '#ddeeff';
  ctx.fillRect(vanX, vanY, 80, 40);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(vanX + 2, vanY + 2, 76, 36);
  ctx.fillStyle = '#aaccdd';
  ctx.fillRect(vanX + 56, vanY + 4, 22, 20);
  ctx.fillStyle = '#88bbcc';
  ctx.fillRect(vanX + 58, vanY + 6, 18, 16);
  ctx.fillStyle = '#444';
  ctx.fillRect(vanX + 12, vanY + 38, 12, 6);
  ctx.fillRect(vanX + 56, vanY + 38, 12, 6);
  ctx.fillStyle = '#3366aa';
  ctx.fillRect(vanX + 8, vanY + 12, 16, 12);
  ctx.fillStyle = '#5588cc';
  ctx.fillRect(vanX + 10, vanY + 14, 12, 8);
  ctx.fillStyle = '#ffdd44';
  ctx.fillRect(vanX + 76, vanY + 16, 4, 8);
}

export function drawVictoryScreen(ctx, player, time) {
  ctx.fillStyle = 'rgba(0,0,0,0.8)';
  ctx.fillRect(0, 0, 800, 480);

  ctx.fillStyle = '#ffdd44';
  ctx.font = '36px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('GLITCH KING DEFEATED!', 400, 180);

  ctx.fillStyle = '#44ffaa';
  ctx.font = '20px monospace';
  ctx.fillText('Client System Saved!', 400, 230);

  ctx.fillStyle = '#fff';
  ctx.font = '18px monospace';
  ctx.fillText('Final Score: ' + player.score, 400, 280);

  const blink = Math.sin(time * 0.005) > 0;
  if (blink) {
    ctx.fillStyle = '#ffdd44';
    ctx.font = '16px monospace';
    ctx.fillText('Press ENTER to restart', 400, 340);
  }
  ctx.textAlign = 'left';
}

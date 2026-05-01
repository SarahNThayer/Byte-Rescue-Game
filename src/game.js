import { createPlayer, updatePlayer, drawPlayer } from './player.js';
import { updateEnemy, drawEnemy } from './enemies.js';
import { updateItems, drawItem } from './items.js';
import { createProjectile, updateProjectiles, drawProjectile } from './projectiles.js';
import { createCamera, updateCamera } from './camera.js';
import { getLevelData } from './levels.js';
import { aabb, resolveX, resolveY, platformBetween } from './collision.js';
import { drawBackground, drawPlatforms, drawExitGate, drawTeleportNodes, drawHUD, showOverlay, hideOverlay, drawVictoryScreen, drawTitleScreen, drawCharSelect, drawVan, updateMuteButton } from './renderer.js';
import { playSound, startBGM, stopBGM } from './audio.js';

const STATES = { TITLE: 'title', CHAR_SELECT: 'char_select', INTRO: 'intro', PLAYING: 'playing', LEVEL_COMPLETE: 'level_complete', GAME_OVER: 'game_over', VICTORY: 'victory' };

export function createGame(input) {
  const state = {
    current: STATES.TITLE,
    level: 1,
    maxLevel: 3,
    player: null,
    camera: null,
    levelData: null,
    projectiles: [],
    keysCollected: 0,
    exitUnlocked: false,
    time: 0,
    shootCooldown: 0,
    movingPlatformState: [],
    selectedChar: 'steve',
    van: null,
    introPhase: 0,
    introTimer: 0,
    enemySpawnTimer: 0,
    enemySpawnInterval: 180,
    lastPlayerBottom: 0,
  };

  function initLevel(num) {
    state.levelData = getLevelData(num);
    const charH = state.selectedChar === 'mark' ? 30 : 26;
    state.player = createPlayer(state.levelData.playerSpawn.x, state.levelData.playerSpawn.y + 28 - charH, state.selectedChar);
    state.camera = createCamera(800, 480);
    state.projectiles = [];
    state.keysCollected = 0;
    state.exitUnlocked = false;
    state.time = 0;
    state.shootCooldown = 0;
    state.movingPlatformState = [];
    state.enemySpawnTimer = 0;
    state.lastPlayerBottom = state.player.y + state.player.h;
    if (state.levelData.movingPlatforms) {
      state.movingPlatformState = state.levelData.movingPlatforms.map(p => ({
        ...p, t: 0, prevX: p.origX, prevY: p.origY,
      }));
    }
    const ld = state.levelData;
    state.van = { x: -100, y: ld.playerSpawn.y - 40, phase: 0, timer: 0 };
    state.introPhase = 0;
    state.introTimer = 0;
  }

  function startGame() {
    state.current = STATES.CHAR_SELECT;
    hideOverlay();
  }

  function startLevelIntro() {
    initLevel(state.level);
    state.current = STATES.INTRO;
    hideOverlay();
    startBGM();
  }

  function updateIntro(p, ld) {
    const van = state.van;
    state.introTimer++;

    if (van.phase === 0) {
      van.x += 3;
      if (van.x >= ld.playerSpawn.x - 40) {
        van.x = ld.playerSpawn.x - 40;
        van.phase = 1;
        van.timer = 0;
      }
    } else if (van.phase === 1) {
      van.timer++;
      if (van.timer > 40) {
        van.phase = 2;
        van.timer = 0;
      }
    } else if (van.phase === 2) {
      van.timer++;
      if (van.timer > 20) {
        p.x = ld.playerSpawn.x;
        p.y = ld.playerSpawn.y + 28 - (p.character === 'mark' ? 30 : 26);
        van.phase = 3;
      }
    } else if (van.phase === 3) {
      van.x += 4;
      if (van.x > 900) {
        state.current = STATES.PLAYING;
      }
    }
  }

  function drawIntro(ctx) {
    const ld = state.levelData;
    const cam = state.camera;
    drawBackground(ctx, ld, cam.x);
    drawPlatforms(ctx, ld.platforms, cam.x);
    drawExitGate(ctx, ld.exitGate, cam.x, state.exitUnlocked);
    if (ld.teleportNodes) {
      drawTeleportNodes(ctx, ld.teleportNodes, cam.x, state.time);
    }
    drawVan(ctx, state.van.x - cam.x, state.van.y, state.time);
    if (state.van.phase >= 2) {
      drawPlayer(ctx, state.player, cam.x, cam.y);
    }
  }

  function spawnEnemy() {
    const ld = state.levelData;
    const p = state.player;
    const cam = state.camera;

    const spawnX = cam.x + Math.random() * cam.width;
    if (Math.abs(spawnX - p.x) < 150) return;

    const types = ['spider', 'malware', 'spambot', 'ransomware'];
    const weights = [0.35, 0.25, 0.25, 0.15];
    let r = Math.random();
    let type = 'spider';
    for (let i = 0; i < types.length; i++) {
      r -= weights[i];
      if (r <= 0) { type = types[i]; break; }
    }

    const groundY = 420;
    let ex, ey;
    if (type === 'spider' || type === 'spambot') {
      ex = spawnX;
      ey = groundY - (type === 'spider' ? 16 : 20);
    } else if (type === 'malware') {
      ex = spawnX;
      ey = groundY - 24;
    } else {
      ex = spawnX;
      ey = groundY - 28;
    }

    const enemy = { type, x: ex, y: ey, w: 22, h: 16, vx: -1.2, vy: 0, alive: true, animFrame: 0, animTimer: 0 };

    if (type === 'malware') { enemy.w = 24; enemy.h = 24; enemy.vx = -1; enemy.platformY = ey; }
    if (type === 'spambot') { enemy.w = 20; enemy.h = 20; enemy.vx = -1.8; enemy.bounceTimer = 0; }
    if (type === 'ransomware') { enemy.w = 28; enemy.h = 28; enemy.vx = -0.6; }

    ld.enemies.push(enemy);
  }

  function handleEnemyCollision(player, enemy, preVy, prePlayerBottom) {
    if (!enemy.alive || player.invincible > 0) return false;

    const playerBottom = player.y + player.h;
    const enemyTop = enemy.y;

    if (aabb(player, enemy)) {
      const wasAbove = prePlayerBottom <= enemyTop + 4;
      const isNowOverlapping = playerBottom >= enemyTop;
      const fallingStomp = preVy > 0 && wasAbove && isNowOverlapping;
      const blocked = platformBetween(player, enemy, state.levelData.platforms);

      if (fallingStomp && !blocked) {
        enemy.alive = false;
        player.vy = -8;
        player.score += 100;
        playSound('stomp');
        return true;
      }

      player.lives--;
      player.invincible = 90;
      playSound('hurt');
      if (player.lives <= 0) {
        state.current = STATES.GAME_OVER;
        stopBGM();
        showOverlay('GAME OVER', 'The Glitch King Wins', true, false);
      }
      return true;
    }

    return false;
  }

  function handleItemCollection(player, item) {
    if (item.collected) return;
    if (!aabb(player, item)) return;

    item.collected = true;

    if (item.type === 'coffee') {
      player.score += 50;
      playSound('collect');
    } else if (item.type === 'key') {
      player.score += 200;
      state.keysCollected++;
      playSound('key');
      if (state.keysCollected >= state.levelData.keysRequired) {
        state.exitUnlocked = true;
      }
    } else if (item.type === 'firewall') {
      player.hasFirewall = true;
      player.score += 150;
      playSound('collect');
    }
  }

  function handleTeleportNodes(player, time) {
    if (!state.levelData.teleportNodes) return;
    for (const node of state.levelData.teleportNodes) {
      if (aabb(player, node)) {
        player.x = node.target.x;
        player.y = node.target.y;
        player.invincible = 30;
      }
    }
  }

  function updateMovingPlatforms(dt) {
    if (!state.movingPlatformState.length) return;
    for (const mp of state.movingPlatformState) {
      mp.t += mp.speed * 0.02;
      const prevX = mp.x;
      const prevY = mp.y;

      if (mp.axis === 'x') {
        mp.x = mp.origX + Math.sin(mp.t) * ((mp.endX - mp.startX) / 2);
      } else {
        mp.y = mp.origY + Math.sin(mp.t) * ((mp.endY - mp.startY) / 2);
      }

      const dx = mp.x - prevX;
      const dy = mp.y - prevY;

      const p = state.player;
      const onPlatform = p.x + p.w > mp.x && p.x < mp.x + mp.w;
      if (onPlatform && Math.abs((p.y + p.h) - mp.y) < 8) {
        p.x += dx;
        p.y += dy;
        p.grounded = true;
      }
    }
  }

  function update() {
    if (state.current === STATES.TITLE) {
      if (input('Space') || input('Enter')) startGame();
      return;
    }

    if (state.current === STATES.CHAR_SELECT) {
      if (input('Digit1') || input('Numpad1')) {
        state.selectedChar = 'steve';
        startLevelIntro();
      }
      if (input('Digit2') || input('Numpad2')) {
        state.selectedChar = 'mark';
        startLevelIntro();
      }
      return;
    }

    if (state.current === STATES.GAME_OVER || state.current === STATES.VICTORY) {
      if (input('Enter')) {
        showOverlay('BYTE RESCUE', 'vs The Glitch King', false, true, 'Press SPACE or ENTER to Start');
        state.current = STATES.TITLE;
      }
      return;
    }

    if (state.current === STATES.LEVEL_COMPLETE) {
      if (input('Enter')) {
        state.level++;
        if (state.level > state.maxLevel) {
          state.current = STATES.VICTORY;
          stopBGM();
          showOverlay('YOU WIN!', 'The System is Saved!', false, true);
        } else {
          startLevelIntro();
        }
      }
      return;
    }

    if (state.current === STATES.INTRO) {
      state.time++;
      updateIntro(state.player, state.levelData);
      return;
    }

    state.time++;
    const p = state.player;
    const ld = state.levelData;

    updatePlayer(p, input);

    if (p.jumpPressed) playSound('jump');

    p.x += p.vx;
    for (const plat of ld.platforms) {
      resolveX(p, plat);
    }

    updateMovingPlatforms(state.time);

    const preVy = p.vy;
    const prePlayerBottom = p.y + p.h;
    p.y += p.vy;

    for (const enemy of ld.enemies) {
      if (enemy.alive) handleEnemyCollision(p, enemy, preVy, prePlayerBottom);
    }

    for (const plat of ld.platforms) {
      resolveY(p, plat);
    }

    if (p.x < 0) { p.x = 0; p.vx = 0; }
    if (p.x > ld.width - p.w) { p.x = ld.width - p.w; p.vx = 0; }

    if (p.y > ld.height + 50) {
      p.lives--;
      playSound('hurt');
      if (p.lives <= 0) {
        state.current = STATES.GAME_OVER;
        stopBGM();
        showOverlay('GAME OVER', 'The Glitch King Wins', true, false);
        return;
      }
      p.x = ld.playerSpawn.x;
      p.y = ld.playerSpawn.y;
      p.vx = 0;
      p.vy = 0;
      p.invincible = 60;
    }

    state.enemySpawnTimer++;
    if (state.enemySpawnTimer >= state.enemySpawnInterval) {
      state.enemySpawnTimer = 0;
      spawnEnemy();
    }

    for (const enemy of ld.enemies) {
      updateEnemy(enemy, ld.platforms);
    }

    if (p.shootRequested && p.hasFirewall && state.shootCooldown <= 0) {
      state.projectiles.push(createProjectile(
        p.x + (p.facing > 0 ? p.w : -10),
        p.y + p.h / 2 - 3,
        p.facing
      ));
      state.shootCooldown = 20;
      playSound('shoot');
    }
    if (state.shootCooldown > 0) state.shootCooldown--;

    updateProjectiles(state.projectiles, ld.platforms);

    for (const proj of state.projectiles) {
      if (!proj.alive) continue;
      for (const enemy of ld.enemies) {
        if (enemy.alive && aabb(proj, enemy)) {
          enemy.alive = false;
          proj.alive = false;
          p.score += 100;
          playSound('stomp');
        }
      }
    }

    for (const item of ld.items) {
      handleItemCollection(p, item);
    }

    handleTeleportNodes(p, state.time);

    if (state.exitUnlocked && aabb(p, ld.exitGate)) {
      state.current = STATES.LEVEL_COMPLETE;
      playSound('levelComplete');
      showOverlay('LEVEL ' + state.level + ' COMPLETE!', ld.name, false, true, 'Press ENTER for next level');
    }

    updateCamera(state.camera, p, ld.width, ld.height);
    drawHUD(null, p, ld, state.keysCollected);
  }

  function render(ctx) {
    if (state.current === STATES.TITLE) {
      drawTitleScreen(ctx, state.time);
      state.time++;
      return;
    }

    if (state.current === STATES.CHAR_SELECT) {
      drawCharSelect(ctx, state.time);
      state.time++;
      return;
    }

    if (state.current === STATES.VICTORY) {
      drawVictoryScreen(ctx, state.player, state.time);
      state.time++;
      return;
    }

    if (state.current === STATES.INTRO) {
      drawIntro(ctx);
      state.time++;
      return;
    }

    if (state.current === STATES.GAME_OVER) return;

    const cam = state.camera;
    const ld = state.levelData;

    drawBackground(ctx, ld, cam.x);
    drawPlatforms(ctx, ld.platforms, cam.x);

    if (state.movingPlatformState.length) {
      for (const mp of state.movingPlatformState) {
        ctx.fillStyle = '#668';
        ctx.fillRect(mp.x - cam.x, mp.y, mp.w, mp.h);
        ctx.fillStyle = '#88a';
        ctx.fillRect(mp.x - cam.x, mp.y, mp.w, 3);
      }
    }

    drawExitGate(ctx, ld.exitGate, cam.x, state.exitUnlocked);

    if (ld.teleportNodes) {
      drawTeleportNodes(ctx, ld.teleportNodes, cam.x, state.time);
    }

    for (const item of ld.items) {
      drawItem(ctx, item, cam.x, cam.y, state.time);
    }

    for (const enemy of ld.enemies) {
      drawEnemy(ctx, enemy, cam.x, cam.y);
    }

    drawPlayer(ctx, state.player, cam.x, cam.y);

    for (const proj of state.projectiles) {
      drawProjectile(ctx, proj, cam.x, cam.y);
    }

    drawHUD(ctx, state.player, ld, state.keysCollected);
  }

  function restart() {
    showOverlay('BYTE RESCUE', 'vs The Glitch King', false, true, 'Press SPACE or ENTER to Start');
    state.current = STATES.TITLE;
  }

  return { state, update, render, startGame, restart };
}

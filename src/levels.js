import { createSpider, createMalware, createSpamBot, createRansomwareBlock } from './enemies.js';
import { createCoffeeCup, createAccessKey, createFirewallUpgrade } from './items.js';

export function getLevelData(levelNum) {
  if (levelNum === 1) return level1();
  if (levelNum === 2) return level2();
  if (levelNum === 3) return level3();
  return level1();
}

function level1() {
  const W = 4000;
  const H = 480;
  const groundY = 420;

  const platforms = [
    { x: 0, y: groundY, w: W, h: 60 },
    { x: 200, y: 340, w: 120, h: 16 },
    { x: 400, y: 280, w: 140, h: 16 },
    { x: 620, y: 320, w: 100, h: 16 },
    { x: 820, y: 260, w: 140, h: 16 },
    { x: 1050, y: 300, w: 120, h: 16 },
    { x: 1250, y: 350, w: 140, h: 16 },
    { x: 1480, y: 280, w: 120, h: 16 },
    { x: 1680, y: 220, w: 140, h: 16 },
    { x: 1900, y: 300, w: 100, h: 16 },
    { x: 2100, y: 340, w: 140, h: 16 },
    { x: 2320, y: 260, w: 120, h: 16 },
    { x: 2520, y: 200, w: 140, h: 16 },
    { x: 2750, y: 280, w: 120, h: 16 },
    { x: 2950, y: 340, w: 140, h: 16 },
    { x: 3180, y: 260, w: 120, h: 16 },
    { x: 3380, y: 300, w: 140, h: 16 },
    { x: 3600, y: 240, w: 140, h: 16 },
    { x: 3820, y: 320, w: 120, h: 16 },
    { x: 500, y: 200, w: 60, h: 80 },
    { x: 1400, y: 180, w: 60, h: 100 },
    { x: 2400, y: 160, w: 60, h: 80 },
    { x: 3300, y: 180, w: 60, h: 120 },
  ];

  const enemies = [
    createSpider(700, groundY - 16),
    createSpider(1100, groundY - 16),
    createSpider(1600, groundY - 16),
    createSpider(2000, groundY - 16),
    createSpider(2400, groundY - 16),
    createSpider(2900, groundY - 16),
    createSpider(3300, groundY - 16),
    createSpider(820, 244),
    createSpider(1570, 204),
    createSpider(2320, 184),
    createMalware(1300, groundY - 24),
    createMalware(2700, groundY - 24),
    createMalware(3500, groundY - 24),
    createSpamBot(1800, groundY - 20),
    createSpamBot(3100, groundY - 20),
  ];

  const items = [
    createCoffeeCup(250, 300),
    createCoffeeCup(450, 240),
    createCoffeeCup(850, 220),
    createCoffeeCup(1470, 240),
    createCoffeeCup(1600, 180),
    createCoffeeCup(2150, 220),
    createCoffeeCup(2550, 240),
    createCoffeeCup(3100, 260),
    createCoffeeCup(3370, 200),
    createFirewallUpgrade(1570, 180),
    createAccessKey(1950, 284),
    createAccessKey(3850, 304),
  ];

  const exitGate = { x: 3900, y: groundY - 60, w: 40, h: 60 };

  return {
    name: 'Help Desk Plains',
    width: W, height: H,
    playerSpawn: { x: 50, y: groundY - 28 },
    platforms, enemies, items, exitGate,
    keysRequired: 2,
    bgColor1: '#1a2a3a',
    bgColor2: '#0a1a2a',
  };
}

function level2() {
  const W = 4500;
  const H = 480;
  const groundY = 420;

  const platforms = [
    { x: 0, y: groundY, w: 400, h: 60 }, // starting
    { x: 250, y: 350, w: 100, h: 16 }, // first one
    { x: 450, y: 280, w: 120, h: 16 },
    { x: 650, y: 220, w: 120, h: 16 },
    { x: 850, y: 280, w: 100, h: 16 },
    { x: 1050, y: 350, w: 120, h: 16 },
    { x: 1250, y: 300, w: 100, h: 16 },
    { x: 1450, y: 240, w: 120, h: 16 },
    { x: 1650, y: 300, w: 120, h: 16 },
    { x: 1850, y: 350, w: 100, h: 16 },
    { x: 2050, y: 280, w: 120, h: 16 },
    { x: 2250, y: 220, w: 120, h: 16 },
    { x: 2450, y: 300, w: 100, h: 16 },
    { x: 2650, y: 350, w: 120, h: 16 },
    { x: 2850, y: 280, w: 120, h: 16 },
    { x: 3050, y: 220, w: 120, h: 16 },
    { x: 3250, y: 300, w: 100, h: 16 },
    { x: 3450, y: 240, w: 120, h: 16 },
    { x: 3650, y: 300, w: 120, h: 16 },
    { x: 3850, y: 220, w: 120, h: 16 },
    { x: 4050, y: 350, w: 140, h: 16 },
    { x: 4250, y: groundY, w: 250, h: 60 },
    // { x: 600, y: 150, w: 60, h: 80 },
    // { x: 1400, y: 140, w: 60, h: 100 },
    // { x: 2200, y: 130, w: 60, h: 90 },
    // { x: 3000, y: 140, w: 60, h: 80 },
    // { x: 3800, y: 150, w: 60, h: 70 },
  ];


  const movingPlatforms = [
    { x: 400, y: 320, w: 80, h: 16, startX: 400, endX: 580, speed: 1, moveY: false, axis: 'x' },
    { x: 950, y: 250, w: 80, h: 16, startY: 200, endY: 300, speed: 0.8, moveY: true, axis: 'y' },
    { x: 1750, y: 280, w: 80, h: 16, startX: 1750, endX: 1950, speed: 1.2, moveY: false, axis: 'x' },
    { x: 2550, y: 220, w: 80, h: 16, startY: 180, endY: 280, speed: 1, moveY: true, axis: 'y' },
    { x: 3350, y: 260, w: 80, h: 16, startX: 3350, endX: 3550, speed: 1, moveY: false, axis: 'x' },
    { x: 3950, y: 280, w: 80, h: 16, startY: 240, endY: 340, speed: 0.8, moveY: true, axis: 'y' },
  ];

  const enemies = [
    createSpider(250, groundY - 16),
    createSpider(800, groundY - 16),
    createSpider(1500, groundY - 16),
    createSpider(2200, groundY - 16),
    createSpider(3000, groundY - 16),
    createSpider(3700, groundY - 16),
    createMalware(680, 204),
    createMalware(1480, 224),
    createMalware(2280, 204),
    createMalware(3080, 204),
    createMalware(3880, 204),
    createSpamBot(1100, groundY - 20),
    createSpamBot(1900, groundY - 20),
    createSpamBot(2700, groundY - 20),
    createSpamBot(3500, groundY - 20),
    createRansomwareBlock(1300, groundY - 28),
    createRansomwareBlock(2900, groundY - 28),
  ];

  const items = [
    createCoffeeCup(500, 240),
    createCoffeeCup(900, 240),
    createCoffeeCup(1500, 200),
    createCoffeeCup(2100, 240),
    createCoffeeCup(2700, 260),
    createCoffeeCup(3300, 260),
    createCoffeeCup(3900, 180),
    createCoffeeCup(4100, 310),
    createFirewallUpgrade(2280, 180),
    createAccessKey(1500, 200),
    createAccessKey(3100, 180),
    createAccessKey(4100, 310),
  ];

  const exitGate = { x: 4400, y: groundY - 60, w: 40, h: 60 };

  return {
    name: 'Server Stack Towers',
    width: W, height: H,
    playerSpawn: { x: 50, y: groundY - 28 },
    platforms: [...platforms, ...movingPlatforms],
    enemies, items, exitGate,
    keysRequired: 3,
    bgColor1: '#1a1a2a',
    bgColor2: '#0a0a1a',
    movingPlatforms: movingPlatforms.map(p => ({
      ...p, t: 0,
      origX: p.x, origY: p.y,
    })),
  };
}

function level3() {
  const W = 5000;
  const H = 480;
  const groundY = 420;

  level 3 platforms:
  const platforms = [
    { x: 0, y: groundY, w: 350, h: 60 },
    { x: 250, y: 340, w: 80, h: 16 },
    { x: 450, y: 280, w: 100, h: 16 },
    { x: 650, y: 220, w: 120, h: 16 },
    { x: 850, y: 280, w: 80, h: 16 },
    { x: 1050, y: 340, w: 100, h: 16 },
    { x: 1250, y: 280, w: 120, h: 16 },
    { x: 1450, y: 220, w: 100, h: 16 },
    { x: 1650, y: 280, w: 80, h: 16 },
    { x: 1850, y: 340, w: 100, h: 16 },
    { x: 2050, y: 280, w: 120, h: 16 },
    { x: 2250, y: 220, w: 100, h: 16 },
    { x: 2450, y: 300, w: 80, h: 16 },
    { x: 2650, y: 340, w: 100, h: 16 },
    { x: 2850, y: 280, w: 120, h: 16 },
    { x: 3050, y: 220, w: 120, h: 16 },
    { x: 3250, y: 280, w: 80, h: 16 },
    { x: 3450, y: 340, w: 100, h: 16 },
    { x: 3650, y: 280, w: 120, h: 16 },
    { x: 3850, y: 220, w: 100, h: 16 },
    { x: 4050, y: 300, w: 80, h: 16 },
    { x: 4250, y: 340, w: 100, h: 16 },
    { x: 4450, y: 280, w: 120, h: 16 },
    { x: 4650, y: 220, w: 150, h: 16 },
    { x: 4850, y: groundY, w: 150, h: 60 },
    // { x: 500, y: 160, w: 60, h: 80 },
    // { x: 1350, y: 125, w: 60, h: 75 },
    { x: 2150, y: 175, w: 60, h: 90 },
    { x: 2950, y: 170, w: 60, h: 80 },
    { x: 3750, y: 170, w: 60, h: 70 },
    { x: 4550, y: 170, w: 60, h: 80 },
  ];

  const teleportNodes = [
    { x: 300, y: groundY - 20, w: 20, h: 20, target: { x: 2100, y: 240 } },
    { x: 2100, y: 240, w: 20, h: 20, target: { x: 3700, y: groundY - 20 } },
    { x: 3700, y: groundY - 20, w: 20, h: 20, target: { x: 4600, y: 180 } },
  ];

  const enemies = [
    createSpider(400, groundY - 16),
    createSpider(1100, groundY - 16),
    createSpider(1900, groundY - 16),
    createSpider(2700, groundY - 16),
    createSpider(3500, groundY - 16),
    createSpider(4300, groundY - 16),
    createMalware(680, 204),
    createMalware(1280, 264),
    createMalware(2080, 264),
    createMalware(2880, 264),
    createMalware(3680, 264),
    createMalware(4480, 264),
    createSpamBot(900, groundY - 20),
    createSpamBot(1700, groundY - 20),
    createSpamBot(2500, groundY - 20),
    createSpamBot(3300, groundY - 20),
    createSpamBot(4100, groundY - 20),
    createRansomwareBlock(1500, groundY - 28),
    createRansomwareBlock(3100, groundY - 28),
    createRansomwareBlock(4500, groundY - 28),
  ];

  const items = [
    createCoffeeCup(500, 240),
    createCoffeeCup(1100, 300),
    createCoffeeCup(1700, 240),
    createCoffeeCup(2300, 260),
    createCoffeeCup(2900, 240),
    createCoffeeCup(3500, 300),
    createCoffeeCup(4100, 260),
    createCoffeeCup(4700, 180),
    createFirewallUpgrade(2200, 190),
    createAccessKey(1420, 180),
    createAccessKey(3020, 180),
    createAccessKey(4620, 180),
  ];

  const exitGate = { x: 4900, y: groundY - 60, w: 40, h: 60 };

  return {
    name: 'Network Nexus',
    width: W, height: H,
    playerSpawn: { x: 50, y: groundY - 28 },
    platforms, enemies, items, exitGate,
    keysRequired: 3,
    bgColor1: '#2a1a2a',
    bgColor2: '#1a0a1a',
    teleportNodes,
  };
}

const keys = {};

export function initInput() {
  window.addEventListener('keydown', (e) => {
    keys[e.code] = true;
    if (['Space', 'ArrowUp', 'ArrowDown'].includes(e.code)) {
      e.preventDefault();
    }
  });
  window.addEventListener('keyup', (e) => {
    keys[e.code] = false;
  });
}

export function isPressed(code) {
  return !!keys[code];
}

export function isJustPressed(code) {
  return !!keys[code] && !keys['_prev_' + code];
}

export function updatePrevKeys() {
  for (const key in keys) {
    keys['_prev_' + key] = keys[key];
  }
}

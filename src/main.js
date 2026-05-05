import { initInput, isPressed, updatePrevKeys } from './input.js';
import { createGame } from './game.js';
import { initAudio, toggleMute, isMuted, updateMuteButton } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

initInput();
initAudio();

const game = createGame(isPressed);

document.getElementById('restart-btn').addEventListener('click', () => {
  game.restart();
});

document.getElementById('mute-btn').addEventListener('click', () => {
  toggleMute();
  updateMuteButton(isMuted());
});

function gameLoop() {
  game.update();
  game.render(ctx);
  updatePrevKeys();
  requestAnimationFrame(gameLoop);
}
// console.log("main()");
gameLoop();
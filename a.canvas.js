const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const player = {
  x: 100,
  y: 200,
  vy: 0,
  onGround: false,
  mode: 'cube'
};

const level = {
  speed: 4,
  objects: [
    { type: 'ground', x: 0, y: 250, w: 2000, h: 50 },
    { type: 'spike', x: 400, y: 230, w: 20, h: 20 }
  ]
};

let cameraX = 0;
let keys = {};

document.addEventListener('keydown', e => keys[e.code] = true);
document.addEventListener('keyup', e => keys[e.code] = false);

function update() {
  cameraX += level.speed;

  // gravity
  player.vy += 0.6;
  player.y += player.vy;

  // jump
  if (keys['Space'] && player.onGround) {
    player.vy = -12;
    player.onGround = false;
  }

  // simple collision with ground
  player.onGround = false;
  for (const obj of level.objects) {
    if (obj.type === 'ground') {
      if (player.x > obj.x - cameraX &&
          player.x < obj.x - cameraX + obj.w &&
          player.y >= obj.y - 20 &&
          player.y <= obj.y) {
        player.y = obj.y - 20;
        player.vy = 0;
        player.onGround = true;
      }
    }
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // draw level
  for (const obj of level.objects) {
    const screenX = obj.x - cameraX;
    if (obj.type === 'ground') {
      ctx.fillStyle = '#444';
      ctx.fillRect(screenX, obj.y, obj.w, obj.h);
    } else if (obj.type === 'spike') {
      ctx.fillStyle = '#f44';
      ctx.beginPath();
      ctx.moveTo(screenX, obj.y + obj.h);
      ctx.lineTo(screenX + obj.w / 2, obj.y);
      ctx.lineTo(screenX + obj.w, obj.y + obj.h);
      ctx.closePath();
      ctx.fill();
    }
  }

  // draw player
  ctx.fillStyle = '#0ff';
  ctx.fillRect(player.x - 10, player.y - 20, 20, 20);
}

function loop() {
  update();
  render();
  requestAnimationFrame(loop);
}

loop();

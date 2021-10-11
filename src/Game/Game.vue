<template>
  <div class="ratio-16-9">
    <div class="inner">
      <canvas id="screen" ref="screen" />
    </div>
  </div>
  <div>
    <div id="direction">
      <div
        v-for="(ico, dir) of directionIco"
        :class="['arrow', direction['type'][dir] === true && 'on']"
      >{{ ico }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
const WIDTH = 400
const HEIGHT = 400
const speed = 4
const ratio = 20
const spaceRatio = 50
const spaceSpeed = 12
const screen = ref<HTMLCanvasElement>()
const getRect = (el: HTMLCanvasElement, ratio: number) => {
  return [el.width / ratio, el.height / ratio]
}

const createSpeed = (speed: number) => ({
  top: -speed,
  left: -speed,
  right: speed,
  down: speed,
})

interface Position {
  x: number
  y: number
  dir?: Dir
}

const bullets: Set<Position> = reactive(new Set)
const position: Position = reactive({
  x: 0,
  y: 0
})

type Dir = 'top' | 'left' | 'right' | 'down'

interface Direction {
  current: Dir,
  type: {
    [key: string]: boolean
  },
  speed: {
    [key: string]: number
  },
}


const directionIco = {
  top: '↑',
  left: '←',
  right: '→',
  down: '↓',
}

const RULE = {
  top: 'y',
  left: 'x',
  right: 'x',
  down: 'y',
}

const direction: Direction = reactive({
  current: 'top',
  type: {
    top: false,
    left: false,
    right: false,
    down: false,
  },
  speed: createSpeed(speed)
})

const directionKey = {
  'ArrowUp': 'top',
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  'ArrowDown': 'down',
}

const space = reactive({
  speed: createSpeed(spaceSpeed)
})

const draw = () => {
  if (!screen.value) return
  const el = screen.value as HTMLCanvasElement
  const ctx = el.getContext('2d') as CanvasRenderingContext2D


  for (const type in direction.type) {
    if (direction.type[type])
      position[RULE[type]] += direction.speed[type]
  }

  for (const bullet of bullets) {
    bullet[RULE[bullet.dir]] += space.speed[bullet.dir]
    console.log(bullet);
    if (bullet.y > el.height / 2 ||
      bullet.y < -el.height / 2 ||
      bullet.x > el.width / 2 ||
      bullet.x < -el.width / 2)
      bullets.delete(bullet)
  }

  // ctx.restore()

  ctx.fillStyle = '#000'
  ctx.rect(-el.width / 2, -el.height / 2, el.width, el.height)
  ctx.fill()
  ctx.beginPath()
  // ctx.clearRect(-el.width / 2, -el.height / 2, el.width, el.width)
  const [w, h] = getRect(el, ratio)
  ctx.fillStyle = 'yellow'
  ctx.rect(position.x - w / 2,
    position.y - h / 2,
    w, h)
  ctx.fill()
  const [bullet_w, bullet_h] = getRect(el, spaceRatio)
  ctx.beginPath()
  for (const bullet of bullets) {
    ctx.fillStyle = 'white'
    ctx.rect(bullet.x - bullet_w / 2,
      bullet.y - bullet_h / 2,
      bullet_w, bullet_h)
  }
  ctx.fill()
  requestAnimationFrame(draw)
}


onMounted(() => {
  const el = screen.value as HTMLCanvasElement
  const ctx = el.getContext('2d') as CanvasRenderingContext2D
  el.width = WIDTH
  el.height = HEIGHT
  ctx.translate(WIDTH / 2, HEIGHT / 2)
  ctx.save()
  requestAnimationFrame(draw)
})

// watch(directionType, (next, before) => {
//   console.log(next, before);
// })

const keyDownCallback = (bool: boolean, cb?: (code: string) => void) => (event: KeyboardEvent) => {
  if (event.code in directionKey) {
    if (bool) cb && cb(event.code)
  }
  switch (event.code) {
    case 'ArrowUp':
      direction.type.top = bool
      break;
    case 'ArrowLeft':
      direction.type.left = bool
      break;
    case 'ArrowRight':
      direction.type.right = bool
      break;
    case 'ArrowDown':
      direction.type.down = bool
      break;
    case 'Space':
      if (bool)
        bullets.add({ ...position, dir: direction.current })
      break;
    default:
      break;
  }
}
document.addEventListener('keydown', keyDownCallback(true, (code) => {
  direction.current = directionKey[code]
}))
document.addEventListener('keyup', keyDownCallback(false))

</script>

<style lang="scss">
.ratio-16-9 {
  position: relative;
  padding-top: calc(100% * 9 / 16);
  .inner {
    position: absolute;
    inset: 0;
  }
}
#screen {
  width: 100%;
  height: 100%;
}

#direction {
  display: flex;

  .arrow {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000;
    color: #fff;

    &.on {
      background-color: #f00;
    }
  }
}
</style>

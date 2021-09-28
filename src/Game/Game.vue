<template>
  <div class="ratio-16-9">
    <div class="inner">
      <canvas id="screen" ref="screen" />
    </div>
  </div>
  <div>
    <div id="direction">
      <div
        v-for="(ico, direction) of directionIco"
        :class="['arrow', directionType[direction] === true && 'on']"
      >{{ ico }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import NewpalletTown from '@/assets/NewpalletTown.PNG.webp'
const WIDTH = 400
const HEIGHT = 400
const imgReady = ref(false)
const speed = 10
const screen = ref<HTMLCanvasElement>()
const img = new Image()
img.src = NewpalletTown
img.onload = () => {
  if (img.complete) imgReady.value = true
  draw()
}

const position = reactive({
  x: 0,
  y: 0
})

const directionIco = reactive({
  top: '↑',
  left: '←',
  right: '→',
  Down: '↓',
})

const directionType = reactive({
  top: false,
  left: false,
  right: false,
  Down: false,
})

const directionRule = reactive({
  top: 'y',
  left: 'x',
  right: 'x',
  Down: 'y',
})

const directionSpeed = reactive({
  top: speed,
  left: speed,
  right: -speed,
  Down: -speed,
})

const directionKey = reactive({
  'ArrowUp': 'top',
  'ArrowLeft': 'left',
  'ArrowRight': 'right',
  'ArrowDown': 'Down',
})

const draw = () => {
  if (!imgReady.value) return
  if (!screen.value) return
  const el = screen.value as HTMLCanvasElement
  const ctx = el.getContext('2d') as CanvasRenderingContext2D

  for (const type in directionType) {
    if (directionType[type]) position[directionRule[type]] += directionSpeed[type]
  }

  ctx.drawImage(img,
    -img.width / 2 + position.x,
    -img.height / 2 + position.y,
    img.width,
    img.height)
  requestAnimationFrame(draw)
}

requestAnimationFrame(draw)

onMounted(() => {
  const el = screen.value as HTMLCanvasElement
  const ctx = el.getContext('2d') as CanvasRenderingContext2D
  el.width = WIDTH
  el.height = HEIGHT
  ctx.translate(WIDTH / 2, HEIGHT / 2)
})

// watch(directionType, (next, before) => {
//   console.log(next, before);
// })

const keyDownCallback = (bool: boolean) => (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowUp':
      directionType.top = bool
      break;
    case 'ArrowLeft':
      directionType.left = bool
      break;
    case 'ArrowRight':
      directionType.right = bool
      break;
    case 'ArrowDown':
      directionType.Down = bool
      break;
    default:
      break;
  }
}
document.addEventListener('keydown', keyDownCallback(true))
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

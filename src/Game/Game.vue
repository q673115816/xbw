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
import { ref, reactive, onMounted } from 'vue'
import NewpalletTown from '@/assets/NewpalletTown.PNG.webp'
const screen = ref<HTMLCanvasElement>()
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

onMounted(() => {
  const el = screen.value as HTMLCanvasElement
  const rect = el.getBoundingClientRect()
  const { width, height } = rect
  el.width = width
  el.height = height
  const ctx = el.getContext('2d')
  const img = new Image()
  img.src = NewpalletTown

  img.onload = () => {
    if (img.complete) ctx?.drawImage(img, 0, 0, img.width, img.height)
  }

})

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

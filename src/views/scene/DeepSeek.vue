<template>
  <canvas class="canvas" ref="renderCanvas"></canvas>
  <div class="left-button-wrapper">
    <div class="animation-list">
      <div class="animation-item" v-for="item in animationList" :key="item.name">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { initScene } from './initScene'

const animationList = [
  { name: '步骤一' },
  { name: '步骤二' },
  { name: '步骤三' },
  { name: '步骤四' },
  { name: '步骤五' },
]
const renderCanvas = useTemplateRef<HTMLCanvasElement>('renderCanvas')

onMounted(async () => {
  if (!renderCanvas.value) return
  await initScene(renderCanvas.value)
})
onUnmounted(() => {

})

</script>

<style scoped lang="scss">
.canvas {
  width: 100%;
  height: 100vh;
  display: block;
}

.left-button-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  background-color: #fff;
  width: 150px;
  height: 100vh;

  .animation-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    .animation-item {
      padding: 1rem 2rem;
      background-color: aqua;
      cursor: pointer;
      border-radius: 15px;
      &:hover {
        background-color: rgba(0, 255, 255, 0.3);
      }
    }
  }
}
</style>

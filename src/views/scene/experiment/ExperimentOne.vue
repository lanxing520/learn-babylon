<template>
  <section class="experiment-one">
    <canvas class="canvas" ref="renderCanvas"></canvas>
    <div class="now-step">当前步骤:{{ active.name }}</div>
    <div class="left-button-wrapper">
      <div class="animation-list">
        <div
          class="animation-item"
          :class="{ finish: finishedStep.includes(item.name) }"
          v-for="(item, i) in props.stepList"
          :key="i"
          @click="stepClick(i)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="center-bottom-desc">{{ active.desc }}</div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef, watchEffect } from 'vue'
import { initScene } from '../methods/initScene'

interface Step {
  name: string
  desc: string
}

const props = defineProps<{ stepList: Step[] }>()

const active = ref<Step>({ name: '', desc: '' })
const finishedStep = ref<string[]>([])
// const animationList = ref([{ name: '步骤一', desc: '' }])
const renderCanvas = useTemplateRef<HTMLCanvasElement>('renderCanvas')

onMounted(async () => {
  if (!renderCanvas.value) return
  await initScene(renderCanvas.value)
})
watchEffect(() => {
  active.value = props.stepList[0]
})
const stepClick = (i: number) => {
  active.value = props.stepList[i]
}
onUnmounted(() => {})
</script>

<style scoped lang="scss">
.experiment-one {
  position: relative;
  width: 100%;
  height: 100vh;

  .canvas {
    width: 100%;
    height: 100vh;
    display: block;
  }
  .now-step {
    position: absolute;
    left: 1rem;
    top: 4rem;
    color: #fff;
    background: no-repeat center url('src/assets/img/experiment/当前步骤.png');
    background-size: 100% 100%;
    width: 10rem;
    height: 3rem;
    line-height: 3rem;
    text-align: center;
  }
  .left-button-wrapper {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    overflow: auto;
    width: 150px;
    height: 65%;

    .animation-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      .animation-item {
        width: 8rem;
        height: 3rem;
        line-height: 3rem;
        text-align: center;

        background: no-repeat center url('@/assets/img/experiment/步骤.png');
        background-size: 100% 100%;
        color: #75d2fa;
        cursor: pointer;
        border-radius: 15px;
        &:hover {
          background-color: rgba(0, 255, 255, 0.3);
        }

        &.finish {
          background-image: url('@/assets/img/experiment/步骤finish.png');
        }
      }
    }
  }

  .center-bottom-desc {
    position: absolute;
    left: 50%;
    width: 70%;
    bottom: 1rem;
    min-height: 8rem;
    transform: translateX(-50%);
    background: no-repeat center url('@/assets/img/experiment/文本框.png');
    background-size: 100% 100%;
    padding: 1rem;
    color: #fff;
  }
}
</style>

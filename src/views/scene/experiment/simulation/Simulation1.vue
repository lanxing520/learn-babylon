<template>
  <section
    v-loading="loading"
    element-loading-background="rgba(35, 39, 46, 0.7)"
    element-loading-text="Loading..."
    class="experiment-one"
  >
    <canvas class="canvas" ref="renderCanvas"></canvas>
    <div class="now-step">当前步骤:{{ active?.name }}</div>
    <div class="left-button-wrapper">
      <div class="animation-list">
        <div
          class="animation-item"
          :class="{ finish: finishedStep.includes(item.name) }"
          v-for="(item, i) in store.getExperiment[0]"
          :key="i"
          @click="stepClick(i)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="center-bottom-desc">{{ active?.desc }}</div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, useTemplateRef, watchEffect } from "vue"
import { initScene, dispose, loading } from "./methods/initScene"
import { useExperimentStore } from "@/stores/experimentStore"


interface Step {
  name: string
  desc: string
}

const active = ref<Step>({ name: "", desc: "" })
const finishedStep = ref<string[]>([])
const renderCanvas = useTemplateRef<HTMLCanvasElement>("renderCanvas")
const store = useExperimentStore()
onMounted(async () => {
  if (!renderCanvas.value) return

  try {
    await initScene(renderCanvas.value)
  } catch (error) {
    console.error("初始化 Babylon 场景失败:", error)
  }
})
watchEffect(() => {
  active.value = store.getExperiment[0][0]
})
const stepClick = (i: number) => {
  active.value = store.getExperiment[0][i]
}
onBeforeUnmount(() => {
  // 通过 import.meta.hot 判断是否是热重载环境
  dispose()
})
</script>

<style scoped lang="scss">
.experiment-one {
  position: relative;
  width: 100%;
  height: calc(100vh - 5rem);

  .canvas {
    width: 100vw;
    height: calc(100vh - 3rem);
    display: block;
    transform: translate(-1rem, -1rem);
  }

  .now-step {
    position: absolute;
    left: 1rem;
    top: 4rem;
    color: #fff;
    background: no-repeat center url("src/assets/img/experiment/当前步骤.png");
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

        background: no-repeat center url("@/assets/img/experiment/步骤.png");
        background-size: 100% 100%;
        color: #75d2fa;
        cursor: pointer;
        border-radius: 15px;
        &:hover {
          background-color: rgba(0, 255, 255, 0.3);
        }

        &.finish {
          background-image: url("@/assets/img/experiment/步骤finish.png");
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
    background: no-repeat center url("@/assets/img/experiment/文本框.png");
    background-size: 100% 100%;
    padding: 1rem;
    color: #fff;
  }
}
</style>

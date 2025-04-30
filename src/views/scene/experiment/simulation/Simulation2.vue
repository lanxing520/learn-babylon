<template>
  <section
    v-loading="loading"
    element-loading-background="rgba(35, 39, 46, 0.7)"
    element-loading-text="Loading..."
    class="experiment-simulation ex-2"
  >
    <canvas class="canvas" ref="renderCanvas"></canvas>
    <div class="now-step">当前步骤:{{ active?.name }}</div>
    <div class="left-button-wrapper hide-scrollbar">
      <div class="animation-list">
        <div
          class="animation-item"
          :class="{ finish: finishedStep.includes(item.name) }"
          v-for="(item, i) in store.getExperiment"
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
import { ref, watch, onMounted, onBeforeUnmount, useTemplateRef, watchEffect } from "vue"
import { initScene, loading } from "./methods/common/initScene"
import { useExperimentStore } from "@/stores/experimentStore"
import { loadStep, stepIndex } from "./methods/s2/step"
import { itemData } from "./methods/s2/itemData"
import { loadItems } from "./methods/common/loadModle"
import { simulationMixin } from "./simulationMixin"
import { Vector3 } from "@babylonjs/core"
const renderCanvas = useTemplateRef<HTMLCanvasElement>("renderCanvas")
const store = useExperimentStore()
onMounted(async () => {
  if (!renderCanvas.value) return

  try {
    await initScene(renderCanvas.value, {
      camera: {
        target: new Vector3(4, 1.2, -3.3),
        alpha: Math.PI,
        beta: 1.2,
      },
    })
    await loadItems(itemData)
    await loadStep()
  } catch (error) {
    console.error("初始化 Babylon 场景失败:", error)
  }
})

// 定义映射关系
const stepMapping = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  4: 5,
} as any
const { active, finishedStep, stepClick } = simulationMixin(stepMapping, stepIndex, loadStep)
</script>

<style scoped lang="scss">
@use "./simualtion-style.scss";

.ex-2 {
}
</style>

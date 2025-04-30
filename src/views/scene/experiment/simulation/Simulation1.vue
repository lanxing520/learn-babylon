<template>
  <section
    v-loading="loading"
    element-loading-background="rgba(35, 39, 46, 0.7)"
    element-loading-text="Loading..."
    class="experiment-simulation"
  >
    <canvas class="canvas" ref="renderCanvas"></canvas>
    <div class="now-step">当前步骤:{{ active?.name }}</div>
    <div class="left-button-wrapper">
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
import { loadStep, stopStep, loadTester, stepIndex } from "./methods/s1/step"
import { loadItems } from "./methods/common/loadModle"
import { simulationMixin } from "./simulationMixin"
import { itemData } from "./methods/s1/itemData"

const renderCanvas = useTemplateRef<HTMLCanvasElement>("renderCanvas")
const store = useExperimentStore()
onMounted(async () => {
  if (!renderCanvas.value) return

  try {
    await initScene(renderCanvas.value)
    await loadItems(itemData)
    await loadTester()
    await loadStep()
  } catch (error) {
    console.error("初始化 Babylon 场景失败:", error)
  }
})

// 定义映射关系
const stepMapping = {
  0: 1,
  1: 6,
  2: 7,
  3: 8,
  4: 9,
} as any
const { active, finishedStep, stepClick } = simulationMixin(stepMapping, stepIndex, loadStep)
</script>

<style scoped lang="scss">
@use "./simualtion-style.scss";
</style>

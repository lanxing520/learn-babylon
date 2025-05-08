<template>
  <section
    v-loading="loading"
    element-loading-background="rgba(35, 39, 46, 0.7)"
    element-loading-text="Loading..."
    class="experiment-simulation"
  >
    <canvas class="canvas" ref="renderCanvas"></canvas>
    <ExperimentMessage :stepMapping="stepMapping" v-model="stepIndex" @step-change="loadStep" />
  </section>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, useTemplateRef, watchEffect } from "vue"
import { initScene, loading, dispose } from "../common/initScene"
import ExperimentMessage from "../components/ExperimentMessage.vue"
import { loadStep, stopStep, loadTester, stepIndex } from "./step"
import { loadItems } from "../common/loadModle"
import { simulationMixin } from "../../simulationMixin"
import { itemData } from "./itemData"

const renderCanvas = useTemplateRef<HTMLCanvasElement>("renderCanvas")

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
onBeforeUnmount(() => {
  stopStep()
  dispose()
})
// 定义映射关系,左边animation-list的index和右边的stepIndex的index 一一对应
const stepMapping = {
  0: 1,
  1: 6,
  2: 7,
  3: 8,
  4: 9,
} as any
simulationMixin()
</script>

<style scoped lang="scss">
@use "../../simualtion-style.scss";
</style>

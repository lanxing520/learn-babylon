<template>
  <section
    v-loading="loading"
    element-loading-background="rgba(35, 39, 46, 0.7)"
    element-loading-text="Loading..."
    class="experiment-simulation"
  >
    <canvas class="canvas" ref="renderCanvas"></canvas>
    <ExperimentMessage :stepMapping="stepMapping" v-model="stepIndex" @step-change="jumpStep" />
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, useTemplateRef, onUnmounted } from "vue"
import { initScene, loading } from "../common/initScene"
import ExperimentMessage from "../components/ExperimentMessage.vue"
import { initStep, jumpStep, disposeStep } from "./step"
import { stepIndex } from "../common/stepManager"
import { itemData } from "./itemData"
import { loadItems } from "../common/loadModle"
import { simulationMixin } from "../../simulationMixin"
import { Vector3 } from "@babylonjs/core"
const renderCanvas = useTemplateRef<HTMLCanvasElement>("renderCanvas")

onMounted(async () => {
  if (!renderCanvas.value) return
  stepIndex.value = 1

  await initScene(renderCanvas.value, {
    camera: {
      target: new Vector3(4, 1.2, -3.3),
      alpha: Math.PI,
      beta: 1.2,
    },
  })
  await loadItems(itemData)
 await initStep()
    await jumpStep()
})
onUnmounted(() => {
  disposeStep()
})
// 定义映射关系,左边animation-list的index和右边的stepIndex的index 一一对应
const stepMapping = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
  7: 8,
  8: 9,
  9: 10,
  10: 11,
  11: 12,
} as any
simulationMixin()
</script>

<style scoped lang="scss">
@use "../../simualtion-style.scss";
</style>

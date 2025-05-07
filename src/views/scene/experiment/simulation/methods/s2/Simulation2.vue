<template>
  <section
    v-loading="loading"
    element-loading-background="rgba(35, 39, 46, 0.7)"
    element-loading-text="Loading..."
    class="experiment-simulation ex-2"
  >
    <canvas class="canvas" ref="renderCanvas"></canvas>
    <div class="now-step">当前步骤:{{ active?.name }}</div>
    <div class="left-button-wrapper">
      <div class="animation-list hide-scrollbar">
        <div
          class="animation-item"
          :class="{ finish: i === stepIndex - 1 }"
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
import { initScene, loading } from "../common/initScene"
import { useExperimentStore } from "@/stores/experimentStore"
import { loadStep } from "./step"
import { stepIndex } from "../common/stepManager"
import { itemData } from "./itemData"
import { loadItems } from "../common/loadModle"
import { simulationMixin } from "../../simulationMixin"
import { Vector3 } from "@babylonjs/core"
const renderCanvas = useTemplateRef<HTMLCanvasElement>("renderCanvas")
const store = useExperimentStore()
onMounted(async () => {
  if (!renderCanvas.value) return
  stepIndex.value = 1
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

// 定义映射关系,左边animation-list的index和右边的stepIndex的index 一一对应
const stepMapping = {
  0: 1,
  1: 5,
  2: 6,
  3: 8,
  4: 10,
  5: 13,
  6: 14,
  7: 15,
} as any
const { active, finishedStep, stepClick } = simulationMixin(stepMapping, stepIndex, loadStep)
</script>

<style scoped lang="scss">
@use "../../simualtion-style.scss";
</style>

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
import { ref, watch, onMounted, onBeforeUnmount, useTemplateRef, watchEffect } from "vue"
import { initScene, dispose, loading } from "./methods/initScene"
import { useExperimentStore } from "@/stores/experimentStore"
import { loadStep, stopStep, loadTester, stepIndex } from "./methods/s2/step"
import { loadItems } from "./methods/s2/loadModle"

interface Step {
  index: null | number
  name: string
  desc: string
}

const active = ref<Step>({ index: null, name: "", desc: "" })
const finishedStep = ref<string[]>([])
const renderCanvas = useTemplateRef<HTMLCanvasElement>("renderCanvas")
const store = useExperimentStore()
onMounted(async () => {
  if (!renderCanvas.value) return

  try {
    await initScene(renderCanvas.value)
    await loadItems()
    await loadTester()
    await loadStep()
  } catch (error) {
    console.error("初始化 Babylon 场景失败:", error)
  }
})
watchEffect(() => {
  active.value.name = store.getExperiment[0][0].name
  active.value.desc = store.getExperiment[0][0].desc
})

// 定义映射关系
const stepMapping = {
  0: 1,
  1: 6,
  2: 7,
  3: 8,
  4: 9,
} as any
watch(stepIndex, (newVal) => {
  loadStep()
})
const stepClick = (i: number) => {
  if (active.value.index === i) return
  active.value.name = store.getExperiment[0][i].name
  active.value.desc = store.getExperiment[0][i].desc
  active.value.index = i

  stepIndex.value = stepMapping[i] ?? stepIndex.value
}
onBeforeUnmount(() => {
  // 通过 import.meta.hot 判断是否是热重载环境
  dispose()
})
</script>

<style scoped lang="scss">
@use "./simualtion-style.scss";
</style>

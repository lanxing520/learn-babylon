<template>
  <section
    v-loading="loading"
    element-loading-background="rgba(35, 39, 46, 0.7)"
    element-loading-text="Loading..."
    class="experiment-simulation"
  >
    <canvas class="canvas" ref="renderCanvas"></canvas>
    <ExperimentMessage :stepMapping="stepMapping" v-model="stepIndex" @step-change="onStepChange" />
  </section>
</template>

<script setup lang="ts">
import { initScene, loading, dispose } from "./methods/common/initScene"
import ExperimentMessage from "@/views/scene/experiment/simulation/methods/components/ExperimentMessage.vue"
import { getSimulationData } from "./simulation-data.ts"
import { loadItems } from "./methods/common/loadModle"
import { stepIndex } from "./methods/common/stepManager"
import { Vector3 } from "@babylonjs/core"

const isInited = ref(false)
const renderCanvas = useTemplateRef<HTMLCanvasElement>("renderCanvas")
const itemData = shallowRef()
const initStep = shallowRef()
const jumpStep = shallowRef()
const disposeStep = shallowRef()
const stepMapping = shallowRef({})
const props = defineProps<{
  simulationIndex: number | null
}>()
let option = {} as any
watch(
  () => props.simulationIndex,
  async (newVal) => {
    if (newVal === null) return
    const obj = getSimulationData(newVal + 1)
    if (!obj) return

    itemData.value = obj.itemData
    initStep.value = obj.initStep
    jumpStep.value = obj.jumpStep
    disposeStep.value = obj.disposeStep
    stepMapping.value = obj.stepMapping

    option =
      newVal > 0
        ? {
            camera: {
              target: new Vector3(4, 1.2, -3.3),
              alpha: Math.PI,
              beta: 1.2,
            },
          }
        : {}

    // if (isInited.value) {
    //   dispose()
    //   await loadItems(itemData.value)
    //   await initStep.value()
    //   await jumpStep.value()
    // }
  },
  {
    immediate: true,
  },
)

const onStepChange = () => {
  if (jumpStep.value) jumpStep.value()
}

onMounted(async () => {
  if (!renderCanvas.value) return
  stepIndex.value = 1

  try {
    await initScene(renderCanvas.value, option)
    await loadItems(itemData.value)
    await initStep.value()
    await jumpStep.value()
    isInited.value = true
  } catch (error) {
    console.error("初始化 Babylon 场景失败:", error)
  }
})

onBeforeUnmount(() => {
  disposeStep.value()
  dispose()
})
</script>

<style scoped lang="scss">
.experiment-simulation {
  position: relative;
  width: 100%;
  height: calc(100vh - 5rem);

  .canvas {
    width: 100vw;
    height: calc(100vh - 3rem);
    display: block;
    transform: translate(-1rem, -1rem);
  }
}
</style>

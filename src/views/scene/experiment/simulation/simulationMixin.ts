import { ref, onMounted, watchEffect, watch, onBeforeUnmount } from "vue"
import type { Ref } from "vue"
import { dispose } from "./methods/common/initScene"
import { useExperimentStore } from "@/stores/experimentStore"
interface Step {
  index: null | number
  name: string
  desc: string
}
export function simulationMixin(
  stepMapping: any,
  stepIndex: Ref<number>,
  loadStep: () => Promise<void>,
) {
  const active = ref<Step>({ index: null, name: "", desc: "" })
  const finishedStep = ref<string[]>([])
  const store = useExperimentStore()

  const stepClick = (i: number) => {
    if (active.value.index === i) return
    active.value.index = i
    stepIndex.value = stepMapping[i] ?? stepIndex.value
  }
  watch(
    stepIndex,
    (newVal) => {
      // 获取对应的索引
      // const mappedIndex = stepMapping[newVal]
      const mappedIndex = Object.keys(stepMapping).find((key) => stepMapping[key] === newVal)
      if (mappedIndex === undefined) {
        console.error("No mapping found for stepIndex:", newVal)
        return
      }
      active.value.name = store.getExperiment[+mappedIndex].name
      active.value.desc = store.getExperiment[+mappedIndex].desc
      loadStep()
    },
    {
      immediate: true,
    },
  )

  onBeforeUnmount(() => {
    dispose()
  })
  return { active, stepClick, finishedStep }
}

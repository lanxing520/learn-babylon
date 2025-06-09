import { defineStore } from "pinia"
import { defaultExperimentInfo } from "./staticData"

export const useExperimentStore = defineStore(
  "experiment",
  () => {
    const name = ref("人类免疫缺陷病毒（HIV）的筛查")
    const EnglishName = ref("Screening for Human Immunodeficiency Virus (HIV)")

    const experimentInfo = shallowRef<any>(defaultExperimentInfo)
    // function saveExperimentInfo(val: any) {
    //   experimentInfo.value = val
    // }

     const activeTabIndex = ref(0)
    const isSimulation = ref<number | null>(null)
    function getStepList(arr: any) {
      const empty = [] as { name: string; desc: string }[]
      if (!arr?.length) return []
      arr.forEach((e: any) => {
        if (e["步骤Name"] && e["步骤Name"].trim()) {
          empty.push({
            name: e["步骤Name"],
            desc: e["描述"],
          })
        }
      })
      return empty
    }
    const getExperiment = computed(() => {
      if (isSimulation.value === null) return []
      const arr = []
      arr[0] = getStepList(experimentInfo.value["实验模拟一"])
      arr[1] = getStepList(experimentInfo.value["实验模拟二"])
      arr[2] = getStepList(experimentInfo.value["实验模拟三"])
      arr[3] = getStepList(experimentInfo.value["实验模拟四"])
      arr[4] = getStepList(experimentInfo.value["实验模拟五"])
      return arr[isSimulation.value]
    })
    return {
      name,
      EnglishName,
      activeTabIndex,
      isSimulation,
      experimentInfo,
      // saveExperimentInfo,
      getExperiment,
    }
  },
  { persist: true },
)
export const experimentScore = defineStore("experimentScore", () => {
  const tipMessage = ref("")
  const totalScore = ref(0)
  const report = ref<any[]>([])

  return {
    tipMessage,
    totalScore,
    report,
  }
})

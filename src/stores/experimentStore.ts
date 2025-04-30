import { ref, computed } from "vue"
import { defineStore } from "pinia"

export const useExperimentStore = defineStore(
  "experiment",
  () => {
    const name = ref("")
    const EnglishName = ref("")

    const experimentInfo = ref<any>({})
    function saveExperimentInfo(val: any) {
      experimentInfo.value = val
    }

    const activeTab = ref("实验介绍")
    const isSimulation = ref<number|null>(null)
    function getStepList(arr: any) {
      const empty = [] as { name: string; desc: string }[]
      if (!arr?.length) return []
      arr.forEach((e: any) => {
        if (e["步骤Name"]) {
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
      activeTab,
      isSimulation,

      experimentInfo,
      saveExperimentInfo,
      getExperiment,
    }
  },
  { persist: true },
)

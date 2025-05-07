<template>
  <div class="simulation-page">
    <div class="tab-container" v-if="currentComponent === null">
      <div class="tab normal-title" v-for="(item, i) in list" :key="i" @click="goTo(i)">
        {{ item }}
      </div>
    </div>

    <!-- <Simulation1 /> -->
    <component v-else :is="currentComponent"></component>
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef, computed, watch } from "vue"
import type { Component } from "vue"
import { useExperimentStore } from "@/stores/experimentStore"
import Simulation1 from "./methods/s1/Simulation1.vue"
import Simulation2 from "./methods/s2/Simulation2.vue"
import Simulation3 from "./methods/s3/Simulation3.vue"
import Simulation4 from "./methods/s4/Simulation4.vue"
import Simulation5 from "./methods/s5/Simulation5.vue"

const store = useExperimentStore()
const components = [Simulation1, Simulation2, Simulation3, Simulation4, Simulation5]
const currentComponent = shallowRef<null | Component>(null)
const list = computed(() => {
  return store.experimentInfo["实验模拟"].map((e: any) => {
    return e["实验原理Name"]
  })
})

const goTo = (i: number) => {
  store.isSimulation = i
  currentComponent.value = components[i]
}
watch(
  () => store.isSimulation,
  (newVal) => {
    if (newVal === null) {
      currentComponent.value = null
    } else {
      currentComponent.value = components[newVal]
    }
  },
  { immediate: true },
)
onMounted(() => {})
</script>

<style scoped lang="scss">
.simulation-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  .tab-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .tab {
      width: 30rem;
      height: 5rem;
      line-height: 5rem;
      text-align: center;
      background: no-repeat center url("@/assets/img/little-tab.png");
      background-size: 100% 100%;
      font-size: 3rem;
      cursor: pointer;
      font-weight: normal;

      color: #1c8bbe;
      &:hover {
        color: #21f0f5;
        background-image: url("@/assets/img/little_tab_active.png") !important;
      }
    }
  }
}
</style>

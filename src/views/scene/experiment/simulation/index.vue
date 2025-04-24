<template>
  <div class="simulation-page">
    <div class="tab-container" v-if="currentComponent === null">
      <div class="tab" v-for="(item, i) in list" :key="i" @click="goTo(i)">
        {{ item }}
      </div>
    </div>

    <Simulation1 />
    <!-- <component v-else :is="currentComponent"></component> -->
  </div>
</template>

<script setup lang="ts">
import { onMounted, shallowRef, computed } from 'vue'
import type { Component } from 'vue'
import { useExperimentStore } from '@/stores/experimentStore'
import Simulation1 from './Simulation1.vue'
import Simulation2 from './Simulation2.vue'
import Simulation3 from './Simulation3.vue'
import Simulation4 from './Simulation4.vue'
import Simulation5 from './Simulation5.vue'

const store = useExperimentStore()
const components = [Simulation1, Simulation2, Simulation3, Simulation4, Simulation5]
const currentComponent = shallowRef<null | Component>(Simulation1)
const list = computed(() => {
  return store.experimentInfo['实验模拟'].map((e: any) => {
    return e['实验原理Name']
  })
})
const goTo = (i: number) => {
  currentComponent.value = components[i]
}
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
      width: 25rem;
      height: 5rem;
      line-height: 5rem;
      text-align: center;
      background: no-repeat center url('@/assets/img/little-tab.png');
      background-size: 100% 100%;
      font-size: 1.5rem;
      cursor: pointer;

      &:hover {
        background-image: url('@/assets/img/little_tab_active.png') !important;
      }
    }
  }
}
</style>

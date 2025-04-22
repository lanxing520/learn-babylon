<template>
  <ExperimentLayout>
    <div class="experiment-page">
      <ExperimentIntroduction v-show="store.activeTab === '实验介绍'" />
      <ExperimentalPrinciple v-show="store.activeTab === '实验原理'" />
      <Simulation v-if="store.activeTab === '实验模拟'" />

      <div class="fps">{{ fps }}</div>
    </div>
  </ExperimentLayout>
</template>
<script setup lang="ts">
import ExperimentLayout from '@/components/ExperimentLayout.vue'
import ExperimentIntroduction from './ExperimentIntroduction.vue'
import ExperimentalPrinciple from './ExperimentalPrinciple.vue'
import Simulation from './simulation/index.vue'
import { fps } from './simulation/methods/config.ts'
import { useExperimentStore } from '@/stores/experimentStore'

const store = useExperimentStore()
</script>
<style scoped lang="scss">
.experiment-page {
  position: relative;
  height: calc(100vh - 5rem);

  .fps {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 2rem;
    z-index: 9999;
  }
}
</style>

<script setup>
import Scene from './views/scene/index.vue'
import DeepSeek from './views/scene/DeepSeek.vue'
</script>

<template>
  <main class="main">
    <DeepSeek />
    <!-- <Scene /> -->
  </main>
</template>
<style scoped lang="scss">
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>

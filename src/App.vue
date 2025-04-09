<script setup lang="ts">
import Scene from './views/scene/index.vue'
</script>

<template>
  <main class="main">
    <Scene />
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

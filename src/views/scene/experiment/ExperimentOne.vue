<template>
  <section class="experiment-one">
    <canvas class="canvas" ref="renderCanvas"></canvas>
    <div class="left-button-wrapper">
      <div class="animation-list">
        <div class="animation-item" v-for="item in animationList" :key="item.name">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="file-button" @click="dialogVisible = true">获取excel</div>
  </section>

  <el-dialog v-model="dialogVisible" title="读取文件" align-center width="800">
    <ReadExcel @file-upload="getFileData" />
    <template #footer>
      <el-button>确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'
import { initScene } from '../methods/initScene'
import ReadExcel from '@/components/ReadExcel.vue'

const dialogVisible = ref(false)
const fileData = ref([])
const animationList = ref([{ name: '步骤一' }])
const renderCanvas = useTemplateRef<HTMLCanvasElement>('renderCanvas')

const getFileData = (data: any) => {
  fileData.value = data.map((e: any) => Object.values(e))
  // animationList.value=
  console.log(fileData.value)
}

onMounted(async () => {
  if (!renderCanvas.value) return
  // await initScene(renderCanvas.value)
})
onUnmounted(() => {})
</script>

<style scoped lang="scss">
.experiment-one {
  position: relative;
  width: 100%;
  height: 100vh;
  .file-button {
    position: absolute;
    left: 0;
    top: 0;
    padding: 5px;
    border: 1px solid #aeaeae;
    background: rgba(0, 255, 255, 0.2);
    cursor: pointer;
  }
  .canvas {
    width: 100%;
    height: 100vh;
    display: block;
  }

  .left-button-wrapper {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;
    background-color: #fff;
    width: 150px;
    height: 100vh;

    .animation-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      .animation-item {
        padding: 1rem 2rem;
        background-color: aqua;
        cursor: pointer;
        border-radius: 15px;
        &:hover {
          background-color: rgba(0, 255, 255, 0.3);
        }
      }
    }
  }
}
</style>

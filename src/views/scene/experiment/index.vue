<template>
  <div class="experiment-page">
    <ExperimentOne :stepList="experiment[0]" />
    <div class="top-bg"></div>
    <div class="file-button" @click="dialogVisible = true">获取excel</div>
  </div>
  <el-dialog v-model="dialogVisible" title="读取文件" align-center width="90%">
    <ReadExcel class="excel" @file-upload="getFileData" />
    <template #footer>
      <el-button @click="onConfirm">确定</el-button>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import ExperimentOne from './ExperimentOne.vue'
import ReadExcel from '@/components/ReadExcel.vue'
const dialogVisible = ref(false)
const fileData = ref<any>([])
const experiment = ref<{ name: string; desc: string }[][]>([])
const localData = localStorage.getItem('fileData')
if (localData) {
  fileData.value = JSON.parse(localData)
}

const getFileData = (data: any) => {
  fileData.value = data
}
const onConfirm = () => {
  dialogVisible.value = false
  localStorage.setItem('fileData', JSON.stringify(fileData.value))
}

watchEffect(() => {
  experiment.value[0] = getStepList(fileData.value['实验模拟一'])
  experiment.value[1] = getStepList(fileData.value['实验模拟二'])
  experiment.value[2] = getStepList(fileData.value['实验模拟三'])
  experiment.value[3] = getStepList(fileData.value['实验模拟四'])
  experiment.value[4] = getStepList(fileData.value['实验模拟五'])
})

function getStepList(arr: any) {
  const empty = [] as { name: string; desc: string }[]
  if (!arr.length) return []
  arr.forEach((e: any) => {
    if (e['步骤Name']) {
      empty.push({
        name: e['步骤Name'],
        desc: e['描述'],
      })
    }
  })
  return empty
}
</script>
<style scoped lang="scss">
.experiment-page {
  position: relative;

  .top-bg {
    position: absolute;
    top: 0;
    width: 100%;
    height: 3rem;
    background: no-repeat center url('@/assets/img/标题22.png');
    background-size: 100% 100%;
  }
  .file-button {
    position: absolute;
    left: 0;
    top: 0;
    padding: 5px;
    border: 1px solid #aeaeae;
    background: rgba(0, 255, 255, 0.2);
    cursor: pointer;
    z-index: 9;
  }
}
</style>

<template>
  <div class="homepage">
    <div class="tab" v-for="(item, i) in routes" :key="i" @click="goTo(item)">
      {{ item.name }}
    </div>
    <div class="file-button" @click="dialogVisible = true">获取excel</div>
    <el-dialog v-model="dialogVisible" title="读取文件" align-center width="90%">
      <ReadExcel class="excel" @file-upload="getFileData" />
      <template #footer>
        <el-button @click="onConfirm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router"
import { useExperimentStore } from "@/stores/experimentStore"
import ReadExcel from "@/components/ReadExcel.vue"
import { ref, watchEffect } from "vue"
interface Route {
  name: string
  route: string
  EnglishName:string
}
const store = useExperimentStore()
const router = useRouter()
const routes = [
  {
    name: "人类免疫缺陷病毒（HIV）的筛查",
    EnglishName: "Screening for Human Immunodeficiency Virus (HIV)",
    route: "/experiment-page",
  },
]
const goTo = (item: Route) => {
  store.name = item.name
  store.EnglishName = item.EnglishName
  router.push(item.route)
}

const dialogVisible = ref(false)
const fileData = ref<any>([])

if (store.experimentInfo) {
  fileData.value = store.experimentInfo
}

const getFileData = (data: any) => {
  fileData.value = data
}
const onConfirm = () => {
  dialogVisible.value = false
  store.saveExperimentInfo(fileData.value)
}
</script>
<style scoped lang="scss">
.homepage {
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  background: no-repeat center url("@/assets/img/experiment_bg_black.png");
  background-size: 100% 100%;

  .tab {
    width: 25rem;
    height: 5rem;
    line-height: 5rem;
    text-align: center;
    background: no-repeat center url("@/assets/img/little-tab.png");
    background-size: 100% 100%;
    font-size: 1.5rem;
    cursor: pointer;

    &:hover {
      background-image: url("@/assets/img/little_tab_active.png") !important;
    }
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

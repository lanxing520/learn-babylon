<template>
  <div class="score-container">分数:{{ expInfo.score }}</div>
  <div class="time">用时:{{ time }}秒</div>
  <div class="now-step">当前步骤:{{ active?.name }}</div>
  <div class="left-button-wrapper">
    <div class="animation-list hide-scrollbar">
      <div
        class="animation-item"
        :class="{ finish: i === active.index }"
        v-for="(item, i) in store.getExperiment"
        :key="i"
        @click="stepClick(i)"
      >
        {{ item.name }}
      </div>
    </div>
  </div>
  <div class="center-bottom-desc">
    <div class="tips-container" v-show="expInfo.tipMessage">{{ expInfo.tipMessage }}</div>
    <span>{{ active?.desc }} </span>
  </div>
  <el-button class="end-button" v-if="isFinished" @click="endExperiment">结束并提交</el-button>
  <el-dialog v-model="dialogVisible" title="" width="500" align-center>
    <span style="font-size: 20px">
      你的成绩为{{ expInfo.score }},用时{{ formatSeconds(time) }}</span
    >
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitScore"> 提交成绩 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { useExperimentStore, experimentInfo } from "@/stores/experimentStore"
import { Timer } from "@/utils/timer"
import { isFinished } from "../common/stepManager"
import http from "@/api/request"

interface Step {
  index: null | number
  name: string
  desc: string
}
const model = defineModel<number>({ required: true })
const props = defineProps<{
  stepMapping: Record<string, number>
}>()
const emit = defineEmits(["stepChange"])

const store = useExperimentStore()
const expInfo = experimentInfo()
const active = ref<Step>({ index: null, name: "", desc: "" })

const myTimer = new Timer()
myTimer.start()
const time = myTimer.getTime()
function formatSeconds(seconds: number) {
  if (seconds < 0) seconds = 0 // 处理负数
  const mins = Math.floor(seconds / 60) // 计算分钟数（取整）
  const secs = seconds % 60 // 计算剩余秒数
  return `${mins}分${secs}秒` // 返回格式化字符串
}
const dialogVisible = ref(false)
const endExperiment = () => {
  myTimer.pause()
  dialogVisible.value = true
}

const stepClick = (i: number) => {
  if (active.value.index === i) return
  active.value.index = i
  model.value = props.stepMapping[i] ?? i + 1
}
watch(
  () => model.value,
  (newVal) => {
    if (newVal === undefined) return

    // 获取对应的索引
    let mappedIndex = Object.keys(props.stepMapping).find(
      (key) => props.stepMapping[key] === newVal,
    )

    // 只有当索引确实变化时才更新
    if (mappedIndex !== undefined) {
      active.value.index = +mappedIndex
      active.value.name = store.getExperiment[+mappedIndex].name
      active.value.desc = store.getExperiment[+mappedIndex].desc
      emit("stepChange")
    }
  },
  {
    immediate: true,
  },
)

const submitScore = async () => {
  dialogVisible.value = false
  await uploadScore()
  if (store.isSimulation !== null) {
    store.isSimulation = null
    store.activeTab = "实验模拟"
  }
}

async function uploadScore() {
  await http.post("/data_upload", {
    appid: "",
    expId: "",
    reportData: "",
    expScoreDetails: [{
      trueOrFalse: true,
      startTime: myTimer.getStartTime(),
      expectTime: myTimer.getEndTime(),
      Score: expInfo.score,
      maxScore: 100,
    }],
  })
}
</script>

<style scoped lang="scss">
.score-container {
  position: absolute;
  right: 0;
  top: 0;
  color: #000;
}
.time {
  position: absolute;
  top: 1.5rem;
  right: 0;
  color: #000;
}
.end-button {
  position: absolute;
  right: 1rem;
  bottom: 2rem;
}
.now-step {
  position: absolute;
  left: 1rem;
  top: 4rem;
  color: #fff;
  background: no-repeat center url("src/assets/img/experiment/当前步骤.png");
  background-size: 100% 100%;
  width: 10rem;
  height: 3rem;
  line-height: 3rem;
  text-align: center;
}
.left-button-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 150px;
  height: 100%;

  .animation-list {
    height: 55%;
    overflow: hidden auto;

    .animation-item {
      width: 8rem;
      height: 3rem;
      line-height: 3rem;
      text-align: center;
      background: no-repeat center url("@/assets/img/experiment/步骤.png");
      background-size: 100% 100%;
      color: #75d2fa;
      cursor: pointer;
      border-radius: 15px;
      margin-bottom: 0.55rem;
      &:hover {
        background-color: rgba(0, 255, 255, 0.3);
      }

      &.finish {
        background-image: url("@/assets/img/experiment/步骤finish.png");
      }
    }
  }
}

.center-bottom-desc {
  position: absolute;
  left: 50%;
  width: 70%;
  bottom: 1rem;
  min-height: 8rem;
  transform: translateX(-50%);
  background: no-repeat center url("@/assets/img/experiment/文本框.png");
  background-size: 100% 100%;
  padding: 1rem;
  color: #fff;

  .tips-container {
    position: absolute;
    bottom: calc(100% + 1rem);
    right: 0;
    min-width: 20rem;
    padding: 2rem 1.5rem 1rem 1.5rem;
    background: no-repeat center url("@/assets/img/experiment/提示.png");
    background-size: 100% 100%;
  }
}
</style>

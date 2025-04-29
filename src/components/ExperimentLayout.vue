<template>
  <div class="experiment-layout">
    <div class="top-bg" :class="store.isSimulation === null ? 'bg1' : 'bg2'">
      <div class="exp-name">
        <div class="normal-title">{{ store.name }}</div>
        <div class="english">{{ store.EnglishName }}</div>
      </div>
      <div class="tab-container">
        <div
          class="tab-item normal-title"
          :class="{ active: item === store.activeTab }"
          v-for="(item, i) in tabs"
          :key="i"
          @click="clickTab(item)"
        >
          {{ item }}
        </div>
      </div>

      <div class="flex">
        <!-- <div>天气</div> -->
        <div class="time">
          <div class="date">{{ date }}</div>
          <div>{{ time }}</div>
        </div>
        <div @click="back">
          <i class="back_icon"></i>
        </div>
      </div>
    </div>
    <div class="experiment-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"
import { useRouter } from "vue-router"
import { useExperimentStore } from "@/stores/experimentStore"
const store = useExperimentStore()

const tabs = ["实验介绍", "实验原理", "实验模拟"]

const time = ref("")
const date = ref("")

function updateClock() {
  const now = new Date()

  // 更新时间
  time.value = now.toLocaleTimeString("zh-CN", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })

  // 更新日期
  date.value = now.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
}
const clickTab = (item: string) => {
  store.activeTab = item
}
// 初始化并启动定时器
updateClock()
const timer = setInterval(updateClock, 1000)

onBeforeUnmount(() => {
  clearInterval(timer)
})

const router = useRouter()
const back = () => {
  if (store.isSimulation !== null) {
    store.isSimulation = null
    store.activeTab = "实验模拟"
    return
  }
  router.push("/")
}

onMounted(() => {})
</script>

<style scoped lang="scss">
.experiment-layout {
  padding-top: 3rem;
  height: 100vh;
  background: no-repeat center url("@/assets/img/experiment_bg_black.png");
  background-size: 100% 100%;

  .top-bg {
    position: absolute;
    display: grid;
    grid-template-columns: 50% 30% auto;
    top: 0;
    width: 100%;
    height: 5rem;
    background: no-repeat center;
    background-size: 100% 100%;
    z-index: 2;
    .exp-name {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 4.6rem;

      padding-left: 0.8rem;
      color: #fff;

      .normal-title {
        font-size: 2rem;
        line-height: 1.8rem;
      }
    }
    .tab-container {
      display: flex;
      justify-content: space-around;
      .tab-item {
        color: #1c8bbe;
        line-height: 3.5rem;
        font-size: 1.6rem;
        cursor: pointer;
        width: 10rem;

        text-align: center;
        &.active {
          color: #21f4f9;
          height: 4.2rem;
          background: no-repeat center url("@/assets/img/top_tab_bg_active.png");
          background-size: contain;
        }
      }
    }

    .flex {
      justify-content: right;
      margin-right: 0.5rem;
      height: 3rem;
      gap: 0.8rem;
      .date {
        font-size: 0.8rem;
      }
    }
  }
  .bg1 {
    background-image: url("@/assets/img/big_title_bg.png");
  }
  .bg2 {
    background-image: url("@/assets/img/big_title_bg2.png");
  }

  .experiment-content {
    margin: 1rem;
  }
}
</style>

<template>
  <div class="experiment-layout">
    <div class="top-bg">
      <div class="exp-name">{{ store.name }}</div>
      <div class="tab-container">
        <div
          class="tab-item"
          :class="{ active: item === store.activeTab }"
          v-for="(item, i) in tabs"
          :key="i"
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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useExperimentStore } from '@/stores/experimentStore'
const store = useExperimentStore()

const tabs = ['实验介绍', '实验原理', '实验模拟']

const time = ref('')
const date = ref('')

function updateClock() {
  const now = new Date()

  // 更新时间
  time.value = now.toLocaleTimeString('zh-CN', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })

  // 更新日期
  date.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
}

// 初始化并启动定时器
updateClock()
const timer = setInterval(updateClock, 1000)

onBeforeUnmount(() => {
  clearInterval(timer)
})

const router = useRouter()
const back = () => {
  router.push('/')
}

onMounted(() => {})
</script>

<style scoped lang="scss">
.experiment-layout {
  padding-top: 3rem;
  .top-bg {
    position: absolute;
    display: grid;
    grid-template-columns: 50% 30% auto;
    top: 0;
    width: 100%;
    height: 4rem;
    background: no-repeat center url('@/assets/img/标题22.png');
    background-size: 100% 100%;

    .exp-name {
      font-size: 1.6rem;
      font-weight: bold;
      padding-left: 0.5rem;
      line-height: 3.5rem;
      color: #fff;
    }
    .tab-container {
      display: flex;
      justify-content: space-around;
      .tab-item {
        font-weight: bold;
        color: #1c8bbe;
        line-height: 2.5rem;
        font-size: 1.3rem;
        cursor: pointer;
        &.active {
          color: #21f4f9;
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

  .experiment-content {
    margin: 1rem;
  }
}
</style>

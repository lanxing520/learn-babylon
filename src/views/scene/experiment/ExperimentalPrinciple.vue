<template>
  <div class="experimental-principle">
    <div class="left-button-wrapper">
      <div class="animation-list">
        <div
          class="animation-item"
          :class="{ active: activeIndex === i }"
          v-for="(item, i) in data"
          :key="i"
          @click="stepClick(i)"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <div class="content">
      <div class="desc block">
        <div class="inner-text">{{ data[activeIndex]?.desc }}</div>
      </div>
      <div class="img-audio block">
        <audio controls :src="assets[activeIndex].audio"></audio>
        <img :src="assets[activeIndex].img" alt="" />
      </div>
    </div>
    <div class="bottom-button">
      <img class="next-icon" @click="goNext" src="@/assets/img/experiment/实验模拟关.png" alt="" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useExperimentStore } from '@/stores/experimentStore'
import { getAssetUrl } from '@/utils/assetHelper'

const getUrl = (name: string) => {
  const path = 'img/experiment/one/' + name
  const url = getAssetUrl(path)
  return url
}
const assets = [
  { img: getUrl('图片4.png'), audio: getUrl('2.mp3') },
  { img: getUrl('图片5.png'), audio: getUrl('3.mp3') },
  { img: getUrl('图片6.jpg'), audio: getUrl('4.mp3') },
  { img: getUrl('图片7.jpg'), audio: getUrl('5.mp3') },
]

interface Data {
  name: string
  desc: string
}
const store = useExperimentStore()
const data = ref<Data[]>([])
const activeIndex = ref<number>(0)

if (store.experimentInfo?.['实验原理']?.length) {
  store.experimentInfo['实验原理'].forEach((e: any) => {
    data.value.push({
      name: e['实验原理Name'],
      desc: e['ExpArticlesText'],
    })
  })
}

const stepClick = (i: number) => {
  activeIndex.value = i
}

const goNext = () => {
  store.activeTab = '实验模拟'
}
</script>

<style scoped lang="scss">
.experimental-principle {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  .left-button-wrapper {
    .animation-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      .animation-item {
        width: 12rem;
        height: 4rem;
        line-height: 4rem;
        text-align: center;
        background: no-repeat center url('@/assets/img/experiment/左侧导航1.png');
        background-size: 100% 100%;
        color: #75d2fa;
        cursor: pointer;
        border-radius: 15px;

        &:hover {
          background-color: rgba(0, 255, 255, 0.3);
        }

        &.active {
          background-image: url('@/assets/img/experiment/左侧导航2.png');
        }
      }
    }
  }

  .content {
    width: 80%;
    height: calc(100vh - 150px);
    margin-right: 2rem;
    .block {
      width: 100%;
      height: 45%;
      border: 1px solid;
      background: no-repeat center url('@/assets/img/experiment/原理框1.png');
      background-size: 100% 100%;
    }

    .desc {
      margin-bottom: 1rem;
      padding: 2em;
      display: flex;
      align-items: center;
      .inner-text {
        font-size: 1.5rem;
        text-indent: 2em;
      }
    }

    .img-audio {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 1rem;
      img {
        height: 100%;
        min-width: 100px;
      }
    }
  }

  .bottom-button {
    position: absolute;
    right: 1rem;
    bottom: 0;
    .next-icon {
      width: 12rem;
      cursor: pointer;
    }
  }
}
</style>

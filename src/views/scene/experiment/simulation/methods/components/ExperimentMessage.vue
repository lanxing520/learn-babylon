<template>
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
  <div class="center-bottom-desc">{{ active?.desc }}</div>
</template>

<script setup lang="ts">

import { useExperimentStore } from "@/stores/experimentStore"


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
const active = ref<Step>({ index: null, name: "", desc: "" })
onMounted(() => {})
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
    // const mappedIndex = stepMapping[newVal]
    let mappedIndex = Object.keys(props.stepMapping).find(
      (key) => props.stepMapping[key] === newVal,
    )
    // console.log("leftIndex", mappedIndex)

    if (mappedIndex !== undefined) {
      active.value.name = store.getExperiment[+mappedIndex].name
      active.value.desc = store.getExperiment[+mappedIndex].desc
    }
    emit("stepChange")
  },
  {
    immediate: true,
  },
)
</script>

<style scoped lang="scss">
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
}
</style>

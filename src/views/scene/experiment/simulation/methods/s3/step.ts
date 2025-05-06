import { item } from "../common/loadModle"
import { itemData } from "./itemData"
import { scene, camera } from "../common/initScene"
import { Vector3 } from "@babylonjs/core"

import { moveAni, rotateAni } from "../common/animation"
import { ref } from "vue"
import { playAudio, posTranslate, createLiquid } from "../common/action"
import { AnimationStepManager } from "../common/stepManager"
import { config } from "../common/config"
const frameRate = config.frameRate

const PI = Math.PI
export const stepIndex = ref(1)

let isInited = false
let stepManager: AnimationStepManager
async function init() {
  isInited = true

  stepManager = new AnimationStepManager()
  // 注册模型
  Object.keys(itemData).forEach((key) => {
    stepManager.registerModel(key, item[key].meshes)
  })

  // 定义步骤1,稀释
  stepManager.addStep({
    models: {
      jtdg: {
        position: itemData.jtdg.position,
      },
    },
    interactions: [
      {
        modelName: "jtdg",
        onClick: async () => {
          playAudio(19)
        },
        animations: [
          {
            mesh: item.jtdg.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.jtdg.position },
              // {
              //   frame: frameRate,
              //   value: posTranslate(itemData.lt.position, [0, 0.18, -0.2]),
              // },
              // {
              //   frame: 2 * frameRate,
              //   value: posTranslate(itemData.lt.position, [0, 0.18, -0.2]),
              // },
              { frame: 2.5 * frameRate, value: itemData.jtdg.position },
            ]),
          },
          // {
          //   mesh: item.lt.meshes[0],
          //   animation: rotateAni("rotation.x", [
          //     { frame: 0 * frameRate, value: 0 },
          //     {
          //       frame: 1 * frameRate,
          //       value: 1.7,
          //     },
          //     {
          //       frame: 2 * frameRate,
          //       value: 1.7,
          //     },
          //     { frame: 2.5 * frameRate, value: 0 },
          //   ]),
          // },
        ],
        animationRange: [0, 2.5 * frameRate],
      },
    ],
    onEnter: async () => {},
  })
  // 定义步骤2

  // 定义步骤3

  // 定义步骤4

  // 定义步骤5,加样
}

// 开始执行

export async function loadStep() {
  if (!scene || !camera) return
  if (!isInited) {
    await init()
  }

  stepManager.goToStep(stepIndex.value - 1)
}

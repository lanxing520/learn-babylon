import { item } from "../common/loadModle"
import { itemData } from "./itemData"

import { Vector3, Mesh } from "@babylonjs/core"

import { changeSizeAni, moveAni, rotateAni } from "../common/animation"
import { ref } from "vue"
import { playAudio, posTranslate, createLiquid } from "../common/action"
import { AnimationStepManager } from "../common/stepManager"
import { config } from "../common/config"
const frameRate = config.frameRate

const PI = Math.PI

let isInited = false
let stepManager: AnimationStepManager | null
export async function initStep() {
  isInited = true

  stepManager = new AnimationStepManager()
  // 注册模型
  Object.keys(itemData).forEach((key) => {
    stepManager?.registerModel(key, item[key].meshes)
  })

  const blood = createLiquid(item.zkcxg.meshes[0], 0.08, 0.003, 0.05) as Mesh
  // 定义步骤1,灌胶验漏
  stepManager.addStep({
    models: {
      zls: {
        position: itemData.zls.position,
      },
    },
    interactions: [
      {
        modelName: "zls",
        onClick: async () => {
          playAudio(22)
        },
        animations: [
          {
            mesh: item.zls.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.zls.position },
              { frame: 0.5 * frameRate, value: posTranslate(itemData.blb.position, [0, 0.2, -0.2]) },
              
              {
                frame: 1.75 * frameRate,
                value: posTranslate(itemData.blb.position, [0, 0.2, -0.2]),
              },

              { frame: 3 * frameRate, value: itemData.zls.position },
            ]),
          },
          {
            mesh: item.zls.meshes[0],
            animation: rotateAni("rotation.z", [
              {
                frame: 0.5 * frameRate,
                value: 0,
              },
              {
                frame: 1 * frameRate,
                value: 1.2,
              },
              {
                frame: 1.5 * frameRate,
                value: 1.2,
              },
              {
                frame: 2 * frameRate,
                value: 0,
              },
            ]),
          },
        ],
        animationRange: [0, 3.5 * frameRate],
      },
    ],
    onEnter: async () => {
      // item.blb.meshes[2].setParent(null)
    },
  })
  // 定义步骤2

  // 定义步骤3,观察

  // 定义步骤4

  // 定义步骤5,加样
}

// 开始执行

export async function jumpStep() {
  if (stepManager) stepManager.goToStep()
}
export function disposeStep() {
  if (stepManager) {
    stepManager.dispose()
    stepManager = null
  }
}

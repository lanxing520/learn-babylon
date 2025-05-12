import { item, resetItems } from "../common/loadModle"
import { itemData } from "./itemData"

import { Vector3, Mesh, AnimationEvent } from "@babylonjs/core"

import { changeSizeAni, moveAni, rotateAni, createKeyframes } from "../common/animation"
import { ref } from "vue"
import { playAudio, posTranslate, createLiquid, createWaterFlow } from "../common/action"
import { AnimationStepManager } from "../common/stepManager"
import { config } from "../common/config"

const frameRate = config.frameRate

const PI = Math.PI

let stepManager: AnimationStepManager | null
export async function initStep() {
  stepManager = new AnimationStepManager()
  // 注册模型
  Object.keys(itemData).forEach((key) => {
    stepManager?.registerModel(key, item[key].meshes)
  })

  const pourWaterAni = moveAni(
    "position",
    createKeyframes(
      [
        itemData.zls.position,
        posTranslate(itemData.blb.position, [0, 0.2, -0.2]),
        { pause: 1 },
        itemData.zls.position,
      ],
      0.5,
    ),
  )
  pourWaterAni.addEvent(
    new AnimationEvent(
      0.5 * frameRate,
      () => {
        createWaterFlow(posTranslate(itemData.zjj.position, [0, 0.2, -0.01]))
      },
      true,
    ),
  )
  const blood = createLiquid(item.zkcxg.meshes[0], 0.08, 0.03, 0.05) as Mesh
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
            animation: pourWaterAni,
          },
          {
            mesh: item.zls.meshes[0],
            animation: rotateAni("rotation.z", createKeyframes([0, 1.2, { pause: 0.5 }, 0], 1)),
          },
        ],
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
  resetItems(itemData)
  if (stepManager) stepManager.goToStep()
}
export function disposeStep() {
  if (stepManager) {
    stepManager.dispose()
    stepManager = null
  }
}

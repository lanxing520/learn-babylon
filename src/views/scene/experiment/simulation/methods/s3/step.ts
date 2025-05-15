import { item, resetItems } from "../common/loadModle"
import { itemData3 } from "./itemData"

import { Vector3, Mesh } from "@babylonjs/core"

import { changeSizeAni, moveAni, rotateAni } from "../common/animation"
import { ref } from "vue"
import { playAudio, posTranslate, createLiquid } from "../common/action"
import { AnimationStepManager } from "../common/stepManager"
import { config } from "../common/config"
const frameRate = config.frameRate

const PI = Math.PI

let stepManager: AnimationStepManager | null
export async function initStep3() {
  stepManager = new AnimationStepManager()
  // 注册模型
  Object.keys(itemData3).forEach((key) => {
    stepManager?.registerModel(key, item[key].meshes)
  })
  createLiquid(item.zkcxg.meshes[0], 0.05)
  const blood = createLiquid(item.jtdg.meshes[0], 0.08, 0.003, 0.05) as Mesh
  // 定义步骤1,稀释
  stepManager.addStep({
    models: {
      jtdg: {
        position: itemData3.jtdg.position,
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
              { frame: 0, value: itemData3.jtdg.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData3.zkcxg.position, [0, 0.3, 0]),
              },
              { frame: 1 * frameRate, value: posTranslate(itemData3.zkcxg.position, [0, 0.03, 0]) },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData3.zkcxg.position, [0, 0.03, 0]),
              },
              {
                frame: 1.75 * frameRate,
                value: posTranslate(itemData3.zkcxg.position, [0, 0.3, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData3.jtjsz.position, [-0.5, 0.02, -0.02]),
              },
              {
                frame: 2.5 * frameRate,
                value: posTranslate(itemData3.jtjsz.position, [-0.5, 0.02, -0.02]),
              },
              { frame: 3 * frameRate, value: itemData3.jtdg.position },
            ]),
          },
          {
            mesh: blood,
            animation: changeSizeAni("scaling.y", [
              { frame: 1 * frameRate, value: 0 },
              { frame: 1.5 * frameRate, value: 1 },
              { frame: 2 * frameRate, value: 1 },
              { frame: 2.5 * frameRate, value: 0.8 },
            ]),
          },
          {
            mesh: item.zkcxg.meshes[2],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: posTranslate(itemData3.zkcxg.position, [0, 0.1, 0]) },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData3.zkcxg.position, [0, 0.1, 0.1]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData3.zkcxg.position, [0, -0.28, 0.1]),
              },
            ]),
          },
          {
            mesh: item.jtjsz.meshes[0],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: itemData3.jtjsz.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData3.jtjsz.position, [-0.5, 0, 0]),
              },
              // {
              //   frame: 3 * frameRate,
              //   value: posTranslate(itemData3.jtjsz.position, [-0.5, 0, 0]),
              // },
              // { frame: 3.5 * frameRate, value: itemData3.jtjsz.position },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      item.zkcxg.meshes[2].setParent(null)
    },
  })
  // 定义步骤2
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {
          playAudio(12)
        },
        animations: [
          {
            mesh: item.ybxsy.meshes[3],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.18, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 1 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.18, 0],
              },
            ]),
          },
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData3.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData3.jyq.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData3.ybxsy.position, [0, 0.2, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData3.ybxsy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.4 * frameRate,
                value: posTranslate(itemData3.ybxsy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.45 * frameRate,
                value: posTranslate(itemData3.ybxsy.position, [0, 0.2, 0]),
              },
              {
                frame: 2.5 * frameRate,
                value: posTranslate(itemData3.jtjsz.position, [-0.5, 0.02, -0.02]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData3.jtjsz.position, [-0.5, 0.02, -0.02]),
              },
              { frame: 3.5 * frameRate, value: itemData3.jyq.position },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(20)
    },
  })
  // 定义步骤3,观察
  stepManager.addStep({
    models: {
      jtjsz: {
        position: posTranslate(itemData3.jtjsz.position, [-0.5, 0, 0]),
      },
    },
    interactions: [{ modelName: "jtjsz" }],
    onEnter: async () => {
      playAudio(21)
    },
  })
  // 定义步骤4,结果判定
  stepManager.addStep({
    models: {
      jtjsz: {
        position: posTranslate(itemData3.jtjsz.position, [-0.5, 0, 0]),
      },
    },
    interactions: [{ modelName: "jtjsz" }],
    onEnter: async () => {},
  })
 
}

export async function jumpStep3() {
  resetItems(itemData3)
  if (stepManager) stepManager.goToStep()
}

export function disposeStep3() {
  if (stepManager) {
    stepManager.dispose()
    stepManager = null
  }
}

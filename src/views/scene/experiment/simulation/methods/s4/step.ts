import { item } from "../common/loadModle"
import { itemData } from "./itemData"
import { scene, camera } from "../common/initScene"
import { Vector3, Mesh } from "@babylonjs/core"

import { changeSizeAni, moveAni, rotateAni } from "../common/animation"
import { ref } from "vue"
import { playAudio, posTranslate, createLiquid } from "../common/action"
import { AnimationStepManager } from "../common/stepManager"
import { config } from "../common/config"
const frameRate = config.frameRate

const PI = Math.PI


let isInited = false
let stepManager: AnimationStepManager
async function init() {
  isInited = true

  stepManager = new AnimationStepManager()
  // 注册模型
  Object.keys(itemData).forEach((key) => {
    stepManager.registerModel(key, item[key].meshes)
  })
  createLiquid(item.zkcxg.meshes[0], 0.05)
  const blood = createLiquid(item.jtdg.meshes[0], 0.08, 0.003, 0.05) as Mesh
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
              { frame: 0.5 * frameRate, value: posTranslate(itemData.zkcxg.position, [0, 0.3, 0]) },
              { frame: 1 * frameRate, value: posTranslate(itemData.zkcxg.position, [0, 0.03, 0]) },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, 0.03, 0]),
              },
              {
                frame: 1.75 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, 0.3, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.jtjsz.position, [-0.5, 0.02, -0.02]),
              },
              {
                frame: 2.5 * frameRate,
                value: posTranslate(itemData.jtjsz.position, [-0.5, 0.02, -0.02]),
              },
              { frame: 3 * frameRate, value: itemData.jtdg.position },
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
              { frame: 0 * frameRate, value: posTranslate(itemData.zkcxg.position, [0, 0.1, 0]) },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, 0.1, 0.1]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, -0.28, 0.1]),
              },
            ]),
          },
          {
            mesh: item.jtjsz.meshes[0],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: itemData.jtjsz.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.jtjsz.position, [-0.5, 0, 0]),
              },
              // {
              //   frame: 3 * frameRate,
              //   value: posTranslate(itemData.jtjsz.position, [-0.5, 0, 0]),
              // },
              // { frame: 3.5 * frameRate, value: itemData.jtjsz.position },
            ]),
          },
        ],
        animationRange: [0, 3.5 * frameRate],
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
              { frame: 0, value: itemData.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.jyq.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.ybxsy.position, [0, 0.2, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.ybxsy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.4 * frameRate,
                value: posTranslate(itemData.ybxsy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.45 * frameRate,
                value: posTranslate(itemData.ybxsy.position, [0, 0.2, 0]),
              },
              {
                frame: 2.5 * frameRate,
                value: posTranslate(itemData.jtjsz.position, [-0.5, 0.02, -0.02]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.jtjsz.position, [-0.5, 0.02, -0.02]),
              },
              { frame: 3.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
        ],
        animationRange: [0, 8.5 * frameRate],
      },
    ],
    onEnter: async () => {},
  })
  // 定义步骤3,观察
  stepManager.addStep({
    models: {
      jtjsz: {
        position: posTranslate(itemData.jtjsz.position, [-0.5, 0, 0]),
      },
    },
    interactions: [],
    onEnter: async () => {},
  })
  // 定义步骤4
stepManager.addStep({
  models: {
    jtjsz: {
      position: posTranslate(itemData.jtjsz.position, [-0.5, 0, 0]),
    },
  },
  interactions: [],
  onEnter: async () => {},
})
  // 定义步骤5,加样
}

// 开始执行

export async function loadStep() {
  if (!scene || !camera) return
  if (!isInited) {
    await init()
  }

  stepManager.goToStep()
}

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
    if (item[key]?.meshes) {
      stepManager?.registerModel(key, item[key].meshes)
    }
  })
  item.lxj.meshes[1].rotation = Vector3.Zero()
  // const blood = createLiquid(item.jtdg.meshes[0], 0.08, 0.003, 0.05) as Mesh
  // 定义步骤1,分装全血
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData.jyq.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {
          playAudio(40)
        },
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.jyq.position },

              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.knqx.position, [0, 0.3, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.knqx.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.knqx.position, [0, 0.02, 0]),
              },
              {
                frame: 1.75 * frameRate,
                value: posTranslate(itemData.knqx.position, [0, 0.3, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.3, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.02, 0]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.02, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.3, 0]),
              },
              { frame: 3.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.lsg.meshes[2],
            animation: moveAni("position", [
              { frame: 0, value: posTranslate(itemData.lsg.position, [0, 0, 0]) },

              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.1, -0.05]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, -0.09, -0.05]),
              },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      item.lsg.meshes[2].setParent(null)
    },
  })
  // 定义步骤2,加入抗体
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData.jyq.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {
          playAudio(41)
        },
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.jyq.position },

              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.kt.position, [0, 0.3, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.kt.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.kt.position, [0, 0.02, 0]),
              },
              {
                frame: 1.75 * frameRate,
                value: posTranslate(itemData.kt.position, [0, 0.3, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.3, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.3, 0]),
              },
              { frame: 3.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.lsg.meshes[2],
            animation: moveAni("position", [
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, -0.09, -0.05]),
              },

              {
                frame: 3.25 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.1, -0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0, 0]),
              },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  // 定义步骤3,避光孵育
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData.jyq.position,
      },
    },
    interactions: [
      {
        modelName: "lbz",
        onClick: async () => {
          playAudio(42)
        },
        animations: [
          {
            mesh: item.lbz.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.lbz.position },

              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.lbz.position, [-0.5, 0.5, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.yc.position, [0, 0.36, 0]),
              },

              //  { frame: 3.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.lsg.meshes[0],
            animation: moveAni("position", [
              {
                frame: 0 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, -0.09, -0.05]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.lbz.position, [-0.505, 0.515, -0.05]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.yc.position, [-0.005, 0.375, -0.05]),
              },
            ]),
          },
          {
            mesh: item.lsg.meshes[0],
            animation: rotateAni("rotation.x", [
              {
                frame: 0 * frameRate,
                value: 0,
              },
              {
                frame: 1 * frameRate,
                value: PI / 2,
              },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  // 定义步骤4,裂解红细胞
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData.jyq.position,
      },
    },
    interactions: [
      {
        modelName: "hxbljy",
        onClick: async () => {
          playAudio(43)
        },
        animations: [
          {
            mesh: item.hxbljy.meshes[1],
            animation: moveAni("position", [
              { frame: 0, value: itemData.hxbljy.position },

              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.hxbljy.position, [0, 0.05, -0.1]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.hxbljy.position, [0, -0.08, -0.1]),
              },

              //  { frame: 3.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              {
                frame: 0 * frameRate,
                value: itemData.jyq.position,
              },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.hxbljy.position, [0, 0.2, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.hxbljy.position, [0, 0.01, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.hxbljy.position, [0, 0.01, 0]),
              },
              {
                frame: 1.75 * frameRate,
                value: posTranslate(itemData.hxbljy.position, [0, 0.2, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.2, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.03, 0]),
              },
            ]),
          },
          // {
          //   mesh: item.lsg.meshes[0],
          //   animation: moveAni("position", [
          //     {
          //       frame: 0 * frameRate,
          //       value: posTranslate(itemData.lsg.position, [0, -0.09, -0.05]),
          //     },
          //     {
          //       frame: 1 * frameRate,
          //       value: posTranslate(itemData.hxbljy.position, [0, 0.2, -0.05]),
          //     },
          //     {
          //       frame: 2 * frameRate,
          //       value: posTranslate(itemData.hxbljy.position, [0, 0.01, -0.05]),
          //     },
          //   ]),
          // },
        ],
      },
    ],
    onEnter: async () => {
      item.hxbljy.meshes[1].setParent(null)
    },
  })
  // 定义步骤5,离心洗涤
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData.jyq.position,
      },
    },
    interactions: [
      {
        modelName: "lsg",
        onClick: async () => {
          playAudio(44)
        },
        animations: [
          {
            mesh: item.lsg.meshes[0],
            animation: moveAni("position", [
              {
                frame: 0 * frameRate,
                value: itemData.lsg.position,
              },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.5, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.lxj.position, [0, 0.3, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.lxj.position, [0, 0.3, 0]),
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.5, 0]),
              },
              {
                frame: 4.25 * frameRate,
                value: itemData.lsg.position,
              },
            ]),
          },
          {
            mesh: item.lxj.meshes[1],
            animation: rotateAni("rotation.x", [
              { frame: 1 * frameRate, value: -0.6 }, // 起始状态
              { frame: 2 * frameRate, value: 0 },
              { frame: 3 * frameRate, value: 0 },
              { frame: 3.25 * frameRate, value: -0.6 },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  //定义步骤6,PBS洗涤
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "pbs",
        onClick: async () => {
          playAudio(45)
        },
        animations: [
          {
            mesh: item.pbs.meshes[2],
            animation: moveAni("position", [
              { frame: 0, value: itemData.pbs.position },

              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.pbs.position, [0, 0.05, -0.1]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.pbs.position, [0, -0.14, -0.1]),
              },

              //  { frame: 3.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.jyq.position },

              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.pbs.position, [0, 0.2, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.pbs.position, [0, 0.01, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.pbs.position, [0, 0.01, 0]),
              },
              {
                frame: 1.75 * frameRate,
                value: posTranslate(itemData.pbs.position, [0, 0.2, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.3, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.3, 0]),
              },
              { frame: 3.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.lsg.meshes[0],
            animation: moveAni("position", [
              {
                frame: 3 * frameRate,
                value: itemData.lsg.position,
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.5, 0]),
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData.lxj.position, [0, 0.3, 0]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData.lxj.position, [0, 0.3, 0]),
              },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.5, 0]),
              },
              {
                frame: 6 * frameRate,
                value: itemData.lsg.position,
              },
            ]),
          },
          {
            mesh: item.lxj.meshes[1],
            animation: rotateAni("rotation.x", [
              { frame: 3.9 * frameRate, value: -0.6 }, // 起始状态
              { frame: 4 * frameRate, value: 0 },
              { frame: 4.8 * frameRate, value: 0 },
              { frame: 5 * frameRate, value: -0.6 },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      item.pbs.meshes[2].setParent(null)
    },
  })

  //定义步骤7,固定细胞
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "djjq",
        onClick: async () => {
          playAudio(46)
        },
        animations: [
          {
            mesh: item.djjq.meshes[1],
            animation: moveAni("position", [
              { frame: 0, value: itemData.djjq.position },

              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.djjq.position, [0, 0.05, -0.1]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.djjq.position, [0, -0.14, -0.1]),
              },

              //  { frame: 3.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.jyq.position },

              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.djjq.position, [0, 0.2, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.djjq.position, [0, 0.01, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.djjq.position, [0, 0.01, 0]),
              },
              {
                frame: 1.75 * frameRate,
                value: posTranslate(itemData.djjq.position, [0, 0.2, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.3, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.05, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.3, 0]),
              },
              { frame: 3.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {
      item.djjq.meshes[1].setParent(null)
    },
  })
  //定义步骤8,流式细胞仪准备
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "lsxby",
        animations: [],
      },
    ],
    onEnter: async () => {
      playAudio(47)
    },
  })
  // 定义步骤9,样本上机
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "lsg",
        onClick: async () => {
          playAudio(48)
        },
        animations: [
          {
            mesh: item.lsg.meshes[0],
            animation: moveAni("position", [
              {
                frame: 0 * frameRate,
                value: itemData.lsg.position,
              },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.lsg.position, [0, 0.3, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.lsxby.position, [0, 0.1, 0]),
              },
              //  {
              //    frame: 3 * frameRate,
              //    value: posTranslate(itemData.lsxby.position, [0, 0.1, 0]),
              //  },
              //  {
              //    frame: 4 * frameRate,
              //    value: posTranslate(itemData.lsg.position, [0, 0.3, 0]),
              //  },
              //  {
              //    frame: 4.25 * frameRate,
              //    value: itemData.lsg.position,
              //  },
            ]),
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  // 定义步骤10,数据保存
  stepManager.addStep({
    models: {},

    onEnter: async () => {
      playAudio(49)
    },
  })
  // 定义步骤11,清洁
  stepManager.addStep({
    models: {},
    onEnter: async () => {
      playAudio(50)
    },
  })
  // 定义步骤12,记录
  stepManager.addStep({
    models: {},
    onEnter: async () => {
      playAudio(51)
    },
  })
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

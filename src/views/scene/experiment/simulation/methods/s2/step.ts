import { item } from "../common/loadModle"
import { itemData } from "./itemData"
import { scene, camera } from "../common/initScene"
import {
  Vector3,
  AbstractMesh,
  AnimationGroup,
  AnimationEvent,
  PointerEventTypes,
} from "@babylonjs/core"
import type { ISceneLoaderAsyncResult } from "@babylonjs/core"
import {
  createAnimeGroup,
  changeSizeAni,
  moveAni,
  rotateAni,
  customRotate,
} from "../common/animation"
import { ref, watch } from "vue"
import {
  playAudio,
  posTranslate,
  move,
  rotate,
  scale,
  addHighlight,
  addMouseOverInfo,
  createLiquid,
} from "../common/action"
import { AnimationStepManager } from "../common/stepManager"
import { config } from "../common/config"
import type { Mesh } from "three"
const frameRate = config.frameRate

const PI = Math.PI


let isInited = false
let stepManager: AnimationStepManager
async function init() {
  isInited = true
  const lxg2 = item.lxg.meshes[0].clone("离心管2", null)
  const lxg3 = item.lxg.meshes[0].clone("离心管3", null)
  if (!lxg2 || !lxg3) return
  lxg2.position = new Vector3(...posTranslate(itemData.lxg.position, [0.1, 0, 0]))
  lxg3.position = new Vector3(...posTranslate(itemData.lxg.position, [0.2, 0, 0]))
  const hwxm = item.hwx.meshes[1]
  hwxm.rotation = Vector3.Zero()
  // stepManager.registerModel("lxg2", [lxg2])
  // stepManager.registerModel("lxg3", [lxg3])
  stepManager = new AnimationStepManager()
  // 注册模型
  Object.keys(itemData).forEach((key) => {
    stepManager.registerModel(key, item[key].meshes)
  })
  createLiquid(item.zkcxg.meshes[0], 0.05)
  const water19 = createLiquid(item.lt.meshes[0], 0.05, 0.06, 0.05, [1, 1, 1], 0.1)
  if (!water19) return
  item.zkcxg.meshes[2].isVisible = false
  // 定义步骤1,稀释
  stepManager.addStep({
    models: {
      lt: {
        position: itemData.lt.position,
      },
      lxg: {
        position: itemData.lxg.position,
      },
    },
    interactions: [
      {
        modelName: "lt",
        onClick: async () => {
          playAudio(11)
        },
        animations: [
          {
            mesh: item.lt.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.lt.position },
              {
                frame: frameRate,
                value: posTranslate(itemData.lt.position, [0, 0.18, -0.2]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.lt.position, [0, 0.18, -0.2]),
              },
              { frame: 2.5 * frameRate, value: itemData.lt.position },
            ]),
          },
          {
            mesh: item.lt.meshes[0],
            animation: rotateAni("rotation.x", [
              { frame: 0 * frameRate, value: 0 },
              {
                frame: 1 * frameRate,
                value: 1.7,
              },
              {
                frame: 2 * frameRate,
                value: 1.7,
              },
              { frame: 2.5 * frameRate, value: 0 },
            ]),
          },
          {
            mesh: water19,
            animation: changeSizeAni("scaling.y", [
              { frame: 0.5 * frameRate, value: 1 },
              { frame: 1.5 * frameRate, value: 0 },
            ]),
          },
        ],
        animationRange: [0, 2.5 * frameRate],
      },
    ],
    onEnter: async () => {},
  })
  // 定义步骤2
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData.jyq.position,
      },
      xdy: {
        position: itemData.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
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
                value: posTranslate(itemData.xdy.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.xdy.position, [0, 0.02, 0]),
              },
              { frame: 1.5 * frameRate, value: posTranslate(itemData.xdy.position, [0, 0.02, 0]) },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.jyq.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.lt.position, [-0.5, 0.1, 0]),
              },
              {
                frame: 2.5 * frameRate,
                value: posTranslate(itemData.lt.position, [-0.5, 0.05, 0]),
              },
              {
                frame: 3 * frameRate,
                value: itemData.jyq.position,
              },
            ]),
          },
          {
            mesh: item.xdy.meshes[3],
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
            mesh: item.lxg.meshes[0],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: itemData.lxg.position },
              { frame: 1 * frameRate, value: posTranslate(itemData.lt.position, [-0.5, 0, 0]) },
              { frame: 2.5 * frameRate, value: posTranslate(itemData.lt.position, [-0.5, 0, 0]) },
              { frame: 3 * frameRate, value: itemData.lxg.position },
            ]),
          },
        ],
        animationRange: [0, 3 * frameRate],
      },
    ],
    onEnter: async () => {
      item.xdy.meshes[1].setParent(null)
    },
    onExit: async () => {},
  })
  // 定义步骤3
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData.jyq.position,
      },
      xdy: {
        position: itemData.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
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
                value: posTranslate(itemData.ybxsy.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.ybxsy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.ybxsy.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.jyq.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.lt.position, [-0.5, 0.08, 0]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.lt.position, [-0.5, 0.08, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, 0.15, 0]),
              },
              {
                frame: 3.25 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, 0.03, 0]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, 0.03, 0]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, 0.08, 0]),
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData.lt.position, [-0.5, 0.08, 0]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData.lt.position, [-0.5, 0.08, 0]),
              },
              { frame: 5 * frameRate, value: itemData.jyq.position },
            ]),
          },
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
            mesh: lxg2,
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: posTranslate(itemData.lxg.position, [0.1, 0, 0]) },
              { frame: 1 * frameRate, value: posTranslate(itemData.lt.position, [-0.5, 0, 0]) },
              { frame: 4.5 * frameRate, value: posTranslate(itemData.lt.position, [-0.5, 0, 0]) },
              { frame: 5 * frameRate, value: posTranslate(itemData.lxg.position, [0.1, 0, 0]) },
            ]),
          },
        ],
        animationRange: [0, 5 * frameRate],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })
  // 定义步骤4
  stepManager.addStep({
    models: {
      lt: {
        position: itemData.lt.position,
        // visible:false
      },
      lxg: {
        position: itemData.lxg.position,
      },
    },
    interactions: [
      {
        modelName: "ybxsy",
        animations: [
          {
            mesh: item.ybxsy.meshes[3],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: posTranslate(itemData.ybxsy.position, [0, 0.12, 0]) },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.ybxsy.position, [0, 0.2, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.ybxsy.position, [0, 0, -0.1]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.ybxsy.position, [0, 0, -0.1]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData.ybxsy.position, [0, 0.2, 0]),
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData.ybxsy.position, [0, 0.12, 0]),
              },
            ]),
          },
          {
            mesh: item.ybxsy.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.ybxsy.position },
              {
                frame: frameRate,
                value: posTranslate(itemData.lt.position, [0, 0.5, -0.14]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.lt.position, [0, 0.5, -0.14]),
              },
              { frame: 3.5 * frameRate, value: itemData.ybxsy.position },
            ]),
          },
          {
            mesh: item.ybxsy.meshes[0],
            animation: rotateAni("rotation.z", [
              { frame: 1 * frameRate, value: 0 },
              {
                frame: 1.5 * frameRate,
                value: -1.5,
              },
              {
                frame: 2.5 * frameRate,
                value: -1.5,
              },
              { frame: 3 * frameRate, value: 0 },
            ]),
          },
          {
            mesh: item.lt.meshes[0],
            animation: moveAni("position", [
              { frame: 3.5 * frameRate, value: itemData.lt.position },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData.lt.position, [-0.5, 0.13, -0.49]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData.lt.position, [-0.5, 0.13, -0.49]),
              },
              { frame: 5 * frameRate, value: itemData.lt.position },
            ]),
          },
          {
            mesh: item.lt.meshes[0],
            animation: rotateAni("rotation.x", [
              { frame: 4 * frameRate, value: 0 },
              {
                frame: 4.25 * frameRate,
                value: 1.6,
              },
              {
                frame: 4.5 * frameRate,
                value: 1.6,
              },
              { frame: 4.75 * frameRate, value: 0 },
            ]),
          },
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 5 * frameRate, value: itemData.jyq.position },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData.jyq.position, [0, 0.15, 0]),
              },
              {
                frame: 5.75 * frameRate,
                value: posTranslate(itemData.mbek.position, [0, 0.1, 0]),
              },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData.mbek.position, [0, 0.1, 0]),
              },
              {
                frame: 6.5 * frameRate,
                value: posTranslate(itemData.mbek.position, [0, 0.15, 0]),
              },
              {
                frame: 6.75 * frameRate,
                value: posTranslate(itemData.lt.position, [-0.5, 0.1, 0]),
              },
              {
                frame: 7.25 * frameRate,
                value: posTranslate(itemData.lt.position, [-0.5, 0.1, 0]),
              },
              { frame: 7.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.mbek.meshes[1],
            animation: moveAni("position", [
              { frame: 5 * frameRate, value: [0, 0.18, 0] },
              {
                frame: 5.25 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 5.5 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 6.5 * frameRate,
                value: [-0.2, 0, 0],
              },
              {
                frame: 6.75 * frameRate,
                value: [0, 0.5, 0],
              },
              {
                frame: 7 * frameRate,
                value: [0, 0.18, 0],
              },
            ]),
          },
          {
            mesh: lxg3,
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: posTranslate(itemData.lxg.position, [0.2, 0, 0]) },
              { frame: 1 * frameRate, value: posTranslate(itemData.lt.position, [-0.5, 0, 0]) },
              { frame: 7.25 * frameRate, value: posTranslate(itemData.lt.position, [-0.5, 0, 0]) },
              { frame: 7.5 * frameRate, value: posTranslate(itemData.lxg.position, [0.2, 0, 0]) },
            ]),
          },
        ],
        animationRange: [0, 7.5 * frameRate],
      },
    ],
    onEnter: async () => {
      item.ybxsy.meshes[3].setParent(null)
    },
  })
  // 定义步骤5,加样
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
                value: posTranslate(itemData.ybxsy.position, [0, 0.1, 0]),
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
                value: posTranslate(itemData.ybxsy.position, [0, 0.15, 0]),
              },
              {
                frame: 1.6 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]), //空白孔
              },
              {
                frame: 2.1 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]), //空白孔
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.dz1.position, [0, 0.2, 0]),
              },
              {
                frame: 2.5 * frameRate,
                value: posTranslate(itemData.dz1.position, [0, 0.1, 0]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.dz1.position, [0, 0.1, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.dz1.position, [0, 0.2, 0]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]), //阴性对照孔
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData.dz2.position, [0, 0.2, 0]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData.dz2.position, [0, 0.1, 0]),
              },
              {
                frame: 4.75 * frameRate,
                value: posTranslate(itemData.dz2.position, [0, 0.1, 0]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData.dz2.position, [0, 0.2, 0]),
              },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]), //阳性对照孔
              },
              {
                frame: 6 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, 0.2, 0]),
              },
              {
                frame: 6.5 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, 0.02, 0]),
              },
              {
                frame: 7 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, 0.02, 0]),
              },
              {
                frame: 7.25 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [0, 0.2, 0]),
              },
              {
                frame: 7.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]), //待测血清孔
              },
              {
                frame: 8 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]), //待测血清孔
              },
              { frame: 8.25 * frameRate, value: itemData.jyq.position },
            ]),
          },

          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: itemData.mbbbb.position },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
              },
              {
                frame: 8.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
              },
              { frame: 8.5 * frameRate, value: itemData.mbbbb.position },
            ]),
          },
        ],
        animationRange: [0, 8.5 * frameRate],
      },
    ],
    onEnter: async () => {},
  })

  // 定义步骤6,震荡孵育
  stepManager.addStep({
    models: {
      lt: {
        position: itemData.lt.position,
      },
      lxg: {
        position: itemData.lxg.position,
      },
    },
    interactions: [
      {
        modelName: "fbm",
        onClick: async () => {
          playAudio(13)
        },
        animations: [
          {
            mesh: item.fbm.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.fbm.position },
              {
                frame: 0.25 * frameRate,
                value: posTranslate(itemData.mbbbb.position, [-0.01, 0.013, 0.01]),
              },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.mbbbb.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData.mbbbb.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 4.5 * frameRate,
                value: itemData.fbm.position,
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 0.25 * frameRate, value: itemData.mbbbb.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.mbbbb.position, [-0.5, 0, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.5, 0, 0]),
              },
              { frame: 1 * frameRate, value: posTranslate(itemData.hwx.position, [0, 0.1, 0]) },
              { frame: 3.5 * frameRate, value: posTranslate(itemData.hwx.position, [0, 0.1, 0]) },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.5, 0, 0]),
              },
              {
                frame: 4 * frameRate,
                value: posTranslate(itemData.mbbbb.position, [-0.5, 0, 0]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 6 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: rotateAni("rotation.z", [
              { frame: 4.5 * frameRate, value: 0 }, // 起始状态
              { frame: 5 * frameRate, value: PI / 2 }, // 旋转
              { frame: 5.5 * frameRate, value: 0 },
            ]),
          },
          {
            mesh: hwxm,
            animation: rotateAni("rotation.y", [
              { frame: 0, value: 0 }, // 起始状态
              { frame: 0.5 * frameRate, value: 2 }, // 旋转
              { frame: 1 * frameRate, value: 2 },
              { frame: 1.5 * frameRate, value: 0 },
              { frame: 3 * frameRate, value: 0 },
              { frame: 3.5 * frameRate, value: 2 },
              { frame: 4 * frameRate, value: 2 },
              { frame: 4.5 * frameRate, value: 0 },
            ]),
          },
        ],
        animationRange: [0, 6 * frameRate],
      },
    ],
    onEnter: async () => {},
  })
  // 定义步骤7
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData.jyq.position,
      },
      xdy: {
        position: itemData.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.xdy.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.xdy.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.xdy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.xdy.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.xdy.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.xdy.meshes[3],
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
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 5 * frameRate, value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]) },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [-0.3, 0, 0.4]), //水槽位置
              },
              {
                frame: 6 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: rotateAni("rotation.z", [
              { frame: 5.5 * frameRate, value: 0 }, // 起始状态
              { frame: 5.75 * frameRate, value: PI }, // 旋转
              { frame: 6 * frameRate, value: 0 },
            ]),
          },
        ],
        animationRange: [0, 7 * frameRate],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })

  // 定义步骤8,加入酶标物
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
      },
      xdy: {
        position: itemData.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.mbek.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.mbek.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.mbek.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.mbek.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.mbek.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.mbek.meshes[1],
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
            mesh: item.fbm.meshes[0],
            animation: moveAni("position", [
              { frame: 4.75 * frameRate, value: itemData.fbm.position },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 5.25 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 5.5 * frameRate, //进恒温箱
                value: posTranslate(itemData.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 6 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 6.5 * frameRate,
                value: posTranslate(itemData.mbbbb.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 6.75 * frameRate,
                value: itemData.fbm.position,
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 5 * frameRate, value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]) },
              {
                frame: 5.25 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.5, 0, 0]),
              },
              { frame: 5.5 * frameRate, value: posTranslate(itemData.hwx.position, [0, 0.1, 0]) },
              { frame: 6 * frameRate, value: posTranslate(itemData.hwx.position, [0, 0.1, 0]) },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.5, 0, 0]),
              },
              {
                frame: 6.5 * frameRate,
                value: posTranslate(itemData.mbbbb.position, [-0.5, 0, 0]),
              },
              {
                frame: 6.75 * frameRate,
                value: posTranslate(itemData.mbbbb.position, [-0.5, 0, 0]),
              },
              {
                frame: 7 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 7.5 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 8 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: rotateAni("rotation.z", [
              { frame: 7 * frameRate, value: 0 }, // 起始状态
              { frame: 7.25 * frameRate, value: PI }, // 旋转
              { frame: 7.5 * frameRate, value: 0 },
            ]),
          },
          {
            mesh: hwxm,
            animation: rotateAni("rotation.y", [
              { frame: 5 * frameRate, value: 0 }, // 起始状态
              { frame: 5.25 * frameRate, value: 2 }, // 旋转
              { frame: 5.5 * frameRate, value: 2 },
              { frame: 5.75 * frameRate, value: 0 },
              { frame: 5.9 * frameRate, value: 0 },
              { frame: 6 * frameRate, value: 2 },
              { frame: 6.5 * frameRate, value: 2 },
              { frame: 7 * frameRate, value: 0 },
            ]),
          },
        ],
        animationRange: [0, 8 * frameRate],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })
  // 定义步骤9,加入酶标物-2
  stepManager.addStep({
    models: {
      jyq: {
        position: itemData.jyq.position,
      },
      xdy: {
        position: itemData.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.xdy.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.xdy.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.xdy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.xdy.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.xdy.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.xdy.meshes[3],
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
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 5 * frameRate, value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]) },
              {
                frame: 5.5 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [-0.3, 0, 0.4]), //水槽位置
              },
              {
                frame: 6 * frameRate,
                value: posTranslate(itemData.zkcxg.position, [-0.3, 0, 0.4]),
              },
              {
                frame: 6.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
              },
            ]),
          },
          {
            mesh: item.mbbbb.meshes[0],
            animation: rotateAni("rotation.z", [
              { frame: 5.5 * frameRate, value: 0 }, // 起始状态
              { frame: 5.75 * frameRate, value: PI }, // 旋转
              { frame: 6 * frameRate, value: 0 },
            ]),
          },
        ],
        animationRange: [0, 7 * frameRate],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })

  // 定义步骤10,加入底物显色剂A
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
      },
      xdy: {
        position: itemData.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "xsjA",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.xsjA.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.xsjA.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.xsjA.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.xsjA.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.xsjA.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.xsjA.meshes[1],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.12, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 1 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.12, 0],
              },
            ]),
          },
        ],
        animationRange: [0, 5.5 * frameRate],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })
  //定义步骤11,加入底物显色剂B
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
      },
    },
    interactions: [
      {
        modelName: "xsjB",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.xsjB.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.xsjB.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.xsjB.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.xsjB.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.xsjB.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.xsjB.meshes[2],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.11, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 1 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.11, 0],
              },
            ]),
          },
        ],
        animationRange: [0, 5.5 * frameRate],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })
  // 定义步骤12,震荡后进恒温箱
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
      },
    },
    interactions: [
      {
        modelName: "mbbbb",
        onClick: async () => {},
        animations: [
          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]) },
              {
                frame: 0.25 * frameRate, //震荡
                value: posTranslate(itemData.sjh.position, [-0.5, 0, -0.02]),
              },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.5, 0, 0.02]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.5, 0, -0.02]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.5, 0, 0.02]),
              },
              {
                frame: 1.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
              },

              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.5, 0, 0]),
              },
              { frame: 2 * frameRate, value: posTranslate(itemData.hwx.position, [0, 0.1, 0]) }, // 进恒温箱
              { frame: 2.5 * frameRate, value: posTranslate(itemData.hwx.position, [0, 0.1, 0]) },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.5, 0, 0]),
              },

              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
              },
            ]),
          },

          {
            mesh: item.fbm.meshes[0],
            animation: moveAni("position", [
              { frame: 1 * frameRate, value: itemData.fbm.position },
              {
                frame: 1.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 2 * frameRate, //进恒温箱
                value: posTranslate(itemData.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 2.5 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.01, 0.113, 0.01]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.hwx.position, [-0.51, 0.013, 0.01]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.51, 0.013, 0.01]),
              },
            ]),
          },

          {
            mesh: hwxm,
            animation: rotateAni("rotation.y", [
              { frame: 1.5 * frameRate, value: 0 }, // 起始状态
              { frame: 1.75 * frameRate, value: 2 }, // 旋转
              { frame: 1.8 * frameRate, value: 2 },
              { frame: 2 * frameRate, value: 0 },
              { frame: 2.5 * frameRate, value: 0 },
              { frame: 2.6 * frameRate, value: 2 },
              { frame: 3 * frameRate, value: 2 },
              { frame: 4 * frameRate, value: 0 },
            ]),
          },
        ],
        animationRange: [0, 4 * frameRate],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })

  // 定义步骤13,终止反应
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
      },
      xdy: {
        position: itemData.xdy.position,
      },
    },
    interactions: [
      {
        modelName: "zzy",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: itemData.jyq.position },
              {
                frame: 0.5 * frameRate,
                value: posTranslate(itemData.zzy.position, [0, 0.15, 0]),
              },
              {
                frame: 0.75 * frameRate,
                value: posTranslate(itemData.zzy.position, [0, 0.1, 0]),
              },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.zzy.position, [0, 0.02, 0]),
              },
              {
                frame: 1.5 * frameRate,
                value: posTranslate(itemData.zzy.position, [0, 0.02, 0]),
              },
              {
                frame: 2 * frameRate,
                value: posTranslate(itemData.zzy.position, [0, 0.15, 0]),
              },
              {
                frame: 2.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 2.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.07]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.05]),
              },
              {
                frame: 3.75 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.25 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.03]),
              },
              {
                frame: 4.5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              {
                frame: 5 * frameRate,
                value: posTranslate(itemData.sjh.position, [-0.47, 0, 0.01]),
              },
              { frame: 5.5 * frameRate, value: itemData.jyq.position },
            ]),
          },
          {
            mesh: item.zzy.meshes[3],
            animation: moveAni("position", [
              { frame: 0 * frameRate, value: [0, 0.12, 0] },
              {
                frame: 0.5 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 1 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2 * frameRate,
                value: [0, 0, 0.1],
              },
              {
                frame: 2.25 * frameRate,
                value: [0, 0.2, 0],
              },
              {
                frame: 2.5 * frameRate,
                value: [0, 0.12, 0],
              },
            ]),
          },
        ],
        animationRange: [0, 5.5 * frameRate],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })
  // 定义步骤14,酶标仪比色
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
      },
    },
    interactions: [
      {
        modelName: "mby",
        onClick: async () => {},
        animations: [
          {
            mesh: item.mbbbb.meshes[0],
            animation: moveAni("position", [
              { frame: 0, value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]) },
              {
                frame: 1 * frameRate,
                value: posTranslate(itemData.mby.position, [0.02, 0.1, 0]),
              },
              {
                frame: 3 * frameRate,
                value: posTranslate(itemData.mby.position, [0.02, 0.1, 0]),
              },
              { frame: 4 * frameRate, value: posTranslate(itemData.sjh.position, [-0.5, 0, 0]) },
            ]),
          },
        ],
        animationRange: [0, 4 * frameRate],
      },
    ],
    onEnter: async () => {},
    onExit: async () => {},
  })
  // 定义步骤15,加入酶标物-3
  stepManager.addStep({
    models: {
      mbbbb: {
        position: posTranslate(itemData.sjh.position, [-0.5, 0, 0]),
      },
    },
    interactions: [
      {
        modelName: "mbbbb",
        onClick: async () => {},
        animations: [],
      },
    ],
  })
}

// 开始执行

export async function loadStep() {
  if (!scene || !camera) return
  if (!isInited) {
    await init()
  }

  stepManager.goToStep()
}

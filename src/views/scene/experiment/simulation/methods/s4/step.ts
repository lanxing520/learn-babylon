import { item, resetItems } from "../common/loadModle"
import { itemData } from "./itemData"

import { Vector3, Mesh, AnimationEvent, AbstractMesh } from "@babylonjs/core"

import { changeSizeAni, moveAni, rotateAni, createKeyframes } from "../common/animation"
import { ref } from "vue"
import { playAudio, posTranslate, createLiquid, createWaterFlow } from "../common/action"
import { AnimationStepManager } from "../common/stepManager"
import { config } from "../common/config"
import { watchPoint, scPoint, model } from "./itemData"
import type { NumberArray } from "../common/interface"
import { create } from "lodash"
type PathPoint = NumberArray | { pause: number } | number

const frameRate = config.frameRate

const PI = Math.PI

let stepManager: AnimationStepManager | null
export async function initStep() {
  stepManager = new AnimationStepManager()
  // 注册模型
  Object.keys(itemData).forEach((key) => {
    stepManager?.registerModel(key, item[key].meshes)
  })

  // item.blb.meshes[0].setParent(item.zjj.meshes[0])
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
  // 定义步骤2,制分离胶
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.jyq.position,
                  ...createPostion(itemData.bxxa.position),
                  ...createPostion(itemData.hcl.position),
                  ...createPostion(itemData.sds.position),

                  ...createPostion(itemData.glsa.position),
                  ...createPostion(itemData.temed.position),
                  posTranslate(itemData.blb.position, [0, 0.1, 0]),
                  { pause: 0.5 },

                  ...createPostion(itemData.ybc.position, itemData.blb.position),
                  itemData.jyq.position,
                ],
                0.5,
              ),
            ),
          },
          {
            mesh: item.lxg.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.lxg.position,
                  watchPoint,
                  { pause: 1 },
                  // itemData.lxg.position
                ],
                0.5,
              ),
            ),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(23)
      // item.blb.meshes[2].setParent(null)
    },
  })
  // 定义步骤3,制浓缩胶
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.jyq.position,
                  ...createPosition2(itemData.bxxa.position),
                  ...createPosition2(itemData.hcl.position),
                  ...createPosition2(itemData.sds.position),

                  ...createPosition2(itemData.glsa.position),
                  ...createPosition2(itemData.temed.position),
                  // ...createPostion(itemData.ybc.position, itemData.blb.position),
                  itemData.jyq.position,
                ],
                0.5,
              ),
            ),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(24)
      // item.blb.meshes[2].setParent(null)
    },
  })
  // 定义步骤4
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "blb",
        onClick: async () => {},
        animations: [
          {
            mesh: item.zjj.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [itemData.zjj.position, scPoint, { pause: 1 }, itemData.zjj.position],
                1,
              ),
            ),
          },
          {
            mesh: item.zjj.meshes[0],
            animation: rotateAni("rotation.z", createKeyframes([0, 1.2, { pause: 0.5 }, 0], 1)),
          },
          {
            mesh: item.blb.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [itemData.blb.position, scPoint, { pause: 1 }, itemData.blb.position],
                1,
              ),
            ),
          },
          {
            mesh: item.blb.meshes[0],
            animation: rotateAni("rotation.z", createKeyframes([0, 1.2, { pause: 0.5 }, 0], 1)),
          },
          {
            mesh: item.lz.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.lz.position,
                  posTranslate(itemData.blb.position, [0, 0.2, 0]),
                  posTranslate(itemData.blb.position, [0, 0.1, 0]),
                  { pause: 1 },
                  posTranslate(itemData.blb.position, [0, 0.2, 0]),
                  itemData.lz.position,
                ],
                0.5,
                2.5,
              ),
            ),
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  // 定义步骤5,
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.jyq.position,
                  ...createPosition2(itemData.blb.position, 0.2, 0.1, 1),
                  itemData.jyq.position,
                ],
                0.5,
              ),
            ),
          },
          {
            mesh: item.sc.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.sc.position,
                  posTranslate(itemData.blb.position, [0, 0.2, 0]),
                  posTranslate(itemData.blb.position, [0, 0.12, 0]),
                ],
                0.5,
                3,
              ),
            ),
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  //步骤6,样本处理
  stepManager.addStep({
    models: {
      sc: {
        position: posTranslate(itemData.blb.position, [0, 0.12, 0]),
      },
    },
    interactions: [
      {
        modelName: "lxg",
        onClick: async () => {},
        animations: [
          {
            mesh: item.lxg.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.lxg.position,
                  watchPoint,
                  { pause: 8 },
                  posTranslate(itemData.hwsyg.position, [0, 0.2, 0]),
                  posTranslate(itemData.hwsyg.position, [0, 0.1, 0]),
                  { pause: 1 },
                  posTranslate(itemData.lxj.position, [-0.2, 0.5, 0.5]),
                  posTranslate(itemData.lxj.position, [0, 0.2, 0]),
                  { pause: 1 },
                  posTranslate(itemData.lxj.position, [0.2, 0.5, 0.5]),
                  itemData.lxg.position,
                ],
                0.5,
              ),
            ),
          },
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.jyq.position,
                  ...createPostion(itemData.zkcxg.position),
                  ...createPostion(itemData.sds.position),
                  itemData.jyq.position,
                ],
                0.5,
              ),
            ),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(25)
    },
  })
  //步骤7,装胶
  stepManager.addStep({
    models: {
      sc: {
        position: posTranslate(itemData.blb.position, [0, 0.12, 0]),
      },
    },
    interactions: [
      {
        modelName: "blb",
        onClick: async () => {},
        animations: [
          {
            mesh: item.zjj.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.zjj.position,
                  posTranslate(itemData.dyc.position, [0, 0.3, 0]),
                  posTranslate(itemData.dyc.position, [0, 0.05, 0]),
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.blb.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.blb.position,
                  posTranslate(itemData.dyc.position, [0, 0.3, 0]),
                  posTranslate(itemData.dyc.position, [0, 0.05, 0]),
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.sc.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  posTranslate(itemData.blb.position, [0, 0.12, 0]),
                  posTranslate(itemData.dyc.position, [0, 0.42, 0]),
                  posTranslate(itemData.dyc.position, [0, 0.17, 0]),
                  { pause: 2 },
                  posTranslate(itemData.dyc.position, [0, 0.3, 0]),
                  itemData.sc.position,
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.dyy.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [itemData.dyy.position, posTranslate(itemData.dyy.position, [-0.4, 0, 0])],
                1,
              ),
            ),
          },
          {
            mesh: item.zmhcy.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.zmhcy.position,
                  posTranslate(itemData.dyc.position, [0, 0.2, +0.5]),
                  { pause: 2 },
                  itemData.zmhcy.position,
                  // posTranslate(itemData.dyc.position, [0, 0.17, 0]),
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.zmhcy.meshes[0],
            animation: rotateAni("rotation.z", createKeyframes([0, -1.3, { pause: 1 }, 0], 1, 1)),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(26)
    },
  })
  //步骤8,上样
  stepManager.addStep({
    models: model.state8,
    interactions: [
      {
        modelName: "jyq",
        onClick: async () => {},
        animations: [
          {
            mesh: item.jyq.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.jyq.position,
                  ...createPosition2(itemData.lxg.position, 0.2, 0.02, 1),
                  ...createPosition2(itemData.dyc.position, 0.3, 0.15, 2),
                  ...createPosition2(itemData.yrdb.position, 0.3, 0.02, 1),
                  ...createPosition2(itemData.dyc.position, 0.3, 0.15, 2),
                  itemData.jyq.position,
                ],
                0.5,
              ),
            ),
          },
          {
            mesh: item.dyy.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [posTranslate(itemData.dyy.position, [-0.4, 0, 0]), itemData.dyy.position],
                1,
                12,
              ),
            ),
          },
        ],
      },
    ],
    onEnter: async () => {
      playAudio(27)
    },
  })
  //步骤9,电泳
  stepManager.addStep({
    models: model.state9,
    interactions: [
      {
        modelName: "dyykg",
        onClick: async () => {},
        animations: [],
      },
    ],
    onEnter: async () => {
      playAudio(28)
    },
  })
  //步骤10,处理
  stepManager.addStep({
    models: model.state9,
    interactions: [
      {
        modelName: "qjb",
        onClick: async () => {},
        animations: [
          {
            mesh: item.dyy.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.dyy.position,
                  posTranslate(itemData.dyy.position, [-0.4, 0, 0]),
                  { pause: 3 },
                  itemData.dyy.position,
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.zjj.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  posTranslate(itemData.dyc.position, [0, 0.05, 0]),
                  posTranslate(itemData.dyc.position, [0, 0.3, 0]),
                  itemData.zjj.position,
                ],
                1,
                2,
              ),
            ),
          },
          {
            mesh: item.blb.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes([
                posTranslate(itemData.dyc.position, [0, 0.05, 0]),
                posTranslate(itemData.dyc.position, [0, 0.3, 0]),
                watchPoint,
              ]),
            ),
          },
          {
            mesh: item.qjb.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.qjb.position,
                  posTranslate(watchPoint, [+0.01, 0.16, +0.2]),
                  posTranslate(watchPoint, [0.01, 0.16, -0.1]),
                  posTranslate(watchPoint, [+0.01, 0.16, +0.2]),
                  itemData.qjb.position,
                ],
                1,
              ),
            ),
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  //步骤11,转膜1
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "pvdfm",
        onClick: async () => {},
        animations: [
          rotateAnimation(item.pvdfm.meshes[0]),
          {
            mesh: item.pvdfm.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.pvdfm.position,
                  posTranslate(itemData.fbm1.position, [-0.06, 0.2, -0.065]),
                  posTranslate(itemData.fbm1.position, [-0.06, 0.02, -0.065]),
                  { pause: 2 },
                ],
                1,
              ),
            ),
          },
          {
            mesh: item.lz.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.lz.position,
                  posTranslate(itemData.fbm2.position, [-0.06, 0.2, -0.065]),
                  posTranslate(itemData.fbm2.position, [-0.06, 0.02, -0.065]),
                ],
                1,
              ),
            ),
          },
          rotateAnimation(item.lz.meshes[0]),
          {
            mesh: item.zmhcy.meshes[0],
            animation: moveAni(
              "position",
              createKeyframes(
                [
                  itemData.zmhcy.position,
                  posTranslate(itemData.zmhcy.position, [0, 0.3, 0]),
                  posTranslate(itemData.fbm2.position, [0, 0.2, -0.45]),
                  { pause: 0.5 },
                  posTranslate(itemData.zmhcy.position, [0, 0.3, 0]),
                  itemData.zmhcy.position,
                ],
                0.5,
              ),
            ),
          },
          rotateAnimation(item.zmhcy.meshes[0], "z", 0.5),
        ],
      },
    ],
    onEnter: async () => {},
  })
  //步骤12,转膜2
  stepManager.addStep({
    models: model.state12,
    interactions: [
      {
        modelName: "zmy",
        onClick: async () => {},
        animations: [
          moveAnimation(
            item.hmd.meshes[0],
            [itemData.hmd.position, posTranslate(itemData.zmy.position, [0.1, 0.21, 0])],
            1,
          ),
          moveAnimation(
            item.lz.meshes[0],
            [
              posTranslate(itemData.fbm2.position, [-0.06, 0.02, -0.065]),
              posTranslate(itemData.zmy.position, [0.05, 0.22, 0]),
            ],
            1,
            2,
          ),
          moveAnimation(
            item.gl.meshes[0],
            [
              itemData.gl.position,
              posTranslate(itemData.gl.position, [0, 0.2, 0]),
              posTranslate(itemData.zmy.position, [0.05, 0.35, 0]),
              posTranslate(itemData.zmy.position, [0.3, 0.35, 0]),
              { pause: 2 },
              posTranslate(itemData.zmy.position, [0.05, 0.36, 0]),
              posTranslate(itemData.zmy.position, [0.3, 0.36, 0]),
              { pause: 2 },
              posTranslate(itemData.zmy.position, [0.05, 0.37, 0]),
              posTranslate(itemData.zmy.position, [0.3, 0.37, 0]),
              itemData.gl.position,
            ],
            1,
            2,
          ),
          moveAnimation(
            item.blb.meshes[0],
            [
              itemData.blb.position,
              posTranslate(itemData.blb.position, [0, 0.2, 0]),
              posTranslate(itemData.zmy.position, [-0.05, 0.25, 0]),
              { pause: 1 },
              itemData.blb.position,
            ],
            1,
            3,
          ),
          rotateAnimation(item.blb.meshes[0], "x", 1, 4.5),
          moveAnimation(
            item.pvdfm.meshes[0],
            [
              posTranslate(itemData.fbm1.position, [-0.06, 0.02, -0.065]),
              posTranslate(itemData.zmy.position, [0.05, 0.225, 0]),
            ],
            1,
            6,
          ),
          moveAnimation(
            item.lz2.meshes[0],
            [
              posTranslate(itemData.fbm2.position, [-0.06, 0.02, -0.065]),
              posTranslate(itemData.zmy.position, [0.05, 0.23, 0]),
            ],
            1,
            8,
          ),
          moveAnimation(
            item.hmd2.meshes[0],
            [itemData.hmd.position, posTranslate(itemData.zmy.position, [0.1, 0.24, 0])],
            1,
            10,
          ),
        ],
      },
    ],
    onEnter: async () => {},
  })
  //步骤13,加转膜缓冲液
  stepManager.addStep({
    models: model.state13,
    interactions: [
      {
        modelName: "zmhcy",
        onClick: async () => {},
        animations: [
          moveAnimation(
            item.zmhcy.meshes[0],
            [itemData.zmhcy.position, posTranslate(itemData.zmy.position, [0.1, 0.3, -0.4])],
            1,
          ),
          rotateAnimation(item.zmhcy.meshes[0], "z", 0.5),
        ],
      },
    ],
    onEnter: async () => {},
  })
  //步骤14,连接电源
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "",
        onClick: async () => {},
        animations: [],
      },
    ],
    onEnter: async () => {},
  })
  //步骤15,封闭
  stepManager.addStep({
    models: {
      hcm: {
        position: posTranslate(itemData.zmy.position, [0.05, 0.22, 0]),
      },
    },
    interactions: [
      {
        modelName: "nz",
        onClick: async () => {},
        animations: [
          moveAnimation(
            item.nz.meshes[0],
            [
              itemData.nz.position,
              posTranslate(itemData.zmy.position, [0.03, 0.22, 0]),
              posTranslate(itemData.tznn.position, [-0.05, 0.22, 0]),
            ],
            1,
          ),
          moveAnimation(
            item.hcm.meshes[0],
            [
              posTranslate(itemData.zmy.position, [0.05, 0.22, 0]),
              posTranslate(itemData.tznn.position, [-0.05, 0.22, 0]),
              posTranslate(itemData.tznn.position, [-0.05, 0.1, 0]),
              posTranslate(itemData.yc.position, [-0.05, 0.4, 0]),
            ],
            1,
            1,
          ),
          moveAnimation(
            item.tznn.meshes[0],
            [itemData.tznn.position, posTranslate(itemData.yc.position, [0, 0.3, 0])],
            1,
            3,
          ),
        ],
      },
    ],
    onEnter: async () => {},
  })
  return
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "zjj",
        onClick: async () => {},
        animations: [
          {
            mesh: item.zls.meshes[0],
            animation: pourWaterAni,
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "zjj",
        onClick: async () => {},
        animations: [
          {
            mesh: item.zls.meshes[0],
            animation: pourWaterAni,
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "zjj",
        onClick: async () => {},
        animations: [
          {
            mesh: item.zls.meshes[0],
            animation: pourWaterAni,
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
  stepManager.addStep({
    models: {},
    interactions: [
      {
        modelName: "zjj",
        onClick: async () => {},
        animations: [
          {
            mesh: item.zls.meshes[0],
            animation: pourWaterAni,
          },
        ],
      },
    ],
    onEnter: async () => {},
  })
}

function moveAnimation(mesh: Mesh | AbstractMesh, pathList: PathPoint[], step = 0.5, start = 0) {
  return {
    mesh,
    animation: moveAni("position", createKeyframes(pathList, step, start)),
  }
}
function rotateAnimation(mesh: Mesh | AbstractMesh, axis = "x", pause?: number, start = 0) {
  const key = [0, PI / 2] as any
  if (pause !== undefined) {
    key.push({ pause })
    key.push(0)
  }
  return {
    mesh: mesh,
    animation: rotateAni("rotation." + axis, createKeyframes(key, 1, start)),
  }
}

function createPostion(position: NumberArray, position2 = watchPoint) {
  const arr1 = [
    posTranslate(position, [0, 0.3, 0]),
    posTranslate(position, [0, 0.05, 0]),
    { pause: 0.5 },
    posTranslate(position, [0, 0.3, 0]),
  ]
  let arr2 = [] as any
  if (position2) {
    arr2 = [
      posTranslate(position2, [0, 0.3, 0]),
      posTranslate(position2, [0, 0.03, 0]),
      { pause: 0.5 },
      posTranslate(position2, [0, 0.3, 0]),
    ]
  }
  return [...arr1, ...arr2]
}

function createPosition2(position: NumberArray, up = 0.3, down = 0.05, pause = 0.5) {
  return [
    posTranslate(position, [0, up, 0]),
    posTranslate(position, [0, down, 0]),
    { pause },
    posTranslate(position, [0, up, 0]),
  ]
}

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

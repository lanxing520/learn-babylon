import { item } from "../common/loadModle"
import { itemData } from "./itemData"
import { scene, camera } from "../common/initScene"
import {
  ImportMeshAsync,
  StandardMaterial,
  Mesh,
  Color3,
  MeshBuilder,
  Vector3,
  Color4,
  Texture,
  ParticleSystem,
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

import { move, rotate, scale, addHighlight, click, addMouseOverInfo } from "../common/action"
import { ref, watch } from "vue"
import { playAudio } from "../common/action"
import { AnimationStepManager } from "../common/stepManager"

const PI = Math.PI
export const stepIndex = ref(1)
const frameRate = 30
let isInited = false
let stepManager: AnimationStepManager
async function init() {
  isInited = true
  stepManager = new AnimationStepManager()
  // 注册模型
  stepManager.registerModel("lt", item.lt.meshes)
  stepManager.registerModel("lxg", item.lxg.meshes)
  // 注册其他模型...

  // 定义步骤1
  stepManager.addStep({
    models: {
      lt: {
        position: itemData.lt.position,
        visible: true,
      },
      lxg: {
        position: itemData.lxg.position,
        visible: true,
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
                value: [
                  itemData.lt.position[0],
                  itemData.lt.position[1] + 0.18,
                  itemData.lt.position[2] - 0.2,
                ],
              },
              {
                frame: 2 * frameRate,
                value: [
                  itemData.lt.position[0],
                  itemData.lt.position[1] + 0.18,
                  itemData.lt.position[2] - 0.2,
                ],
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
        ],
        animationRange: [0, 2.5 * frameRate],
        nextStep: 2, // 完成后自动跳转到步骤2
      },
    ],
    onEnter: async () => {
      item.lt.meshes[0].rotation = new Vector3(0, 0, 0)
      // addHighlight(item.lt.meshes as Mesh[])
    },
  })
}

// 开始执行

export async function loadStep() {
  if (!scene || !camera) return
  if (!isInited) {
    await init()
  }

  stepManager.goToStep(stepIndex.value - 1)
}

function createLiquid(bottle: any, height = 0.12, diameter = 0.03, transformY = 0.05) {
  if (!scene) return
  // 创建圆柱体作为液体
  const liquid = MeshBuilder.CreateCylinder(
    "liquid",
    {
      height,
      diameter,
      tessellation: 32,
    },
    scene,
  )

  // 将轴心点移动到圆柱体底部
  liquid.setPivotPoint(new Vector3(0, -height / 2, 0))
  // 对齐到瓶子底部
  liquid.parent = bottle
  liquid.position.y = transformY // 调整Y轴位置

  // 设置半透明材质
  const mat = new StandardMaterial("liquidMat", scene)
  mat.diffuseColor = new Color3(1, 0, 0)
  mat.alpha = 1
  liquid.material = mat

  return liquid
}

const createGlassWater = () => {}

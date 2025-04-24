import * as BABYLON from "@babylonjs/core/Legacy/legacy"
import { scene, camera } from "../initScene"
import { addMouseOverInfo, move } from "../action"
import { createAnimeGroup, changeSizeAni, moveAni, rotateAni, customRotate } from "../animation"
import { GradientMaterial } from "@babylonjs/materials"
import { createTube } from "./tube"
import { createBezierPath } from "../curvePath"



const PI = Math.PI
const frameRate = 30
const origin = { x: 4.3, y: 1.1, z: -2.4 }
export async function loadScene() {
  if(!scene) return
  try {
    const res = await BABYLON.ImportMeshAsync("/model/scene/lab.glb", scene)
    optimizeMesh(res.meshes)
    // mesh.meshes[0].scaling = new BABYLON.Vector3(3,3,3)
  } catch (error) {
    console.error("场景加载失败:", error)
  }
}
type DynamicObject = {
  [key: string]: {
    name: string
    position: [number, number, number]
    rotate?: [number, number, number]
    scaling?: [number, number, number]
  } // 任意字符串 key
}
type DynamicLoaderResult = {
  [key: string]: BABYLON.ISceneLoaderAsyncResult // 任意字符串 key
}
const itemData = {
  sterileSwab: {
    name: "无菌棉签",
    position: [origin.x, origin.y, origin.z - 0.2],
    rotate: [0, 0, PI / 2],
  },
  disinfectant: {
    name: "消毒液",
    position: [origin.x, origin.y, origin.z - 0.4],
    rotate: [0, PI / 2, 0],
  },

  sharpBox: {
    name: "锐器盒",
    position: [origin.x, origin.y - 0.02, origin.z - 0.8],
    scaling: [3, 3, 3],
  },

  wasteBucket: {
    name: "污物桶",
    position: [origin.x - 1, origin.y - 0.02, origin.z - 2.5],
    scaling: [8, 8, 8],
  },
  pen: {
    name: "标记笔",
    position: [origin.x, origin.y - 0.02, origin.z - 1.2],
    scaling: [10, 10, 10],
  },
  centrifuge: {
    name: "离心机",
    position: [origin.x, origin.y - 0.02, origin.z - 2.8],
  },
  testTubeRack: {
    name: "试管架",
    position: [origin.x, origin.y - 0.02, origin.z - 1.6],
    rotate: [0, PI / 2, 0],
  },
  refrigerator: {
    name: "冰箱",
    position: [origin.x - 1.8, origin.y - 0.02, origin.z - 2.5],
  },
} as DynamicObject
const item = {} as DynamicLoaderResult
async function loadAllItems() {
  if(!scene) return
  try {
    // 使用map而不是forEach来创建Promise数组
    const loadPromises = Object.keys(itemData).map(async (key: keyof DynamicObject) => {
      const data = itemData[key]
      const url = `/model/item/experiment6/${data.name}.glb`
if (!scene) return
      try {
        // 加载模型
        const result = await BABYLON.ImportMeshAsync(url, scene)
        const rootMesh = result.meshes[0]
        move(rootMesh, data.position)

        // 设置旋转（如果有）
        if (data.rotate) {
          rootMesh.rotation = new BABYLON.Vector3(...data.rotate)
        }

        // 设置缩放（如果有）
        if (data.scaling) {
          rootMesh.scaling = new BABYLON.Vector3(...data.scaling)
        }

        // 添加鼠标悬停信息
        result.meshes.forEach((mesh) => {
          addMouseOverInfo(mesh)
        })

        // 存储加载结果
        item[key] = result

        return { key, success: true }
      } catch (error) {
        console.error(`Failed to load model ${data.name}:`, error)
        return { key, success: false, error }
      }
    })

    // 等待所有加载完成
    const results = await Promise.all(loadPromises)

    // 检查是否有加载失败的项目
    const failedLoads = results.filter((r) => !r?.success)
    if (failedLoads.length > 0) {
      console.warn(`${failedLoads.length} models failed to load`)
    }
  } catch (error) {
    console.error("Error in loadAllItems:", error)
    throw error // 可以选择重新抛出或处理错误
  }
}
export function disposeAllModle() {
  Object.keys(item).forEach(async (e) => {
    item[e].meshes.forEach((e: any) => {
      e.dispose()
    })
  })
}
export async function loadItems() {
  if (!scene) return
  const person = await BABYLON.ImportMeshAsync("/model/item/HIV测试者.glb", scene)
  const anim = person.animationGroups[0]
  anim.speedRatio = 0.05
  // anim.stop() // 停止动画
  anim.to = 4.8
  anim.onAnimationGroupLoopObservable.add(() => {
    anim.pause()
    anim.goToFrame(4.8)
  })

  await loadAllItems()

  // const tube = createTube(createSmoothPath(origin, { x: 4, y: 1.15, z: -2 }))
  const curve = createBezierPath(
    [
      [3.5, 1.15, -3.3],
      [3.6, 1.16, -3.25],
      [3.7, 1.165, -3.2],
      [3.8, 1.165, -3.18],
      [3.9, 1.16, -3.18],
      [4, 1.14, -3.2],
      [4, 1.12, -3.2],
    ],
    10,
  )

  const tube = createTube(curve, 0.002)
  const transparentMaterial = new BABYLON.StandardMaterial("transparentMat", scene)
  transparentMaterial.alpha = 0.5 // 设置透明度（0-1，0为完全透明，1为完全不透明）
  // transparentMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0) // 设置漫反射颜色（红色）
  tube.material = transparentMaterial

  // setTimeout(() => {
  //   anim.restart()
  //   anim.speedRatio = -0.05
  //   anim.onAnimationGroupLoopObservable.add(() => {
  //     anim.pause()
  //     anim.goToFrame(0)
  //   })
  // }, 4000)
  // 停止动画

  // person.animationGroups[0].isStarted = true
  person.meshes[0].position = new BABYLON.Vector3(3.2, 0.28, -3.5)
  person.meshes[0].rotation = new BABYLON.Vector3(0, -PI / 2, 0)
  const stool = await BABYLON.ImportMeshAsync("/model/scene/凳子.glb", scene)
  stool.meshes[0].position = new BABYLON.Vector3(3.3, 0.05, -3.5)

  const bottleCaps = item?.disinfectant?.meshes?.[2]

  bottleCaps.setParent(null)

  const mq = itemData.sterileSwab
  //复制2号棉签
  const mq2 = item.sterileSwab.meshes[0].clone('mq2',null)
  const xds = itemData.disinfectant
  const wwt = itemData.wasteBucket
  const step1 = createAnimeGroup("step1", [
    //移动消毒水瓶盖
    {
      mesh: bottleCaps,
      animation: moveAni("position", [
        {
          frame: 0,
          value: xds.position,
        },
        {
          frame: 2 * frameRate,
          value: [xds.position[0], xds.position[1] - 0.18, xds.position[2] - 0.1],
        },
      ]),
    },
    //移动棉签
    {
      mesh: item.sterileSwab.meshes[0],
      animation: moveAni("position", [
        {
          frame: 2 * frameRate,
          value: mq.position,
        },
        {
          frame: 3 * frameRate,
          value: [xds.position[0], xds.position[1] + 0.5, xds.position[2]],
        },
        {
          frame: 4 * frameRate,
          value: [xds.position[0], xds.position[1] + 0.2, xds.position[2]],
        },
        {
          frame: 5 * frameRate,
          value: [xds.position[0], xds.position[1] + 0.5, xds.position[2]],
        },
        {
          frame: 6 * frameRate,
          value: [3.62, 1.175, -3.28],
        },
        {
          frame: 8 * frameRate,
          value: [3.63, 1.17, -3.28],
        },
        {
          frame: 10 * frameRate,
          value: [wwt.position[0]+0.1, wwt.position[1]+0.4, wwt.position[2]],
        },
      ]),
    },
    {
      mesh: item.sterileSwab.meshes[0],
      animation: rotateAni("rotation.z", [
        {
          frame: 2 * frameRate,
          value: 0,
        },
        {
          frame: 4 * frameRate,
          value: PI,
        },

        {
          frame: 5 * frameRate,
          value: PI,
        },
        {
          frame: 6 * frameRate,
          value: PI / 2,
        },
      ]),
    },
  ])
step1.normalize(0, 10 * frameRate)
  step1.start()

  // const pfp = await BABYLON.ImportMeshAsync('/model/item/2漂浮瓶.glb', scene, {})
  // pfp.meshes[0].position = new BABYLON.Vector3(op.x + 0.25, op.y, op.z)
  // pfp.meshes.forEach((e) => {
  //   addMouseOverInfo(e)
  // })

  // const liquid = createLiquid(saltWater.meshes[0])
  // const liquid2 = createLiquid(pfp.meshes[0])

  // const jtdg = await BABYLON.ImportMeshAsync('/model/item/6胶头滴管.glb', scene)
  // jtdg.meshes[0].position = new BABYLON.Vector3(op.x + 0.6, op.y + 0.02, op.z)
  // // jtdg.meshes[0].rotation = new BABYLON.Vector3(1, 0, 0)
  // customRotate(jtdg.meshes[0], [0, op.y + 2, 0])

  // // createParticleFlow(liquid, liquid2)

  // const waterMove = createAnimeGroup('', [
  //   {
  //     animation: changeSizeAni('scaling.y', [
  //       { frame: 0, value: 1 },
  //       { frame: frameRate * 4, value: 1 },
  //       { frame: frameRate * 6, value: 0.01 },
  //     ]),
  //     mesh: liquid,
  //   },
  //   {
  //     animation: changeSizeAni('scaling.y', [
  //       { frame: 0, value: 0.01 },
  //       { frame: frameRate * 4, value: 0.01 },
  //       { frame: frameRate * 6, value: 1 },
  //     ]),
  //     mesh: liquid2,
  //   },
  // ])
  // moveRotateSaltWater.normalize(0, 4 * frameRate)
  // waterMove.playOrder = 1
  // moveRotateSaltWater.onAnimationGroupEndObservable.add((group) => {
  //   createWaterStream(new BABYLON.Vector3(op.x + 0.25, op.y + 0.35, op.z))
  // })

  // waterMove.start()
}

function createLiquid(bottle: any, height = 0.12) {
  if (!scene) return
  // 创建圆柱体作为液体
  const liquid = BABYLON.MeshBuilder.CreateCylinder(
    "liquid",
    {
      height,
      diameter: 0.1,
      tessellation: 32,
    },
    scene,
  )
  // 将轴心点移动到圆柱体底部
  liquid.setPivotPoint(new BABYLON.Vector3(0, -height / 2, 0))
  // 对齐到瓶子底部
  liquid.parent = bottle
  liquid.position.y = 0.08 // 调整Y轴位置

  // 设置半透明材质
  const mat = new BABYLON.StandardMaterial("liquidMat", scene)
  mat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 1)
  mat.alpha = 0.7
  liquid.material = mat

  return liquid
}
//创建水流
const createWaterStream = (position: BABYLON.AbstractMesh | BABYLON.Vector3) => {
  if(!scene) return
  const particleSystem = new BABYLON.ParticleSystem("waterStream", 2000, scene)

  // 发射器设置

  particleSystem.particleEmitterType = particleSystem.createPointEmitter(
    new BABYLON.Vector3(0, -1, 0),
    new BABYLON.Vector3(0, 0, 0),
  )
  particleSystem.emitter = position

  // 粒子参数
  particleSystem.emitRate = 80
  particleSystem.minEmitPower = 0.5
  particleSystem.maxEmitPower = 0.7
  particleSystem.minLifeTime = 0.5
  particleSystem.maxLifeTime = 0.5

  // 大小和外观
  particleSystem.minSize = 0.04
  particleSystem.maxSize = 0.08
  particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 0.6)
  particleSystem.color2 = new BABYLON.Color4(0.8, 0.9, 1.0, 0.3)
  particleSystem.colorDead = new BABYLON.Color4(0.9, 0.95, 1.0, 0.0)

  // 运动设置

  // particleSystem.gravity = new BABYLON.Vector3(0, -0.8, 0)

  // 纹理和渲染
  particleSystem.particleTexture = new BABYLON.Texture("textures/waterParticle.png", scene)
  const fluidRenderer = scene.enableFluidRenderer()
  if (fluidRenderer) fluidRenderer.addParticleSystem(particleSystem)

  particleSystem.targetStopDuration = 1.2 // 系统总运行时间（秒）

  particleSystem.start()

  // return particleSystem
}

const createGlassWater = () => {}

function optimizeMesh(meshes: BABYLON.AbstractMesh[]) {
  const rootMesh = meshes[0]

  // 情况 1：根节点是空容器 → 冻结所有子网格
  if (rootMesh.getChildMeshes().length > 0) {
    rootMesh.getChildMeshes().forEach((child) => {
      child.freezeWorldMatrix()
      child.material?.freeze()
      child.doNotSyncBoundingInfo = true
      // child?.material?.needDepthPrePass = true
    })
  }
  // 情况 2：根节点是实际网格 → 直接冻结
  else {
    rootMesh.freezeWorldMatrix()
    // rootMesh?.material?.needDepthPrePass = true
    rootMesh.material?.freeze()
    rootMesh.doNotSyncBoundingInfo = true
  }
}

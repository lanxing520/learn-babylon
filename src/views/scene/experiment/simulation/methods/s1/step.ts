import { item, itemData, origin } from "./loadModle"
import { scene, camera } from "../initScene"
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
} from "@babylonjs/core"
import type { ISceneLoaderAsyncResult } from "@babylonjs/core"
import { createAnimeGroup, changeSizeAni, moveAni, rotateAni, customRotate } from "../animation"
import { createBezierPath } from "../curvePath"
import { createTube } from "./tube"

const PI = Math.PI

const frameRate = 30
let person = null as null | ISceneLoaderAsyncResult
async function loadTester() {
  if (!scene) return
  if (person) return

  const stool = await ImportMeshAsync("/model/scene/凳子.glb", scene)
  stool.meshes[0].position = new Vector3(3.3, 0.05, -3.5)
  person = await ImportMeshAsync("/model/item/HIV测试者.glb", scene)
  person.meshes[0].position = new Vector3(3.2, 0.28, -3.5)
  person.meshes[0].rotation = new Vector3(0, -PI / 2, 0)
  const anim = person.animationGroups[0]
  anim.speedRatio = 0.05
  // anim.stop() // 停止动画
  anim.to = 4.8
  anim.onAnimationGroupLoopObservable.add(() => {
    anim.pause()
    anim.goToFrame(4.8)
  })
  // setTimeout(() => {
  //   anim.restart()
  //   anim.speedRatio = -0.05
  //   anim.onAnimationGroupLoopObservable.add(() => {
  //     anim.pause()
  //     anim.goToFrame(0)
  //   })
  // }, 4000)
}
let animationId: number | null = null
let segments: Mesh[] = []
let step1AnimationGroup: AnimationGroup | null = null
let tube: Mesh | null = null
export async function runStep1() {
  if (!scene) return
  await loadTester()

  const path = [
    [3.5, 1.15, -3.3], //手
    [3.6, 1.16, -3.25],
    [3.7, 1.165, -3.2],
    [3.8, 1.165, -3.18],
    [3.9, 1.16, -3.18],
    [4, 1.14, -3.2],
    [4, 1.12, -3.2],
  ] as [number, number, number][]
  const curve = createBezierPath(path, 10)

  tube = createTube(curve, 0.002)
  const transparentMaterial = new StandardMaterial("transparentMat", scene)
  transparentMaterial.alpha = 0.2 // 设置透明度（0-1，0为完全透明，1为完全不透明）
  tube.material = transparentMaterial

  // 创建多个tube分段

  let visibleSegments = 1
  const redMaterial = new StandardMaterial("redMat", scene)
  redMaterial.alpha = 1 // 设置透明度（0-1，0为完全透明，1为完全不透明）
  redMaterial.diffuseColor = new Color3(1, 0, 0) // 设置漫反射颜色（红色）
  const curve2 = createBezierPath(path, 100)

  // 定义动画相关变量

  let lastTime = 0
  const growthInterval = 20 // 控制生长速度(毫秒)
  // 启动血液路径动画函数
  function startTubeAnimation() {
    // 停止已有动画
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }

    // 重置状态
    visibleSegments = 1
    segments.forEach((segment) => segment.dispose())
    segments.length = 0

    // 动画循环
    const animate = (currentTime: number) => {
      // 控制生长速度
      if (currentTime - lastTime > growthInterval) {
        lastTime = currentTime

        if (visibleSegments < curve2.length - 1) {
          // 添加新分段
          const segmentPath = curve2.slice(visibleSegments - 1, visibleSegments + 2)
          const segment = MeshBuilder.CreateTube(
            `segment-${visibleSegments}`,
            {
              path: segmentPath,
              radius: 0.0015,
              tessellation: 16,
            },
            scene,
          )
          segment.material = redMaterial
          segments.push(segment)
          visibleSegments++
        } else {
          // 动画完成时停止
          if (animationId !== null) {
            cancelAnimationFrame(animationId)
            animationId = null
          }
          return
        }
      }

      // 继续动画循环
      animationId = requestAnimationFrame(animate)
    }

    // 开始动画
    animationId = requestAnimationFrame(animate)
  }

 

  // 在场景销毁时记得取消动画
  scene.onDispose = () => {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
    }
  }

  const bottleCaps = item?.disinfectant?.meshes?.[2]

  bottleCaps.setParent(null)

  const mq = itemData.sterileSwab
  //复制2号棉签
  const mq2 = item.sterileSwab.meshes[0].clone("mq2", null)
  const xds = itemData.disinfectant
  const wwt = itemData.wasteBucket
  const step1AnimationGroup = createAnimeGroup("step1AnimationGroup", [
    //移动消毒水瓶盖
    {
      mesh: bottleCaps,
      animation: moveAni("position", [
        {
          frame: 0,
          value: xds.position,
        },
        {
          frame: 1 * frameRate,
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
          value: [wwt.position[0] + 0.1, wwt.position[1] + 0.4, wwt.position[2]],
        },
      ]),
    },
    {
      mesh: item.sterileSwab.meshes[0],
      animation: rotateAni("rotation.z", [
        {
          frame: 3 * frameRate,
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
  step1AnimationGroup.normalize(0, 10 * frameRate)
  step1AnimationGroup.start()
  step1AnimationGroup.onAnimationGroupEndObservable.add(() => {
    // 启动动画
    startTubeAnimation()
  })
}

export function stopStep() {
  // 1. 停止 tube 生长动画
  if (animationId !== null) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  // 2. 移除所有 tube 分段
  segments.forEach((segment) => {
    segment.dispose()
  })
  segments = []

  // 3. 停止并清理动画组
  if (step1AnimationGroup) {
    step1AnimationGroup.stop()
    step1AnimationGroup.dispose()
    step1AnimationGroup = null
  }

  // 4. 移除透明 tube
  if (tube) {
    tube.dispose()
    tube = null
  }

  // 5. 重置棉签位置（如果需要）
  const mq = item?.sterileSwab?.meshes?.[0]
  if (mq) {
    // mq.position.copyFromFloats(mq.position.x, mq.position.y, mq.position.z)
    // mq.rotation.copyFromFloats(0, 0, 0)
  }

  // 6. 重置消毒水瓶盖位置（如果需要）
  const bottleCaps = item?.disinfectant?.meshes?.[2]
  if (bottleCaps) {
    bottleCaps.position.copyFromFloats(
      itemData.disinfectant.position[0],
      itemData.disinfectant.position[1],
      itemData.disinfectant.position[2],
    )
  }
}

function createLiquid(bottle: any, height = 0.12) {
  if (!scene) return
  // 创建圆柱体作为液体
  const liquid = MeshBuilder.CreateCylinder(
    "liquid",
    {
      height,
      diameter: 0.1,
      tessellation: 32,
    },
    scene,
  )
  // 将轴心点移动到圆柱体底部
  liquid.setPivotPoint(new Vector3(0, -height / 2, 0))
  // 对齐到瓶子底部
  liquid.parent = bottle
  liquid.position.y = 0.08 // 调整Y轴位置

  // 设置半透明材质
  const mat = new StandardMaterial("liquidMat", scene)
  mat.diffuseColor = new Color3(0.2, 0.6, 1)
  mat.alpha = 0.7
  liquid.material = mat

  return liquid
}
//创建水流
const createWaterStream = (position: AbstractMesh | Vector3) => {
  if (!scene) return
  const particleSystem = new ParticleSystem("waterStream", 2000, scene)

  // 发射器设置

  particleSystem.particleEmitterType = particleSystem.createPointEmitter(
    new Vector3(0, -1, 0),
    new Vector3(0, 0, 0),
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
  particleSystem.color1 = new Color4(0.7, 0.8, 1.0, 0.6)
  particleSystem.color2 = new Color4(0.8, 0.9, 1.0, 0.3)
  particleSystem.colorDead = new Color4(0.9, 0.95, 1.0, 0.0)

  // 运动设置

  // particleSystem.gravity = new Vector3(0, -0.8, 0)

  // 纹理和渲染
  particleSystem.particleTexture = new Texture("textures/waterParticle.png", scene)
  const fluidRenderer = scene.enableFluidRenderer()
  if (fluidRenderer) fluidRenderer.addParticleSystem(particleSystem)

  particleSystem.targetStopDuration = 1.2 // 系统总运行时间（秒）

  particleSystem.start()

  // return particleSystem
}

const createGlassWater = () => {}

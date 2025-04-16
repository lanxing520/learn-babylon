import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { scene } from './initScene'
import { addMouseOverInfo } from './action'

let particleSystem: BABYLON.ParticleSystem
const PI = Math.PI
const frameRate = 30
export async function loadScene() {
  try {
    const mesh = await BABYLON.ImportMeshAsync('/model/scene/lab.glb', scene)
    // mesh.meshes[0].scaling = new BABYLON.Vector3(3,3,3)
  } catch (error) {
    console.error('场景加载失败:', error)
  }
}

export async function loadItems() {
  const op = { x: 0.6, y: 1.42, z: -2 }
  try {
    const saltWater = await BABYLON.ImportMeshAsync('/model/item/1饱和食盐水.glb', scene, {
      // meshNames: ['饱和食盐水'],
    })
    saltWater.meshes[0].position = new BABYLON.Vector3(op.x, op.y, op.z)
    saltWater.meshes[0].rotation = new BABYLON.Vector3(0, 0, 0)
    saltWater.meshes.forEach((e) => {
      addMouseOverInfo(e)
    })
    // addMouseOverInfo(saltWater.meshes[0])

    console.log(saltWater.meshes)

    const pfp = await BABYLON.ImportMeshAsync('/model/item/2漂浮瓶.glb', scene, {
      // meshNames: ['漂浮瓶'],
    })
    pfp.meshes[0].position = new BABYLON.Vector3(op.x + 0.25, op.y, op.z)
    pfp.meshes.forEach((e) => {
      addMouseOverInfo(e)
    })

    const liquid = createLiquid(saltWater.meshes[0])
    const liquid2 = createLiquid(pfp.meshes[0])

    const jtdg = await BABYLON.ImportMeshAsync('/model/item/6胶头滴管.glb', scene)
    jtdg.meshes[0].position = new BABYLON.Vector3(op.x + 0.6, op.y + 0.02, op.z)
    // jtdg.meshes[0].rotation = new BABYLON.Vector3(1, 0, 0)
    customRotate(jtdg.meshes[0], [0, op.y + 2, 0])

    // createParticleFlow(liquid, liquid2)
    scene.beginDirectAnimation(
      saltWater.meshes[0],
      [
        moveAni('position', [
          [op.x, op.y, op.z],
          [op.x, op.y + 0.4, op.z],
        ]),
      ],
      0,
      2 * frameRate,
      false,
      1,
      () => {
        scene.beginDirectAnimation(
          saltWater.meshes[0],
          [rotateAni('rotation.z')],
          0,
          2 * frameRate,
          false,
          1,
          () => {
            createWaterStream(new BABYLON.Vector3(op.x + 0.25, op.y + 0.35, op.z))
          },
        )
      },
    )

    scene.beginDirectAnimation(liquid, [pourAnimation()], 0, 6 * frameRate, true, 1)
    scene.beginDirectAnimation(liquid2, [addWaterAni()], 0, 6 * frameRate, true, 1)
  } catch (error) {
    console.error('物品加载失败:', error)
  }
}

function createLiquid(bottle: any, height = 0.12) {
  // 创建圆柱体作为液体
  const liquid = BABYLON.MeshBuilder.CreateCylinder(
    'liquid',
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
  const mat = new BABYLON.StandardMaterial('liquidMat', scene)
  mat.diffuseColor = new BABYLON.Color3(0.2, 0.6, 1)
  mat.alpha = 0.7
  liquid.material = mat

  return liquid
}
//创建水流
const createWaterStream = (position: BABYLON.AbstractMesh | BABYLON.Vector3) => {
  const particleSystem = new BABYLON.ParticleSystem('waterStream', 2000, scene)

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
  particleSystem.particleTexture = new BABYLON.Texture('textures/waterParticle.png', scene)
  const fluidRenderer = scene.enableFluidRenderer()
  fluidRenderer.addParticleSystem(particleSystem)

  particleSystem.targetStopDuration = 1.2 // 系统总运行时间（秒）
  particleSystem.start()

  // return particleSystem
}

const createGlassWater = () => {}

// 倒水动画
function pourAnimation() {
  // 2. 液体高度动画
  const liquidAnim = new BABYLON.Animation(
    'liquidHeight',
    'scaling.y',
    frameRate,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  )

  liquidAnim.setKeys([
    { frame: 0, value: 1 },
    { frame: frameRate * 4, value: 1 },
    { frame: frameRate * 6, value: 0 }, // 液体减少
  ])

  // 执行动画
  // createParticleFlow(scene, bottle1, bottle2),

  return liquidAnim
}
function addWaterAni() {
  // 2. 液体高度动画
  const liquidAnim = new BABYLON.Animation(
    'liquidHeight',
    'scaling.y',
    frameRate,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  )

  liquidAnim.setKeys([
    { frame: 0, value: 0.01 },
    { frame: frameRate * 4, value: 0.01 },
    { frame: frameRate * 6, value: 1 },
  ])

  // 执行动画
  // createParticleFlow(scene, bottle1, bottle2),

  return liquidAnim
}
function moveAni(property: any, path: number[][], step = 2) {
  const movein = new BABYLON.Animation(
    'move',
    property,
    frameRate,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  )
  const movein_keys = path.map((e, i) => {
    return {
      frame: step * i * frameRate,
      value: new BABYLON.Vector3(...e),
    }
  })
  movein.setKeys(movein_keys)
  return movein
}

function rotateAni(property: any) {
  const rotate = new BABYLON.Animation(
    'rotate',
    property,
    frameRate,
    BABYLON.Animation.ANIMATIONTYPE_FLOAT,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  )
  const movein_keys = [
    {
      frame: 0,
      value: 0,
    },
    {
      frame: 2 * frameRate,
      value: -PI / 2,
    },
  ]
  rotate.setKeys(movein_keys)
  return rotate
}

function customRotate(mesh: any, axis: number[]) {
  // 1. 定义自定义旋转轴（例如[1, 1, 0]）
  const customAxis = new BABYLON.Vector3(...axis).normalize()

  // // 1. 创建不可见的父容器作为旋转中心
  // const pivot = new BABYLON.TransformNode("pivot");
  // pivot.position = new BABYLON.Vector3(2, 3, 4); // 设置旋转中心点坐标

  // // 2. 将mesh设为pivot的子对象，并调整mesh位置使其相对旋转中心正确
  // mesh.parent = pivot;
  // mesh.position = mesh.position.subtract(pivot.position); // 使mesh相对于pivot定位

  // // 3. 旋转父容器
  // scene.registerBeforeRender(() => {
  //     pivot.rotate(BABYLON.Axis.Y, 0.01, BABYLON.Space.WORLD); // 围绕世界Y轴旋转
  //     // 或围绕自定义轴：
  //     // pivot.rotate(customAxis, 0.01, BABYLON.Space.WORLD);
  // });

  // 2. 创建动画
  const animationDuration = 5 // 动画持续时间(秒)
  const totalFrames = frameRate * animationDuration

  // 创建旋转动画
  const animation = new BABYLON.Animation(
    'customRotation',
    'rotationQuaternion',
    frameRate,
    BABYLON.Animation.ANIMATIONTYPE_QUATERNION,
    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE,
  )

  // 3. 创建关键帧
  const keys = []
  for (let frame = 0; frame <= totalFrames; frame++) {
    // 计算当前角度（完整旋转2π）
    const angle = (frame / totalFrames) * 2 * Math.PI

    // 创建四元数旋转
    const rotationQuaternion = BABYLON.Quaternion.RotationAxis(customAxis, angle)

    keys.push({
      frame: frame,
      value: rotationQuaternion,
    })
  }

  // 设置关键帧
  animation.setKeys(keys)

  // 4. 确保mesh有rotationQuaternion
  if (!mesh.rotationQuaternion) {
    mesh.rotationQuaternion = BABYLON.Quaternion.FromEulerAngles(
      mesh.rotation.x,
      mesh.rotation.y,
      mesh.rotation.z,
    )
  }

  // 5. 添加并运行动画
  mesh.animations = [animation]
  scene.beginAnimation(mesh, 0, totalFrames, true)
}

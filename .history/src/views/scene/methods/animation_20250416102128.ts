import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { scene } from './initScene'

const PI = Math.PI
const frameRate = 30
interface AnimationList{
  animation: BABYLON.Animation
  mesh:BABYLON.AbstractMesh
}

export function createAnimeGroup(groupName:string,list:AnimationList[],option:any) {
const animeGroup =
}



// 倒水动画
export function pourAnimation() {
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
export function addWaterAni() {
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
  return liquidAnim
}
export function moveAni(property: any, path: number[][], step = 2) {
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

export function rotateAni(property: any) {
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

export function customRotate(mesh: any, axis: number[]) {
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


<template>
  <canvas id="renderCanvas"></canvas>
</template>
<script setup lang="ts">
import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { onMounted } from 'vue'

onMounted(() => {
  // 创建引擎和场景
  const canvas = document.getElementById('renderCanvas')
  const engine = new BABYLON.Engine(canvas, true)
  const scene = new BABYLON.Scene(engine)

  // 创建相机
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    Math.PI / 2,
    5,
    BABYLON.Vector3.Zero(),
    scene,
  )
  camera.attachControl(canvas, true)
  camera.lowerRadiusLimit = 2
  camera.upperRadiusLimit = 10

  // 创建灯光
  new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)

  // 创建流体渲染器
  const fluidRenderer = new BABYLON.FluidRenderer(scene)
  const fluidObject = fluidRenderer.createFluidObject('water')

  // 创建圆柱体作为容器
  const cylinder = BABYLON.MeshBuilder.CreateCylinder(
    'cylinder',
    {
      height: 2,
      diameter: 1,
      tessellation: 64,
    },
    scene,
  )
  cylinder.position.y = 1

  // 使圆柱体半透明
  cylinder.material = new BABYLON.StandardMaterial('cylinderMat', scene)
  cylinder.material.alpha = 0.3
  cylinder.material.wireframe = true

  // 配置流体属性
  fluidObject.particleSize = 0.05
  fluidObject.particleThicknessAlpha = 0.5
  fluidObject.smoothRadius = 0.1
  fluidObject.density = 1000
  fluidObject.color = new BABYLON.Color4(0.2, 0.5, 1, 0.8)
  fluidObject.reflection = 0.5
  fluidObject.refraction = 0.5

  // 创建发射器
  const emitter = new BABYLON.MeshBuilder.CreateSphere(
    'emitter',
    {
      diameter: 0.1,
    },
    scene,
  )
  emitter.isVisible = false
  emitter.position = new BABYLON.Vector3(0, 0.5, 0)

  // 配置流体发射器
  fluidObject.addEmitter(emitter, {
    particleSize: 0.05,
    emitRate: 1000,
    randomVelocity: 0.01,
    direction1: new BABYLON.Vector3(0, 0.1, 0),
    direction2: new BABYLON.Vector3(0, 0.1, 0),
    minEmitPower: 0.5,
    maxEmitPower: 1,
    minLifeTime: 10,
    maxLifeTime: 15,
  })

  // 添加碰撞和边界
  fluidObject.addCollider(cylinder)

  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene)
  fluidObject.addCollider(ground)

  // 键盘控制
  const keyState = {}
  window.addEventListener('keydown', (e) => {
    keyState[e.key] = true
  })
  window.addEventListener('keyup', (e) => {
    keyState[e.key] = false
  })

  // 倾斜控制
  let tiltAngle = 0
  scene.onBeforeRenderObservable.add(() => {
    if (keyState['ArrowLeft']) tiltAngle += 0.01
    if (keyState['ArrowRight']) tiltAngle -= 0.01

    tiltAngle = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, tiltAngle))

    cylinder.rotation.z = tiltAngle
    emitter.rotation.z = tiltAngle

    const directionX = Math.sin(tiltAngle) * 0.2
    const directionY = Math.cos(tiltAngle) * 0.1

    fluidObject.updateEmitter(emitter, {
      direction1: new BABYLON.Vector3(directionX, directionY, 0),
      direction2: new BABYLON.Vector3(directionX, directionY, 0),
    })
  })

  // 运行渲染循环
  engine.runRenderLoop(() => {
    scene.render()
  })

  // 响应窗口大小变化
  window.addEventListener('resize', () => {
    engine.resize()
  })
})
</script>
<style></style>

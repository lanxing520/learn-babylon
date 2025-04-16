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


 const particleSystem = new BABYLON.ParticleSystem('waterStream', 2000, scene)
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
  // fluidObject.particleSize = 0.05
  // fluidObject.particleThicknessAlpha = 0.5
  // 发射器设置

  particleSystem.particleEmitterType = particleSystem.createPointEmitter(
    new BABYLON.Vector3(0, -1, 0),
    new BABYLON.Vector3(0, 0, 0),
  )
  particleSystem.emitter = cylinder

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
 const renderObject = fluidRenderer.addParticleSystem(particleSystem)


 particleSystem.targetStopDuration = 1.2 // 系统总运行时间（秒）
  particleSystem.start()


  // 创建流体渲染器


const fluidObject = renderObject.object;

  // const fluidRenderer = new BABYLON.FluidRenderer(scene)
  // const fluidObject = fluidRenderer.createFluidObject('water')

  // 创建圆柱体作为容器

  // fluidObject.smoothRadius = 0.1
  // fluidObject.density = 1000
  // fluidObject.color = new BABYLON.Color4(0.2, 0.5, 1, 0.8)
  // fluidObject.reflection = 0.5
  // fluidObject.refraction = 0.5

  // 创建发射器
  // const emitter = new BABYLON.MeshBuilder.CreateSphere(
  //   'emitter',
  //   {
  //     diameter: 0.1,
  //   },
  //   scene,
  // )
  // emitter.isVisible = false
  // emitter.position = new BABYLON.Vector3(0, 0.5, 0)


  // 添加碰撞和边界
  // fluidObject.addCollider(cylinder)

  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene)
  // fluidObject.addCollider(ground)


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

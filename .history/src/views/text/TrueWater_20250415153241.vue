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
const cylinderEmitter = particleSystem.createCylinderEmitter(1,1,0,0)
  particleSystem.particleEmitterType = cylinderEmitter
  particleSystem.emitter = cylinder
cylinderEmitter.radius = 0.4;
particleSystem.direction1 = new BABYLON.Vector3(0, -1, 0);
particleSystem.direction2 = new BABYLON.Vector3(0, 0, 0);
  // 粒子参数
  particleSystem.emitRate = 80000
  particleSystem.minEmitPower = 0
  particleSystem.maxEmitPower = 0
  // particleSystem.minLifeTime = 0.5
  // particleSystem.maxLifeTime = 0.5

  // 大小和外观
  particleSystem.minSize = 0.1
  particleSystem.maxSize = 0.2
  particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 0.6)
  particleSystem.color2 = new BABYLON.Color4(0.8, 0.9, 1.0, 0.3)
  particleSystem.colorDead = new BABYLON.Color4(0.9, 0.95, 1.0, 0.0)

  // 运动设置

  particleSystem.gravity = new BABYLON.Vector3(0, -0.8, 0)

  // 纹理和渲染
  particleSystem.particleTexture = new BABYLON.Texture('textures/waterParticle.png', scene)
  const fluidRenderer = scene.enableFluidRenderer()
 const renderObject = fluidRenderer.addParticleSystem(particleSystem)


//  particleSystem.targetStopDuration = 1.2 // 系统总运行时间（秒）
  particleSystem.start()


  // 创建流体渲染器

const fluidObject = renderObject.object;

  const ground = BABYLON.MeshBuilder.CreateGround('ground', { width: 10, height: 10 }, scene)



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
<style>
canvas{
  width: 100%;
  height: 100vh;
}

</style>

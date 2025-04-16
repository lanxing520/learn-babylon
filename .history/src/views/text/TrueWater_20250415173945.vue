<template>
  <canvas id="renderCanvas"></canvas>
</template>
<script setup lang="ts">
import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { onMounted } from 'vue'
import HavokPhysics from '@babylonjs/havok'
import { loadLight } from '../scene/loadLight'


onMounted(async () => {
  // 创建引擎和场景
  const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement
  if (!canvas) return
  const engine = await BABYLON.EngineFactory.CreateAsync(canvas, {
    GPUPowerPreference: 'high-performance',
  })
  const scene = new BABYLON.Scene(engine)

  const havokInstance = await HavokPhysics()
  const hk = new BABYLON.HavokPlugin(true, havokInstance)
  scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk)
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
  loadLight(scene)
  camera.attachControl(canvas, true)

  // 1. 创建空心圆柱（杯子主体）
const cupBody = BABYLON.MeshBuilder.CreateCylinder("cupBody", {
    height: 3,
    diameterTop: 1.5,
    diameterBottom: 1,
    tessellation: 32,
    enclose: false,  // 不封闭两端
}, scene);

// 2. 创建一个圆盘作为杯底
const cupBottom = BABYLON.MeshBuilder.CreateDisc("cupBottom", {
    radius: 0.5,      // 杯底半径 = diameterBottom / 2
    tessellation: 32,  // 圆滑度
}, scene);

// 3. 调整杯底位置（放在圆柱底部）
cupBottom.position.y = -1.5;  // 圆柱高度的一半（height/2）
cupBottom.rotation =new BABYLON.Vector3(Math.PI/2,0,0)
// 4. 设置材质（例如玻璃效果）
const glassMaterial = new BABYLON.StandardMaterial("glass", scene);
glassMaterial.alpha = 0.3;
glassMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.9, 1);
cupBody.material = glassMaterial;
cupBottom.material = glassMaterial;

// 5. 可选：将杯体和杯底合并成一个 Mesh（方便管理）
const cup = BABYLON.Mesh.MergeMeshes([cupBody, cupBottom], true);



  // 创建粒子系统
  const particleSystem = new BABYLON.ParticleSystem('fluid', 1000, scene)

  particleSystem.emitter = new BABYLON.Vector3(0, 0, 0)
  particleSystem.minSize = 0.04
  particleSystem.maxSize = 0.06

  // 配置粒子行为
  particleSystem.minLifeTime = 5.0
  particleSystem.maxLifeTime = 8.0
  particleSystem.emitRate = 500
  particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE

  // 启用流体渲染器,注册到流体渲染器
  const fluidRenderer = scene.enableFluidRenderer()
  fluidRenderer?.addParticleSystem(particleSystem)

  // 手动碰撞检测
  particleSystem.updateFunction = function (particles) {
    const radius = 0.48 // 略小于圆柱半径
    const halfHeight = 0.9 // 略小于圆柱高度

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      const dist = Math.sqrt(p.position.x ** 2 + p.position.z ** 2)

      // 圆柱侧面碰撞
      if (dist > radius) {
        // 位置修正
        p.position.x = (p.position.x * radius) / dist
        p.position.z = (p.position.z * radius) / dist

        // 方向反弹（8.2.0方式）
        const normal = new BABYLON.Vector3(p.position.x, 0, p.position.z).normalize()
        const dot = normal.x * Math.cos(p.angle) + normal.z * Math.sin(p.angle)
        p.angle = Math.PI + 2 * Math.atan2(normal.z, normal.x) - p.angle
      }

      // 顶部/底部碰撞
      if (Math.abs(p.position.y) > halfHeight) {
        p.position.y = halfHeight * Math.sign(p.position.y)
        p.angle = -p.angle // 简单反弹
      }
    }
  }
  particleSystem.start()
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
canvas {
  width: 100%;
  height: 100vh;
}
</style>

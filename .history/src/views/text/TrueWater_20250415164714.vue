<template>
  <canvas id="renderCanvas"></canvas>
</template>
<script setup lang="ts">
import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { onMounted } from 'vue'
import HavokPhysics from '@babylonjs/havok'

onMounted(async () => {
  // 创建引擎和场景
  const canvas = document.getElementById('renderCanvas')
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
  new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)

camera.attachControl(canvas, true);

// 创建流体渲染器
const fluidRenderer = new BABYLON.FluidRenderer(scene);
const fluidObject = fluidRenderer.createFluidObject("water");
fluidObject.particleSize = 0.05;

// 创建圆柱体容器（仅可视化）
const cylinder = BABYLON.MeshBuilder.CreateCylinder("cylinder", {
    height: 2,
    diameter: 1
}, scene);
cylinder.material = new BABYLON.StandardMaterial("mat", scene);
cylinder.material.alpha = 0.3;

// 创建粒子系统作为流体发射器
const particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
const emitter = BABYLON.MeshBuilder.CreateBox("emitter", {size: 0.1}, scene);
emitter.isVisible = false;
particleSystem.emitter = emitter;

// 配置粒子行为
particleSystem.minEmitPower = 0.5;
particleSystem.maxEmitPower = 1.0;
particleSystem.minLifeTime = 5.0;
particleSystem.maxLifeTime = 10.0;

// 手动碰撞检测
particleSystem.updateFunction = function(particles) {
    const radius = 0.5;
    const height = 1;

    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dist = Math.sqrt(p.position.x**2 + p.position.z**2);

        // 圆柱体碰撞
        if (dist > radius) {
            p.position.x = p.position.x * radius / dist;
            p.position.z = p.position.z * radius / dist;
        }

        // 地面碰撞
        if (p.position.y < 0) {
            p.position.y = 0;
            p.velocity.y *= -0.2;
        }
    }
};

// 将粒子系统连接到流体
fluidObject.addParticleSystem(particleSystem);

// 倾斜控制（示例）
scene.onBeforeRenderObservable.add(() => {
    cylinder.rotation.z += 0.01;
    emitter.rotation.z = cylinder.rotation.z;
});
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

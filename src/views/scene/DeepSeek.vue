<template>
  <canvas class="canvas" ref="renderCanvas"></canvas>
  <div class="left-button-wrapper">
    <div class="animation-list">
      <div class="animation-item" v-for="item in animationList" :key="item.name">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'

import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic'
// import '@babylonjs/loaders/glTF' // 启用GLTF加载器
import { loadScene, loadItems } from './loadModle'
import { loadLight } from './loadLight'
import HavokPhysics from "@babylonjs/havok";

const animationList = [
  { name: '步骤一' },
  { name: '步骤二' },
  { name: '步骤三' },
  { name: '步骤四' },
  { name: '步骤五' },
]
const renderCanvas = useTemplateRef<HTMLCanvasElement>('renderCanvas')
registerBuiltInLoaders()
onMounted(async () => {
  // 1. 初始化引擎和场景
  if (!renderCanvas.value) return
  const engine = await BABYLON.EngineFactory.CreateAsync(renderCanvas.value, {})
  //  const enginIns = new BABYLON.EngineInstrumentation(engine)
  //  enginIns.captureGPUFrameTime = true
  //  enginIns.captureShaderCompilationTime = true
  const scene = new BABYLON.Scene(engine)

  // const havokInstance = await HavokPhysics();
  // const hk = new BABYLON.HavokPlugin(true, havokInstance);
  // scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk);

  scene.autoClear = false // Color buffer
  scene.freezeActiveMeshes()
  scene.blockMaterialDirtyMechanism = true
  scene.performancePriority = BABYLON.ScenePerformancePriority.Aggressive

  // 2. 设置相机和灯光
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    0.95,
    4,
    new BABYLON.Vector3(1, 0, 0),
    scene,
  )

  // window.camera = camera
  camera.attachControl(renderCanvas.value, true)

  loadLight(scene)

  // 3. 加载GLTF模型
  await loadScene(scene)
  await loadItems(scene)

  // 4. 启动渲染循环
  engine.runRenderLoop(() => {
    scene.render()
  })

  // 窗口大小调整
  const resize = () => engine.resize()
  window.addEventListener('resize', resize)

  onUnmounted(() => {
    engine.dispose()
    window.removeEventListener('resize', resize)
  })
})
</script>

<style scoped lang="scss">
.canvas {
  width: 100%;
  height: 100vh;
  display: block;
}

.left-button-wrapper {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 0;
  background-color: #fff;
  width: 150px;
  height: 100vh;

  .animation-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    .animation-item {
      padding: 1rem 2rem;
      background-color: aqua;
      cursor: pointer;
      border-radius: 15px;
      &:hover {
        background-color: rgba(0, 255, 255, 0.3);
      }
    }
  }
}
</style>

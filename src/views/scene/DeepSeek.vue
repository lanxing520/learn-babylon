<template>
  <canvas ref="renderCanvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, useTemplateRef } from 'vue'

import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic'
// import '@babylonjs/loaders/glTF' // 启用GLTF加载器
import { loadScene, loadItems } from './loadModle'

const renderCanvas = useTemplateRef<HTMLCanvasElement>('renderCanvas')
registerBuiltInLoaders()
onMounted(async () => {
  // 1. 初始化引擎和场景
  if (!renderCanvas.value) return
  const engine = await BABYLON.EngineFactory.CreateAsync(renderCanvas.value, {})

  const scene = new BABYLON.Scene(engine)

  // 2. 设置相机和灯光
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    0.95,
    4.5,
    new BABYLON.Vector3(1, 0, 0),
    scene,
  )

  // window.camera = camera
  camera.attachControl(renderCanvas.value, true)
  // const light = new BABYLON.PointLight("pointLight", new BABYLON.Vector3(1, 1.8, -1), scene);
  const light = new BABYLON.RectAreaLight("areaLight", new BABYLON.Vector3(0, 3, 1), 3, 3, scene);
  const light0=new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(0, 1.5, 0), scene)
  // const light1=new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(1, 1.8, -1), scene);
  light0.intensity = 2;
  light.intensity = 1;
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

<style scoped>
canvas {
  width: 100%;
  height: 100vh;
  display: block;
}
</style>

import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic'
import { loadScene, loadItems } from './loadModle'
import { loadLight } from './loadLight'
import applyConfig from './config'

export let scene: BABYLON.Scene
export let engine: BABYLON.AbstractEngine
registerBuiltInLoaders()

export async function initScene(canvasDom: HTMLCanvasElement) {
  // 1. 初始化引擎和场景
  engine = await BABYLON.EngineFactory.CreateAsync(canvasDom, {
    GPUPowerPreference: 'high-performance',
    stencil: true,
  })
  scene = new BABYLON.Scene(engine)

  await applyConfig()

  // 2. 设置相机和灯光
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    -Math.PI / 2,
    0.95,
    2,
    new BABYLON.Vector3(1, 1.4, -2),
    scene,
  )
  // 调整滚轮缩放灵敏度 (默认值为3.0)
  camera.wheelPrecision = 40 // 值越大，缩放越慢；值越小，缩放越快

  // 可选：限制缩放距离
  // camera.lowerRadiusLimit = 2 // 最小距离
  // camera.upperRadiusLimit = 20 // 最大距离
  camera.attachControl(canvasDom, true)
  loadLight(scene)
  // 3. 加载GLTF模型
  await loadScene()
  await loadItems()
  // 4. 启动渲染循环
  engine.runRenderLoop(() => {
    scene.render()
  })

  // 窗口大小调整
  window.addEventListener('resize', resize)
}

export function dispose() {
  engine.dispose()
  window.removeEventListener('resize', resize)
}

const resize = () => engine.resize()

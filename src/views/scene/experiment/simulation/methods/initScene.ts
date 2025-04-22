import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic'
import { loadScene, loadItems } from './s1/loadModle'
import { ref } from 'vue'
import applyConfig from './config'

export let scene: BABYLON.Scene
export let engine: BABYLON.AbstractEngine
export let camera: BABYLON.ArcRotateCamera
export let light: BABYLON.Light
registerBuiltInLoaders()
export const loading = ref(true)

interface ILoadingScreen {
  //What happens when loading starts
  displayLoadingUI: () => void
  //What happens when loading stops
  hideLoadingUI: () => void
}
class CustomLoadingScreen implements ILoadingScreen {
  constructor(
    public loadingUIText: string,
    public loadingUIBackgroundColor: string,
  ) {}
  public displayLoadingUI() {
    loading.value = true
  }
  public hideLoadingUI() {
    loading.value = false
  }
}
export async function initScene(canvasDom: HTMLCanvasElement) {
  // 1. 初始化引擎和场景
  engine = await BABYLON.EngineFactory.CreateAsync(canvasDom, {
    GPUPowerPreference: 'high-performance',
    stencil: true,
  })
  var loadingScreen = new CustomLoadingScreen('loading!!', '#23272e')
  // replace the default loading screen
  engine.loadingScreen = loadingScreen
  // show the loading screen
  engine.displayLoadingUI()

  scene = new BABYLON.Scene(engine)

  await applyConfig()

  // 2. 设置相机和灯光
  camera = new BABYLON.ArcRotateCamera(
    'camera',
    Math.PI / 2,
    0.95,
    2,
    new BABYLON.Vector3(3.5, 1.2, -3),
    scene,
  )
  // 调整滚轮缩放灵敏度 (默认值为3.0)
  camera.wheelPrecision = 40 // 值越大，缩放越慢；值越小，缩放越快

  // 可选：限制缩放距离
  camera.lowerRadiusLimit = 1 // 最小距离
  camera.upperRadiusLimit = 4 // 最大距离
  camera.lowerBetaLimit = 0.1 // 最小垂直角度(避免完全垂直向下看)
  camera.upperBetaLimit = 2 // 最大垂直角度(π/2是水平视角)
  camera.attachControl(canvasDom, true)

  light = new BABYLON.RectAreaLight('areaLight', new BABYLON.Vector3(1, 3, 0), 3.5, 3.5, scene)
  const light0 = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(0, 1.5, 0), scene)

  light0.intensity = 2
  light.intensity = 0.5
  // 3. 加载GLTF模型
  await loadScene()
  await loadItems()
  /*
   * create your scene over here
   */

  // hide the loading screen when you want to
  engine.hideLoadingUI()
  // 4. 启动渲染循环
  engine.runRenderLoop(() => {
    scene.render()
  })

  // 窗口大小调整
  window.addEventListener('resize', resize)
}

export function dispose() {
  scene.dispose()
  engine.dispose()
  camera.dispose()
  light.dispose()
  window.removeEventListener('resize', resize)
}

const resize = () => engine.resize()

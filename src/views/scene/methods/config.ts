import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { scene, engine } from './initScene'
import HavokPhysics from '@babylonjs/havok'
import { ref } from 'vue'

export const config = {
  showFps: false,
  debugger: false,
  HavokPhysics: true,
  sceneOptimize: true,
}

export const fps = ref<string>('')
export default async () => {
  if (config.showFps) {
    scene.onAfterRenderObservable.add(() => {
      fps.value = engine.getFps().toFixed()
    })
  }
  if (config.debugger) {
    // 调试用
    scene.debugLayer.show({
      overlay: true, // 显示覆盖层（包含 FPS）
    })
  }
  if (config.HavokPhysics) {
    const havokInstance = await HavokPhysics()
    const hk = new BABYLON.HavokPlugin(true, havokInstance)
    scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk)
  }
  if (config.sceneOptimize) {
    scene.autoClear = false // Color buffer
    scene.freezeActiveMeshes()
    scene.blockMaterialDirtyMechanism = true

    scene.autoClearDepthAndStencil = false // Depth and stencil, obviously

    scene.blockfreeActiveMeshesAndRenderingGroups = true

    //激进性能模式,会禁用鼠标事件
    // scene.performancePriority = BABYLON.ScenePerformancePriority.Aggressive
  }
}

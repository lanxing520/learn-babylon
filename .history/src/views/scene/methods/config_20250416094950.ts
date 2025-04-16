import * as BABYLON from '@babylonjs/core/Legacy/legacy'
import { scene, engine } from './initScene'
import HavokPhysics from '@babylonjs/havok'

export default async () => {
  scene.onAfterRenderObservable.add(() => {
    console.log('FPS:', engine.getFps().toFixed(2))
  })

  // 调试用
  scene.debugLayer.show({
    overlay: true, // 显示覆盖层（包含 FPS）
  })

   const havokInstance = await HavokPhysics()
   const hk = new BABYLON.HavokPlugin(true, havokInstance)
  scene.enablePhysics(new BABYLON.Vector3(0, -9.8, 0), hk)


    // scene.autoClear = false // Color buffer
    // scene.freezeActiveMeshes()
    // scene.blockMaterialDirtyMechanism = true
    // scene.performancePriority = BABYLON.ScenePerformancePriority.Aggressive
}

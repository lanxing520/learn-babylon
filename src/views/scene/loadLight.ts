import * as BABYLON from '@babylonjs/core/Legacy/legacy'

export function loadLight(scene: any) {
  const light = new BABYLON.RectAreaLight(
    'areaLight',
    new BABYLON.Vector3(1, 3, 0),
    3.5,
    3.5,
    scene,
  )
  const light0 = new BABYLON.HemisphericLight('HemiLight', new BABYLON.Vector3(0, 1.5, 0), scene)

  light0.intensity = 2
  light.intensity = 0.5
  // 聚光灯
}

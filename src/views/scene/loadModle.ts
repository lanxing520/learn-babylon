import * as BABYLON from '@babylonjs/core/Legacy/legacy'
const PI = Math.PI
export async function loadScene(scene: any) {
  try {
    const url = '/model/scene/lab.glb'
    await BABYLON.ImportMeshAsync(url, scene)
  } catch (error) {
    console.error('场景加载失败:', error)
  }
}

export async function loadItems(scene: any) {
  try {
    const saltWater = await BABYLON.ImportMeshAsync('/model/item/1饱和食盐水.glb', scene)
    saltWater.meshes[0].position = new BABYLON.Vector3(0.6, 1.42, -2)
    saltWater.meshes[0].rotation = new BABYLON.Vector3(0, 0, 0)

    const Scoop = await BABYLON.ImportMeshAsync('/model/item/6胶头滴管.glb', scene)
    Scoop.meshes[0].position = new BABYLON.Vector3(0.9, 1.42, -2)

    // saltWater.meshes[0].animations.push(animation1('position'))
    // const pbr = new BABYLON.PBRMaterial('pbr', scene)
    // pbr.albedoColor = new BABYLON.Color3(255, 255, 255)
    // Scoop.meshes[0].material = pbr

    console.log(Scoop.meshes)
    scene.beginDirectAnimation(Scoop.meshes[0], [animation1('position')], 0, 5   * 60, true);
    // Scoop.meshes[0].rotation = new BABYLON.Vector3(0, 0, 0)
  } catch (error) {
    console.error('物品加载失败:', error)
  }
}

export function animation1(property: any) {
  const frameRate = 60
  const movein = new BABYLON.Animation(
    'move',
    property,
    frameRate,
    BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
    BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT,
  )
  const movein_keys = [];

  movein_keys.push({
    frame: 0,
    value: new BABYLON.Vector3(0.9, 1.42, -2),
  });


  movein_keys.push({
    frame: 2 * frameRate,
    value: new BABYLON.Vector3(0.6, 1.82, -2),
  });

  movein.setKeys(movein_keys);
  return movein
}

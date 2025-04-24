import * as BABYLON from "@babylonjs/core/Legacy/legacy"
import { scene, camera } from "../initScene"
import { addMouseOverInfo, move } from "../action"

const PI = Math.PI

export const origin = { x: 4.3, y: 1.1, z: -2.4 }
export async function loadScene() {
  if (!scene) return
  try {
    // const res = await BABYLON.ImportMeshAsync("/model/scene/lab.glb", scene)
    // optimizeMesh(res.meshes)
    // mesh.meshes[0].scaling = new BABYLON.Vector3(3,3,3)
  } catch (error) {
    console.error("场景加载失败:", error)
  }
}
type DynamicObject = {
  [key: string]: {
    name: string
    position: [number, number, number]
    rotate?: [number, number, number]
    scaling?: [number, number, number]
  } // 任意字符串 key
}
type DynamicLoaderResult = {
  [key: string]: BABYLON.ISceneLoaderAsyncResult // 任意字符串 key
}
export const itemData = {
  sterileSwab: {
    name: "无菌棉签",
    position: [origin.x, origin.y, origin.z - 0.2],
    rotate: [0, 0, PI / 2],
  },
  disinfectant: {
    name: "消毒液",
    position: [origin.x, origin.y, origin.z - 0.4],
    rotate: [0, PI / 2, 0],
  },

  sharpBox: {
    name: "锐器盒",
    position: [origin.x, origin.y - 0.02, origin.z - 0.8],
    scaling: [3, 3, 3],
  },
  bloodNeedle: {
    name: "一次性采血针",
    position: [origin.x, origin.y, origin.z - 1.1],
    scaling: [10, 10, 10],
    // position:[0,0,0]
    rotate: [PI / 2, 0, 0],
  },
  pen: {
    name: "标记笔",
    position: [origin.x, origin.y - 0.02, origin.z - 1.2],
    scaling: [10, 10, 10],
  },
  centrifuge: {
    name: "离心机",
    position: [origin.x, origin.y - 0.02, origin.z - 2.8],
  },
  bloodTube: {
    name: "真空采血管",
    position: [origin.x - 0.1, origin.y, origin.z - 1.45],
    scaling: [0.5, 0.5, 0.5],
  },
  testTubeRack: {
    name: "试管架",
    position: [origin.x, origin.y - 0.02, origin.z - 1.6],
    rotate: [0, PI / 2, 0],
  },
  wasteBucket: {
    name: "污物桶",
    position: [origin.x - 1, origin.y - 0.02, origin.z - 2.5],
    scaling: [8, 8, 8],
  },
  refrigerator: {
    name: "冰箱",
    position: [origin.x - 1.8, origin.y - 0.02, origin.z - 2.5],
  },
} as DynamicObject
export const item = {} as DynamicLoaderResult
async function loadAllItems() {
  if (!scene) return
  try {
    // 使用map而不是forEach来创建Promise数组
    const loadPromises = Object.keys(itemData).map(async (key: keyof DynamicObject) => {
      const data = itemData[key]
      const url = `/model/item/experiment6/${data.name}.glb`
      if (!scene) return
      try {
        // 加载模型
        const result = await BABYLON.ImportMeshAsync(url, scene)
        const rootMesh = result.meshes[0]
        move(rootMesh, data.position)

        // 设置旋转（如果有）
        if (data.rotate) {
          rootMesh.rotation = new BABYLON.Vector3(...data.rotate)
        }

        // 设置缩放（如果有）
        if (data.scaling) {
          rootMesh.scaling = new BABYLON.Vector3(...data.scaling)
        }

        // 添加鼠标悬停信息
        result.meshes.forEach((mesh) => {
          addMouseOverInfo(mesh)
        })

        // 存储加载结果
        item[key] = result

        return { key, success: true }
      } catch (error) {
        console.error(`Failed to load model ${data.name}:`, error)
        return { key, success: false, error }
      }
    })

    // 等待所有加载完成
    const results = await Promise.all(loadPromises)

    // 检查是否有加载失败的项目
    const failedLoads = results.filter((r) => !r?.success)
    if (failedLoads.length > 0) {
      console.warn(`${failedLoads.length} models failed to load`)
    }
  } catch (error) {
    console.error("Error in loadAllItems:", error)
    throw error // 可以选择重新抛出或处理错误
  }
}
export function disposeAllModle() {
  Object.keys(item).forEach(async (e) => {
    item[e].meshes.forEach((e: any) => {
      e.dispose()
    })
  })
}
export async function loadItems() {
  await loadAllItems()
  console.log(item.bloodNeedle)

  // const tube = createTube(createSmoothPath(origin, { x: 4, y: 1.15, z: -2 }))

  // 停止动画

  // person.animationGroups[0].isStarted = true

  // const pfp = await BABYLON.ImportMeshAsync('/model/item/2漂浮瓶.glb', scene, {})
  // pfp.meshes[0].position = new BABYLON.Vector3(op.x + 0.25, op.y, op.z)
  // pfp.meshes.forEach((e) => {
  //   addMouseOverInfo(e)
  // })

  // const liquid = createLiquid(saltWater.meshes[0])
  // const liquid2 = createLiquid(pfp.meshes[0])

  // const jtdg = await BABYLON.ImportMeshAsync('/model/item/6胶头滴管.glb', scene)
  // jtdg.meshes[0].position = new BABYLON.Vector3(op.x + 0.6, op.y + 0.02, op.z)
  // // jtdg.meshes[0].rotation = new BABYLON.Vector3(1, 0, 0)
  // customRotate(jtdg.meshes[0], [0, op.y + 2, 0])

  // // createParticleFlow(liquid, liquid2)

  // const waterMove = createAnimeGroup('', [
  //   {
  //     animation: changeSizeAni('scaling.y', [
  //       { frame: 0, value: 1 },
  //       { frame: frameRate * 4, value: 1 },
  //       { frame: frameRate * 6, value: 0.01 },
  //     ]),
  //     mesh: liquid,
  //   },
  //   {
  //     animation: changeSizeAni('scaling.y', [
  //       { frame: 0, value: 0.01 },
  //       { frame: frameRate * 4, value: 0.01 },
  //       { frame: frameRate * 6, value: 1 },
  //     ]),
  //     mesh: liquid2,
  //   },
  // ])
  // moveRotateSaltWater.normalize(0, 4 * frameRate)
  // waterMove.playOrder = 1
  // moveRotateSaltWater.onAnimationGroupEndObservable.add((group) => {
  //   createWaterStream(new BABYLON.Vector3(op.x + 0.25, op.y + 0.35, op.z))
  // })

  // waterMove.start()
}

function optimizeMesh(meshes: BABYLON.AbstractMesh[]) {
  const rootMesh = meshes[0]

  // 情况 1：根节点是空容器 → 冻结所有子网格
  if (rootMesh.getChildMeshes().length > 0) {
    rootMesh.getChildMeshes().forEach((child) => {
      child.freezeWorldMatrix()
      child.material?.freeze()
      child.doNotSyncBoundingInfo = true
      // child?.material?.needDepthPrePass = true
    })
  }
  // 情况 2：根节点是实际网格 → 直接冻结
  else {
    rootMesh.freezeWorldMatrix()
    // rootMesh?.material?.needDepthPrePass = true
    rootMesh.material?.freeze()
    rootMesh.doNotSyncBoundingInfo = true
  }
}

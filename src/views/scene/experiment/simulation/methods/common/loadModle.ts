import * as BABYLON from "@babylonjs/core/Legacy/legacy"
import { scene, camera } from "./initScene"
import { addMouseOverInfo, move } from "./action"

import type { DynamicObject } from "../common/interface.ts"

const PI = Math.PI

export const origin = { x: 4.3, y: 1.1, z: -2.4 }

type DynamicLoaderResult = {
  [key: string]: BABYLON.ISceneLoaderAsyncResult // 任意字符串 key
}

export const item = {} as DynamicLoaderResult
export async function loadItems(itemData: DynamicObject) {
  if (!scene) return
  try {
    // 使用map而不是forEach来创建Promise数组
    const loadPromises = Object.keys(itemData).map(async (key: keyof DynamicObject) => {
      const data = itemData[key]
      const url = `/model/item/${data.name}.glb`
      if (!scene) return
      try {
        // 加载模型
        const result = await BABYLON.ImportMeshAsync(url, scene, { name: data.name })
        const rootMesh = result.meshes[0]
           rootMesh.computeWorldMatrix(true)
        // 设置缩放（如果有）正确的变换顺序应该是：缩放 -> 旋转 -> 平移
        if (data.scaling) {
          if (Array.isArray(data.scaling)) {
            rootMesh.scaling = new BABYLON.Vector3(...data.scaling)
          } else if (typeof data.scaling === "number") {
            rootMesh.scaling = new BABYLON.Vector3(data.scaling, data.scaling, data.scaling)
          }
        }
        // // 设置旋转（如果有）
        if (data.rotate) {
          rootMesh.rotation = new BABYLON.Vector3(...data.rotate)
        }
        move(rootMesh, data.position)
     
      
        // 添加鼠标悬停信息
        result.meshes.forEach((e) => {
          e.name = data.name
          addMouseOverInfo(e)
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

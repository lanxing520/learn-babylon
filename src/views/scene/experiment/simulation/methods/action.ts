import { scene } from "./initScene"
import * as BABYLON from "@babylonjs/core/Legacy/legacy"

const infoPanel = document.createElement("div")
document.body.appendChild(infoPanel)
export function addMouseOverInfo(mesh: any) {
  if (!scene) return
  // 确保只处理根节点
  // if (mesh.parent) {
  //   return
  // }
  // 确保mesh有名称
  mesh.name = mesh.name || "未命名Mesh"

  // 初始化ActionManager
  mesh.actionManager = mesh.actionManager || new BABYLON.ActionManager(scene)

  //高亮效果
  const hl = new BABYLON.HighlightLayer("hl1", scene)
  // 鼠标悬停事件
  mesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function () {
      if (!scene) return
      // 高亮效果
      hl.addMesh(mesh, new BABYLON.Color3(151 / 255, 1, 1))
      // 显示信息
      showMeshInfo(mesh, scene.pointerX, scene.pointerY)
    }),
  )

  // 鼠标移出事件
  mesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () => {
      hl.removeMesh(mesh)

      // 隐藏信息
      hideMeshInfo()
    }),
  )

  function showMeshInfo(mesh: any, x: number, y: number) {
    infoPanel.style.position = "absolute"
    infoPanel.style.backgroundColor = "rgba(0,0,0,0.7)"
    infoPanel.style.color = "white"
    infoPanel.style.padding = "10px"
    infoPanel.style.borderRadius = "5px"
    infoPanel.style.pointerEvents = "none"
    infoPanel.style.zIndex = "1000"
    infoPanel.style.maxWidth = "300px"

    // 收集mesh信息
    const info = `<strong>${mesh.name || "未命名对象"}</strong>`
    infoPanel.style.left = x + 10 + "px"
    infoPanel.style.top = y + 10 + "px"
    infoPanel.innerHTML = info
    infoPanel.style.display = "block"
  }

  function hideMeshInfo() {
    infoPanel.style.display = "none"
  }
}
export function move(mesh: any, position: [number, number, number]) {
  mesh.position = new BABYLON.Vector3(...position)
}
export function rotate(mesh: any, rotation: [number, number, number]) {
  mesh.rotation = new BABYLON.Vector3(...rotation)
}
export function scale(mesh: any, scale: [number, number, number]) {
  mesh.scaling = new BABYLON.Vector3(...scale)
}

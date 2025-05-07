import { scene } from "./initScene"
import * as BABYLON from "@babylonjs/core"
import { AudioPlayer } from "@/utils/audioPlayer"
import { getAssetUrl } from "@/utils/assetHelper"
import type { NumberArray } from "./interface"

let highlightLayer = null as null | BABYLON.HighlightLayer
export function addHighlight(meshes: BABYLON.Mesh[]) {
  if (!scene) return
  highlightLayer = new BABYLON.HighlightLayer("hl1", scene)
  // 点击时高亮
  meshes.forEach((e) => {
    highlightLayer?.addMesh(e, new BABYLON.Color3(151 / 255, 1, 1))
  })
}
export function removeHighlight() {
  highlightLayer?.removeAllMeshes()
}

export function click(meshes: BABYLON.Mesh[], event: () => void) {
  if (!scene) return

  // 使用射线检测替代碰撞区域
  scene.onPointerDown = (evt, pickResult) => {
    if (!pickResult.hit) return // 如果没有命中物体，直接返回

    const pickedMesh = pickResult.pickedMesh
    if (!pickedMesh || !meshes.includes(pickedMesh as BABYLON.Mesh)) return // 确保命中的是目标mesh之一

    // 执行回调并移除高亮
    event()
    removeHighlight()

    // 清理射线监听
    if (!scene) return
    scene.onPointerDown = undefined
  }

  // 创建射线
  const ray = scene.createPickingRay(
    scene.pointerX,
    scene.pointerY,
    BABYLON.Matrix.Identity(),
    scene.activeCamera,
  )
  const hit = scene.pickWithRay(ray, (mesh) => meshes.includes(mesh as BABYLON.Mesh))

  if (hit && hit.pickedMesh) {
    event()
    removeHighlight()
  }
}

const infoPanel = document.createElement("div")
document.body.appendChild(infoPanel)

export function addMouseOverInfo(mesh: any, meshName?: string) {
  if (!scene) return

  // 确保mesh有名称
  mesh.name = meshName || mesh.name || "未命名Mesh"

  // 初始化ActionManager
  mesh.actionManager = mesh.actionManager || new BABYLON.ActionManager(scene)

  //高亮效果

  mesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function () {
      if (!scene) return
      // 高亮效果
      // hl.addMesh(mesh, new BABYLON.Color3(151 / 255, 1, 1))
      // 显示信息
      showMeshInfo(mesh, scene.pointerX, scene.pointerY)
    }),
  )

  // 鼠标移出事件
  mesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, () => {
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
export function move(mesh: any, position: NumberArray) {
  mesh.position = new BABYLON.Vector3(...position)
}
export function rotate(mesh: any, rotation: NumberArray) {
  mesh.rotation = new BABYLON.Vector3(...rotation)
}
export function scale(mesh: any, scale: NumberArray) {
  mesh.scaling = new BABYLON.Vector3(...scale)
}
export function posTranslate(position: NumberArray, translate: NumberArray): NumberArray {
  return [position[0] + translate[0], position[1] + translate[1], position[2] + translate[2]]
}
function addBoundingBox(mesh: BABYLON.Mesh) {
  mesh.showBoundingBox = true
  let sphereMin = mesh.getBoundingInfo().boundingBox.minimum
  let sphereMax = mesh.getBoundingInfo().boundingBox.maximum
  console.log(sphereMin, sphereMax)
  const min = new BABYLON.Vector3(sphereMin.x - 0.02, sphereMin.y - 0.02, sphereMin.z - 0.02) // 扩大最小边界
  const max = new BABYLON.Vector3(sphereMax.x + 0.02, sphereMax.y + 0.02, sphereMax.z + 0.02) // 扩大最大边界
  mesh.setBoundingInfo(new BABYLON.BoundingInfo(min, max))
}

let animationId: number | null = null

export function animate(item: any, duration: number) {
  if (!scene) return

  const startTime = performance.now()

  function animateStep() {
    if (!scene) return

    const currentTime = performance.now()
    const elapsedTime = currentTime - startTime

    if (elapsedTime < duration) {
      // 更新动画
      item.mesh.position.y = Math.sin(elapsedTime / 1000) * 2

      animationId = requestAnimationFrame(animateStep)
    } else {
      // 动画完成时停止
      if (animationId !== null) {
        cancelAnimationFrame(animationId)
        animationId = null

        // 添加生成血液的逻辑
        if (item && item.bloodTube) {
          generateBlood(item.bloodTube)
        }
      }
    }
  }

  animationId = requestAnimationFrame(animateStep)
}

// 修改后的生成血液函数：模拟红色液体流入瓶子
function generateBlood(bottle: any) {
  if (!scene || !bottle) return

  const boundingInfo = bottle.getBoundingInfo()
  const boundingBox = boundingInfo.boundingBox
  const height = boundingBox.maximum.y - boundingBox.minimum.y
  const diameter = boundingBox.maximum.x - boundingBox.minimum.x

  // 创建液体材质
  const liquidMaterial = new BABYLON.StandardMaterial("liquidMat", scene)
  liquidMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0) // 红色
  liquidMaterial.alpha = 0.8 // 半透明

  // 创建初始液面
  let liquidHeight = 0
  const liquid = BABYLON.MeshBuilder.CreateCylinder(
    "liquid",
    {
      height: liquidHeight,
      diameter: diameter * 0.9, // 略小于瓶子直径
      tessellation: 32,
    },
    scene,
  )
  liquid.material = liquidMaterial
  liquid.position.y = boundingBox.minimum.y + liquidHeight / 2 // 液面从底部开始

  // 将液体设置为瓶子的子对象
  liquid.setParent(bottle)

  // 模拟液体逐渐升高的动画
  const fillSpeed = 0.01 // 液面上升速度
  const targetLiquidHeight = height * 0.8 // 液体填充到瓶子高度的80%

  function updateLiquid() {
    if (liquidHeight < targetLiquidHeight) {
      liquidHeight += fillSpeed
      liquid.scaling.y = liquidHeight // 调整液面高度
      liquid.position.y = boundingBox.minimum.y + liquidHeight / 2 // 更新液面位置

      requestAnimationFrame(updateLiquid)
    }
  }

  updateLiquid()
}

const audioPlayer = new AudioPlayer()
// 在用户交互事件中加载和播放音频
export async function playAudio(index: number) {
  try {
    const url = getAssetUrl(`audio/${index}.mp3`)
    audioPlayer.setVolume(1) // 设置为50%音量
    audioPlayer.play(url)
  } catch (error) {
    console.error("音频播放错误", error)
  }
}

export function createLiquid(
  bottle: any,
  height = 0.12,
  diameter = 0.03,
  transformY = 0.05,
  color = [1, 0, 0],
  alpha = 1,
): BABYLON.Mesh | undefined {
  if (!scene) return
  // 创建圆柱体作为液体
  const liquid = BABYLON.MeshBuilder.CreateCylinder(
    "liquid",
    {
      height,
      diameter,
      tessellation: 32,
    },
    scene,
  )

  // 将轴心点移动到圆柱体底部
  liquid.setPivotPoint(new BABYLON.Vector3(0, -height / 2, 0))
  // 对齐到瓶子底部
  liquid.parent = bottle
  liquid.position.y = transformY // 调整Y轴位置

  // 设置半透明材质
  const mat = new BABYLON.StandardMaterial("liquidMat", scene)
  mat.diffuseColor = new BABYLON.Color3(...color) // 红色
  mat.alpha = alpha
  liquid.material = mat

  return liquid
}

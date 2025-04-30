
import {AbstractMesh} from "@babylonjs/core";
export function optimizeMesh(meshes: AbstractMesh[]) {
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

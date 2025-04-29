const PI = Math.PI

export const origin = { x: 4.3, y: 1.1, z: -2.4 }

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
    rotate: [0, 0, PI / 2],
  },
  centrifuge: {
    name: "离心机",
    position: [origin.x, origin.y - 0.02, origin.z - 2.8],
  },
  jtdg: {
    name: "胶头滴管",
    position: [origin.x, origin.y, origin.z - 2.2],
  },
  bloodTube: {
    name: "真空采血管",
    position: [origin.x, origin.y, origin.z - 2],
    scaling: [0.5, 0.5, 0.5],
    rotate: [0, 0, PI / 2],
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

type Vector3 = [number, number, number]

export type DynamicObject = Record<
  string,
  {
    name: string
    position: Vector3
    rotate?: Vector3
    scaling?: Vector3
  }
>

export const step1Position = {
  bloodTube: [
    itemData.testTubeRack.position[0] - 0.1,
    itemData.testTubeRack.position[1] + 0.25,
    itemData.testTubeRack.position[2] + 0.13,
  ],
  tube: [0.6, 0.06, 0],
}
export const step2Position = {
  bloodTube: [
    step1Position.bloodTube[0],
    step1Position.bloodTube[1] - 0.2,
    step1Position.bloodTube[2],
  ],
}
export const step3Position = {}
export const step4Position = {
  bloodTube: [
    itemData.centrifuge.position[0],
    itemData.centrifuge.position[1] + 0.1,
    itemData.centrifuge.position[2],
  ],
}
export const step5Position = {}

// 采血针管路径点
export const tubePoints = [
  [3.53, 1.182, -3.28], //手
  [3.6, 1.19, -3.25],
  [3.7, 1.165, -3.2],
  [3.8, 1.165, -3.18],
  [3.9, 1.16, -3.18],
] as [number, number, number][]

import type { DynamicObject, NumberArray } from "../common/interface"
import { posTranslate } from "../common/action"
const PI = Math.PI

export const origin = { x: 4.3, y: 1.1, z: -2.4 }

export const itemData1 = {
  sterileSwab: {
    name: "无菌棉签",
    position: [origin.x, origin.y, origin.z - 0.2],
    rotate: [0, 0, PI / 2],
    visible: false,
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
  lxg: {
    name: "离心管",
    rotate: [0, PI / 2, 0],
    position: [origin.x - 0.5, origin.y, origin.z - 2.4],
    scaling: 10,
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

const step1 = {
  bloodTube: posTranslate(itemData1.testTubeRack.position, [-0.1, 0.25, 0.13]),
  tube: [0.6, 0.06, 0] as NumberArray,
}

const step6 = {
  bloodTube: posTranslate(step1.bloodTube, [0, -0.2, 0]),
}

export const models = {
  step1,
  step4: {
    bloodTube: {
      position: [3.97, 1.16, -3.18] as NumberArray,
    },
  },
  step6,
  step3: {},
  step9: {
    bloodTube: posTranslate(itemData1.centrifuge.position, [0, 0.1, 0]),
  },
}

// 采血针管路径点
export const tubePoints = [
  [3.53, 1.182, -3.28], //手
  [3.6, 1.19, -3.25],
  [3.7, 1.165, -3.2],
  [3.8, 1.165, -3.18],
  [3.9, 1.16, -3.18],
] as NumberArray[]

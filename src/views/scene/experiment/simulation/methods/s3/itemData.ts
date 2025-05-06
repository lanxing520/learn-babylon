import type { DynamicObject } from "../common/interface"
const PI = Math.PI

export const origin = { x: 4.3, y: 1.08, z: -2.2 }

export const itemData = {
  jtjsz: {
    name: "胶体金试纸",
    position: [origin.x, origin.y, origin.z - 0.2],
    scaling: [0.8, 0.6, 0.8],
    rotate: [0, PI, 0],
  },
  ybxsy: {
    name: "样本稀释液",
    scaling: 0.62,
    position: [origin.x - 0.05, origin.y + 0.03, origin.z - 0.66],
    rotate: [0, -PI / 2, 0],
  },

  jtdg: {
    name: "胶头滴管",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.45],
    scaling: 0.3,
  },
  zkcxg: {
    name: "真空采血管",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z],
    scaling: 0.3,
  },
} as DynamicObject


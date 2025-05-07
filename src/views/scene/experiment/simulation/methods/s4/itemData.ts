import type { scale } from "../common/action"
import type { DynamicObject } from "../common/interface"
const PI = Math.PI

export const origin = { x: 4.3, y: 1.08, z: -2 }

export const itemData = {
  zkcxg: {
    name: "真空采血管",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z],
    scaling: 0.8,
  },
  jsq: {
    name: "计时器",
    rotate: [0, -PI / 2, 0],
    position: [origin.x - 0.4, origin.y, origin.z],
    scaling: 10,
  },

  sjh: {
    name: "试剂盒",
    position: [origin.x, origin.y, origin.z - 0.8],
    scaling: [0.8, 0.6, 0.8],
    rotate: [0, PI, 0],
  },

  sc: {
    name: "梳齿",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z],
    scaling: 0.8,
  },

  jyq: {
    name: "加样器",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.66],
    scaling: 0.5,
  },
  sb: {
    name: "装有蒸馏水的烧杯",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.45],
  },

  hwsyg: {
    name: "恒温水浴锅",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.66],
  },
  lz: {
    name: "滤纸",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.66],
  },
  blb: {
    name: "玻璃板",
    rotate: [0, PI / 2, 0],
    position: [origin.x, origin.y, origin.z - 0.2],
    scaling: 0.6,
  },
  zjj: {
    name: "制胶架",
    rotate: [0, PI / 2, 0],
    position: [origin.x, origin.y, origin.z - 0.2],
    scaling: 11,
  },
  hmd: {
    name: "海绵垫",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.66],
  },
  zmgt: {
    name: "转膜滚筒",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.66],
  },
  pvdfm: {
    name: "PVDF膜",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.66],
  },

  fbm: {
    name: "封闭皿",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.66],
  },
  nz: {
    name: "镊子",
    rotate: [0, 0, 0],
    position: [origin.x, origin.y, origin.z - 0.66],
  },
  dyc: {
    name: "电泳槽",
    rotate: [0, PI / 2, 0],
    position: [origin.x - 0.3, origin.y, origin.z - 2.8],
    scaling: 0.5,
  },
  dyy: {
    name: "电泳仪",
    rotate: [0, PI / 2, 0],
    position: [origin.x - 0.3, origin.y, origin.z - 2.8],
    scaling: 0.5,
  },
  dyykg: {
    name: "电泳仪开关",
    rotate: [0, PI / 2, 0],
    position: [origin.x + 0.1, origin.y, origin.z - 2],
    scaling: 0.5,
  },
  zmy: {
    name: "转膜仪",
    rotate: [0, 0, 0],
    position: [origin.x - 1, origin.y, origin.z - 3],
    scaling: 1.5,
  },
  lxj: {
    name: "离心机",
    rotate: [0, PI, 0],
    position: [origin.x - 1.5, origin.y, origin.z - 3],
  },

  wwt: {
    name: "污物桶",
    rotate: [0, 0, 0],
    position: [origin.x + 0.12, origin.y, origin.z - 3.2],
    scaling: 10,
  },
  bx: {
    name: "冰箱",
    position: [origin.x - 2, origin.y, origin.z - 2.7],
    scaling: [0.7, 0.7, 0.7],
    rotate: [0, 0, 0],
  },
  yc: {
    name: "摇床",
    rotate: [0, PI, 0],
    position: [origin.x - 2.6, origin.y + 0.07, origin.z - 2.7],
    scaling: 0.8,
  },
  hxfgcxy: {
    name: "化学发光成像仪",
    rotate: [0, PI, 0],
    position: [origin.x - 3.2, origin.y + 0.07, origin.z - 2.7],
  },
} as DynamicObject

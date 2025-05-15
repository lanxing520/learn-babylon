import { initStep1, jumpStep1, disposeStep1 } from "./methods/s1/step"
import { initStep2, jumpStep2, disposeStep2 } from "./methods/s2/step"
import { initStep3, jumpStep3, disposeStep3 } from "./methods/s3/step"
import { initStep4, jumpStep4, disposeStep4 } from "./methods/s4/step"
import { initStep5, jumpStep5, disposeStep5 } from "./methods/s5/step"
import { itemData1 } from "./methods/s1/itemData"
import { itemData2 } from "./methods/s2/itemData"
import { itemData3 } from "./methods/s3/itemData"
import { itemData4 } from "./methods/s4/itemData"
import { itemData5 } from "./methods/s5/itemData"

// 定义映射关系,左边animation-list的index和右边的stepIndex的index 一一对应
const stepMapping1 = {
  0: 1,
  1: 6,
  2: 7,
  3: 8,
  4: 9,
} as any

const stepMapping2 = {
  0: 1,
  1: 5,
  2: 6,
  3: 8,
  4: 10,
  5: 13,
  6: 14,
  7: 15,
} as any

const stepMapping3 = {
  0: 1,
  1: 3,
  2: 4,
} as any

const stepMapping4 = {
  0: 1,
  1: 2,
  2: 3,
  3: 6,
  4: 7,
  5: 8,
  6: 9,
  7: 10,
  8: 11,
  9: 13,
  10: 14,
  11: 15,
  12: 16,
  13: 18,
  14: 20,
  15: 22,
  16: 25,
  17: 26,
} as any

const stepMapping5 = {
  0: 1,
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 7,
  7: 8,
  8: 9,
  9: 10,
  10: 11,
  11: 12,
} as any

export function getSimulationData(step: number) {
  switch (step) {
    case 1:
      return {
        initStep: initStep1,
        jumpStep: jumpStep1,
        disposeStep: disposeStep1,
        itemData: itemData1,
        stepMapping: stepMapping1,
      }
    case 2:
      return {
        initStep: initStep2,
        jumpStep: jumpStep2,
        disposeStep: disposeStep2,
        itemData: itemData2,
        stepMapping: stepMapping2,
      }
    case 3:
      return {
        initStep: initStep3,
        jumpStep: jumpStep3,
        disposeStep: disposeStep3,
        itemData: itemData3,
        stepMapping: stepMapping3,
      }
    case 4:
      return {
        initStep: initStep4,
        jumpStep: jumpStep4,
        disposeStep: disposeStep4,
        itemData: itemData4,
        stepMapping: stepMapping4,
      }
    case 5:
      return {
        initStep: initStep5,
        jumpStep: jumpStep5,
        disposeStep: disposeStep5,
        itemData: itemData5,
        stepMapping: stepMapping5,
      }
  }
}

import { Animation, AbstractMesh, Vector3 } from "@babylonjs/core"

export type NumberArray = [number, number, number]
export type DynamicObject = Record<
  string,
  {
    name: string
    fileName?: string
    fileType?: string
    position: NumberArray
    rotate?: NumberArray
    scaling?: NumberArray | number
    visible?: boolean
  }
>

export interface AnimationItem {
  animation: Animation
  mesh: AbstractMesh
}
export interface AnimationKey {
  frame: number
  value: number | number[] | Vector3
}

export type ModelsType = Record<
  string,
  {
    position?: NumberArray
    rotation?: NumberArray
    scaling?: NumberArray
    visible?: boolean
  }
>

export interface AnimationStep {
  models: ModelsType
  interactions?: {
    modelName?: string
    onClick?: () => Promise<void>
    animations?: AnimationItem[]
    animationRange?: [number, number]
    animationSpeedRatio?: number

    nextStep?: number
  }[]
  warmTips?: string
  onEnter?: () => Promise<void>
  onEnd?: () => Promise<void>
  onExit?: () => Promise<void>
}

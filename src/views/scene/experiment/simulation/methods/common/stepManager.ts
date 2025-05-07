import { AbstractMesh, AnimationGroup, Vector3, Mesh } from "@babylonjs/core"
import { addHighlight, removeHighlight, click } from "./action"
import { createAnimeGroup } from "./animation"
import type { AnimationItem } from "./animation"
import { ref } from "vue"

export const stepIndex = ref(1)

export class AnimationStepManager {
  private steps: AnimationStep[] = []
  private currentStepIndex = 0
  private modelInstances: Record<string, AbstractMesh[]> = {}
  private animationGroups: Record<string, AnimationGroup> = {}
  private activeAnimations: AnimationGroup[] = []
  // private stepState: Record<number, any> = {}

  constructor() {}

  // 注册模型
  registerModel(name: string, mesh: AbstractMesh[]) {
    this.modelInstances[name] = mesh
  }

  // 添加步骤
  addStep(step: AnimationStep) {
    this.steps.push(step)
  }

  // 跳转到指定步骤
  async goToStep(targetIndex = stepIndex.value - 1) {
    if (targetIndex < 0 || targetIndex >= this.steps.length) return
    // 停止当前所有动画
    this.stopAllAnimations()

    // 执行离开当前步骤的清理
    const currentStep = this.steps[this.currentStepIndex]
    if (
      currentStep &&
      typeof currentStep.onExit === "function" &&
      this.currentStepIndex !== targetIndex
    ) {
      await currentStep.onExit()
    }

    // 更新当前步骤索引
    this.currentStepIndex = targetIndex
    const targetStep = this.steps[targetIndex]

    // 初始化步骤状态
    // if (!this.stepState[targetIndex]) {
    //   this.stepState[targetIndex] = {}
    // }

    // 执行步骤进入逻辑
    if (targetStep.onEnter) {
      await targetStep.onEnter()
    }

    // 设置模型初始状态
    this.setupModelStates(targetStep)

    // 设置交互事件
    this.setupInteractions(targetStep)
  }

  private stopAllAnimations() {
    this.activeAnimations.forEach((anim) => anim.stop())
    this.activeAnimations = []
  }

  private setupModelStates(step: AnimationStep) {
    // 设置模型可见性、位置等初始状态
    Object.keys(this.modelInstances).forEach((name) => {
      const model = this.modelInstances[name]
      model[0].setEnabled(step.models[name]?.visible ?? true)
    })

    // 应用模型初始位置/旋转等
    Object.entries(step.models).forEach(([name, config]) => {
      const model = this.modelInstances[name]
      if (!model) return

      if (config.position) model[0].position = Vector3.FromArray(config.position)
      if (config.rotation) model[0].rotation = Vector3.FromArray(config.rotation)
      if (config.scaling) model[0].scaling = Vector3.FromArray(config.scaling)
    })
  }

  private setupInteractions(step: AnimationStep) {
    // 清除旧的高亮和点击事件
    // ...
    removeHighlight()

    // 设置新的交互
    step.interactions?.forEach((interaction) => {
      if (!interaction.modelName) return
      const mesh = this.modelInstances[interaction.modelName]
      if (!mesh) return

      // 添加高亮
      addHighlight(mesh as Mesh[])

      // 添加点击事件
      click(mesh as Mesh[], async () => {
        if (interaction.onClick) {
          await interaction.onClick()
        }

        // 执行关联动画
        if (interaction.animations) {
          const animGroup = createAnimeGroup(
            `step-${this.currentStepIndex}-${interaction.modelName}-ani`,
            interaction.animations,
          )
          if (interaction.animationRange && interaction.animationRange.length === 2) {
            animGroup.normalize(...interaction.animationRange)
          }
          if (interaction.animationSpeedRatio) {
            animGroup.speedRatio = interaction.animationSpeedRatio
          }

          animGroup.start()
          this.activeAnimations.push(animGroup)

          animGroup.onAnimationGroupEndObservable.add(async () => {
            if (step?.onEnd && typeof step.onEnd === "function") {
              await step.onEnd()
            }
            this.currentStepIndex++
            stepIndex.value++
            this.goToStep(this.currentStepIndex)
          })
        }
      })
    })
  }
}

interface AnimationStep {
  models: Record<
    string,
    {
      position?: [number, number, number]
      rotation?: [number, number, number]
      scaling?: [number, number, number]
      visible?: boolean
    }
  >
  interactions?: {
    modelName?: string
    onClick?: () => Promise<void>
    animations?: AnimationItem[]
    animationRange?: [number, number]
    animationSpeedRatio?: number
    nextStep?: number
  }[]
  onEnter?: () => Promise<void>
  onEnd?: () => Promise<void>
  onExit?: () => Promise<void>
}

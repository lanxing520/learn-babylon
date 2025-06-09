export type QuestionData = {
  question: string
  answer: string | string[]
  type: string
  tips?: string
  options: {
    label: string
    value: string
    img?: string
  }[]
}

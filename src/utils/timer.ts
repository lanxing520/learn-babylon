export class Timer {
  private seconds
  private timerId: number | undefined
  private isRunning: boolean
  private startTime: Date | null = null // 开始时间
  private endTime: Date | null = null   // 结束时间

  constructor() {
    this.seconds = ref(0)
    this.timerId = undefined
    this.isRunning = false
  }

  getTime() {
    return this.seconds
  }

  getStartTime(): string | null {
    return this.startTime ? this.formatDate(this.startTime) : null
  }

  getEndTime(): string | null {
    return this.endTime ? this.formatDate(this.endTime) : null
  }

  start() {
    if (!this.isRunning) {
      this.isRunning = true
      this.startTime = new Date() // 记录开始时间
      this.timerId = setInterval(() => {
        this.seconds.value++
      }, 1000)
    }
  }

  pause() {
    if (this.isRunning) {
      clearInterval(this.timerId)
      this.isRunning = false
      this.endTime = new Date() // 记录结束时间
    }
  }

  reset() {
    clearInterval(this.timerId)
    this.seconds.value = 0
    this.isRunning = false
    this.endTime = new Date() // 结束时间也设为当前时间
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }
}
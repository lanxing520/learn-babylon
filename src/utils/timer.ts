export class Timer {
  private seconds
  private timerId: number | undefined
  private isRunning: boolean
  constructor() {
    this.seconds = ref(0)
    this.timerId = undefined
    this.isRunning = false
  }
  getTime() {
    return this.seconds
  }
  start() {
    if (!this.isRunning) {
      this.isRunning = true
      this.timerId = setInterval(() => {
        this.seconds.value++
      }, 1000)
    }
  }

  pause() {
    if (this.isRunning) {
      clearInterval(this.timerId)
      this.isRunning = false
    }
  }

  reset() {
    clearInterval(this.timerId)
    this.seconds.value = 0
    this.isRunning = false
  }
}

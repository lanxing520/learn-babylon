// 防抖函数
export function debounce(fn: () => void, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null
  return () => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}

export function arraysEqual(a: (string | string[])[], b: (string | string[])[]): boolean {
  if (a === b) return true
  if (a.length !== b.length) return false

  const sortedA = a.map(normalize).sort()
  const sortedB = b.map(normalize).sort()

  for (let i = 0; i < sortedA.length; i++) {
    if (sortedA[i] !== sortedB[i]) return false
  }

  return true
}

// 将 string[] 转换为排序后的字符串用于比较，如果是 string 直接返回
function normalize(item: string | string[]): string {
  if (Array.isArray(item)) {
    return JSON.stringify(item.sort())
  }
  return item
}

// utils/assetHelper.js
export const getAssetUrl = (path: string) => {

  // 开发环境：用new URL处理
  if (import.meta.env.DEV) {
    const ipath = `../assets/${path}`
    const url = new URL(ipath, import.meta.url).href
    return url
  }
  // 生产环境：直接拼接路径
  else {
    return `/assets/${path}`
  }
}

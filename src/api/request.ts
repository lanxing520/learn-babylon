import axios from "axios"
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios"

// 定义接口返回数据的类型（根据后端实际返回结构调整）
interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

class HttpClient {
  private instance: AxiosInstance

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config)

    // 请求拦截器
    // this.instance.interceptors.request.use(
    //   (config) => {
    //     // 在这里可以添加token等
    //     const token = localStorage.getItem("token")
    //     if (token) {
    //       config.headers.Authorization = `Bearer ${token}`
    //     }
    //     return config
    //   },
    //   (error) => {
    //     return Promise.reject(error)
    //   },
    // )

    // // 响应拦截器
    // this.instance.interceptors.response.use(
    //   (response: AxiosResponse<ApiResponse>) => {
    //     // 对响应数据做处理
    //     if (response.data.code !== 200) {
    //       // 可以根据后端定义的错误码做统一处理
    //       return Promise.reject(response.data)
    //     }
    //     return response.data.data // 直接返回有用的数据部分
    //   },
    //   (error) => {
    //     // 对响应错误做处理
    //     if (error.response?.status === 401) {
    //       // 处理未授权
    //     }
    //     return Promise.reject(error)
    //   },
    // )
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get(url, config)
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post(url, data, config)
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put(url, data, config)
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete(url, config)
  }
}

// 创建实例
const http = new HttpClient({
  baseURL: import.meta.env.VITE_API_BASE_URL, // 从环境变量获取
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
})

export default http

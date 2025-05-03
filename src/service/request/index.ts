import axios from 'axios'
import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import type { HYRequestConfig, HYRequestInterceptors } from './type'

class HYRequest {
  instance: AxiosInstance
  private readonly interceptors?: HYRequestInterceptors

  constructor(config: HYRequestConfig) {
    this.instance = axios.create(config)
    this.interceptors = config.interceptors

    // 全局请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log('全局请求成功的拦截')
        return config
      },
      (err) => {
        console.log('全局响应失败的拦截')
        return Promise.reject(err)
      }
    )

    // 实例请求拦截器
    if (this.interceptors?.requestSuccessFn) {
      this.instance.interceptors.request.use((config) => this.interceptors?.requestSuccessFn?.(config) || config)
    }
    if (this.interceptors?.requestFailureFn) {
      this.instance.interceptors.request.use(undefined, this.interceptors.requestFailureFn)
    }

    // 实例响应拦截器
    if (this.interceptors?.responseSuccessFn) {
      this.instance.interceptors.response.use(this.interceptors.responseSuccessFn)
    }
    if (this.interceptors?.responseFailureFn) {
      this.instance.interceptors.response.use(undefined, this.interceptors.responseFailureFn)
    }
  }

  request<T = any>(config: HYRequestConfig<T>) {
    // 单次请求的成功拦截处理
    if (config.interceptors?.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config as InternalAxiosRequestConfig)
    }

    // 返回Promise
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单次响应的成功拦截处理
          if (config.interceptors?.responseSuccessFn) {
            const response = config.interceptors.responseSuccessFn(res as AxiosResponse<T>)
            resolve(response.data)
          } else {
            resolve(res)
          }
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  get<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: 'GET' })
  }
  post<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: 'POST' })
  }
  delete<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: 'DELETE' })
  }
  put<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: 'PUT' })
  }
}

export default HYRequest

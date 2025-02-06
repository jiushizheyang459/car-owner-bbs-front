import axios from 'axios'
import type { AxiosInStance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { HYRequestConfig } from './type'

class HYRequest {
  instance: AxiosInStance

  constructor(config: HYRequestConfig) {
    this.instance = axios.create(config)

    this.instance.interceptors.request.use(
      (config) => {
        console.log('全局请求成功的拦截')
        return config
      },
      (err) => {
        console.log('全局响应失败的拦截')
      }
    )

    this.instance.interceptors.request.use(
      config.interceptors?.requestSuccessFn,
      config.interceptors?.requestFailureFn
    )
    this.instance.interceptors.response.use(
      config.interceptors?.requestSuccessFn,
      config.interceptors?.requestFailureFn
    )
  }

  request<T = any>(config: HYRequestConfig<T>) {
    //  单次清求的威功拦截处型
    if (config.intercepiors?.requestSuccessFn) {
      config = config.interceptors.requestSuccessFn(config)
    }

    //  返回Promise
    return new Promise<T>((resolve, reject) => {
      this.instance
        .request<any, T>(config)
        .then((res) => {
          //  单次响应的成功拦截处理
          if (config.interceptors?.responseSuccessFn) {
            res = config.interceptors.responseSuccessFn(res)
          }
          resolve(res)
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
  patch<T = any>(config: HYRequestConfig<T>) {
    return this.request({ ...config, method: 'PATCH' })
  }
}

export default HYRequest

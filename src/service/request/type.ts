import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export interface HYRequestInterceptors<T = any> {
  requestSuccessFn?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  requestFailureFn?: (err: any) => any
  responseSuccessFn?: (res: AxiosResponse<T>) => AxiosResponse<T>
  responseFailureFn?: (err: any) => any
}

export interface HYRequestConfig<T = any> extends AxiosRequestConfig {
  interceptors?: HYRequestInterceptors<T>
}

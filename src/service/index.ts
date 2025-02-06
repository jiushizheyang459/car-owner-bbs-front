import { BASE_URL, TIME_OUT } from './config'
import HYRequest from './request'
import { localCache } from '@/utils/cache.ts'
import { LOGIN_TOKEN } from '@/global/constants.ts'

const hyRequest = new HYRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestSuccessFn: (config) => {
      //region每一个请求都自动携带token
      const token = localCache.getCache(LOGIN_TOKEN)
      if (config && token) {
        config.headers.token = token
      }
      return config
      //endregion
    }
  }
})

export default hyRequest

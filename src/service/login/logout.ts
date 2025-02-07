import hyRequest from '@/service'
import { localCache } from '@/utils/cache.ts'
import { LOGIN_TOKEN } from '@/global/constants.ts'

export function accountLogoutRequest() {
  return hyRequest.post({
    url: '/logout'
  })
}

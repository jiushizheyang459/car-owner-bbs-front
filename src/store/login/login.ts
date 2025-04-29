import { defineStore } from 'pinia'
import { accountLoginRequest } from '@/service/login/login.ts'
import type { IAccount } from '@/types'
import { localCache } from '@/utils/cache.ts'
import { LOGIN_TOKEN } from '@/global/constants.ts'
import router from '@/router'

interface ILoginState {
  token: string
  userInfo: any
}

const useLoginStore = defineStore('login', {
  state: (): ILoginState => ({
    token: localCache.getCache(LOGIN_TOKEN) ?? '',
    userInfo: localCache.getCache('userInfo') ?? null
  }),
  actions: {
    async loginAccountAction(account: IAccount) {
      //1.账号登录，获取token等信息
      const loginResult = await accountLoginRequest(account)
      this.token = loginResult.data.data.token
      this.userInfo = loginResult.data.data.userInfo

      //进行本地缓存
      localCache.setCache(LOGIN_TOKEN, this.token)
      localCache.setCache('userInfo', this.userInfo)

      //页面跳转
      router.push('/main')
    }
  }
})

export default useLoginStore

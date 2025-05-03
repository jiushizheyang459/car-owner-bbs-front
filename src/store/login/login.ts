import { defineStore } from 'pinia'
import { accountLoginRequest } from '@/service/login/login.ts'
import type { IAccount } from '@/types'
import { localCache } from '@/utils/cache.ts'
import { LOGIN_TOKEN, USER_INFO, MENUS } from '@/global/constants.ts'
import router from '@/router'
import type { ILoginState, IMenu } from './type'

const useLoginStore = defineStore('login', {
  state: (): ILoginState => ({
    token: localCache.getCache(LOGIN_TOKEN) ?? '',
    userInfo: localCache.getCache(USER_INFO) ?? null,
    menus: localCache.getCache(MENUS) ?? []
  }),
  getters: {
    // 获取所有权限标识
    permissionsList(): string[] {
      const perms: string[] = []

      // 递归获取所有菜单的权限标识
      function getPerms(menuList: IMenu[]) {
        for (const menu of menuList) {
          if (menu.perms) {
            perms.push(menu.perms)
          }
          if (menu.children && menu.children.length > 0) {
            getPerms(menu.children)
          }
        }
      }

      getPerms(this.menus)
      return perms
    }
  },
  actions: {
    async loginAccountAction(account: IAccount) {
      //1.账号登录，获取token等信息
      const loginResult = await accountLoginRequest(account)
      this.token = loginResult.data.data.token
      this.userInfo = loginResult.data.data.userInfo
      this.menus = loginResult.data.data.menus

      //进行本地缓存
      localCache.setCache(LOGIN_TOKEN, this.token)
      localCache.setCache(USER_INFO, this.userInfo)
      localCache.setCache(MENUS, this.menus)

      //页面跳转
      router.push('/main')
    },

    // 检查是否有某个权限
    hasPermission(permission: string): boolean {
      return this.permissionsList.includes(permission)
    }
  }
})

export default useLoginStore

import { defineStore } from 'pinia'
import { accountLoginRequest } from '@/service/login/login.ts'
import type { IAccount } from '@/types'
import { localCache } from '@/utils/cache.ts'
import { LOGIN_TOKEN, MENUS, USERINFO } from '@/global/constants.ts'
import router from '@/router'
import type { ILoginState, IMenuVo } from './type.ts'
import type { RouteRecordRaw } from 'vue-router'
import { ElMessage } from 'element-plus'

// 布局类型常量定义
enum LayoutType {
  DEFAULT = 0, // 默认布局，包含ContentLeft和ContentRight
  FULLSCREEN = 1, // 全屏布局，仅包含GlobalHeader
  CUSTOM = 2 // 自定义布局
}

function loadView(viewPath: string) {
  return import(`/src/${viewPath}`).catch((error) => {
    console.error(`动态加载页面失败: ${viewPath}`, error)
    ElMessage.error('页面加载失败，已跳转404')
    router.push('/404')
    return Promise.reject(error)
  })
}

export const useLoginStore = defineStore('login', {
  state: (): ILoginState => ({
    token: localCache.getCache(LOGIN_TOKEN) ?? '',
    userInfo: localCache.getCache(USERINFO) ?? null,
    menus: localCache.getCache(MENUS) ?? []
  }),
  actions: {
    // 生成动态路由
    generateRoutes(menus: IMenuVo[]) {
      if (!menus || !Array.isArray(menus)) {
        ElMessage.error('菜单数据格式错误')
        return
      }

      const routes: RouteRecordRaw[] = []
      const fullscreenRoutes: RouteRecordRaw[] = [] // 存储全屏布局的路由

      // 处理菜单数据，生成路由配置
      const handleMenu = (menu: IMenuVo, parentMenu?: IMenuVo): RouteRecordRaw | null => {
        // 只处理目录和菜单类型的菜单项
        if (menu.menuType !== 'M' && menu.menuType !== 'C') {
          return null
        }

        // 检查必要的字段
        if (!menu.path || !menu.menuName || !menu.component) {
          ElMessage.error('菜单项缺少必要字段')
          return null
        }

        // 判断布局类型
        const isFullscreen = menu.layoutType === LayoutType.FULLSCREEN

        // 如果是全屏布局且有父菜单，不作为子路由处理
        if (isFullscreen && parentMenu) {
          return null
        }

        // 处理组件路径
        let componentPath = menu.component
        if (componentPath.startsWith('/')) {
          componentPath = componentPath.substring(1)
        }
        if (!componentPath.startsWith('views/')) {
          componentPath = `views/${componentPath}`
        }
        if (!componentPath.endsWith('.vue')) {
          componentPath = `${componentPath}.vue`
        }

        const pathRegex = /^[a-zA-Z0-9/_-]+\.vue$/
        if (!pathRegex.test(componentPath)) {
          ElMessage.error(`无效的组件路径：${componentPath}`)
          return null
        }

        // 处理路由路径，自动添加参数
        const routePath = menu.paramKey ? `${menu.path}/:${menu.paramKey}` : menu.path

        const route: RouteRecordRaw = {
          path: routePath,
          name: menu.menuName,
          component: () => loadView(componentPath),
          meta: {
            title: menu.menuName,
            icon: menu.icon,
            originalPath: menu.path,
            layoutType: menu.layoutType
          },
          children: []
        }

        // 处理子路由
        if (menu.children && Array.isArray(menu.children) && menu.children.length > 0) {
          const childrenRoutes = menu.children
            .map((child) => handleMenu(child, menu))
            .filter((route): route is RouteRecordRaw => route !== null)

          if (childrenRoutes.length > 0) {
            route.children = childrenRoutes

            // 处理特定路由的重定向（保留对某些特殊路由的处理）
            if (menu.path === '/article') {
              route.redirect = '/article/all'
            }
          }
        }

        return route
      }

      // 递归处理所有菜单，构建路由树
      const processMenus = (menuList: IMenuVo[]) => {
        for (const menu of menuList) {
          // 获取当前菜单的路由配置
          const route = handleMenu(menu)
          if (!route) continue

          // 根据布局类型决定路由去向
          if (menu.layoutType === LayoutType.FULLSCREEN) {
            // 全屏布局路由单独存储
            fullscreenRoutes.push(route)
          } else {
            // 普通路由添加到路由数组
            routes.push(route)
          }

          // 递归处理子菜单
          if (menu.children && menu.children.length > 0) {
            processMenus(menu.children)
          }
        }
      }

      // 开始处理菜单树
      processMenus(menus)

      // 添加所有普通路由
      for (const route of routes) {
        try {
          const existingRoute = router.hasRoute(route.name as string)
          if (!existingRoute) {
            router.addRoute('main', route)
          }
        } catch (error) {
          ElMessage.error(`添加路由失败：${route.path}`)
        }
      }

      // 添加全屏布局路由（直接挂载到main路由下）
      for (const route of fullscreenRoutes) {
        try {
          const existingRoute = router.hasRoute(route.name as string)
          if (!existingRoute) {
            router.addRoute('main', route)
          }
        } catch (error) {
          ElMessage.error(`添加全屏路由失败：${route.path}`)
        }
      }

      // 添加404路由（确保它是最后添加的）
      if (!router.hasRoute('NotFound')) {
        router.addRoute({
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          component: () => import('@/components/404/404.vue')
        })
      }
    },

    async loginAccountAction(account: IAccount) {
      try {
        // 1.账号登录，获取token等信息
        const loginResult = await accountLoginRequest(account)

        // 检查返回数据结构
        if (!loginResult?.data?.data) {
          ElMessage.error('登录返回数据格式错误')
          throw new Error('登录返回数据格式错误')
        }

        const { token, userInfo, menus } = loginResult.data.data

        if (!token) {
          ElMessage.error('登录失败：未获取到token')
          throw new Error('登录失败：未获取到token')
        }

        this.token = token
        this.userInfo = userInfo
        this.menus = menus || []

        // 进行本地缓存
        localCache.setCache(LOGIN_TOKEN, this.token)
        localCache.setCache(USERINFO, this.userInfo)
        localCache.setCache(MENUS, this.menus)

        // 生成动态路由
        this.generateRoutes(this.menus)

        // 页面跳转
        router.push('/main')
      } catch (error: any) {
        ElMessage.error(error.message || '登录失败')
        throw error
      }
    },

    async fetchUserInfo() {
      const cachedUserInfo = localCache.getCache(USERINFO)
      const cachedMenus = localCache.getCache(MENUS)
      if (!cachedUserInfo || !cachedMenus) {
        ElMessage.error('用户信息丢失，请重新登录')
        localCache.removeCache(LOGIN_TOKEN)
        localCache.removeCache(USERINFO)
        localCache.removeCache(MENUS)
        router.push('/login')
        throw new Error('用户信息丢失')
      }

      this.userInfo = cachedUserInfo
      this.menus = cachedMenus

      // 生成动态路由
      if (this.menus.length > 0) {
        this.generateRoutes(this.menus)
      }
    }
  }
})

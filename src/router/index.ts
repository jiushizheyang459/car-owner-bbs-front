// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { localCache } from '@/utils/cache.ts'
import { LOGIN_TOKEN, MENUS } from '@/global/constants.ts'
import { useLoginStore } from '@/store/login/login.ts'

// 创建路由器
const router = createRouter({
  // history: createWebHistory(import.meta.env.BASE_URL),
  history: createWebHashHistory(),
  // 映射关系：path => component
  routes: [
    {
      path: '/',
      redirect: '/main'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login/Login.vue')
    },
    {
      path: '/register',
      name: 'register',
      component: () => import('../views/login/Login.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: () => import('../views/main/main.vue'),
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'index',
          component: () => import('../views/index/index.vue')
        }
      ]
    }
    // 404路由将在动态添加其他路由后再添加
  ]
})

// 记录动态路由是否已加载
let dynamicRoutesAdded = false

// 全局前置导航守卫
router.beforeEach(async (to, from, next) => {
  // 1. 获取token
  const token = localCache.getCache(LOGIN_TOKEN)

  // 2. 判断是否需要登录访问
  const whiteList = ['/login', '/register']

  // 未登录情况处理
  if (!token) {
    if (whiteList.includes(to.path)) {
      return next()
    }
    return next('/login')
  }

  // 已登录情况下访问登录页，自动跳转到首页
  if (to.path === '/login') {
    return next('/main')
  }

  // 3. 获取用户信息，加载动态路由
  const loginStore = useLoginStore()

  if (!dynamicRoutesAdded || !loginStore.userInfo?.roleKey) {
    try {
      // 加载用户信息和生成动态路由
      await loginStore.fetchUserInfo()

      // 标记动态路由已添加
      dynamicRoutesAdded = true

      // 重新导航到目标页面
      return next({ ...to, replace: true })
    } catch (error) {
      // 异常情况清除登录状态
      localCache.removeCache(LOGIN_TOKEN)
      return next('/login')
    }
  }

  // 4. 正常导航
  next()
})

// 添加全局后置钩子确保404路由在最后添加
router.isReady().then(() => {
  // 确保在所有动态路由加载完成后，才添加404路由
  if (!router.hasRoute('NotFound')) {
    router.addRoute({
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/components/404/404.vue')
    })
  }
})

export default router

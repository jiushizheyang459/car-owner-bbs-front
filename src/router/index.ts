// import { createRouter, createWebHistory } from 'vue-router'
import { createRouter, createWebHashHistory } from 'vue-router'
import { localCache } from '@/utils/cache.ts'
import { LOGIN_TOKEN } from '@/global/constants.ts'

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
        },
        {
          path: '/article',
          name: 'article',
          component: () => import('../views/article/index.vue'),
          redirect: '/article/all',
          children: [
            {
              path: '/article/all',
              name: 'all',
              component: () => import('../views/article/all/index.vue')
            },
            {
              path: '/article/follow',
              name: 'follow',
              component: () => import('../views/article/follow/index.vue')
            }
          ]
        },
        // 将编辑器路由移到这里，作为顶级路由
        {
          path: '/article/editor',
          name: 'editor',
          component: () => import('@/views/article/editor/layout.vue')
        },
        {
          path: '/article/draft',
          name: 'draft',
          component: () => import('@/views/article/draft/layout.vue')
        },
        {
          path: '/article/detail/:id',
          name: 'detail',
          component: () => import('../views/article/detail/index.vue')
        },
        {
          path: '/knowledge',
          name: 'knowledge',
          component: () => import('../views/knowledge/index.vue')
        },
        {
          path: '/information',
          name: 'information',
          component: () => import('../views/information/index.vue')
        },
        {
          path: '/event',
          name: 'event',
          component: () => import('../views/event/index.vue')
        },
        {
          path: '/friendly',
          name: 'friendly',
          component: () => import('../views/friendly/index.vue')
        }
        /*
        {
          path: '/main/trading',
          name: 'trading',
          component: () => import('../views/trading/info.vue')
        },
        {
          path: '/main/event',
          name: 'event',
          component: () => import('../views/event/info.vue')
        },
        */
      ]
    }
  ]
})

//导航守卫
router.beforeEach((to, from) => {
  const token = localCache.getCache(LOGIN_TOKEN)
  if (to.path === '/main' && !token) {
    return '/login'
  }
})

export default router

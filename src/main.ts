import './assets/css/index.less'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import App from './App.vue'
import router from './router'
import pinia from './store'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'
import { useLoginStore } from './store/login/login'
import { setupPermission } from './utils/permission'

const app = createApp(App)

// 注册ElementPlus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 注册全局权限指令
setupPermission(app)

app.use(ElementPlus)
app.use(pinia)
app.use(router)

// 初始化应用
const initApp = async () => {
  const loginStore = useLoginStore()
  try {
    // 仅在有token时初始化用户信息
    if (loginStore.token) {
      await loginStore.fetchUserInfo()
    }
  } catch (error) {
    console.error('应用初始化失败:', error)
  }
}

// 等待路由准备就绪后挂载应用
router.isReady().then(async () => {
  await initApp()
  app.mount('#app')
})

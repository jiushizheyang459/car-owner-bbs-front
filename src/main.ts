import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'normalize.css'
import './assets/css/index.less'
import '@/styles/element/index.css' // 更新为 .css 文件

import App from './App.vue'
import router from './router'
import registerIcons from '@/global/register-icons.ts'
import { setupDirectives } from '@/directives'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(registerIcons)
app.use(ElementPlus)
setupDirectives(app)

app.mount('#app')

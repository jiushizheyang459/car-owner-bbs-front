import { createApp } from 'vue'
import 'normalize.css'
import './assets/css/index.less'

import App from './App.vue'
import router from './router'
import registerIcons from '@/global/register-icons.ts'
import pinia from '@/store'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(registerIcons)

app.mount('#app')

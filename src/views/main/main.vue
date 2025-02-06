<template>
  <div class="main">
    <nav>
      <BasicLayout />
    </nav>
    <!--    <button @click="handleExitClick">退出登录</button>-->
  </div>
</template>

<script setup lang="ts">
import { localCache } from '@/utils/cache.ts'
import { LOGIN_TOKEN } from '@/global/constants.ts'
import { useRouter } from 'vue-router'
import { accountLogoutRequest } from '@/service/logout/logout.ts'
import BasicLayout from '@/layouts/BasicLayout.vue'

const router = useRouter()
function handleExitClick() {
  //向服务器发送退出登录的请求
  accountLogoutRequest()
    .then(() => {
      //删除本地token
      localCache.removeCache(LOGIN_TOKEN)
    })
    .catch((err) => {
      console.error('Logout failed:', err)
    })
  //跳回到login页面
  router.push('/login')
}
</script>

<style scoped></style>

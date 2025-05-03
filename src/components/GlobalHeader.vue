<template>
  <el-row :gutter="20" type="flex" justify="space-between" align="middle" class="no-wrap">
    <el-col style="flex: 0 0 250px">
      <div class="title-bar">
        <img class="logo" src="../assets/img/logo.png" alt="logo" />
        <!-- <div class="title">用户中心</div> -->
      </div>
    </el-col>
    <el-col style="flex: 1">
      <div class="menu">
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
          <el-menu-item v-for="item in filteredMenuItems" :key="item.path" :index="item.path">
            {{ item.label }}
          </el-menu-item>
        </el-menu>
      </div>
    </el-col>
    <el-col style="flex: 0 0 80px">
      <div class="user-login-status">
        <!--        <el-button type="primary" href="/login">登录</el-button>-->
        <HeaderInfo />
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeaderInfo from '@/components/HeaderInfo.vue'
import useLoginStore from '@/store/login/login'

const router = useRouter()
const route = useRoute()
const loginStore = useLoginStore()

// 根据当前路由路径设置激活项
const activeIndex = computed(() => route.path)

// 过滤菜单项，只显示有权限的项
const filteredMenuItems = computed(() => {
  return menuItems.filter((item) => {
    if (item.permission) {
      return loginStore.hasPermission(item.permission)
    }
    return true // 对于没有权限要求的项，直接显示
  })
})

const menuItems = [
  { path: '/index', label: '首页' },
  { path: '/article', label: '文章' },
  { path: '/information', label: '资讯' },
  { path: '/knowledge', label: '知识' },
  { path: '/event', label: '活动' },
  { path: '/friendly', label: '友情链接' },
  { path: '/advertisement', label: '广告', permission: 'content:advertisement:list' },
  { path: '/announcement', label: '公告', permission: 'content:announcement:list' }
]

// 处理菜单选择事件
const handleSelect = (path: string) => {
  router.push(path)
}
</script>

<style lang="less" scoped>
.no-wrap {
  flex-wrap: nowrap;
  /* 防止换行 */
}

.title-bar {
  display: flex;
  align-items: center;
  white-space: nowrap;
}

.logo {
  height: 48px;
}

.title {
  margin-left: 16px;
  font-size: 18px;
  color: black;
}

.user-login-status {
  text-align: right;
}

.el-menu--horizontal.el-menu {
  border-bottom: none;
}
</style>

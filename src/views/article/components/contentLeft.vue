<template>
  <div class="content-left">
    <div class="card">
      <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        router
      >
        <el-menu-item v-for="item in lists" :key="item.path" :index="item.path">
          <span>{{ item.label }}</span>
        </el-menu-item>
      </el-menu>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const activeIndex = computed(() => route.path)

const lists = [
  { path: '/article/all', label: '全部' },
  { path: '/article/follow', label: '关注' }
]

const handleSelect = (path: string) => {
  router.push(path)
}
</script>

<style scoped lang="less">
.content-left {
  width: 700px;
  flex-shrink: 0;
  margin-right: 10px;
}

.card {
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 5px #ddd;
  margin-bottom: 10px;
  box-sizing: border-box;
  overflow: hidden;
}
</style>

<template>
  <div id="basicLayout">
    <el-container>
      <el-header class="header">
        <GlobalHeader />
      </el-header>
      <el-main class="content">
        <router-view />
      </el-main>
      <el-footer :class="{ 'footer-show': isFooterVisible }" class="footer">
        <a href="https://github.com/jiushizheyang459?tab=repositories" target="_blank">BHU｜By Leeway｜联系方式</a>
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isFooterVisible = ref(false)

// Scroll event handler
const handleScroll = () => {
  const scrollHeight = document.documentElement.scrollHeight
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
  const clientHeight = document.documentElement.clientHeight

  // Only show footer when scroll reaches the bottom of the page
  if (scrollHeight - scrollTop <= clientHeight) {
    isFooterVisible.value = true
  } else {
    isFooterVisible.value = false
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style lang="less" scoped>
#basicLayout {
  .footer {
    background: #efefef;
    text-align: center;
    position: fixed;
    bottom: -80px; /* Initially hide the footer off-screen */
    left: 0;
    right: 0;
    padding: 16px;
    transition: all 0.5s ease; /* Smooth transition */
    opacity: 0; /* Initially hidden */
  }

  .footer-show {
    bottom: 0; /* Show footer at the bottom of the screen */
    opacity: 1; /* Make the footer fully visible */
  }

  .content {
    padding: 20px;
    margin-bottom: 20px;
    background: #f9f9f9;
  }

  .header {
    background: white;
    margin-bottom: 10px;
    color: unset;
  }
}
</style>

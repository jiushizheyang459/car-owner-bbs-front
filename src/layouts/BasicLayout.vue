<template>
  <div id="basicLayout">
    <el-container>
      <el-header class="header">
        <GlobalHeader />
      </el-header>
      <el-main class="content">
        <router-view />
      </el-main>
      <el-footer class="footer">
        <a href="https://github.com/jiushizheyang459?tab=repositories" target="_blank"
          >by leeway｜关于作者｜联系方式</a
        >
      </el-footer>
    </el-container>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="less" scoped>
#basicLayout {
  .footer {
    background: #efefef;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 16px;
  }

  .content {
    padding: 20px;
    margin-bottom: 20px;
    //background: linear-gradient(to right, #fefefe, #fff);
    background: #f9f9f9;
  }

  .header {
    background: white;
    margin-bottom: 10px;
    color: unset;
  }
}
</style>

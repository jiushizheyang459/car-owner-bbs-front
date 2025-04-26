<template>
  <div class="content">
    <DraftIndex />
    <el-backtop :right="100" :bottom="100" />
  </div>
</template>

<script setup lang="ts">
import DraftIndex from './index.vue'
</script>

<style scoped lang="less">
.content {
  width: 1000px;
  margin: 0 auto;
  padding: 20px 0;
}
</style>

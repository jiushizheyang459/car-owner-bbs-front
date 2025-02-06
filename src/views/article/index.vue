<template>
  <div class="content">
    <ContentLeft />
    <ContentRight />
  </div>
</template>

<script setup lang="ts">
import ContentLeft from '@/views/article/components/contentLeft.vue'
import ContentRight from '@/views/article/components/contentRight.vue'
</script>

<style scoped lang="less">
.content {
  display: flex;
  width: 1000px;
  margin: 0 auto;
}
</style>

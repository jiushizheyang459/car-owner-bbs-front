<template>
  <div class="content">
    <ContentTop />
    <ContentBody />
    <ContentFooter />
  </div>
</template>

<script setup lang="ts">
import ContentTop from '@/views/index/components/ContentTop.vue'
import ContentBody from '@/views/index/components/ContentBody.vue'
import ContentFooter from '@/views/index/components/ContentFooter.vue'
</script>

<style scoped lang="less">
.content {
  display: flex;
  width: 1000px;
  margin: 0 auto;
}
</style>

<template>
  <div class="content">
    <ContentTop />
    <ContentBody />
    <ContentFooter />
  </div>
</template>

<script setup lang="ts">
import ContentTop from '@/views/index/components/contentTop.vue'
import ContentBody from '@/views/index/components/contentBody.vue'
import ContentFooter from '@/views/index/components/contentFooter.vue'
</script>

<style scoped lang="less">
.content {
  display: flex;
  flex-direction: column;
  width: 1000px;
  margin: 0 auto;
}
</style>

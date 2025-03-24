<template>
  <div id="content-body">
    <LatestNews />
    <Article />
    <Event />
  </div>
</template>

<script setup lang="ts">
import Article from './article.vue'
import LatestNews from './latestNews.vue'
import Event from '@/views/index/components/event.vue'
</script>

<style scoped lang="less">
#content-body {
}
</style>

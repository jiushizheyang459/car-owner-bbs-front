<template>
  <div class="article-container">
    <h1 class="article-title">{{ articleDetail?.title }}</h1>
    <div class="article-meta">
      <span>作者: {{ articleDetail?.createBy }}</span>
      <span>发布时间: {{ articleDetail?.createTime }}</span>
      <span>浏览量: {{ articleDetail?.viewCount }}</span>
    </div>
    <div class="article-content prose" v-html="articleDetail?.content"></div>

    <!-- 评论组件 -->
    <Comment :article-id="Number(route.params.id)" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import useArticleStore from '@/store/article/article'
import { storeToRefs } from 'pinia'
import Comment from '../components/Comment.vue'

const route = useRoute()
const articleStore = useArticleStore()
const { articleDetail } = storeToRefs(articleStore)

onMounted(async () => {
  const articleId = Number(route.params.id)
  await articleStore.getArticleDetailAction(articleId)
})
</script>

<style scoped lang="less">
.article-container {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 5px #ddd;
  padding: 20px;
  width: 1000px;
  margin: 20px auto;
}

.article-title {
  font-size: 32px;
  margin-bottom: 20px;
}

.article-meta {
  color: #666;
  margin-bottom: 30px;

  span {
    margin-right: 20px;
  }
}

.article-content {
  :deep(.quote-block) {
    border-left: 4px solid #409eff;
    margin: 1em 0;
    padding: 0.5em 1em;
    background-color: rgba(64, 158, 255, 0.1);
    border-radius: 4px;

    p {
      margin: 0;
      color: #666;
      font-style: italic;
    }
  }

  :deep(.editor-link) {
    color: #409eff;
    text-decoration: none;
    cursor: pointer;
    padding: 0 2px;
    border-radius: 2px;
    background-color: rgba(64, 158, 255, 0.1);
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(64, 158, 255, 0.2);
      text-decoration: underline;
    }
  }

  :deep(hr) {
    border: none;
    border-top: 2px solid #eee;
    margin: 2em 0;
  }

  :deep(h1) {
    font-size: 2em;
    margin: 1em 0 0.5em;
  }

  :deep(h2) {
    font-size: 1.5em;
    margin: 1em 0 0.5em;
  }

  :deep(h3) {
    font-size: 1.17em;
    margin: 1em 0 0.5em;
  }

  :deep(em) {
    font-style: italic;
  }
}
</style>

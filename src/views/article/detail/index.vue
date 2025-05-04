<template>
  <div class="article-container">
    <h1 class="article-title">{{ articleDetail?.title }}</h1>
    <div class="article-meta">
      <span>作者: {{ articleDetail?.createBy }}</span>
      <span>发布时间: {{ articleDetail?.createTime }}</span>
      <span>浏览量: {{ articleDetail?.viewCount }}</span>
      <span class="save-action" @click="toggleSave">
        <img :src="articleDetail?.saveFlag ? 'src/assets/icon/save-fill.svg' : 'src/assets/icon/save.svg'"
          class="action-icon" />
      </span>
    </div>
    <div class="article-content prose" v-html="articleDetail?.content"></div>

    <!-- 只保留点赞功能，放在中央 -->
    <div class="article-actions">
      <div class="like-container">
        <div class="like-button" @click="toggleLike">
          <img :src="articleDetail?.likeFlag ? 'src/assets/icon/like-fill.svg' : 'src/assets/icon/like.svg'"
            class="action-icon large-icon" />
          <span :class="articleDetail?.likeFlag ? 'likeNum' : ''">{{ articleDetail?.likeCount }}</span>
        </div>
      </div>
    </div>

    <!-- 评论组件 -->
    <Comment :article-id="Number(route.params.id)" />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useArticleStore from '@/store/article/article'
import useLikeStore from '@/store/like/like'
import useSaveStore from '@/store/save/save'
import { storeToRefs } from 'pinia'
import Comment from '../components/Comment.vue'
import { ElMessage } from 'element-plus'
import { localCache } from '@/utils/cache'
import { LOGIN_TOKEN } from '@/global/constants'

const route = useRoute()
const router = useRouter()
const articleStore = useArticleStore()
const likeStore = useLikeStore()
const saveStore = useSaveStore()

const { articleDetail } = storeToRefs(articleStore)

onMounted(async () => {
  const articleId = Number(route.params.id)
  try {
    // 获取文章详情
    await articleStore.getArticleDetailAction(articleId)
    // 只有在成功获取文章详情后，才更新浏览量
    await articleStore.updateArticleViewCountAction(articleId)
  } catch (error) {
    // 使用ElMessage向用户展示错误信息
    ElMessage.error('获取文章详情失败，请稍后再试')
  }
})

// 点赞功能
const toggleLike = async () => {
  const token = localCache.getCache(LOGIN_TOKEN)
  if (!token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  if (!articleDetail.value) return

  const articleId = Number(route.params.id)
  await likeStore.toggleLikeAction(articleId)

  // 更新文章详情中的点赞状态和数量
  if (articleDetail.value) {
    articleDetail.value.likeFlag = !articleDetail.value.likeFlag
    articleDetail.value.likeCount = articleDetail.value.likeFlag
      ? articleDetail.value.likeCount + 1
      : articleDetail.value.likeCount - 1
  }
}

// 收藏功能
const toggleSave = async () => {
  const token = localCache.getCache(LOGIN_TOKEN)
  if (!token) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }

  if (!articleDetail.value) return

  const articleId = Number(route.params.id)
  if (articleDetail.value.saveFlag) {
    // 如果已经收藏，则取消收藏
    const success = await saveStore.deleteSaveAction(articleId)
    if (success && articleDetail.value) {
      articleDetail.value.saveFlag = false
    }
  } else {
    // 如果未收藏，则添加收藏
    const success = await saveStore.addSaveAction(articleId)
    if (success && articleDetail.value) {
      articleDetail.value.saveFlag = true
    }
  }
}
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
  display: flex;
  align-items: center;

  span {
    margin-right: 20px;
  }

  .save-action {
    margin-left: auto;
    cursor: pointer;

    img {
      height: 20px;
      transition:
        transform 0.3s ease,
        opacity 0.3s ease;
    }

    &:hover img {
      transform: scale(1.1);
      opacity: 0.7;
    }
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

/* 修改点赞和收藏样式 */
.article-actions {
  display: flex;
  justify-content: center;
  padding: 20px 0;
  margin-top: 20px;
  border-top: 1px solid #eee;
}

.like-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.like-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 8px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: rgba(18, 150, 219, 0.1);
  }

  .large-icon {
    height: 40px;
    margin-bottom: 5px;
  }

  .likeNum {
    color: #1296db;
    font-weight: bold;
  }
}

/* 为图片添加动态效果 */
.action-icon {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

/* 鼠标悬停时进行缩放 */
.like-button:hover .action-icon {
  transform: scale(1.1);
  /* 图片放大 */
  opacity: 0.7;
  /* 图片透明度变化 */
}
</style>

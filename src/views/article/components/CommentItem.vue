<template>
  <div class="comment-item" :id="`comment-${comment.id}`">
    <div class="comment-header">
      <div class="comment-author">
        <el-avatar :size="32" :src="comment.avatar || defaultAvatar" />
        <span class="author-name">
          {{ comment.createBy }}
          <span v-if="isAuthor" class="author-tag">作者</span>
        </span>
      </div>
      <span class="comment-time">{{ comment.createTime }}</span>
    </div>
    <div class="comment-content">
      <template v-if="comment.toCommentUserId !== -1">
        回复 <span class="reply-to">@{{ comment.toCommentUserName }}</span>：
      </template>
      {{ comment.content }}
    </div>
    <div class="comment-footer">
      <el-button type="text" @click="$emit('reply', comment, parentComment)">回复</el-button>
    </div>

    <!-- 递归显示子回复 -->
    <div v-if="comment.children && comment.children.length > 0" class="reply-list">
      <CommentItem v-for="child in comment.children" :key="child.id" :comment="child" :parent-comment="comment"
        :article-id="articleId" :article-author="articleAuthor" @reply="$emit('reply', $event, comment)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue'
import type { IComment } from '@/store/comment/type'

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const props = defineProps<{
  comment: IComment
  parentComment?: IComment
  articleId: number
  articleAuthor?: string
}>()

// 判断评论者是否是文章作者
const isAuthor = computed(() => {
  return props.articleAuthor && props.comment.createBy === props.articleAuthor
})

defineEmits<{
  (e: 'reply', comment: IComment, parentComment?: IComment): void
}>()
</script>

<style scoped lang="less">
.comment-item {
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  &.highlight-comment {
    animation: highlight 3s ease;
  }
}

@keyframes highlight {
  0% {
    background-color: rgba(64, 158, 255, 0.1);
  }

  100% {
    background-color: transparent;
  }
}

.comment-header {
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .comment-author {
    display: flex;
    align-items: center;
    gap: 8px;

    .author-name {
      font-weight: bold;

      .author-tag {
        font-size: 12px;
        color: #fff;
        background-color: #409eff;
        padding: 2px 6px;
        border-radius: 4px;
        margin-left: 5px;
        font-weight: normal;
      }
    }
  }

  .comment-time {
    color: #999;
    font-size: 14px;
  }
}

.comment-content {
  margin-bottom: 5px;
  line-height: 1.6;

  .reply-to {
    color: #409eff;
    font-weight: bold;
  }
}

.comment-footer {
  margin-top: 5px;
}

.reply-list {
  margin-left: 40px;
  margin-top: 10px;
  padding-left: 20px;
  border-left: 2px solid #eee;
}
</style>

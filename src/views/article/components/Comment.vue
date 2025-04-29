<template>
  <div class="comment-section">
    <h3 class="comment-title">评论 ({{ total }})</h3>

    <!-- 评论输入框 -->
    <div class="comment-input">
      <el-input v-model="commentContent" type="textarea" :rows="3" placeholder="写下你的评论..." />
      <div class="comment-actions">
        <el-button type="primary" @click="handleSubmitComment">发表评论</el-button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div class="comment-list">
      <div v-for="comment in commentList" :key="comment.id" class="comment-item">
        <div class="comment-header">
          <div class="comment-author">
            <el-avatar :size="32" :src="comment.avatar || defaultAvatar" />
            <span class="author-name">
              {{ comment.createBy }}
              <span v-if="isAuthor(comment.createBy)" class="author-tag">作者</span>
            </span>
          </div>
          <span class="comment-time">{{ comment.createTime }}</span>
        </div>
        <div class="comment-content">{{ comment.content }}</div>
        <div class="comment-footer">
          <el-button type="text" @click="handleReply(comment)">回复</el-button>
        </div>

        <!-- 递归显示回复 -->
        <div v-if="comment.children && comment.children.length > 0" class="reply-list">
          <CommentItem
            v-for="reply in comment.children"
            :key="reply.id"
            :comment="reply"
            :parent-comment="comment"
            :article-id="articleId"
            :article-author="articleAuthor"
            @reply="handleReply"
          />
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div class="pagination">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20]"
        layout="total, sizes, prev, pager, next"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 回复对话框 -->
    <el-dialog v-model="replyDialogVisible" title="回复评论" width="500px">
      <el-input v-model="replyContent" type="textarea" :rows="3" placeholder="写下你的回复..." />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="replyDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmitReply">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import useCommentStore from '@/store/comment/comment'
import { storeToRefs } from 'pinia'
import { useLoginStore } from '@/store/login/login'
import useArticleStore from '@/store/article/article'
import CommentItem from './CommentItem.vue'

// 默认头像
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

const props = defineProps<{
  articleId: number
}>()

const commentStore = useCommentStore()
const loginStore = useLoginStore()
const articleStore = useArticleStore()
const { commentList, total } = storeToRefs(commentStore)
const { articleDetail } = storeToRefs(articleStore)

// 获取文章作者
const articleAuthor = computed(() => {
  return articleDetail.value?.createBy || ''
})

// 判断是否是文章作者
const isAuthor = (username: string) => {
  return username === articleAuthor.value
}

const currentPage = ref(1)
const pageSize = ref(10)
const commentContent = ref('')
const replyDialogVisible = ref(false)
const replyContent = ref('')
const currentReplyTo = ref<any>(null)

// 获取评论列表
const fetchComments = async () => {
  await commentStore.getCommentListAction(props.articleId, currentPage.value, pageSize.value)
}

// 提交评论
const handleSubmitComment = async () => {
  if (!commentContent.value.trim()) {
    return
  }

  const commentData = {
    type: 0,
    articleId: props.articleId,
    rootId: -1,
    content: commentContent.value,
    toCommentUserId: -1,
    toCommentId: -1
  }

  await commentStore.addCommentAction(commentData)
  commentContent.value = ''
}

// 处理回复
const handleReply = (comment: any, parentComment?: any) => {
  if (!loginStore.userInfo) {
    return
  }

  currentReplyTo.value = {
    comment,
    parentComment
  }
  replyDialogVisible.value = true
}

// 提交回复
const handleSubmitReply = async () => {
  if (!replyContent.value.trim() || !currentReplyTo.value) {
    return
  }

  const { comment, parentComment } = currentReplyTo.value

  // 确定根评论ID
  const rootId = parentComment ? parentComment.rootId : comment.id

  // 确定回复目标
  const toCommentUserId = comment.createById
  const toCommentId = comment.id

  const commentData = {
    type: 0,
    articleId: props.articleId,
    rootId: rootId,
    content: replyContent.value,
    toCommentUserId: toCommentUserId,
    toCommentId: toCommentId
  }

  await commentStore.addCommentAction(commentData)
  replyDialogVisible.value = false
  replyContent.value = ''
  currentReplyTo.value = null
}

// 分页处理
const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchComments()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchComments()
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped lang="less">
.comment-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.comment-title {
  font-size: 20px;
  margin-bottom: 20px;
}

.comment-input {
  margin-bottom: 30px;

  .comment-actions {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}

.comment-list {
  .comment-item {
    margin-bottom: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
    }
  }

  .comment-header {
    margin-bottom: 10px;
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
    margin-bottom: 10px;
    line-height: 1.6;
  }

  .comment-footer {
    margin-top: 10px;
  }
}

.reply-list {
  margin-left: 40px;
  margin-top: 10px;
  padding-left: 20px;
  border-left: 2px solid #eee;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>

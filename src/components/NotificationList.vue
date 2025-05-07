<template>
  <el-dialog
    v-model="visible"
    title="通知消息"
    width="500px"
    :close-on-click-modal="false"
    @close="handleClose"
    :append-to-body="true"
  >
    <div class="notification-list">
      <el-empty v-if="!notificationStore.notificationList?.length" description="暂无通知" />
      <div v-else class="notification-items">
        <div
          v-for="notification in notificationStore.notificationList"
          :key="notification.id"
          class="notification-item"
          :class="{ unread: notification.isRead === 0 }"
          @click="handleNotificationClick(notification)"
        >
          <div class="notification-header">
            <el-avatar :size="30" :src="notification.senderAvatar" />
            <span class="sender-name">{{ notification.senderName }}</span>
          </div>
          <div class="content">{{ notification.content }}</div>
          <div class="article-title">{{ notification.articleTitle }}</div>
          <div class="time">{{ formatTime(notification.createTime) }}</div>
        </div>
      </div>
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          :total="notificationStore.notificationTotalCount"
          layout="total, sizes, prev, pager, next"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleMarkAllAsRead" v-if="hasUnreadNotifications">全部标为已读</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { formatTime } from '@/utils/format-time'
import router from '@/router'
import useNotificationStore from '@/store/notification/notification'
import type { INotification } from '@/store/notification/type'

const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const visible = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const notificationStore = useNotificationStore()
const currentPage = ref(1)
const pageSize = ref(10)

// 计算是否有未读通知
const hasUnreadNotifications = computed(() => {
  return notificationStore.notificationList?.some((notification) => notification.isRead === 0) ?? false
})

// 加载通知列表
const loadNotifications = async () => {
  try {
    await notificationStore.getNotificationListAction(currentPage.value, pageSize.value)
  } catch (error) {
    console.error('加载通知列表失败:', error)
  }
}

// 处理通知点击
const handleNotificationClick = async (notification: INotification) => {
  // 根据通知类型跳转到不同页面
  switch (notification.type) {
    case 1: // 文章评论
      router.push(`/article/detail/${notification.articleId}`)
      break
    case 2: // 评论回复
      router.push(`/article/detail/${notification.articleId}`)
      // 使用nextTick确保页面加载完成后再滚动
      setTimeout(() => {
        const commentElement = document.getElementById(`comment-${notification.commentId}`)
        if (commentElement) {
          commentElement.scrollIntoView({ behavior: 'smooth' })
          // 添加高亮效果
          commentElement.classList.add('highlight-comment')
          // 3秒后移除高亮效果
          setTimeout(() => {
            commentElement.classList.remove('highlight-comment')
          }, 3000)
        }
      }, 500)
      break
  }

  // 标记为已读
  if (notification.isRead === 0) {
    try {
      await notificationStore.markAsReadAction([notification.id])
    } catch (error) {
      ElMessage.error('标记已读失败')
    }
  }

  // 关闭对话框
  visible.value = false
}

// 处理分页大小变化
const handleSizeChange = (val: number) => {
  pageSize.value = val
  loadNotifications()
}

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val
  loadNotifications()
}

// 处理全部标为已读
const handleMarkAllAsRead = async () => {
  try {
    await notificationStore.markAllAsReadAction()
    ElMessage.success('全部标为已读成功')
  } catch (error) {
    ElMessage.error('标记已读失败')
  }
}

// 关闭对话框
const handleClose = () => {
  visible.value = false
  emit('update:modelValue', false)
}

// 监听对话框显示状态
watch(
  () => visible.value,
  (newVal) => {
    if (newVal) {
      loadNotifications()
    }
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.notification-list {
  max-height: 400px;
  overflow-y: auto;
}

.notification-items {
  .notification-item {
    padding: 12px;
    border-bottom: 1px solid #eee;
    cursor: pointer;

    &:hover {
      background-color: #f5f7fa;
    }

    &.unread {
      background-color: #f0f9ff;
    }

    .notification-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;

      .sender-name {
        font-weight: bold;
        margin-left: 8px;
      }
    }

    .content {
      font-size: 14px;
      color: #333;
      margin-bottom: 4px;
    }

    .article-title {
      font-size: 13px;
      color: #666;
      margin-bottom: 4px;
    }

    .time {
      font-size: 12px;
      color: #999;
    }
  }
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

:deep(.notification-dialog) {
  position: fixed;
  top: 60px;
  left: 20px;
  margin: 0;

  .el-dialog__header {
    padding: 10px 20px;
    margin: 0;
    border-bottom: 1px solid #eee;
  }

  .el-dialog__body {
    padding: 0;
  }
}
</style>

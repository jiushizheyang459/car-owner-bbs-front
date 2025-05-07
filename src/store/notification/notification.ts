import { defineStore } from 'pinia'
import { getNotificationList, getUnreadCount, markAsRead, markAllAsRead } from '@/service/notification/notification'
import type { INotificationState, INotification } from './type'
import { ElMessage } from 'element-plus'

const useNotificationStore = defineStore('notification', {
  state: (): INotificationState => ({
    notificationList: [],
    notificationTotalCount: 0,
    unreadCount: 0
  }),
  actions: {
    async getNotificationListAction(pageNum: number, pageSize: number) {
      try {
        const notificationListResult = await getNotificationList(pageNum, pageSize)
        if (notificationListResult.data.code === 200) {
          const { total, rows } = notificationListResult.data.data
          this.notificationList = rows
          this.notificationTotalCount = total
          return true
        } else {
          ElMessage.error(notificationListResult.data.msg || '获取通知列表失败')
          return false
        }
      } catch (error) {
        ElMessage.error('获取通知列表失败')
        console.error('获取通知列表失败:', error)
        return false
      }
    },

    async getUnreadCountAction() {
      try {
        const unreadCountResult = await getUnreadCount()
        if (unreadCountResult.data.code === 200) {
          this.unreadCount = unreadCountResult.data.data
          return true
        } else {
          ElMessage.error(unreadCountResult.data.msg || '获取未读通知数量失败')
          return false
        }
      } catch (error) {
        console.error('获取未读通知数量失败:', error)
        return false
      }
    },

    async markAsReadAction(ids: number[]) {
      try {
        const markAsReadResult = await markAsRead(ids)
        if (markAsReadResult.data.code === 200) {
          // 更新通知列表中的已读状态
          this.notificationList = this.notificationList.map((notification) => {
            if (ids.includes(notification.id)) {
              return { ...notification, isRead: 1 }
            }
            return notification
          })

          // 更新未读数量
          await this.getUnreadCountAction()
          return true
        } else {
          ElMessage.error(markAsReadResult.data.msg || '标记已读失败')
          return false
        }
      } catch (error) {
        ElMessage.error('标记已读失败')
        console.error('标记已读失败:', error)
        return false
      }
    },

    async markAllAsReadAction() {
      try {
        const markAllAsReadResult = await markAllAsRead()
        if (markAllAsReadResult.data.code === 200) {
          // 更新通知列表中的所有通知为已读
          this.notificationList = this.notificationList.map((notification) => {
            return { ...notification, isRead: 1 }
          })

          // 更新未读数量为0
          this.unreadCount = 0
          return true
        } else {
          ElMessage.error(markAllAsReadResult.data.msg || '标记全部已读失败')
          return false
        }
      } catch (error) {
        ElMessage.error('标记全部已读失败')
        console.error('标记全部已读失败:', error)
        return false
      }
    },

    // 直接更新未读数量，用于WebSocket接收到新通知时
    updateUnreadCount(count: number) {
      this.unreadCount = count
    }
  }
})

export default useNotificationStore

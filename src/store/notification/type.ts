export interface INotification {
  id: number
  senderName: string
  senderAvatar: string
  type: number
  articleId: number
  articleTitle: string
  commentId: number
  replyId: number
  content: string
  isRead: number
  createTime: string
}

export interface INotificationState {
  notificationList: INotification[]
  notificationTotalCount: number
  unreadCount: number
}

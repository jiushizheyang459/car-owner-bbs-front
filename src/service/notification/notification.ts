import hyRequest from '@/service'

export function getNotificationList(pageNum: number, pageSize: number) {
  return hyRequest.get({
    url: '/notification/notificationList',
    params: {
      pageNum,
      pageSize
    }
  })
}

export function getUnreadCount() {
  return hyRequest.get({
    url: '/notification/unread/count'
  })
}

export function markAsRead(ids: number[]) {
  return hyRequest.put({
    url: '/notification/read',
    data: ids
  })
}

export function markAllAsRead() {
  return hyRequest.put({
    url: '/notification/read/all'
  })
}

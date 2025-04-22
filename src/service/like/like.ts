import hyRequest from '@/service'

// 切换文章点赞状态
export function toggleLike(articleId: number, userId: number) {
  return hyRequest.post({
    url: `/like/${articleId}`,
    params: { userId }
  })
}

// 获取文章点赞状态
export function getLikeStatus(articleId: number, userId: number) {
  return hyRequest.get({
    url: `/like/status/${articleId}`,
    params: { userId }
  })
}

// 获取文章点赞数
export function getLikeCount(articleId: number) {
  return hyRequest.get({
    url: `/like/count/${articleId}`
  })
}

import hyRequest from '@/service'

// 获取评论列表
export function getCommentList(articleId: number, pageNum: number, size: number) {
  return hyRequest.get({
    url: `/comment/commentList`,
    params: {
      articleId,
      pageNum,
      size
    }
  })
}

// 添加评论
export function addComment(data: any) {
  return hyRequest.post({
    url: `/comment`,
    data
  })
}

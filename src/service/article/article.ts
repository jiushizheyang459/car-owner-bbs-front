import hyRequest from '@/service'

export function getAllArticleList(queryInfo: any) {
  const params = new URLSearchParams(queryInfo).toString()
  return hyRequest.get({
    url: `/article/articleList?${params}`
  })
}

export function getFollowingArticleList(queryInfo: any) {
  const params = new URLSearchParams(queryInfo).toString()
  return hyRequest.get({
    url: `/article/follow?${params}`
  })
}

export function getArticleDetail(id: number) {
  return hyRequest.get({
    url: `/article/${id}`
  })
}

export function updateArticleViewCount(id: number) {
  return hyRequest.put({
    url: `/article/updateViewCount/${id}`
  })
}

export function getHotArticleList() {
  return hyRequest.get({
    url: `/article/hotArticleList`
  })
}

export function getNewArticleList() {
  return hyRequest.get({
    url: `/article/newArticleList`
  })
}

import hyRequest from '@/service'

export function getAllArticleList(queryInfo: any) {
  const params = new URLSearchParams(queryInfo).toString()
  return hyRequest.get({
    url: `/article/articleList?${params}`
  })
}

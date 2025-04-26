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

export function getDraftArticleList(queryInfo: any) {
  const params = new URLSearchParams(queryInfo).toString()
  return hyRequest.get({
    url: `/article/draftArticleList?${params}`
  })
}

export function addArticle(articleData: any) {
  return hyRequest.post({
    url: `/article`,
    data: articleData
  })
}

export function addDraftArticle(articleData: any) {
  return hyRequest.post({
    url: `/article/addDraftArticle`,
    data: articleData
  })
}

export function updateArticle(articleData: any) {
  return hyRequest.put({
    url: `/article`,
    data: articleData
  })
}

export function deleteArticle(ids: number[]) {
  return hyRequest.delete({
    url: `/article`,
    params: { ids }
  })
}

// 上传图片
export function uploadImage(imgFile: File) {
  const formData = new FormData()
  formData.append('imgFile', imgFile)
  return hyRequest.post({
    url: `/article/upload`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

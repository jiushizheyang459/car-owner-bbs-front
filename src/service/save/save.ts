import hyRequest from '@/service'

// 获取收藏列表
export function getSaveList(pageNum: number, size: number) {
  return hyRequest.get({
    url: '/save/saveList',
    params: {
      pageNum,
      size
    }
  })
}

// 添加收藏
export function addSave(articleId: number) {
  return hyRequest.post({
    url: '/save',
    params: {
      articleId
    }
  })
}

// 取消收藏
export function deleteSave(articleId: number) {
  return hyRequest.delete({
    url: '/save',
    params: {
      articleId
    }
  })
}

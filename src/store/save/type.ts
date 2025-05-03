export interface ISave {
  articleId: number
  articleTitle: string
  articleContent: string
  articleThumbnail: string
  nickName: string
  avatar: string
  createTime: string
  viewCount: number
}

export interface ISaveState {
  saveList: ISave[]
  saveTotalCount: number
}

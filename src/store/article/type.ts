export interface IArticle {
  avatar: string
  commentCount: number
  content: string
  likeCount: number
  likeFlag: boolean
  id: number
  nickName: string
  saveFlag: boolean
  title: string
  viewCount: number
}

export interface IArticleDetail {
  id: string
  categoryName: string
  status: string
  summary: string
  thumbnail: string
  title: string
  content: string
  createBy: string
  createTime: string
  viewCount: number
}

export interface IHotArticle {
  id: number
  nickName: string
  avatar: string
  title: string
  content: string
  thumbnail: string
  viewCount: number
}

export interface INewArticle {
  id: number
  nickName: string
  avatar: string
  title: string
  content: string
  thumbnail: string
  viewCount: number
  favour: number
}

export interface IArticleState {
  articleList: IArticle[]
  articleTotalCount: number
  articleDetail: IArticleDetail | null
  hotArticleList: IHotArticle[]
  newArticleList: INewArticle[]
}

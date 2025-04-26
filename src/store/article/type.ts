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
  saveFlag: boolean
  likeFlag: boolean
  likeCount: number
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

export interface IDraftArticle {
  id: number
  title: string
  content: string
  thumbnail: string
  status: number
  isComment: number
}

export interface IAddArticleDto {
  id?: number
  title: string
  content: string | null
  summary: string
  categoryId: number
  thumbnail: string
  isTop: number
  status: number
  isComment: number
}

export interface IArticleState {
  articleList: IArticle[]
  articleTotalCount: number
  articleDetail: IArticleDetail | null
  hotArticleList: IHotArticle[]
  newArticleList: INewArticle[]
  draftList: IDraftArticle[]
  draftTotalCount: number
}

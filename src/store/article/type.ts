//TODO JSON 2 TypeScript
export interface IArticle {
  avatar: string
  commentCount: number
  content: string
  favourCount: number
  favourFlag: boolean
  id: number
  nickName: string
  saveFlag: boolean
  title: string
  viewCount: number
}

export interface IArticleState {
  articleList: IArticle[]
  articleTotalCount: number
}

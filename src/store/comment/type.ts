export interface IComment {
  id: number
  articleId: number
  rootId: number
  content: string
  toCommentUserId: number
  toCommentUserName: string
  toCommentId: number
  createById: number
  createTime: string
  createBy: string
  avatar: string
  children?: IComment[]
}

export interface ICommentState {
  commentList: IComment[]
  total: number
}

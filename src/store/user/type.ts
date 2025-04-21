export interface IRecommendedUser {
  id: number
  nickName: string
  avatar: string
  sex: number
  email: string
}

export interface IUserState {
  recommendedUsers: IRecommendedUser[]
}

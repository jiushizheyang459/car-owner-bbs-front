export interface IRecommendedUser {
  id: number
  nickName: string
  avatar: string
  followsFlag: boolean
}

export interface IFollowState {
  followStatus: Record<number, boolean>
  recommendedUsers: IRecommendedUser[]
}

import type { IArticle } from '@/store/article/type.ts'

export interface IRecommendedUser {
  id: number
  nickName: string
  avatar: string
  followsFlag: boolean
}

export interface IFollow {
  id: number
  followerId: number
  followerUser: string
  followedId: number
  followedUser: string
  followedAvatar: string
  createTime: string
}

export interface IFollowState {
  followStatus: Record<number, boolean>
  recommendedUsers: IRecommendedUser[]
  followList: IFollow[]
}

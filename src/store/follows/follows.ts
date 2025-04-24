import { defineStore } from 'pinia'
import { addFollow, deleteFollow, getRecommendedUsers } from '@/service/follows/follows'
import type { IFollowState } from './type'
import { ElMessage } from 'element-plus'

const useFollowStore = defineStore('follows', {
  state: (): IFollowState => ({
    followStatus: {},
    recommendedUsers: []
  }),
  actions: {
    toggleFollowAction(userId: number) {
      if (this.followStatus[userId]) {
        deleteFollow(userId).then(() => {
          this.followStatus[userId] = false
          ElMessage.success('已取消关注')
        })
      } else {
        addFollow(userId).then(() => {
          this.followStatus[userId] = true
          ElMessage.success('关注成功')
        })
      }
    },
    async getRecommendedUsersAction() {
      const result = await getRecommendedUsers()
      this.recommendedUsers = result.data.data
      // 更新关注状态
      this.recommendedUsers.forEach((user) => {
        this.followStatus[user.id] = user.followsFlag
      })
    }
  }
})

export default useFollowStore

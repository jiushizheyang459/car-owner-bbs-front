import { defineStore } from 'pinia'
import {
  addFollow,
  deleteFollow,
  getFollowUsers,
  getRecommendedUsers
} from '@/service/follows/follows'
import type { IFollowState } from './type'
import { ElMessage } from 'element-plus'

const useFollowStore = defineStore('follows', {
  state: (): IFollowState => ({
    followStatus: {},
    recommendedUsers: [],
    followList: []
  }),
  actions: {
    async toggleFollowAction(userId: number) {
      try {
        if (this.followStatus[userId]) {
          // 取消关注
          await deleteFollow(userId)
          this.followStatus[userId] = false

          // 从关注列表中移除该用户
          this.followList = this.followList.filter((item) => item.followedId !== userId)

          ElMessage.success('已取消关注')
          return true
        } else {
          // 添加关注
          await addFollow(userId)
          this.followStatus[userId] = true

          // 重新获取关注列表（或者可以直接将用户添加到列表中）
          await this.getFollowAction()

          ElMessage.success('关注成功')
          return true
        }
      } catch (error) {
        console.error('关注操作失败:', error)
        ElMessage.error('操作失败，请稍后重试')
        return false
      }
    },
    async getRecommendedUsersAction() {
      const result = await getRecommendedUsers()
      this.recommendedUsers = result.data.data
      // 更新关注状态
      this.recommendedUsers.forEach((user) => {
        this.followStatus[user.id] = user.followsFlag
      })
    },
    async getFollowAction() {
      const result = await getFollowUsers()
      this.followList = result.data.data
    }
  }
})

export default useFollowStore

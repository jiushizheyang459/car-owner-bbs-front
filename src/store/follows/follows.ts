import { defineStore } from 'pinia'
import { addFollow, deleteFollow } from '@/service/follows/follows'
import type { IFollowState } from './type'
import { ElMessage } from 'element-plus'

const useFollowStore = defineStore('follows', {
  state: (): IFollowState => ({
    followStatus: {}
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
    }
  }
})

export default useFollowStore

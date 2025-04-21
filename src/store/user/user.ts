import { defineStore } from 'pinia'
import { getRecommendedUsers } from '@/service/user/user.ts'
import type { IUserState } from './type.ts'

const useUserStore = defineStore('user', {
  state: (): IUserState => ({
    recommendedUsers: []
  }),
  actions: {
    async getRecommendedUsersAction() {
      const result = await getRecommendedUsers()
      this.recommendedUsers = result.data.data
    }
  }
})

export default useUserStore

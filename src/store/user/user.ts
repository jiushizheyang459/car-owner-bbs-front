import { defineStore } from 'pinia'
import { getUserInfo, updatePasswordRequest } from '@/service/user/user'
import type { IUserState } from '@/store/user/type.ts'
import type { IUserInfo } from '@/store/login/type.ts'
import type { IUpdatePassword } from '@/store/user/type'
import { ElMessage } from 'element-plus'

const useUserStore = defineStore('user', {
  state: (): IUserState => ({
    userInfo: null as IUserInfo | null
  }),
  actions: {
    async getUserInfoAction() {
      try {
        const result = await getUserInfo()
        if (result.data.code === 200) {
          this.userInfo = result.data.data
        } else {
          ElMessage.error(result.data.msg || '获取用户信息失败')
        }
      } catch (error) {
        ElMessage.error('获取用户信息失败')
        console.error('获取用户信息失败:', error)
      }
    },

    // 清空用户信息
    clearUserInfo() {
      this.userInfo = null
    },

    // 更新用户信息
    updateUserInfoAction(userInfo: IUserInfo) {
      this.userInfo = userInfo
    },

    async updatePasswordAction(updatePasswordDto: IUpdatePassword) {
      await updatePasswordRequest(updatePasswordDto)
    }
  }
})

export default useUserStore

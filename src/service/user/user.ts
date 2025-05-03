import hyRequest from '@/service'
import type { IUpdateUserInfo } from '@/store/user/type'
import type { IUpdatePassword } from '@/store/user/type'

export function getUserInfo() {
  return hyRequest.get({
    url: `/user/userInfo`
  })
}

// 更新用户信息
export function updateUserInfo(userInfo: IUpdateUserInfo) {
  return hyRequest.put({
    url: '/user/userInfo',
    data: userInfo
  })
}

export function updatePasswordRequest(updatePasswordDto: IUpdatePassword) {
  return hyRequest.put({
    url: '/user/updatePassword',
    data: updatePasswordDto
  })
}

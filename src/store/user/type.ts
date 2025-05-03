import type { IUserInfo } from '@/store/login/type'

export interface IUserState {
  userInfo: IUserInfo | null
}

export interface IUpdateUserInfo {
  id: number
  userName: string
  nickName: string
  email: string
  phoneNumber: string
  sex: number
  avatar: string
}

export interface IUpdatePassword {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

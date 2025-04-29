import hyRequest from '@/service'
import type { IAccount } from '@/types'
import type { IUserInfoVo, IMenuVo } from '@/store/login/type'

interface ILoginResult {
  code: number
  msg: string
  data: {
    token: string
    userInfo: IUserInfoVo
    menus: IMenuVo[]
  }
}

export function accountLoginRequest(account: IAccount) {
  return hyRequest.post<{ data: ILoginResult }>({
    url: '/login',
    data: account
  })
}

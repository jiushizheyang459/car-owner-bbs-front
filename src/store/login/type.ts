export interface IMenu {
  id: number
  menuName: string
  parentId: number
  orderNum: number
  path: string
  component: string
  isFrame: number
  menuType: string
  visible: string
  status: string
  perms: string
  icon: string
  layoutType: number
  paramKey: string
  children: IMenu[]
}

export interface IUserInfo {
  id: number
  userName: string
  nickName: string
  avatar: string
  sex: number
  email: string
  phoneNumber: string
  roleKey: string
  roleName: string
}

export interface ILoginState {
  token: string
  userInfo: IUserInfo
  menus: IMenu[]
}

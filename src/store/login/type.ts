import type { RouteRecordRaw } from 'vue-router'

export interface IUserInfoVo {
  id: number
  nickName: string
  avatar: string
  sex: string
  email: string
  roleKey: string
}

export interface IMenuVo {
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
  paramKey?: string // 路由参数键名，如id
  layoutType?: number // 布局类型
  children?: IMenuVo[]
}

export interface ILoginState {
  token: string
  userInfo: IUserInfoVo | null
  menus: IMenuVo[]
}

// 组件映射类型
export type ComponentMapType = {
  [key: string]: () => Promise<any>
}

// 路由配置类型
export interface IRouteConfig {
  path: string
  name: string
  component: () => Promise<any>
  meta: {
    title: string
    icon: string
  }
  children?: IRouteConfig[]
  redirect?: string
}

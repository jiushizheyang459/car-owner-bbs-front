import { localCache } from '@/utils/cache'
import { MENUS, USERINFO } from '@/global/constants'
import type { IMenuVo } from '@/store/login/type'

/**
 * 检查用户是否拥有特定权限
 * @param permission 需要检查的权限标识
 * @returns 是否拥有权限
 */
export function hasPermission(permission: string): boolean {
  // 如果未提供权限标识，直接返回false
  if (!permission) {
    return false
  }

  // 获取当前用户的菜单权限信息
  const menus = localCache.getCache(MENUS) as IMenuVo[] | null
  if (!menus) {
    return false
  }

  // 从菜单树中提取所有权限标识
  const permsList: string[] = []
  const extractPerms = (menuList: IMenuVo[]) => {
    for (const menu of menuList) {
      if (menu.perms) {
        permsList.push(menu.perms)
      }
      if (menu.children && menu.children.length > 0) {
        extractPerms(menu.children)
      }
    }
  }

  extractPerms(menus)

  // 检查是否包含所需权限
  return permsList.includes(permission)
}

/**
 * 检查用户是否为管理员
 * @returns 是否为管理员
 */
export function isAdmin(): boolean {
  const userInfo = localCache.getCache(USERINFO)
  if (!userInfo) {
    return false
  }
  // 根据roleKey判断是否为管理员
  return userInfo.roleKey === 'admin'
}

/**
 * 权限指令，用于自定义v-permission指令
 */
export const permissionDirective = {
  mounted(el: HTMLElement, binding: any) {
    // 获取指令的绑定值，即所需权限
    const { value } = binding
    // 如果无权限，则移除元素
    if (value && !hasPermission(value)) {
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 注册全局权限指令
 * @param app Vue应用实例
 */
export function setupPermission(app: any) {
  app.directive('permission', permissionDirective)
}

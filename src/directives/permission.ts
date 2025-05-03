import type { App, Directive, DirectiveBinding } from 'vue'
import useLoginStore from '@/store/login/login'

/**
 * 权限指令
 * 用法：
 * v-permission="'article:create'" - 检查是否有创建文章的权限
 * v-permission="{ permission: 'article:create', type: 'disabled' }" - 无权限时禁用而不是隐藏
 */
export const permission: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    const loginStore = useLoginStore()

    // 获取指令值
    let permission: string
    let type: 'disabled' | 'hidden' = 'hidden'

    if (typeof binding.value === 'string') {
      permission = binding.value
    } else if (binding.value && typeof binding.value === 'object') {
      permission = binding.value.permission
      if (binding.value.type) {
        type = binding.value.type
      }
    } else {
      throw new Error('v-permission指令使用格式错误')
    }

    // 检查权限
    const hasPermission = loginStore.hasPermission(permission)

    if (!hasPermission) {
      if (type === 'hidden') {
        // 无权限时从DOM中移除元素
        el.parentNode?.removeChild(el)
      } else if (type === 'disabled') {
        // 无权限时禁用元素
        el.setAttribute('disabled', 'disabled')
        el.classList.add('is-disabled')
      }
    }
  }
}

// 注册所有指令
export function setupPermission(app: App): void {
  app.directive('permission', permission)
}

export default setupPermission

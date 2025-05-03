import type { App } from 'vue'
import setupPermission from './permission'

// 导出常用指令
export * from './permission'

// 注册所有指令
export function setupDirectives(app: App): void {
  setupPermission(app)
  // 未来可在此处添加更多指令
}

export default setupDirectives

/**
 * 日期格式化工具函数
 */

/**
 * 将日期字符串格式化为中文日期格式
 * @param dateStr 日期字符串，如：2023-01-01
 * @param options 格式化选项，默认为年月日
 * @returns 格式化后的日期字符串，如：2023年1月1日
 */
export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)

  // 默认选项：年月日
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }

  return date.toLocaleDateString('zh-CN', options || defaultOptions)
}

/**
 * 将日期字符串格式化为短日期格式（MM-DD）
 * @param dateStr 日期字符串
 * @returns 短日期格式字符串
 */
export function formatShortDate(dateStr: string): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${month}-${day}`
}

/**
 * 将日期字符串格式化为标准日期格式（YYYY-MM-DD）
 * @param dateStr 日期字符串
 * @returns 标准日期格式字符串
 */
export function formatStandardDate(dateStr: string): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')

  return `${year}-${month}-${day}`
}

/**
 * 获取日期是星期几
 * @param dateStr 日期字符串
 * @returns 星期几
 */
export function getWeekday(dateStr: string): string {
  if (!dateStr) return ''

  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', { weekday: 'long' })
}

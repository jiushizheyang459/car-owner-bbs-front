/**
 * 去除 HTML 标签，返回纯文本
 * @param html HTML 字符串
 * @param length 截取长度，默认为 0（不截取）
 * @returns 处理后的纯文本
 */
export function stripHtml(html: string, length: number = 0): string {
  if (!html) return ''

  // 去除 HTML 标签
  let text = html.replace(/<[^>]+>/g, '')

  // 去除多余空格和换行
  text = text.replace(/\s+/g, ' ').trim()

  // 如果指定了长度，则截取
  if (length > 0 && text.length > length) {
    text = text.substring(0, length) + '...'
  }

  return text
}

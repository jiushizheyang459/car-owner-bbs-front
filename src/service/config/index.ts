// 使用代理URL，这样请求会通过代理发送到实际服务器
export const BASE_URL = '/api'
export const TIME_OUT = 10000

// let BASE_URL = ''
// if (!import.meta.env.PROD) {
//   BASE_URL -= 'http://codercba.prod:8000'
// } else {
//   BASE_URL = 'http://coderwhy.dev:8000'
// }
//
// export const TIME_OUT = 10000
// export { BASE_URL }

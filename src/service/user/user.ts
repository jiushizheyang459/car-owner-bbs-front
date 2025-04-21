import hyRequest from '@/service'

export function getRecommendedUsers() {
  return hyRequest.get({
    url: '/user/getRecommendedAttention'
  })
}

import hyRequest from '@/service'

export function addFollow(followedId: number) {
  return hyRequest.post({
    url: '/follows',
    params: {
      followedId
    }
  })
}

export function deleteFollow(followedId: number) {
  return hyRequest.delete({
    url: '/follows',
    params: {
      followedId
    }
  })
}

export function getRecommendedUsers() {
  return hyRequest.get({
    url: '/follows/recommendFollowsList'
  })
}

import hyRequest from '@/service'

export function getAdvertisementList() {
  return hyRequest.get({
    url: 'advertisement'
  })
}

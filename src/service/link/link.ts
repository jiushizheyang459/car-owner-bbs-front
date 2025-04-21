import hyRequest from '@/service'

export function getLinkList() {
  return hyRequest.get({
    url: `/link/linkList`
  })
}

export function addLink(data: { name: string; logo: string; description: string; url: string }) {
  return hyRequest.post({
    url: `/link`,
    data
  })
}

import hyRequest from '@/service'

export function getAnnouncementList() {
  return hyRequest.get({
    url: `/announcement`
  })
}

export function addAnnouncement(data: { title: string }) {
  return hyRequest.post({
    url: `/announcement`,
    data
  })
}

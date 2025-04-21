import hyRequest from '@/service'

export function getEventList(queryInfo: any) {
  const params = new URLSearchParams(queryInfo).toString()
  return hyRequest.get({
    url: `/event/eventList?${params}`
  })
}

export function getHotEventList() {
  return hyRequest.get({
    url: `/event/hotEventList`
  })
}

export function getNewEventList() {
  return hyRequest.get({
    url: `/event/newEventList`
  })
}

export function addEvent(data: {
  title: string
  content: string
  thumbnail: string
  startTime: string | number
  endTime: string | number
  eventTime: string
  type: string
  venue: string
}) {
  return hyRequest.post({
    url: `/event`,
    data
  })
}

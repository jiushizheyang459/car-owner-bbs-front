import hyRequest from '@/service'
import type { IAddAnnouncement, IUpdateAnnouncement } from '@/store/announcement/type.ts'

export function getAnnouncementList(pageNum: number, pageSize: number) {
  return hyRequest.get({
    url: '/announcement/announcementList',
    params: {
      pageNum,
      pageSize
    }
  })
}

export function getDisplayAnnouncementList(pageNum: number, pageSize: number) {
  return hyRequest.get({
    url: '/announcement/displayAnnouncementList',
    params: {
      pageNum,
      pageSize
    }
  })
}

export function getAnnouncementDetail(id: number) {
  return hyRequest.get({
    url: `/announcement/${id}`
  })
}

export function addAnnouncement(announcement: IAddAnnouncement) {
  return hyRequest.post({
    url: '/announcement',
    data: announcement
  })
}

export function updateAnnouncement(announcement: IUpdateAnnouncement) {
  return hyRequest.put({
    url: '/announcement',
    data: announcement
  })
}

export function deleteAnnouncement(ids: number[]) {
  return hyRequest.delete({
    url: '/announcement',
    params: {
      ids
    }
  })
}

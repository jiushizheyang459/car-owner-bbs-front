export interface IAnnouncement {
  id: number
  title: string
  creatDate: string
  startTime: string
  endTime: string
}

export interface IAddAnnouncement {
  title: string
  startTime: string
  endTime: string
}

export interface IUpdateAnnouncement extends IAddAnnouncement {
  id: number
}

export interface IAnnouncementDetail {
  id: number
  title: string
  creatTime: string
  startTime: string
  endTime: string
}

export interface IAnnouncementState {
  announcementList: IAnnouncement[]
  announcementTotalCount: number
  announcementDetail: IAnnouncementDetail | null
}

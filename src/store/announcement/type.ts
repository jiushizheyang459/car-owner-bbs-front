export interface IAnnouncement {
  id: number
  title: string
  creatDate: string
}

export interface IAnnouncementState {
  announcementList: IAnnouncement[]
}

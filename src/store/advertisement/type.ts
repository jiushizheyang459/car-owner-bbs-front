export interface IAdvertisement {
  id: number
  title: string
  content: string
  img: string
  priority: number
  description: string
  link: string
  status: number
  startTime: string
  endTime: string
}

export interface IAddAdvertisement {
  title: string
  content: string
  img: string
  priority: number
  link: string
  startTime: string
  endTime: string
  status: number
}

export interface IUpdateAdvertisement extends IAddAdvertisement {
  id: number
}

export interface IAdvertisementDetail {
  id: number
  title: string
  content: string
  imageUrl: string
  linkUrl: string
  startTime: string
  endTime: string
  status: number
  createTime: string
  updateTime: string
}

export interface IAdvertisementState {
  advertisementList: IAdvertisement[]
  advertisementTotalCount: number
  advertisementDetail: IAdvertisementDetail | null
}

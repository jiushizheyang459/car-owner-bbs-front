export interface IAdvertisement {
  id: number
  title: string
  content: string
  img: string
  description: string
}

export interface IAdvertisementState {
  advertisementList: IAdvertisement[]
}

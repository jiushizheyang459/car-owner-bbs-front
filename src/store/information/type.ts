export interface IInformation {
  id: number
  nickName: string
  avatar: string
  title: string
  content: string
  thumbnail: string
  createDate: string
  createTime: string
}

export interface INewInformation {
  title: string
  content: string
  createDate: string
  createTime: string
}

export interface IInformationState {
  informationList: IInformation[]
  newInformationList: INewInformation[]
}

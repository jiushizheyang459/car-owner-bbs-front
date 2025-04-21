export interface ILink {
  id: number
  name: string
  logo: string
  url: string
  description: string
  status: string
}

export interface ILinkState {
  linkList: ILink[]
}

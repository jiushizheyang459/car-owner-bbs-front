export interface IEvent {
  id: number
  title: string
  eventTime: string
  content: string
  thumbnail: string
  startTime: string
  endTime: string
  status: string
  createBy: string
  type: string
  venue: string
}

export interface IHotEvent {
  id: number
  createBy: string
  avatar: string
  title: string
  content: string
  thumbnail: string
}

export interface INewEvent {
  id: number
  createBy: string
  avatar: string
  title: string
  venue: string
}

export interface IEventState {
  eventList: IEvent[]
  hotEventList: IHotEvent[]
  newEventList: INewEvent[]
  eventTotalCount: number
}

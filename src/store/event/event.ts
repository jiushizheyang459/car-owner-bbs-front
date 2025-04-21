import { defineStore } from 'pinia'
import type { IEventState } from '@/store/event/type.ts'
import { addEvent, getEventList, getHotEventList, getNewEventList } from '@/service/Event/event.ts'

const useEventStore = defineStore('Event', {
  state: (): IEventState => ({
    eventList: [],
    eventTotalCount: 0,
    hotEventList: [],
    newEventList: []
  }),
  actions: {
    async getEventListAction(queryInfo: any) {
      const EventListResult = await getEventList(queryInfo)
      const { totalCount, rows } = EventListResult.data.data
      this.eventList = rows
      this.eventTotalCount = totalCount
    },
    async getHotEventListAction() {
      const HotEventListResult = await getHotEventList()
      this.hotEventList = HotEventListResult.data.data
    },
    async getNewEventListAction() {
      const NewEventListResult = await getNewEventList()
      this.newEventList = NewEventListResult.data.data
    },
    async addEventAction(data: {
      title: string
      content: string
      thumbnail: string
      startTime: string | number
      endTime: string | number
      eventTime: string
      type: string
      venue: string
    }) {
      await addEvent(data)
    }
  }
})

export default useEventStore

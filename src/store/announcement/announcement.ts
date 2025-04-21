import { defineStore } from 'pinia'
import type { IAnnouncementState } from '@/store/announcement/type.ts'
import { addAnnouncement, getAnnouncementList } from '@/service/announcement/announcement.ts'

const useAnnouncementStore = defineStore('announcement', {
  state: (): IAnnouncementState => ({
    announcementList: []
  }),
  actions: {
    async getAnnouncementListAction() {
      const announcementListResult = await getAnnouncementList()
      this.announcementList = announcementListResult.data.data
    },
    async addAnnouncementAction(data: { title: string }) {
      await addAnnouncement(data)
      // 添加成功后刷新列表
      await this.getAnnouncementListAction()
    }
  }
})

export default useAnnouncementStore

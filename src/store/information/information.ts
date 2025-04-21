import { defineStore } from 'pinia'
import type { IInformationState } from '@/store/information/type.ts'
import {
  getInformationList,
  addInformation,
  getNewInformationList
} from '@/service/information/information.ts'

const useInformationStore = defineStore('information', {
  state: (): IInformationState => ({
    informationList: [],
    newInformationList: []
  }),
  actions: {
    async getInformationListAction() {
      const informationListResult = await getInformationList()
      this.informationList = informationListResult.data.data
    },
    async addInformationAction(data: { title: string; content: string; thumbnail: string }) {
      await addInformation(data)
      // 添加成功后刷新列表
      await this.getInformationListAction()
    },
    async getNewInformationListAction() {
      const newInformationListResult = await getNewInformationList()
      this.newInformationList = newInformationListResult.data.data
    }
  }
})

export default useInformationStore

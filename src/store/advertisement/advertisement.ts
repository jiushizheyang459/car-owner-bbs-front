import { defineStore } from 'pinia'
import type { IAdvertisementState } from './type.ts'
import { getAdvertisementList } from '@/service/advertisement/advertisement.ts'

const useAdvStore = defineStore('adv', {
  state: (): IAdvertisementState => ({
    advertisementList: []
  }),
  actions: {
    async getAdvertisementAction() {
      const result = await getAdvertisementList()
      this.advertisementList = result.data.data
    }
  }
})

export default useAdvStore

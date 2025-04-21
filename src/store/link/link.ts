import { defineStore } from 'pinia'
import { addLink, getLinkList } from '@/service/link/link.ts'
import type { ILinkState } from '@/store/link/type.ts'

const useLinkStore = defineStore('Link', {
  state: (): ILinkState => ({
    linkList: []
  }),
  actions: {
    async getLinkListAction() {
      const linkListResult = await getLinkList()
      this.linkList = linkListResult.data.data
    },
    async addLinkAction(data: { name: string; logo: string; description: string; url: string }) {
      await addLink(data)
    }
  }
})

export default useLinkStore

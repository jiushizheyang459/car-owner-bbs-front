import { defineStore } from 'pinia'
import { addKnowledge, getKnowledgeList } from '@/service/knowledge/knowledge.ts'
import type { IKnowledgeState } from '@/store/knowledge/type.ts'
import { addInformation } from '@/service/information/information.ts'

const useKnowledgeStore = defineStore('knowledge', {
  state: (): IKnowledgeState => ({
    knowledgeList: [],
    knowledgeTotalCount: 0
  }),
  actions: {
    async getKnowledgeListAction(queryInfo: any) {
      const knowledgeListResult = await getKnowledgeList(queryInfo)
      const { totalCount, rows } = knowledgeListResult.data.data
      this.knowledgeList = rows
      this.knowledgeTotalCount = totalCount
    },
    async addKnowledgeAction(data: { title: string; content: string; thumbnail: string }) {
      await addKnowledge(data)
      // 不再在这里刷新列表，而是在组件中处理
    }
  }
})

export default useKnowledgeStore

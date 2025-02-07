import { defineStore } from 'pinia'
import { getAllArticleList } from '@/service/article/article.ts'
import type { IArticleState } from './type.ts'

const useArticleStore = defineStore('article', {
  state: (): IArticleState => ({
    articleList: [],
    articleTotalCount: 0
  }),
  actions: {
    async getAllArticleListAction(queryInfo: any) {
      const articleListResult = await getAllArticleList(queryInfo)
      const { totalCount, rows } = articleListResult.data.data
      this.articleList = rows
      this.articleTotalCount = totalCount
    }
  }
})

export default useArticleStore

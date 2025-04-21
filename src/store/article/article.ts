import { defineStore } from 'pinia'
import {
  getAllArticleList,
  getFollowingArticleList,
  getArticleDetail,
  updateArticleViewCount,
  getHotArticleList,
  getNewArticleList
} from '@/service/article/article.ts'
import type { IArticleState } from './type.ts'

const useArticleStore = defineStore('article', {
  state: (): IArticleState => ({
    articleList: [],
    articleTotalCount: 0,
    articleDetail: null,
    hotArticleList: [],
    newArticleList: []
  }),
  actions: {
    async getAllArticleListAction(queryInfo: any) {
      const articleListResult = await getAllArticleList(queryInfo)
      const { totalCount, rows } = articleListResult.data.data
      this.articleList = rows
      this.articleTotalCount = totalCount
    },
    async getFollowingArticleListAction(queryInfo: any) {
      const articleListResult = await getFollowingArticleList(queryInfo)
      const { totalCount, rows } = articleListResult.data.data
      this.articleList = rows
      this.articleTotalCount = totalCount
    },
    async getArticleDetailAction(id: number) {
      const result = await getArticleDetail(id)
      this.articleDetail = result.data.data
      // 更新浏览量
      await updateArticleViewCount(id)
    },
    async getHotArticleListAction() {
      const hotArticleListResult = await getHotArticleList()
      this.hotArticleList = hotArticleListResult.data.data
    },
    async getNewArticleListAction() {
      const newArticleListResult = await getNewArticleList()
      this.newArticleList = newArticleListResult.data.data
    }
  }
})

export default useArticleStore

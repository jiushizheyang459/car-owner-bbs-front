import { defineStore } from 'pinia'
import {
  getAllArticleList,
  getFollowingArticleList,
  getArticleDetail,
  updateArticleViewCount,
  getHotArticleList,
  getNewArticleList,
  getDraftArticleList,
  addArticle,
  addDraftArticle,
  updateArticle,
  deleteArticle
} from '@/service/article/article.ts'
import type { IArticleState, IAddArticleDto } from './type.ts'
import { ElMessage } from 'element-plus'

const useArticleStore = defineStore('article', {
  state: (): IArticleState => ({
    articleList: [],
    articleTotalCount: 0,
    articleDetail: null,
    hotArticleList: [],
    newArticleList: [],
    draftList: [],
    draftTotalCount: 0
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
    },
    async updateArticleViewCountAction(id: number) {
      try {
        await updateArticleViewCount(id)
      } catch (error) {
        ElMessage.error('更新浏览量失败')
      }
    },
    async getHotArticleListAction() {
      const hotArticleListResult = await getHotArticleList()
      this.hotArticleList = hotArticleListResult.data.data
    },
    async getNewArticleListAction() {
      const newArticleListResult = await getNewArticleList()
      this.newArticleList = newArticleListResult.data.data
    },
    async getDraftArticleListAction(queryInfo: any) {
      const draftListResult = await getDraftArticleList(queryInfo)
      const { totalCount, rows } = draftListResult.data.data
      this.draftList = rows
      this.draftTotalCount = totalCount
    },
    async addArticleAction(articleData: IAddArticleDto) {
      try {
        await addArticle(articleData)
        ElMessage.success('文章发布成功')
        return true
      } catch (error) {
        ElMessage.error('文章发布失败')
        return false
      }
    },
    async addDraftArticleAction(articleData: IAddArticleDto) {
      try {
        await addDraftArticle(articleData)
        ElMessage.success('草稿保存成功')
        return true
      } catch (error) {
        ElMessage.error('草稿保存失败')
        return false
      }
    },
    async updateArticleAction(articleData: IAddArticleDto) {
      try {
        await updateArticle(articleData)
        ElMessage.success('文章更新成功')
        return true
      } catch (error) {
        ElMessage.error('文章更新失败')
        return false
      }
    },
    async deleteArticleAction(ids: number[]) {
      try {
        await deleteArticle(ids)
        ElMessage.success('文章删除成功')
        return true
      } catch (error) {
        ElMessage.error('文章删除失败')
        return false
      }
    }
  }
})

export default useArticleStore

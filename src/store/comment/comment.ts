import { defineStore } from 'pinia'
import { getCommentList, addComment } from '@/service/comment/comment'
import type { ICommentState } from './type'
import { ElMessage } from 'element-plus'
import { useLoginStore } from '@/store/login/login'

const useCommentStore = defineStore('comment', {
  state: (): ICommentState => ({
    commentList: [],
    total: 0
  }),
  actions: {
    async getCommentListAction(articleId: number, pageNum: number, size: number) {
      try {
        const result = await getCommentList(articleId, pageNum, size)
        if (result.data.code === 200) {
          const { rows, totalCount } = result.data.data
          this.commentList = rows
          this.total = totalCount
        }
      } catch (error) {
        ElMessage.error('获取评论列表失败')
      }
    },
    async addCommentAction(commentData: any) {
      const loginStore = useLoginStore()
      if (!loginStore.userInfo) {
        ElMessage.warning('请先登录')
        return
      }

      try {
        const result = await addComment(commentData)
        if (result.data.code === 200) {
          ElMessage.success('评论成功')
          // 重新获取评论列表
          await this.getCommentListAction(commentData.articleId, 1, 10)
        }
      } catch (error) {
        ElMessage.error('评论失败')
      }
    }
  }
})

export default useCommentStore

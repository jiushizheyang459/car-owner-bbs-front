import { defineStore } from 'pinia'
import { toggleLike, getLikeStatus, getLikeCount } from '@/service/like/like'
import { useLoginStore } from '@/store/login/login'
import { ElMessage } from 'element-plus'
import { localCache } from '@/utils/cache.ts'

const useLikeStore = defineStore('like', {
  state: () => ({
    likeStatus: {} as Record<number, boolean>,
    likeCounts: {} as Record<number, number>
  }),
  actions: {
    async toggleLikeAction(articleId: number) {
      const loginStore = useLoginStore()
      console.log('loginStore.userInfo', loginStore.userInfo)
      console.log('localCache', localCache)
      console.log('localCache.userInfo', localCache.getCache('userInfo'))
      if (!loginStore.userInfo) {
        ElMessage.warning('请先登录')
        return
      }

      try {
        const result = await toggleLike(articleId, loginStore.userInfo.id)
        if (result.data.code === 200) {
          this.likeStatus[articleId] = result.data.data
          // 更新点赞数
          await this.getLikeCountAction(articleId)
        }
      } catch (error) {
        ElMessage.error('操作失败，请稍后重试')
      }
    },

    async getLikeStatusAction(articleId: number) {
      const loginStore = useLoginStore()
      if (!loginStore.userInfo) return

      try {
        const result = await getLikeStatus(articleId, loginStore.userInfo.id)
        if (result.data.code === 200) {
          this.likeStatus[articleId] = result.data.data
        }
      } catch (error) {
        console.error('获取点赞状态失败:', error)
      }
    },

    async getLikeCountAction(articleId: number) {
      try {
        const result = await getLikeCount(articleId)
        if (result.data.code === 200) {
          this.likeCounts[articleId] = result.data.data
        }
      } catch (error) {
        console.error('获取点赞数失败:', error)
      }
    }
  }
})

export default useLikeStore

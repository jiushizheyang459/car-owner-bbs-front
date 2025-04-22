import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { getSaveList, addSave, deleteSave } from '@/service/save/save'
import type { ISaveState } from './type'

const useSaveStore = defineStore('save', {
  state: (): ISaveState => ({
    saveList: [],
    total: 0
  }),
  actions: {
    // 获取收藏列表
    async getSaveListAction(pageNum: number, size: number) {
      const res = await getSaveList(pageNum, size)
      if (res.code === 200) {
        this.saveList = res.data.records
        this.total = res.data.total
      } else {
        ElMessage.error('获取收藏列表失败')
      }
    },
    // 添加收藏
    async addSaveAction(articleId: number) {
      const res = await addSave(articleId)
      if (res.data.code === 200) {
        ElMessage.success('收藏成功')
        return true
      } else {
        ElMessage.error('收藏失败')
        return false
      }
    },
    // 取消收藏
    async deleteSaveAction(articleId: number) {
      const res = await deleteSave(articleId)
      if (res.data.code === 200) {
        ElMessage.success('取消收藏成功')
        return true
      } else {
        ElMessage.error('取消收藏失败')
        return false
      }
    }
  }
})

export default useSaveStore

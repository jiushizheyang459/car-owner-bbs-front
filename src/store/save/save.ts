import { defineStore } from 'pinia'
import { ElMessage } from 'element-plus'
import { getSaveList, addSave, deleteSave } from '@/service/save/save'
import type { ISaveState } from './type'

const useSaveStore = defineStore('save', {
  state: (): ISaveState => ({
    saveList: [],
    saveTotalCount: 0
  }),
  actions: {
    // 获取收藏列表
    async getSaveListAction(pageNum: number, size: number) {
      const saveListResult = await getSaveList(pageNum, size)
      if (saveListResult.data.code === 200) {
        const { totalCount, rows } = saveListResult.data.data
        this.saveList = rows
        this.saveTotalCount = totalCount
      } else {
        ElMessage.error('获取收藏列表失败')
      }
    },
    // 添加收藏
    async addSaveAction(articleId: number) {
      const addSaveResult = await addSave(articleId)
      if (addSaveResult.data.code === 200) {
        ElMessage.success('收藏成功')
        return true
      } else {
        ElMessage.error('收藏失败')
        return false
      }
    },
    // 取消收藏
    async deleteSaveAction(articleId: number) {
      const deleteSaveResult = await deleteSave(articleId)
      if (deleteSaveResult.data.code === 200) {
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

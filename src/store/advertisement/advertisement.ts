import { defineStore } from 'pinia'
import {
  getAdvertisementList,
  getAdvertisementDetail,
  addAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getDisplayAdvertisementList
} from '@/service/advertisement/advertisement'
import type { IAdvertisementState, IAddAdvertisement, IUpdateAdvertisement, IAdvertisementDetail } from './type'
import { ElMessage } from 'element-plus'

const useAdvertisementStore = defineStore('advertisement', {
  state: (): IAdvertisementState => ({
    advertisementList: [],
    advertisementTotalCount: 0,
    advertisementDetail: null
  }),
  actions: {
    async getAdvertisementListAction(pageNum: number, pageSize: number) {
      const advertisementListResult = await getAdvertisementList(pageNum, pageSize)
      const { totalCount, rows } = advertisementListResult.data.data
      this.advertisementList = rows
      this.advertisementTotalCount = totalCount
    },

    async getDisplayAdvertisementListAction(pageNum: number, pageSize: number) {
      const displayAdvertisementListResult = await getDisplayAdvertisementList(pageNum, pageSize)
      const { totalCount, rows } = displayAdvertisementListResult.data.data
      this.advertisementList = rows
      this.advertisementTotalCount = totalCount
    },

    async getAdvertisementDetailAction(id: number) {
      try {
        const advertisementDetailResult = await getAdvertisementDetail(id)
        if (advertisementDetailResult.data.code === 200) {
          this.advertisementDetail = advertisementDetailResult.data.data
        } else {
          ElMessage.error(advertisementDetailResult.data.msg || '获取广告详情失败')
          return null
        }
      } catch (error) {
        ElMessage.error('获取广告详情失败')
        console.error('获取广告详情失败:', error)
        return null
      }
    },

    async addAdvertisementAction(advertisement: IAddAdvertisement) {
      try {
        const addAdvertisementResult = await addAdvertisement(advertisement)
        if (addAdvertisementResult.data.code === 200) {
          ElMessage.success('添加广告成功')
          return true
        } else {
          ElMessage.error(addAdvertisementResult.data.msg || '添加广告失败')
          return false
        }
      } catch (error) {
        ElMessage.error('添加广告失败')
        console.error('添加广告失败:', error)
        return false
      }
    },

    async updateAdvertisementAction(advertisement: IUpdateAdvertisement) {
      try {
        const updateAdvertisementResult = await updateAdvertisement(advertisement)
        if (updateAdvertisementResult.data.code === 200) {
          ElMessage.success('更新广告成功')
          return true
        } else {
          ElMessage.error(updateAdvertisementResult.data.msg || '更新广告失败')
          return false
        }
      } catch (error) {
        ElMessage.error('更新广告失败')
        console.error('更新广告失败:', error)
        return false
      }
    },

    async deleteAdvertisementAction(ids: number[]) {
      try {
        const deleteAdvertisementResult = await deleteAdvertisement(ids)
        if (deleteAdvertisementResult.data.code === 200) {
          ElMessage.success('删除广告成功')
          return true
        } else {
          ElMessage.error(deleteAdvertisementResult.data.msg || '删除广告失败')
          return false
        }
      } catch (error) {
        ElMessage.error('删除广告失败')
        console.error('删除广告失败:', error)
        return false
      }
    }
  }
})

export default useAdvertisementStore

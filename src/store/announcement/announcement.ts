import { defineStore } from 'pinia'
import type { IAddAnnouncement, IAnnouncementState, IUpdateAnnouncement } from '@/store/announcement/type.ts'
import {
  addAnnouncement,
  deleteAnnouncement,
  getAnnouncementDetail,
  getAnnouncementList,
  getDisplayAnnouncementList,
  updateAnnouncement
} from '@/service/announcement/announcement.ts'
import { ElMessage } from 'element-plus'

const useAnnouncementStore = defineStore('announcement', {
  state: (): IAnnouncementState => ({
    announcementList: [],
    announcementTotalCount: 0,
    announcementDetail: null
  }),
  actions: {
    async getAnnouncementListAction(pageNum: number, pageSize: number) {
      const announcementListResult = await getAnnouncementList(pageNum, pageSize)
      const { totalCount, rows } = announcementListResult.data.data
      this.announcementList = rows
      this.announcementTotalCount = totalCount
    },

    async getDisplayAnnouncementListAction(pageNum: number, pageSize: number) {
      const displayAnnouncementListResult = await getDisplayAnnouncementList(pageNum, pageSize)
      const { totalCount, rows } = displayAnnouncementListResult.data.data
      this.announcementList = rows
      this.announcementTotalCount = totalCount
    },

    async getAnnouncementDetailAction(id: number) {
      try {
        const announcementDetailResult = await getAnnouncementDetail(id)
        if (announcementDetailResult.data.code === 200) {
          this.announcementDetail = announcementDetailResult.data.data
        } else {
          ElMessage.error(announcementDetailResult.data.msg || '获取公告详情失败')
          return null
        }
      } catch (error) {
        ElMessage.error('获取公告详情失败')
        console.error('获取公告详情失败:', error)
        return null
      }
    },

    async addAnnouncementAction(announcement: IAddAnnouncement) {
      try {
        const addAnnouncementResult = await addAnnouncement(announcement)
        if (addAnnouncementResult.data.code === 200) {
          ElMessage.success('添加公告成功')
          return true
        } else {
          ElMessage.error(addAnnouncementResult.data.msg || '添加公告失败')
          return false
        }
      } catch (error) {
        ElMessage.error('添加公告失败')
        console.error('添加公告失败:', error)
        return false
      }
    },

    async updateAnnouncementAction(announcement: IUpdateAnnouncement) {
      try {
        const updateAnnouncementResult = await updateAnnouncement(announcement)
        if (updateAnnouncementResult.data.code === 200) {
          ElMessage.success('更新公告成功')
          return true
        } else {
          ElMessage.error(updateAnnouncementResult.data.msg || '更新公告失败')
          return false
        }
      } catch (error) {
        ElMessage.error('更新公告失败')
        console.error('更新公告失败:', error)
        return false
      }
    },

    async deleteAnnouncementAction(ids: number[]) {
      try {
        const deleteAnnouncementResult = await deleteAnnouncement(ids)
        if (deleteAnnouncementResult.data.code === 200) {
          ElMessage.success('删除公告成功')
          return true
        } else {
          ElMessage.error(deleteAnnouncementResult.data.msg || '删除公告失败')
          return false
        }
      } catch (error) {
        ElMessage.error('删除公告失败')
        console.error('删除公告失败:', error)
        return false
      }
    }
  }
})

export default useAnnouncementStore

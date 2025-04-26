import { defineStore } from 'pinia'
import { uploadImage } from '@/service/upload/upload'
import { ElMessage } from 'element-plus'

const useUploadStore = defineStore('upload', {
  state: () => ({}),
  actions: {
    async uploadImageAction(imgFile: File) {
      try {
        const result = await uploadImage(imgFile)
        return result.data.data
      } catch (error) {
        ElMessage.error('图片上传失败')
        return null
      }
    }
  }
})

export default useUploadStore

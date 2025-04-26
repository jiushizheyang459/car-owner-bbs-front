import hyRequest from '@/service'

// 上传图片
export function uploadImage(imgFile: File) {
  const formData = new FormData()
  formData.append('imgFile', imgFile)
  return hyRequest.post({
    url: `/upload`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

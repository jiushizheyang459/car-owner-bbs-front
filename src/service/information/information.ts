import hyRequest from '@/service'

export function getInformationList() {
  return hyRequest.get({
    url: `/information`
  })
}

export function addInformation(data: { title: string; content: string; thumbnail: string }) {
  return hyRequest.post({
    url: `/information`,
    data
  })
}

export function uploadImage(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  return hyRequest.post({
    url: `/upload/image`,
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

export function getNewInformationList() {
  return hyRequest.get({
    url: `/information/newInformationList`
  })
}

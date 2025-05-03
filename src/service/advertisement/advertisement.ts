import hyRequest from '@/service'
import type { IAddAdvertisement, IUpdateAdvertisement } from '@/store/advertisement/type'

export function getAdvertisementList(pageNum: number, pageSize: number) {
  return hyRequest.get({
    url: '/advertisement/advertisementList',
    params: {
      pageNum,
      pageSize
    }
  })
}

export function getDisplayAdvertisementList(pageNum: number, pageSize: number) {
  return hyRequest.get({
    url: '/advertisement/displayAdvertisementList',
    params: {
      pageNum,
      pageSize
    }
  })
}

export function getAdvertisementDetail(id: number) {
  return hyRequest.get({
    url: `/advertisement/${id}`
  })
}

export function addAdvertisement(advertisement: IAddAdvertisement) {
  return hyRequest.post({
    url: '/advertisement',
    data: advertisement
  })
}

export function updateAdvertisement(advertisement: IUpdateAdvertisement) {
  return hyRequest.put({
    url: '/advertisement',
    data: advertisement
  })
}

export function deleteAdvertisement(ids: number[]) {
  return hyRequest.delete({
    url: '/advertisement',
    params: {
      ids
    }
  })
}

import hyRequest from '@/service'

export function getKnowledgeList(queryInfo: any) {
  const params = new URLSearchParams(queryInfo).toString()
  return hyRequest.get({
    url: `/knowledge/knowledgeList?${params}`
  })
}

export function addKnowledge(data: { title: string; content: string; thumbnail: string }) {
  return hyRequest.post({
    url: `/knowledge`,
    data
  })
}

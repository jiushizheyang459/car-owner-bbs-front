export interface IKnowledge {
  id: number
  title: string
  content: string
  thumbnail: string
}

export interface IKnowledgeState {
  knowledgeList: IKnowledge[]
  knowledgeTotalCount: number
}

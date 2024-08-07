export type RankType = {
  _id: string
  rankName: string
  rankScoreGoal: number
  score: ScoreType
  rankIcon: string
  action: string[]
}

export type ScoreType = {
  attendanceScore: number
  numberOfComment: number
  numberOfBlog: number
  numberOfLike: number
  _id: string
}

export type AddRankType = {
  rankName: string
  attendanceScore: number
  numberOfComment: number
  numberOfBlog: number
  numberOfLike: number
  image: File
}

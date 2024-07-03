// Define types
export type User = {
  _id?: string
  firstname: string
  lastname: string
  avatar: string
  rankID: null
}

export type AddPostType = {
  content: string
  postImage?: string
}

export type UpdatePostType = {
  _id: string
  content?: string
  isShow?: boolean
  postImage?: string
}

export type UserReactionType = {
  userId: User
  reaction?: string
  _id?: string
}

export type GetPostType = {
  _id: string
  userId: User
  content: string
  commentCount: number
  reactionCount: number
  status: string
  isShow: boolean
  isApproved?: boolean
  userReaction?: UserReactionType[]
  postImage?: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type GetPostState = {
  _id: ''
  userId: {
    _id: ''
    firstname: ''
    lastname: ''
    avatar: ''
    rankID: null
  }
  content: ''
  commentCount: 0
  reactionCount: 0
  status: ''
  isShow: true
  isApproved?: false
  userReaction?: UserReactionType[]
  postImage?: ''
  createdAt: ''
  updatedAt: ''
}

export type GetPostBySearchType = Array<{
  userId: string
  content: string
  commentCount: number
  reactionCount: number
  status: string
  isShow: boolean
  isApproved: boolean
  userReaction: UserReactionType[]
  postImage: string
  createdAt: string | Date
  updatedAt: string | Date
}>

export type PostType = {
  user?: User
  addPost?: AddPostType
  getPost?: GetPostType
  getPostBySearch?: GetPostBySearchType
}

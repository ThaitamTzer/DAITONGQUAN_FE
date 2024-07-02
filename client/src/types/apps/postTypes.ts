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
  content?: string
  isShow?: boolean
  postImage?: string
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
  userReaction?: [
    {
      userId: User
      reaction?: string
      _id?: string
    }
  ]
  postImage?: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type GetPostState = {
  _id: ''
  userId: {}
  content: ''
  commentCount: 0
  reactionCount: 0
  status: ''
  isShow: true
  isApproved?: false
  userReaction?: [
    {
      userId: {}
      reaction?: ''
      _id?: ''
    }
  ]
  postImage?: ''
  createdAt: ''
  updatedAt: ''
}

export type GetPostBySeacrhType = {
  userId: string
  content: string
  commentCount: number
  reactionCount: number
  status: string
  isShow: boolean
  isApproved: boolean
  userReaction: []
  postImage: string
  createdAt: string | Date
  updatedAt: string | Date
}

export type PostType = {
  user?: User
  addPost?: AddPostType
  getPost?: GetPostType
  getPostBySearch?: GetPostBySeacrhType
}

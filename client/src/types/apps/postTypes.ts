// Define types
export type User = {
  _id: string
  firstname: string
  lastname: string
  avatar: string
  rankID: null
}

export type ReplyComment = {
  commentId: string
  content: string
}

export type RepliesComment = {
  _id: string
  userId: User
  content: string
  createdAt: Date | string
}

export type AddPostType = {
  content: string
  file?: File
}

export type UpdatePostType = {
  content?: string
  isShow?: boolean
  postImage?: string
}

export type UserHidePostType = {
  postId: string
  isShow: boolean
}

export type UserReactionType = [
  {
    userId: User
    reaction?: string
    _id?: string
  }
]

export type UserCommentType = {
  content: string
  postId: string
}

export type GetPostType = {
  _id: string
  userId: User
  content: string
  commentCount: number
  reactionCount: number
  status: string
  isShow: boolean
  isApproved: boolean
  userReaction: UserReactionType
  postImage?: string
  createdAt: string | Date
  updatedAt: string | Date
  [key: string]: any
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

export type CommentType = {
  _id: string
  userId: {
    _id: string
    firstname: string
    lastname: string
    avatar: string
  }
  postId: string
  content: string
  repliesComment: RepliesComment[]
  createdAt: Date | string
  updatedAt: Date | string
  __v: 0
}

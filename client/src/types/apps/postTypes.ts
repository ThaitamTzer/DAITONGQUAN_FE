// Define types

import { ViewOptionsRefined } from '@fullcalendar/core/internal'
import { User } from './userTypes'

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

export type UserPostState = {
  posts: GetPostType[]
  post: GetPostType
  loading: boolean
  allComments: CommentType[]
  addPost: (data: AddPostType) => Promise<void>
  getAllUserPosts: () => Promise<void>
  updateUserPost: (_id: string, data: UpdatePostType) => Promise<void>
  deletePost: (_id: string) => Promise<void>
  reactionPost: (_id: string, action: string) => Promise<void>
  deleteReactionPost: (_id: string) => Promise<void>
  addPostToFavorite: (_id: string) => Promise<void>
  getPostById: (_id: string) => Promise<void>
  clearPostData: () => void
  getAllComments: (postId: string) => Promise<void>
  deleteFavoritePost: (_id: string) => Promise<void>
}

export type EditPostState = {
  loading: boolean
  openEditModal: boolean
  editPost: GetPostType
  openEditPost?: (data: GetPostType) => void
  closeEditPost: () => void
  updateUserPost: (_id: string, data: UpdatePostType) => Promise<void>
}

export type EditCommentState = {
  openEditComment: boolean
  opentEditReply: boolean
  replyId: string
  commentId: string
  selectedComment: string
  selectedReplyComment: string
  openEditCommentModal: (selectedComment: string, commentId: string) => void
  openEditReplyModal: (selectedReplyComment: string, replyId: string, commentId: string) => void
  closeEditCommentModal: () => void
  closeEditReplyModal: () => void
  updateComment: (_id: string, selectedComment: string) => Promise<void>
  updateReplyComment: (commentId: string, replyId: string, selectedReplyComment: string) => Promise<void>
  deleteReplyComment?: (commentId: string, replyId: string) => Promise<void>
}

export type PostListState = {
  listposts: GetPostType[]
  loading: boolean
  approvePost: (_id: string, isApproved: boolean) => Promise<void>
  getListPost: () => Promise<void>
  openModal: boolean
  modalPost: GetPostType
  openModalPost: (data: GetPostType) => void
  closeModalPost: () => void
}

export type CommentPostState = {
  post: GetPostType
  commentPost: (data: UserCommentType) => Promise<void>
  openCommentModal: boolean
  openCommentModalPost?: (data: GetPostType) => void
  closeCommentModalPost: () => void
  handleDeleteComment?: (_id: string) => Promise<void>
}
export type SetPostId = {
  postId: string
  setPostId: (postId: string) => void
}
export type UserData = {
  address: string
  avatar: string
  dateOfBirth?: Date | string
  description?: string
  email?: string
  firstname?: string
  gender?: string
  lastname?: string
  nickname?: string
  phone?: number
  role?: string
  _id: string
}
export type UserObj = {
  userLocal: UserData
}

export type RepliesCommentState = {
  handleOpenReplies: (comment: CommentType | RepliesComment) => void
  handleCloseReplies: () => void
  handleReplyComment: (_id: string, comment: string) => Promise<void>
  openReplies: boolean
  comment: CommentType | RepliesComment
}

export type ViewAllPostState = {
  posts: GetPostType[]
  getAllPosts: () => Promise<void>
}

export type viewFavoritePostState = {
  posts: GetPostType[]
  getFavoritePosts: () => Promise<void>
  reactionPost: (_id: string, action: string) => Promise<void>
  deleteReactionPost: (_id: string) => Promise<void>
}

export type previewImage = {
  openImage: string
  handleOpenImage: (image: string) => void
  handleCloseImage: () => void
}

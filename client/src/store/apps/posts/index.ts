import { create } from 'zustand'
import {
  GetPostType,
  AddPostType,
  UpdatePostType,
  UserCommentType,
  CommentType,
  RepliesComment
} from 'src/types/apps/postTypes'
import postService from 'src/service/post.service'
import toast from 'react-hot-toast'

type UserPostState = {
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

type PostListState = {
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
type SetPostId = {
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
type UserObj = {
  userLocal: UserData
}

export type RepliesCommentState = {
  handleOpenReplies: (comment: CommentType | RepliesComment) => void
  handleCloseReplies: () => void
  handleReplyComment: (_id: string, comment: string) => Promise<void>
  openReplies: boolean
  comment: CommentType | RepliesComment
}

type ViewAllPostState = {
  posts: GetPostType[]
  getAllPosts: () => Promise<void>
}

type viewFavoritePostState = {
  posts: GetPostType[]
  getFavoritePosts: () => Promise<void>
}

export const userDataStore = create<UserObj>(() => ({
  userLocal: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData') || '{}') : {}
}))

export const usePostStore = create<UserPostState>(set => ({
  posts: [],
  post: {} as GetPostType,
  loading: false,
  allComments: [],
  getAllUserPosts: async () => {
    set({ loading: true })
    const response = await postService.getAllUserPosts()
    set({ posts: response, loading: false })
  },
  addPost: async (data: AddPostType) => {
    set({ loading: true })
    await postService.addPost(data)
    await usePostStore.getState().getAllUserPosts()
    set({ loading: false })
  },
  updateUserPost: async (_id: string, data: UpdatePostType) => {
    const postId = postIdStore.getState().postId
    set({ loading: true })
    await postService.updatePost(_id, data)
    usePostStore.getState().getAllUserPosts()
    viewAllPostStore.getState().getAllPosts()
    if (postId) {
      usePostStore.getState().getPostById(postId)
    }
  },
  deletePost: async (_id: string) => {
    const postId = postIdStore.getState().postId
    set({ loading: true })
    await postService.deletePost(_id)
    usePostStore.getState().getAllUserPosts()
    viewAllPostStore.getState().getAllPosts()
    if (postId) {
      usePostStore.getState().getPostById(postId)
    }
  },
  reactionPost: async (_id: string, action: string) => {
    const postId = postIdStore.getState().postId
    set({ loading: true })
    await postService.reactionToPost(_id, action)
    usePostStore.getState().getAllUserPosts()
    viewAllPostStore.getState().getAllPosts()
    if (postId) {
      usePostStore.getState().getPostById(postId)
      usePostStore.getState().getAllUserPosts()
      viewAllPostStore.getState().getAllPosts()
    }
  },
  deleteReactionPost: async (_id: string) => {
    const postId = postIdStore.getState().postId
    set({ loading: true })
    await postService.deleteReactionToPost(_id)
    if (postId) {
      usePostStore.getState().getPostById(postId)
    } else {
      usePostStore.getState().getAllUserPosts()
      viewAllPostStore.getState().getAllPosts()
    }
  },
  addPostToFavorite: async (_id: string) => {
    set({ loading: true })
    await postService.addPostToFavorite(_id)
    usePostStore.getState().getAllUserPosts()
    viewAllPostStore.getState().getAllPosts()
  },
  getPostById: async (_id: string) => {
    set({ loading: true })
    const response = await postService.getPostById(_id)
    set({ post: response, loading: false })
  },
  clearPostData: () => set({ post: {} as GetPostType }),
  getAllComments: async (postId: string) => {
    set({ loading: true })
    const response = await postService.getCommentByPostId(postId)
    set({ allComments: response, loading: false })
  }
}))

export const approvePostStore = create<PostListState>(set => ({
  listposts: [],
  loading: false,
  openModal: false,
  modalPost: {} as GetPostType,
  getListPost: async () => {
    set({ loading: true })
    const response = await postService.getListPost()
    set({ listposts: response, loading: false })
  },
  approvePost: async (_id: string, isApproved: boolean) => {
    set({ loading: true })
    await postService.approvePost(_id, isApproved)
    approvePostStore.getState().getListPost()
  },
  openModalPost: (data: GetPostType) => set({ openModal: true, modalPost: data }),
  closeModalPost: () => {
    set(state => ({ openModal: false, modalPost: state.modalPost }))
  }
}))

export const commentPostState = create<CommentPostState>(set => ({
  post: {} as GetPostType,
  openCommentModal: false,
  openCommentModalPost: (data: GetPostType) => set(() => ({ openCommentModal: true, post: data })),
  closeCommentModalPost: () => {
    set(state => ({ openCommentModal: false, post: state.post }))
  },
  commentPost: async (data: UserCommentType) => {
    set({ post: {} as GetPostType })
    await postService.commentToPost(data)
    usePostStore.getState().getAllUserPosts()
    viewAllPostStore.getState().getAllPosts()
    viewFavoritePostStore.getState().getFavoritePosts()
    const postId = postIdStore.getState().postId
    if (postId) {
      usePostStore.getState().getPostById(postId)
      usePostStore.getState().getAllComments(postId)
    }
  },
  handleDeleteComment: async (_id: string) => {
    await postService.deleteComment(_id)
    const postId = postIdStore.getState().postId
    usePostStore.getState().getPostById(postId)
    usePostStore.getState().getAllComments(postId)
  }
}))

export const editCommentState = create<EditCommentState>(set => ({
  openEditComment: false,
  opentEditReply: false,
  selectedComment: '',
  selectedReplyComment: '',
  replyId: '',
  commentId: '',
  openEditCommentModal: (selectedComment: string, commentId: string) =>
    set({ selectedComment, openEditComment: true, commentId }),
  openEditReplyModal: (selectedReplyComment: string, replyId: string, commentId: string) =>
    set({ opentEditReply: true, selectedReplyComment, replyId, commentId }),
  closeEditCommentModal: () => {
    set(state => ({ openEditComment: false, selectedComment: state.selectedComment }))
  },
  closeEditReplyModal: () => {
    set(state => ({ opentEditReply: false, comment: state.selectedReplyComment }))
  },
  updateComment: async (_id: string, comment: string) => {
    await postService.editComment(_id, comment)
    const postId = postIdStore.getState().postId
    usePostStore.getState().getAllComments(postId)
  },
  updateReplyComment: async (commentId: string, replyId: string, content: string) => {
    await postService.editReplyComment(commentId, replyId, content)
    const postId = postIdStore.getState().postId
    usePostStore.getState().getAllComments(postId)
  },
  deleteReplyComment: async (commentId: string, replyId: string) => {
    await postService.deleteReplyComment(commentId, replyId)
    const postId = postIdStore.getState().postId
    usePostStore.getState().getAllComments(postId)
  }
}))

export const editPostState = create<EditPostState>(set => ({
  openEditModal: false,
  loading: false,
  editPost: {} as GetPostType,
  openEditPost: (data: GetPostType) => set({ openEditModal: true, editPost: data }),
  closeEditPost: () => {
    set(state => ({ openEditModal: false, post: state.editPost }))
  },
  updateUserPost: async (_id: string, data: UpdatePostType) => {
    set({ loading: true })
    await postService.updatePost(_id, data)
    await usePostStore.getState().getAllUserPosts()
  }
}))

export const postIdStore = create<SetPostId>(set => ({
  postId: '',
  setPostId: (postId: string) => set({ postId })
}))

export const repliesCommentState = create<RepliesCommentState>(set => ({
  openReplies: false,
  comment: {} as CommentType | RepliesComment,
  handleOpenReplies: (comment: CommentType | RepliesComment) => set({ openReplies: true, comment: comment }),
  handleCloseReplies: () => set({ openReplies: false, comment: {} as CommentType }),
  handleReplyComment: async (_id: string, comment: string) => {
    await postService.replyComment(_id, comment)
    const postId = postIdStore.getState().postId
    usePostStore.getState().getAllComments(postId)
  }
}))

export const viewAllPostStore = create<ViewAllPostState>(set => ({
  posts: [],
  getAllPosts: async () => {
    const response = await postService.getAllPosts()
    set({ posts: response })
  }
}))

export const viewFavoritePostStore = create<viewFavoritePostState>(set => ({
  posts: [],
  getFavoritePosts: async () => {
    const response = await postService.getFavoritedPosts()
    set({ posts: response })
  }
}))

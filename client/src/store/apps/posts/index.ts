import { create } from 'zustand'
import { GetPostType, AddPostType, UpdatePostType, UserCommentType, CommentType } from 'src/types/apps/postTypes'
import postService from 'src/service/post.service'
import { DialogProps } from '@mui/material'

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
  selectedComment: string
  openEditCommentModal: (selectedComment: string) => void
  closeEditCommentModal: () => void
  updateComment: (_id: string, selectedComment: string) => Promise<void>
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
  scroll: DialogProps['scroll']
  setScroll: (scroll: DialogProps['scroll']) => void
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
  handleOpenReplies: (comment: CommentType) => void
  handleCloseReplies: () => void
  handleReplyComment: (_id: string, comment: string) => Promise<void>
  openReplies: boolean
  comment: CommentType
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
    set({ loading: true })
    await postService.updatePost(_id, data)
    await usePostStore.getState().getAllUserPosts()
  },
  deletePost: async (_id: string) => {
    set({ loading: true })
    await postService.deletePost(_id)
    await usePostStore.getState().getAllUserPosts()
  },
  reactionPost: async (_id: string, action: string) => {
    const postId = postIdStore.getState().postId
    set({ loading: true })
    await postService.reactionToPost(_id, action)
    if (postId) {
      usePostStore.getState().getPostById(postId)
    } else {
      usePostStore.getState().getAllUserPosts()
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
    }
  },
  addPostToFavorite: async (_id: string) => {
    set({ loading: true })
    await postService.addPostToFavorite(_id)
    await usePostStore.getState().getAllUserPosts()
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
    postService.approvePost(_id, isApproved)
    approvePostStore.getState().getListPost()
  },
  openModalPost: (data: GetPostType) => set({ openModal: true, modalPost: data }),
  closeModalPost: () => {
    set(state => ({ openModal: false, modalPost: state.modalPost }))
  }
}))

export const commentPostState = create<CommentPostState>(set => ({
  post: {} as GetPostType,
  scroll: 'paper',
  setScroll: (scroll: DialogProps['scroll']) => set({ scroll }),
  openCommentModal: false,
  openCommentModalPost: (data: GetPostType) =>
    set(state => ({ openCommentModal: true, post: data, scroll: state.scroll })),
  closeCommentModalPost: () => {
    set(state => ({ openCommentModal: false, post: state.post }))
  },
  commentPost: async (data: UserCommentType) => {
    set({ post: {} as GetPostType })
    await postService.commentToPost(data)
    usePostStore.getState().getAllUserPosts()
    const postId = postIdStore.getState().postId
    usePostStore.getState().getPostById(postId)
    usePostStore.getState().getAllComments(postId)
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
  selectedComment: '',
  openEditCommentModal: (selectedComment: string) => set({ openEditComment: true, selectedComment }),
  closeEditCommentModal: () => {
    set(state => ({ openEditComment: false, comment: state.selectedComment }))
  },
  updateComment: async (_id: string, comment: string) => {
    await postService.editComment(_id, comment)
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
  comment: {} as CommentType,
  handleOpenReplies: (comment: CommentType) => set({ openReplies: true, comment: comment }),
  handleCloseReplies: () => set({ openReplies: false, comment: {} as CommentType }),
  handleReplyComment: async (_id: string, comment: string) => {
    await postService.replyComment(_id, comment)
    const postId = postIdStore.getState().postId
    usePostStore.getState().getAllComments(postId)
  }

  // handleDeleteReply: async (_id: string) => {
  //   await postService.deleteReply(_id)
  //   const postId = postIdStore.getState().postId
  //   usePostStore.getState().getAllComments(postId)
  // }
}))

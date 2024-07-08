import { create } from 'zustand'
import { GetPostType, AddPostType, UpdatePostType, UserCommentType } from 'src/types/apps/postTypes'
import postService from 'src/service/post.service'
import { DialogProps } from '@mui/material'

type UserPostState = {
  posts: GetPostType[]
  loading: boolean
  addPost: (data: AddPostType) => Promise<void>
  getAllUserPosts: () => Promise<void>
  updateUserPost: (_id: string, data: UpdatePostType) => Promise<void>
  deletePost: (_id: string) => Promise<void>
  reactionPost: (_id: string, action: string) => Promise<void>
  deleteReactionPost: (_id: string) => Promise<void>
  addPostToFavorite: (_id: string) => Promise<void>
}

export type EditPostState = {
  loading: boolean
  openEditModal: boolean
  editPost: GetPostType
  openEditPost?: (data: GetPostType) => void
  closeEditPost: () => void
  updateUserPost: (_id: string, data: UpdatePostType) => Promise<void>
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
}

export const usePostStore = create<UserPostState>(set => ({
  posts: [],
  loading: false,
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
    set({ loading: true })
    await postService.reactionToPost(_id, action)
    await usePostStore.getState().getAllUserPosts()
  },
  deleteReactionPost: async (_id: string) => {
    set({ loading: true })
    await postService.deleteReactionToPost(_id)
    await usePostStore.getState().getAllUserPosts()
  },
  addPostToFavorite: async (_id: string) => {
    set({ loading: true })
    await postService.addPostToFavorite(_id)
    await usePostStore.getState().getAllUserPosts()
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
    await usePostStore.getState().getAllUserPosts()
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

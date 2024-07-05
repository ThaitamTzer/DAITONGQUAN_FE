import { create } from 'zustand'
import { GetPostType, AddPostType, UpdatePostType } from 'src/types/apps/postTypes'
import postService from 'src/service/post.service'

type UserPostState = {
  posts: GetPostType[]
  loading: boolean
  addPost: (data: AddPostType) => Promise<void>
  getAllUserPosts: () => Promise<void>
  updateUserPost: (data: UpdatePostType) => Promise<void>
  deletePost: (_id: string) => Promise<void>
  reactionPost: (_id: string, action: string) => Promise<void>
  deleteReactionPost: (_id: string) => Promise<void>
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
  },
  updateUserPost: async (data: UpdatePostType) => {
    set({ loading: true })
    await postService.updatePost(data._id, data)
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
    await approvePostStore.getState().getListPost()
  },
  openModalPost: (data: GetPostType) => set({ openModal: true, modalPost: data }),
  closeModalPost: () => {
    set(state => ({ openModal: false, modalPost: state.modalPost }))
  }
}))

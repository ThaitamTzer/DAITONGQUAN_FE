import { create } from 'zustand'
import { GetPostType, AddPostType, UpdatePostType } from 'src/types/apps/postTypes'
import postService from 'src/service/post.service'

type UserPostState = {
  posts: GetPostType[]
  addPost: (data: AddPostType) => Promise<void>
  getAllUserPosts: () => Promise<void>
  updateUserPost: (data: UpdatePostType) => Promise<void>
  deletePost: (_id: string) => Promise<void>
}

export const usePostStore = create<UserPostState>(set => ({
  posts: [],
  addPost: async (data: AddPostType) => {
    const response = await postService.addPost(data)
    set(state => ({ posts: [...state.posts, response] }))
  },
  getAllUserPosts: async () => {
    const response = await postService.getAllUserPosts()
    set({ posts: response })
  },
  updateUserPost: async (data: UpdatePostType) => {
    const response = await postService.updatePost(data._id, data)
    set(state => ({ posts: state.posts.map(post => (post._id === response._id ? response : post)) }))
  },
  deletePost: async (_id: string) => {
    await postService.deletePost(_id)
    set(state => ({ posts: state.posts.filter(post => post._id !== _id) }))
  }
}))

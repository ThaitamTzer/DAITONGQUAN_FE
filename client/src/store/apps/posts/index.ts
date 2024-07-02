import { createStore } from 'zustand'
import { UpdatePostType, AddPostType, PostType, GetPostType, GetPostBySeacrhType, GetPostState } from 'src/types/apps/postTypes'
import postService from 'src/service/post.service'

export type PostState = {
  posts: PostType
  userPosts: GetPostType
  favoritedPosts: PostType
  postBySearch: GetPostBySeacrhType
  postById: PostType
  listPost: PostType
}

export type GetPost = {
  getAllUserPosts: () => void
  getAllPosts: () => void
  getPostById: (_id: string) => void
  getPostBySearch: () => void
  getFavoritedPosts: () => void
  getListPost: () => void
}

export type PostActions = {
  addPost: (post: AddPostType) => void
  updatePost: (post: UpdatePostType) => void
  deletePost: (_id: string) => void
  reactionToPost: (_id: string, data: string) => void
  addPostToFavorite: (_id: string) => void
  deletePostFromFavorite: (_id: string) => void
  deleteReactionToPost: (_id: string) => void
  approvePost: (_id: string, data: boolean) => void
  deleteManyPosts: (postIds: string[]) => void
}

export type CounterStore = PostState & GetPostType & PostActions

export const usePostStore = createStore<PostState & GetPostType & PostActions>(set => ({
  posts: {},
  userPosts: {
    _id: '',

    // userId: {},
    content: '',
    commentCount: 0,
    reactionCount: 0,
    status: '',
    isShow: true,
    isApproved: false,

    // userReaction: [],
    postImage: '',
    createdAt: '',
    updatedAt: ''
  },
  favoritedPosts: {},
  
  // postBySearch: {},
  postById: {},
  listPost: {},
  getAllUserPosts: async () => {
    const response = await postService.getAllUserPosts()
    set({ userPosts: response })
  },
  getAllPosts: async () => {
    const response = await postService.getAllPosts()
    set({ posts: response })
  },
  getPostById: async (_id: string) => {
    const response = await postService.getPostById(_id)
    set({ postById: response })
  },
  getPostBySearch: async () => {
    const response = await postService.getPostBySearch()
    set({ postBySearch: response })
  },
  getFavoritedPosts: async () => {
    const response = await postService.getFavoritedPosts()
    set({ favoritedPosts: response })
  },
  getListPost: async () => {
    const response = await postService.getListPost()
    set({ listPost: response })
  },
  addPost: async (post: AddPostType) => {
    const response = await postService.addPost(post)
    set({ posts: response })
  },
  updatePost: async (post: UpdatePostType) => {
    const response = await postService.updatePost(post)
    set({ posts: response })
  },
  deletePost: async (_id: string) => {
    const response = await postService.deletePost(_id)
    set({ posts: response })
  },
  reactionToPost: async (_id: string, data: string) => {
    const response = await postService.reactionToPost(_id, data)
    set({ posts: response })
  },
  addPostToFavorite: async (_id: string) => {
    const response = await postService.addPostToFavorite(_id)
    set({ posts: response })
  },
  deletePostFromFavorite: async (_id: string) => {
    const response = await postService.deletePostFromFavorite(_id)
    set({ posts: response })
  },
  deleteReactionToPost: async (_id: string) => {
    const response = await postService.deleteReactionToPost(_id)
    set({ posts: response })
  },
  approvePost: async (_id: string, data: boolean) => {
    const response = await postService.approvePost(_id, data)
    set({ posts: response })
  },
  deleteManyPosts: async (postIds: string[]) => {
    const response = await postService.deleteManyPosts(postIds)
    set({ posts: response })
  }
}))

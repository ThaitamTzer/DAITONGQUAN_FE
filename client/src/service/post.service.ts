import axiosClient from 'src/lib/axios'
import { GetPostType, GetPostBySearchType, AddPostType, UpdatePostType, UserCommentType } from 'src/types/apps/postTypes'

const postService = {
  // ** GET ======================================
  // Get all user posts
  getAllUserPosts: async (): Promise<GetPostType[]> => {
    const response: GetPostType[] = await axiosClient.get('/post/view-my-posts')

    return response
  },

  // Get all posts
  getAllPosts: async (): Promise<GetPostType[]> => {
    const response: GetPostType[] = await axiosClient.get('/post/view-all-posts')

    return response
  },

  // Get a post by id
  getPostById: async (_id: string): Promise<GetPostType> => {
    const response: GetPostType = await axiosClient.get(`/post/${_id}`)

    return response
  },

  // Get a post by search
  getPostBySearch: async (query: string): Promise<GetPostBySearchType[]> => {
    const response: GetPostBySearchType[] = await axiosClient.get('/post/search', { params: { query } })

    return response
  },

  // Get all posts favorited by user
  getFavoritedPosts: async (): Promise<GetPostBySearchType[]> => {
    const response: GetPostBySearchType[] = await axiosClient.get('/post/favorite')

    return response
  },

  // Get list post (Admin)
  getListPost: async (): Promise<GetPostType[]> => {
    const response: GetPostType[] = await axiosClient.get('/post/view-list-post')

    return response
  },

  // ** POST ======================================
  // Add a new post
  addPost: async (data: AddPostType): Promise<GetPostType> => {
    const response: GetPostType = await axiosClient.post('/post/add-post', data)

    return response
  },

  // Add post to favorite
  addPostToFavorite: async (_id: string): Promise<void> => {
    await axiosClient.post(`/post/favorite/${_id}`)
  },

  commentToPost: async (data: UserCommentType): Promise<void> => {
    await axiosClient.post(`/post/comment/`,data)
  },

  // ** PUT ======================================
  // Update a post
  updatePost: async (_id: string, data: UpdatePostType): Promise<GetPostType> => {
    const response = await axiosClient.put(`/post/${_id}`, data)

    return response.data
  },

  // Reaction to a post
  reactionToPost: async (_id: string, data: string): Promise<void> => {
    await axiosClient.put(`/post/reaction/${_id}?action=${data}`)
  },

  // ** DELETE ======================================
  // Delete a post
  deletePost: async (_id: string): Promise<void> => {
    await axiosClient.delete(`/post/${_id}`)
  },

  // Delete many posts
  deleteManyPosts: async (postIds: string[]): Promise<void> => {
    await axiosClient.delete('/post/delete-many', { data: { postIds } })
  },

  // Delete post from favorite
  deletePostFromFavorite: async (_id: string): Promise<void> => {
    await axiosClient.delete(`/post/favorite/${_id}`)
  },

  // Delete reaction to a post
  deleteReactionToPost: async (_id: string): Promise<void> => {
    await axiosClient.delete(`/post/reaction/${_id}`)
  },

  // ** PATCH ======================================
  // Approve a post as parameter
  approvePost: async (_id: string, isApproved: boolean): Promise<void> => {
    await axiosClient.patch(`/post/approve/${_id}?isApproved=${isApproved}`)
  }
}

export default postService

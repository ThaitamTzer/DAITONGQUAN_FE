import axiosClient from 'src/lib/axios'
import { GetPostType, GetPostBySeacrhType, AddPostType, UpdatePostType } from 'src/types/apps/postTypes'

const postService = {
  // ** GET ======================================
  // Get all user posts
  getAllUserPosts: async (): Promise<GetPostType> => axiosClient.get('/post/view-my-posts'),

  // Get all posts
  getAllPosts: async (): Promise<any> => axiosClient.get('/post/view-all-posts'),

  // Get a post by id
  getPostById: async (_id: string): Promise<GetPostBySeacrhType> => axiosClient.get(`/post/${_id}`),

  // Get a post by search
  getPostBySearch: async (): Promise<GetPostBySeacrhType> => axiosClient.get('/post/search'),

  // Get all posts favorited by user
  getFavoritedPosts: async (): Promise<GetPostBySeacrhType> => axiosClient.get('/post/favorite'),

  // Get list post (Admin)
  getListPost: async (): Promise<GetPostBySeacrhType> => axiosClient.get('/post/view-list-post'),

  // ** POST ======================================
  // Add a new post
  addPost: async (data: AddPostType): Promise<GetPostBySeacrhType> => axiosClient.post('/post/add-post', data),

  // Add post to favorite
  addPostToFavorite: async (_id: string): Promise<any> => axiosClient.post(`/post/favorite/${_id}`),

  // ** PUT ======================================
  // Update a post
  updatePost: async (_id: string, data: UpdatePostType): Promise<GetPostBySeacrhType> =>
    axiosClient.put(`/post/${_id}`, data),

  // Reaction to a post
  reactionToPost: async (_id: string, data: string): Promise<any> => axiosClient.put(`/post/${_id}`, data),

  // ** DELETE ======================================
  // Delete a post
  deletePost: async (_id: string): Promise<any> => axiosClient.delete(`/post/${_id}`),

  // Delete many posts
  deleteManyPosts: async (postIds: string[]): Promise<any> =>
    axiosClient.delete(`/post/delete-many`, { data: { postIds } }),

  // Delete post from favorite
  deletePostFromFavorite: async (_id: string): Promise<any> => axiosClient.delete(`/post/favorite/${_id}`),

  // Delete reaction to a post
  deleteReactionToPost: async (_id: string): Promise<any> => axiosClient.delete(`/post/reaction/${_id}`),

  // ** PATCH ======================================
  // Approve a post
  approvePost: async (_id: string, data: boolean): Promise<any> => axiosClient.patch(`/post/approve/${_id}`, data)
}

export default postService

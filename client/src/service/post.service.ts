import axiosClient from 'src/lib/axios'
import {
  GetPostType,
  GetPostBySearchType,
  AddPostType,
  UpdatePostType,
  UserCommentType,
  CommentType
} from 'src/types/apps/postTypes'

const postService = {
  // ** GET ======================================
  // Get all user posts
  getAllUserPosts: async (): Promise<GetPostType[]> => {
    const response: GetPostType[] = await axiosClient.get('/post/view-my-posts')

    return response
  },

  // Get all posts
  getAllPosts: async (): Promise<GetPostType[]> => {
    const response: GetPostType[] = await axiosClient.get('/post/view-all-post')

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
  getFavoritedPosts: async (): Promise<GetPostType[]> => {
    const response: GetPostType[] = await axiosClient.get('/post/favorite')

    return response
  },

  // Get list post (Admin)
  getListPost: async (): Promise<GetPostType[]> => {
    const response: GetPostType[] = await axiosClient.get('/post/view-list-post')

    return response
  },

  getCommentByPostId: async (_id: string): Promise<CommentType[]> => {
    const response: any = await axiosClient.get(`/comment/${_id}`)

    return response.comments
  },

  // ** POST ======================================
  // Add a new post
  addPost: async (data: AddPostType): Promise<GetPostType> => {
    const formData = new FormData()
    formData.append('content', data.content)
    if (data.file) {
      formData.append('file', data.file)
    }

    const response = await axiosClient.post('/post', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  // Add post to favorite
  addPostToFavorite: async (_id: string | undefined): Promise<void> => {
    await axiosClient.post(`/post/favorite/${_id}`)
  },

  commentToPost: async (data: UserCommentType | undefined): Promise<void> => {
    await axiosClient.post(`/comment`, data)
  },

  replyComment: async (_id: string, comment: string): Promise<void> => {
    await axiosClient.post(`/comment/reply/${_id}`, { content: comment })
  },

  reportPost: async (postId: string, reportType: string, reportContent: string): Promise<void> => {
    await axiosClient.post(`/report/${postId}`, { reportType, reportContent })
  },

  // ** PUT ======================================
  // Update a post
  updatePost: async (_id: string, data: UpdatePostType) => {
    const formData = new FormData()
    formData.append('content', data.content || '')
    formData.append('postImage', data.postImage || '')
    formData.append('isShow', data.isShow?.toString() || 'true')

    const response = await axiosClient.put(`/post/${_id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    return response.data
  },

  // Reaction to a post
  reactionToPost: async (_id: string, data: string): Promise<void> => {
    await axiosClient.put(`/post/reaction/${_id}?action=${data}`)
  },

  editComment: async (_id: string, comment: string): Promise<void> => {
    await axiosClient.put(`/comment/${_id}`, { content: comment })
  },

  editReplyComment: async (commentId: string, replyId: string, content: string): Promise<void> => {
    await axiosClient.put(`/comment/${commentId}/reply/${replyId}`, { content: content })
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

  deleteComment: async (commentId: string): Promise<void> => {
    await axiosClient.delete(`/comment/${commentId}`)
  },

  deleteReplyComment: async (commentId: string, replyId: string): Promise<void> => {
    await axiosClient.delete(`/comment/${commentId}/reply/${replyId}`)
  },

  // ** PATCH ======================================
  // Approve a post as parameter
  approvePost: async (_id: string, isApproved: boolean): Promise<void> => {
    await axiosClient.patch(`/post/approve/${_id}?isApproved=${isApproved}`)
  },

  // Reject a post
  rejectPost: async (_id: string): Promise<void> => {
    await axiosClient.patch(`/post/rejection/${_id}`)
  }
}

export default postService

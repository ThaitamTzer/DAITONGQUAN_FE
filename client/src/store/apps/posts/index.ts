import { create } from 'zustand'
import {
  GetPostType,
  AddPostType,
  UpdatePostType,
  UserCommentType,
  CommentType,
  RepliesComment,
  UserObj,
  UserPostState,
  PostListState,
  CommentPostState,
  EditCommentState,
  EditPostState,
  RepliesCommentState,
  SetPostId,
  ViewAllPostState,
  viewFavoritePostState,
  previewImage
} from 'src/types/apps/postTypes'
import { mutate } from 'swr'
import postService from 'src/service/post.service'

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
    mutate('GetAllPosts', async () => await postService.getAllPosts(), true)
    set({ loading: false })
  },
  updateUserPost: async (_id: string, data: UpdatePostType) => {
    const postId = postIdStore.getState().postId
    set({ loading: true })
    await postService.updatePost(_id, data)
    mutate('GetAllPosts', async () => await postService.getAllPosts(), true)
    viewAllPostStore.getState().getAllPosts()
    if (postId) {
      usePostStore.getState().getPostById(postId)
    }
  },
  deletePost: async (_id: string) => {
    const postId = postIdStore.getState().postId
    set({ loading: true })
    await postService.deletePost(_id)
    mutate('GetAllPosts', async () => await postService.getAllPosts(), true)
    viewAllPostStore.getState().getAllPosts()
    if (postId) {
      usePostStore.getState().getPostById(postId)
    }
  },
  reactionPost: async (_id: string, action: string) => {
    const postId = postIdStore.getState().postId
    set({ loading: true })
    await postService.reactionToPost(_id, action)
    mutate('GetAllPosts', async () => await postService.getAllPosts(), true)

    // usePostStore.getState().getAllUserPosts()
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
    mutate('GetAllPosts', async () => await postService.getAllPosts(), true)

    if (postId) {
      usePostStore.getState().getPostById(postId)
    } else {
      usePostStore.getState().getAllUserPosts()
      viewAllPostStore.getState().getAllPosts()
    }
  },
  addPostToFavorite: async (_id: string | undefined) => {
    set({ loading: true })
    await postService.addPostToFavorite(_id)
    mutate('GetAllFavorite', async () => await postService.getFavoritedPosts(), true)
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
  },
  deleteFavoritePost: async (_id: string) => {
    set({ loading: true })
    await postService.deletePostFromFavorite(_id)
    mutate('GetAllFavorite', async () => await postService.getFavoritedPosts(), true)
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
  openCommentModalPost: (data: GetPostType | undefined) => set(() => ({ openCommentModal: true, post: data })),
  closeCommentModalPost: () => {
    set(state => ({ openCommentModal: false, post: state.post }))
  },
  commentPost: async (data: UserCommentType | undefined) => {
    set({ post: {} as GetPostType })
    await postService.commentToPost(data)
    usePostStore.getState().getAllUserPosts()
    mutate('GetAllPosts')
    mutate('GetAllFavorite')
    const postId = postIdStore.getState().postId
    if (postId) {
      mutate(['GetCommentByPostId', postId])
      mutate(['GetPostById', postId])
    }
  },
  handleDeleteComment: async (_id: string) => {
    const postId = postIdStore.getState().postId
    await postService.deleteComment(_id)
    mutate(['GetCommentByPostId', postId])
    mutate(['GetPostById', postId])
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
    mutate(['GetCommentByPostId', postId])
  },
  updateReplyComment: async (commentId: string, replyId: string, content: string) => {
    await postService.editReplyComment(commentId, replyId, content)
    const postId = postIdStore.getState().postId
    mutate(['GetCommentByPostId', postId])
  },
  deleteReplyComment: async (commentId: string, replyId: string) => {
    const postId = postIdStore.getState().postId
    await postService.deleteReplyComment(commentId, replyId)
    await usePostStore.getState().getPostById(postId)
    mutate(['GetCommentByPostId', postId])
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
    const postId = await postIdStore.getState().postId
    usePostStore.getState().getPostById(postId)
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
  },
  reactionPost: async (_id: string, action: string) => {
    await postService.reactionToPost(_id, action)
    mutate('GetAllFavorite', async () => await postService.getFavoritedPosts(), true)
  },
  deleteReactionPost: async (_id: string) => {
    await postService.deleteReactionToPost(_id)
    mutate('GetAllFavorite', async () => await postService.getFavoritedPosts(), true)
  }
}))

export const previewImageStore = create<previewImage>(set => ({
  openImage: '',
  handleOpenImage: (image: string) => set({ openImage: image }),
  handleCloseImage: () => set({ openImage: '' })
}))

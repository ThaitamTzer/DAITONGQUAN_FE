import { Card, Grid } from '@mui/material'
import AddPost from 'src/views/apps/post/AddPost'
import PostsPage from 'src/views/apps/post/posts'
import { commentPostState, editPostState, usePostStore } from 'src/store/apps/posts'
import CommentPost from 'src/views/apps/post/CommentPost'
import EditPost from 'src/views/apps/post/EditPost'
import ReportPost from 'src/views/apps/post/ReportPost'
import useSWR from 'swr'
import postService from 'src/service/post.service'
import { PostSkeleton } from 'src/views/skeleton'

const Posts = () => {
  const { post, commentPost, openCommentModal, closeCommentModalPost, openCommentModalPost } = commentPostState(
    state => state
  )
  const reactionPost = usePostStore(state => state.reactionPost)
  const deleteReactionPost = usePostStore(state => state.deleteReactionPost)
  const { openEditModal, editPost, openEditPost, closeEditPost, loading } = editPostState(state => state)
  const deletePost = usePostStore(state => state.deletePost)
  const addPostToFavorite = usePostStore(state => state.addPostToFavorite)
  const updatePost = usePostStore(state => state.updateUserPost)

  const { data: posts, isLoading } = useSWR('GetAllPosts', postService.getAllPosts, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    refreshInterval: 3000,
    errorRetryCount: 2
  })

  return (
    <Grid container spacing={3} justifyContent={'center'}>
      <Grid item xs={12} md={9} sm={12} lg={8}>
        <Card>
          <AddPost />
        </Card>
      </Grid>
      <Grid item xs={12} md={9} sm={12} lg={8}>
        <Card>
          {isLoading ? <PostSkeleton /> : null}
          <PostsPage
            posts={posts}
            reactionPost={reactionPost}
            deleteReactionPost={deleteReactionPost}
            openCommentModalPost={openCommentModalPost}
            addPostToFavorite={addPostToFavorite}
            openEditPost={openEditPost}
            updatePost={updatePost}
            deletePost={deletePost}
          />
        </Card>
      </Grid>
      <CommentPost
        post={post}
        closeCommentModalPost={closeCommentModalPost}
        openCommentModal={openCommentModal}
        commentPost={commentPost}
      />
      <EditPost
        editPost={editPost}
        loading={loading}
        openEditModal={openEditModal}
        closeEditPost={closeEditPost}
        updateUserPost={updatePost}
      />
      <ReportPost />
    </Grid>
  )
}

Posts.acl = {
  action: 'read',
  subject: 'member-page'
}
export default Posts

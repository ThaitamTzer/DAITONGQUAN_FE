import { Card, Grid } from '@mui/material'
import PostsPage from 'src/views/apps/post/posts'
import { commentPostState, editPostState, usePostStore, viewFavoritePostStore } from 'src/store/apps/posts'
import { useEffect } from 'react'
import CommentPost from 'src/views/apps/post/CommentPost'
import EditPost from 'src/views/apps/post/EditPost'
import useSWR from 'swr'
import postService from 'src/service/post.service'

const FavoritePosts = () => {
  const { post, commentPost, openCommentModal, closeCommentModalPost, openCommentModalPost } = commentPostState(
    state => state
  )
  const reactionPost = viewFavoritePostStore(state => state.reactionPost)
  const deleteReactionPost = viewFavoritePostStore(state => state.deleteReactionPost)
  const { openEditModal, editPost, openEditPost, closeEditPost, loading } = editPostState(state => state)
  const deletePost = usePostStore(state => state.deletePost)
  const addPostToFavorite = usePostStore(state => state.addPostToFavorite)
  const updatePost = usePostStore(state => state.updateUserPost)

  const { data: posts } = useSWR('GetAllFavorite', postService.getFavoritedPosts)

  return (
    <Grid container spacing={3} justifyContent={'center'}>
      <Grid item xs={12} md={9} sm={12} lg={8}>
        <Card>
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
    </Grid>
  )
}

FavoritePosts.acl = {
  action: 'read',
  subject: 'member-page'
}
export default FavoritePosts

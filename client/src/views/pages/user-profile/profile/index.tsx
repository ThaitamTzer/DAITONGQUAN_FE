// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import AboutOverivew from 'src/views/pages/user-profile/profile/AboutOverivew'

// ** Types
import Posts from 'src/views/apps/post/posts'
import { usePostStore, commentPostState, editPostState } from 'src/store/apps/posts' // Adjust the path to your store file
import React, { useEffect } from 'react'
import CommentPost from 'src/views/apps/post/CommentPost'
import EditPost from 'src/views/apps/post/EditPost'
import AddPost from 'src/views/apps/post/AddPost'
import useSWR from 'swr'
import postService from 'src/service/post.service'

const Profile = () => {
  const reactionPost = usePostStore(state => state.reactionPost)
  const deleteReactionPost = usePostStore(state => state.deleteReactionPost)
  const deletePost = usePostStore(state => state.deletePost)
  const addPostToFavorite = usePostStore(state => state.addPostToFavorite)
  const updatePost = usePostStore(state => state.updateUserPost)
  const { post, commentPost, openCommentModal, closeCommentModalPost, openCommentModalPost } = commentPostState(
    state => state
  )
  const { openEditModal, editPost, openEditPost, closeEditPost, loading } = editPostState(state => state)

  const { data: posts } = useSWR('GetAllUserPosts', postService.getAllUserPosts, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    errorRetryCount: 2
  })

  return (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverivew />
      </Grid>
      <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Posts
              posts={posts}
              reactionPost={reactionPost}
              deleteReactionPost={deleteReactionPost}
              openCommentModalPost={openCommentModalPost}
              addPostToFavorite={addPostToFavorite}
              openEditPost={openEditPost}
              updatePost={updatePost}
              deletePost={deletePost}
            >
              <AddPost />
            </Posts>
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
          {/* <ConnectionsTeams connections={data.connections} teams={data.teamsTech} /> */}
          <Grid item xs={12}>
            {/* <ProjectsTable /> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default Profile

// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import AboutOverivew from 'src/views/pages/user-profile/profile/AboutOverivew'

// import ProjectsTable from 'src/views/pages/user-profile/profile/ProjectsTable'

// import ActivityTimeline from 'src/views/pages/user-profile/profile/ActivityTimeline'

// import ConnectionsTeams from 'src/views/pages/user-profile/profile/ConnectionsTeams'

// ** Types
import Posts from 'src/views/apps/post/posts'
import { usePostStore, commentPostState, editPostState } from 'src/store/apps/posts' // Adjust the path to your store file
import React, { ReactNode, useEffect } from 'react'
import CommentPost from 'src/views/apps/post/CommentPost'
import EditPost from 'src/views/apps/post/EditPost'
import { useRouter } from 'next/router'
import AddPost from 'src/views/apps/post/AddPost'

const Profile = () => {
  const getAllUserPosts = usePostStore(state => state.getAllUserPosts)
  const posts = usePostStore(state => state.posts)
  const reactionPost = usePostStore(state => state.reactionPost)
  const deleteReactionPost = usePostStore(state => state.deleteReactionPost)
  const deletePost = usePostStore(state => state.deletePost)
  const addPostToFavorite = usePostStore(state => state.addPostToFavorite)
  const updatePost = usePostStore(state => state.updateUserPost)
  const { post, commentPost, openCommentModal, closeCommentModalPost, openCommentModalPost, scroll, setScroll } =
    commentPostState(state => state)

  const { openEditModal, editPost, openEditPost, closeEditPost, loading } = editPostState(state => state)

  useEffect(() => {
    getAllUserPosts()
  }, [])

  const router = useRouter()
  const { postId } = router.query

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
              scroll={scroll}
              setScroll={setScroll}
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

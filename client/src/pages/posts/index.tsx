import { Card, Grid } from '@mui/material'
import AddPost from 'src/views/apps/post/AddPost'
import PostsPage from 'src/views/apps/post/posts'
import { viewAllPostStore } from 'src/store/apps/posts'
import { useEffect } from 'react'

const Posts = () => {
  const posts = viewAllPostStore(state => state.posts)
  const getAllPosts = viewAllPostStore(state => state.getAllPosts)

  useEffect(() => {
    getAllPosts()
  }, [getAllPosts])

  return (
    <Grid container spacing={3} justifyContent={'center'}>
      <Grid item xs={12} md={9} sm={12} lg={8}>
        <Card>
          <AddPost />
        </Card>
      </Grid>
      <Grid item xs={12} md={9} sm={12} lg={8}>
        <Card>
          <PostsPage posts={posts} />
        </Card>
      </Grid>
    </Grid>
  )
}

Posts.acl = {
  action: 'read',
  subject: 'member-page'
}
export default Posts

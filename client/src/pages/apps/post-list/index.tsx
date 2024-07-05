import { approvePostStore } from 'src/store/apps/posts'
import { useEffect } from 'react'
import ApprovePost from 'src/views/apps/post-list/ApprovePost'
import PostsPage from 'src/views/apps/post/posts'
import { Grid } from '@mui/material'

const PostListPage = () => {
  const listPost = approvePostStore(state => state.listposts)
  const getListPost = approvePostStore(state => state.getListPost)
  const loading = approvePostStore(state => state.loading)
  const openModalPost = approvePostStore(state => state.openModalPost)
  const closeModalPost = approvePostStore(state => state.closeModalPost)
  const openModal = approvePostStore(state => state.openModal)
  const approvePost = approvePostStore(state => state.approvePost)
  const modalPost = approvePostStore(state => state.modalPost)

  useEffect(() => {
    getListPost()
  }, [])

  return (
    <>
      {/* <PostList openModalPost={openModalPost} closeModalPost={closeModalPost} loading={loading} listPost={listPost} /> */}
      <Grid container justifyContent={'center'}>
        <Grid item xs={12} md={9} sm={12} lg={8}>
          <PostsPage posts={listPost} approvePost={approvePost} />
        </Grid>
      </Grid>
    </>
  )
}

PostListPage.acl = {
  action: 'read',
  subject: 'post'
}
export default PostListPage

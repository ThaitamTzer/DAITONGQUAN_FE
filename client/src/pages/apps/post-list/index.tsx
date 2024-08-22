import { approvePostStore } from 'src/store/apps/posts'
import PostsPage from 'src/views/apps/post/posts'
import { Grid } from '@mui/material'
import useSWR from 'swr'
import postService from 'src/service/post.service'
import { PostSkeleton } from 'src/views/skeleton'

const PostListPage = () => {
  const approvePost = approvePostStore(state => state.approvePost)

  const { data: listPost, isLoading } = useSWR('GetListPost', postService.getListPost, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    refreshInterval: 3000,
    errorRetryCount: 2
  })

  return (
    <>
      <Grid container justifyContent={'center'}>
        <Grid item xs={12} md={9} sm={12} lg={8}>
          {isLoading ? <PostSkeleton /> : null}
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

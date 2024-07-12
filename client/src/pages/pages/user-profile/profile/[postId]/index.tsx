import { useRouter } from 'next/router'
import { postIdStore, usePostStore } from 'src/store/apps/posts'
import { useEffect } from 'react'
import { Grid, IconButton } from '@mui/material'
import ViewPost from 'src/views/apps/post/viewPost'
import Icon from 'src/@core/components/icon'

const PostPage = () => {
  const getPostById = usePostStore(state => state.getPostById)
  const clearPostData = usePostStore(state => state.clearPostData)
  const getAllComments = usePostStore(state => state.getAllComments)
  const { setPostId } = postIdStore(state => state)
  const comments = usePostStore(state => state.allComments)
  const post = usePostStore(state => state.post)
  const router = useRouter()
  const { postId } = router.query

  useEffect(() => {
    const handleRouteChange = () => {
      clearPostData() // Xóa dữ liệu bài viết
    }

    router.beforePopState(() => {
      handleRouteChange()

      return true
    })

    return () => {
      router.beforePopState(() => true) // Cleanup function
    }
  }, [router, clearPostData])

  useEffect(() => {
    if (postId) {
      getPostById(postId as string)
      getAllComments(postId as string)
      setPostId(postId as string)
    }
  }, [postId, getPostById, getAllComments, setPostId])

  return (
    <Grid container justifyContent={'center'} pt={'0px !important'}>
      <Grid item xs={12} md={9} sm={12} lg={7}>
        <IconButton onClick={() => router.back()} sx={{ mb: 2 }}>
          <Icon icon='ep:back' />
        </IconButton>
        <ViewPost post={post} postId={postId as string} comments={comments} />
      </Grid>
    </Grid>
  )
}

PostPage.acl = {
  action: 'read',
  subject: 'member-page'
}

export default PostPage

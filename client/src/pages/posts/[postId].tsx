import { Grid, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { editPostState, postIdStore, usePostStore } from 'src/store/apps/posts'
import ViewPost from 'src/views/apps/post/viewPost'
import Icon from 'src/@core/components/icon'
import ReportPost from 'src/views/apps/post/ReportPost'
import EditPost from 'src/views/apps/post/EditPost'

const PostDetail = () => {
  const getPostById = usePostStore(state => state.getPostById)
  const getAllComments = usePostStore(state => state.getAllComments)
  const comments = usePostStore(state => state.allComments)
  const { openEditModal, editPost, closeEditPost, loading } = editPostState(state => state)
  const updatePost = usePostStore(state => state.updateUserPost)
  const post = usePostStore(state => state.post)
  const router = useRouter()
  const { setPostId } = postIdStore(state => state)
  const { postId } = router.query

  useEffect(() => {
    if (postId) {
      getPostById(postId as string)
      getAllComments(postId as string)
      setPostId(postId as string)
    }
  }, [postId])

  return (
    <Grid container justifyContent={'center'} pt={'0px !important'}>
      <Grid item xs={12} md={9} sm={12} lg={7}>
        <IconButton onClick={() => router.back()} sx={{ mb: 2 }}>
          <Icon icon='ep:back' />
        </IconButton>
        <ViewPost post={post} postId={postId as string} comments={comments} />
      </Grid>
      <ReportPost />
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

PostDetail.acl = {
  action: 'read',
  subject: 'member-page'
}
export default PostDetail

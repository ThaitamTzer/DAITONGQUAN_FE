import { Grid, IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { editPostState, postIdStore, usePostStore } from 'src/store/apps/posts'
import ViewPost from 'src/views/apps/post/viewPost'
import Icon from 'src/@core/components/icon'
import ReportPost from 'src/views/apps/post/ReportPost'
import EditPost from 'src/views/apps/post/EditPost'
import useSWR from 'swr'
import postService from 'src/service/post.service'

const PostDetail = () => {
  const { openEditModal, editPost, closeEditPost, loading } = editPostState(state => state)
  const updatePost = usePostStore(state => state.updateUserPost)
  const router = useRouter()
  const { setPostId } = postIdStore(state => state)
  const { postId } = router.query
  const { data: post } = useSWR(['GetPostById', postId], () => postService.getPostById(postId as string), {
    revalidateOnFocus: true,
    revalidateIfStale: true
  })

  const { data: comments } = useSWR(
    ['GetCommentByPostId', postId],
    () => postService.getCommentByPostId(postId as string),
    {
      revalidateOnFocus: true,
      revalidateIfStale: true
    }
  )

  useEffect(() => {
    if (postId) {
      setPostId(postId as string)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  subject: 'view-post'
}
export default PostDetail

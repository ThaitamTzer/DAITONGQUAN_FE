import { Card, Grid } from '@mui/material'
import AddPost from 'src/views/apps/post/AddPost'
import PostsPage from 'src/views/apps/post/posts'
import { commentPostState, editPostState, usePostStore } from 'src/store/apps/posts'
import CommentPost from 'src/views/apps/post/CommentPost'
import EditPost from 'src/views/apps/post/EditPost'
import ReportPost from 'src/views/apps/post/ReportPost'
import useSWRInfinite from 'swr/infinite'
import postService from 'src/service/post.service'
import { PostSkeleton } from 'src/views/skeleton'
import { useEffect } from 'react'
import { GetPostType } from 'src/types/apps/postTypes'
import ViewAllStory from 'src/views/apps/story/allStory'
import ViewStoryModal from 'src/views/apps/story/viewStory'

const Posts = () => {
  const { post, commentPost, openCommentModal, closeCommentModalPost, openCommentModalPost, setPageIndex, pageIndex } =
    commentPostState(state => state)

  const reactionPost = usePostStore(state => state.reactionPost)
  const deleteReactionPost = usePostStore(state => state.deleteReactionPost)
  const { openEditModal, editPost, openEditPost, closeEditPost, loading } = editPostState(state => state)
  const deletePost = usePostStore(state => state.deletePost)
  const addPostToFavorite = usePostStore(state => state.addPostToFavorite)
  const updatePost = usePostStore(state => state.updateUserPost)

  const fetchPosts = (pageIndex: number, previousPageData: GetPostType[] | null) => {
    if (previousPageData && previousPageData.length === 0) return null // Reached the end

    const newPageIndex = pageIndex + 1

    return `/pagination?limit=10&page=${newPageIndex}`
  }

  const { data, error, size, setSize, mutate } = useSWRInfinite(fetchPosts, postService.getAllPostsPagination, {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    refreshInterval: 10000,
    errorRetryCount: 2
  })

  const handleCommentPost = async (data: any) => {
    await commentPost(data)
    await mutate()
  }

  const handleReaction = async (postId: string, action: string) => {
    await reactionPost(postId, action)
    await mutate()
  }

  const handleDeleteReactionPost = async (postId: string) => {
    await deleteReactionPost(postId)
    await mutate()
  }

  const posts = data ? data.flat() : []
  const isLoading = !data && !error
  const isLoadingMore = isLoading || (size > 0 && data && typeof data[size - 1] === 'undefined')
  const isEmpty = data?.[0]?.length === 0
  const isReachingEnd = isEmpty || (data && data[data.length - 1]?.length < 10)

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !isReachingEnd && !isLoadingMore) {
        setSize(size + 1)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [isReachingEnd, isLoadingMore, setSize, size])

  return (
    <Grid container spacing={3} justifyContent={'center'}>
      <Grid item xs={12} md={9} sm={12} lg={8}>
        <ViewAllStory />
        <ViewStoryModal />
      </Grid>
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
            reactionPost={handleReaction}
            deleteReactionPost={handleDeleteReactionPost}
            openCommentModalPost={openCommentModalPost}
            addPostToFavorite={addPostToFavorite}
            openEditPost={openEditPost}
            updatePost={updatePost}
            deletePost={deletePost}
          />
          {isLoadingMore && <PostSkeleton />}
        </Card>
      </Grid>
      <CommentPost
        post={post}
        closeCommentModalPost={closeCommentModalPost}
        openCommentModal={openCommentModal}
        commentPost={handleCommentPost}
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

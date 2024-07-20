import { GetPostType, UpdatePostType } from '../apps/postTypes'

export type UserPostsPageProps = {
  posts: GetPostType[] | undefined
  post?: GetPostType
  children?: React.ReactNode
  approvePost?: (_id: string, isApproved: boolean) => Promise<void>
  reactionPost?: (_id: string, action: string) => Promise<void>
  deleteReactionPost?: (_id: string) => Promise<void>
  openCommentModalPost?: (data: GetPostType) => void
  addPostToFavorite?: (_id: string) => Promise<void>
  updatePost?: (_id: string, data: UpdatePostType) => Promise<void>
  deletePost?: (_id: string) => Promise<void>
  openEditPost?: (data: GetPostType) => void
}

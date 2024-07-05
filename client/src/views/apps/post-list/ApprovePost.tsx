import { Dialog, DialogContent, DialogTitle } from '@mui/material'
import { GetPostType } from 'src/types/apps/postTypes'

type ApprovePostType = {
  loading: boolean
  openModal: boolean
  modalPost: GetPostType
  closeModalPost: () => void
  approvePost: (_id: string, isApproved: boolean) => Promise<void>
}

const ApprovePost = (props: ApprovePostType) => {
  const { loading, modalPost, closeModalPost, approvePost, openModal } = props

  return (
    <Dialog fullWidth maxWidth='md' open={openModal} onClose={() => closeModalPost()}>
      <DialogTitle>Approve Post</DialogTitle>
    </Dialog>
  )
}

export default ApprovePost

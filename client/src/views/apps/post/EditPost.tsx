import { Dialog, DialogContent } from '@mui/material'
import { EditPostState } from 'src/store/apps/posts'

const EditPost = (props: EditPostState) => {
  const { openEditModal, editPost, closeEditPost } = props
  const handleCloseEditModal = () => {
    closeEditPost()
  }

  return (
    <Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth='sm'>
      <DialogContent></DialogContent>
    </Dialog>
  )
}

export default EditPost

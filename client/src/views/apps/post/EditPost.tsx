import { Dialog } from '@mui/material'
import { EditPostState } from 'src/store/apps/posts'
import Post from './post'
import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'

const EditPost = (props: EditPostState) => {
  const { openEditModal, editPost, closeEditPost, updateUserPost } = props

  return (
    <Dialog
      open={openEditModal}
      onClose={closeEditPost}
      fullWidth
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogWithCustomCloseButton handleClose={closeEditPost} style={{ p: '0px !important' }}>
        <Post post={editPost} updateUserPost={updateUserPost} closeEditPost={closeEditPost} />
      </DialogWithCustomCloseButton>
    </Dialog>
  )
}

export default EditPost

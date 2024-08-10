import { Button, Dialog, DialogActions, Typography } from '@mui/material'
import React from 'react'
import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'
import { useStoryStore } from 'src/store/apps/story'
import toast from 'react-hot-toast'
import { mutate } from 'swr'
import { Story } from 'src/service/story.service'

const ActionStory = () => {
  const { openActionStoryModal, handleCloseActionStoryModal, deleteStory, id, toggleViewStoryModal, setAnchorEl } =
    useStoryStore(state => state)

  const handleDeleteStory = () => {
    try {
      setAnchorEl(null)
      handleCloseActionStoryModal()
      toast.promise(deleteStory(id), {
        loading: 'Deleting story...',
        success: () => {
          mutate('/story/list-story')
          toggleViewStoryModal({} as Story)

          return 'Story deleted successfully'
        },
        error: 'Error deleting story'
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <Dialog
      open={openActionStoryModal}
      onClose={handleCloseActionStoryModal}
      fullWidth
      maxWidth='sm'
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogWithCustomCloseButton handleClose={handleCloseActionStoryModal}>
        <Typography>Delete This Story?</Typography>
      </DialogWithCustomCloseButton>
      <DialogActions>
        <Button onClick={handleCloseActionStoryModal}>Cancel</Button>
        <Button variant='contained' onClick={handleDeleteStory} color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ActionStory

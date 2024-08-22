import React, { useState } from 'react'
import { Button, Dialog, DialogActions, DialogTitle, Grid, TextField, Typography } from '@mui/material'
import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'
import { useStoryStore } from 'src/store/apps/story'
import VisuallyHiddenInput from 'src/pages/components/upload'
import Icon from 'src/@core/components/icon'
import toast from 'react-hot-toast'
import { mutate } from 'swr'

const AddStoryModal = () => {
  const { openAddStoryModal, handleCloseAddStoryModal, addStory, setAnchorEl } = useStoryStore(state => state)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [fileType, setFileType] = useState<string | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const fileURL = URL.createObjectURL(file)
      setFile(file)
      setFileName(file.name)
      setFilePreview(fileURL)
      setFileType(file.type)
    }
  }

  const handleAddStory = () => {
    if (fileName && filePreview) {
      try {
        toast.promise(addStory(fileName, file), {
          loading: 'Adding story...',
          success: () => {
            mutate('/story/list-story')

            return 'Story added successfully'
          },
          error: 'Error adding story'
        })
        handleCloseAddStoryModal()
        setFilePreview(null)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <Dialog
      open={openAddStoryModal}
      onClose={() => {
        handleCloseAddStoryModal()
        setFilePreview(null)
      }}
      fullWidth
      sx={{
        '.MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle>
        <Typography variant='h4'>Add Story</Typography>
      </DialogTitle>
      <DialogWithCustomCloseButton
        handleClose={() => {
          handleCloseAddStoryModal()
          setFilePreview(null)
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {filePreview &&
              (fileType?.startsWith('image/') ? (
                <img src={filePreview} alt='Preview' style={{ maxWidth: '100%', maxHeight: '400px' }} />
              ) : (
                <video controls style={{ maxWidth: '100%', maxHeight: '400px' }}>
                  <source src={filePreview} type={fileType || undefined} />
                  Your browser does not support the video tag.
                </video>
              ))}
          </Grid>
          <Grid item xs={12}>
            <Button
              sx={{
                p: '0 !important'
              }}
            >
              <VisuallyHiddenInput
                id='upload-image'
                type='file'
                accept='image/*, video/*'
                onChange={handleFileChange}
              />
              <label htmlFor='upload-image'>
                <Button variant='contained' component='span' startIcon={<Icon icon='ph:upload-fill' />}>
                  Upload Image/Video
                </Button>
              </label>
            </Button>
          </Grid>
        </Grid>
      </DialogWithCustomCloseButton>
      <DialogActions>
        <Button onClick={() => handleCloseAddStoryModal()} variant='outlined'>
          Cancel
        </Button>
        <Button onClick={() => handleAddStory()} variant='contained'>
          Add Story
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddStoryModal

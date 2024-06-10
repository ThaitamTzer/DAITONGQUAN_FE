import React, { useState, useRef, useEffect, ChangeEvent } from 'react'
import styled from '@emotion/styled'
import { Dialog, DialogContent, Grid, Button, Divider } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useTranslation } from 'react-i18next'
import Cropper from 'cropperjs'
import userProfileService from 'src/service/userProfileService.service'

interface AvatarDialogProps {
  open: boolean
  onClose: () => void
  avatarUrl: string
}

const ChangeAvatarDialog: React.FC<AvatarDialogProps> = ({ open, onClose, avatarUrl }) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [cropper, setCropper] = useState<Cropper | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const initialAvatarUrl = avatarUrl // Lưu trữ URL avatar ban đầu

  useEffect(() => {
    if (selectedImage && imageRef.current) {
      const cropperInstance = new Cropper(imageRef.current, {
        aspectRatio: 1,
        viewMode: 1
      })
      setCropper(cropperInstance)
    }
  }, [selectedImage])

  useEffect(() => {
    if (open) {
      setSelectedImage(null)
      setCropper(null)
    }
  }, [open, initialAvatarUrl]) // Thêm initialAvatarUrl vào dependencies

  const handleCrop = (): Promise<File | null> => {
    return new Promise((resolve, reject) => {
      if (cropper) {
        cropper.getCroppedCanvas().toBlob(blob => {
          if (blob) {
            const file = new File([blob], 'newImage.jpg', { type: 'image/jpeg' })
            resolve(file)
          } else {
            reject('Error cropping image')
          }
        })
        cropper.destroy()
        setCropper(null)
      } else {
        resolve(null)
      }
    })
  }

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1
  })

  const { t } = useTranslation()

  const handleCancel = () => {
    setSelectedImage(null) // Reset hình ảnh đã chọn
    setCropper(null) // Hủy Cropper nếu đang có
    onClose() // Đóng dialog
  }

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(file)
        if (imageRef.current) {
          imageRef.current.src = reader.result as string
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async () => {
    try {
      const croppedImage = await handleCrop()
      if (croppedImage) {
        setSelectedImage(croppedImage)
        const formData = new FormData()
        formData.append('avatar', croppedImage)
        await userProfileService.uploadProfileAvatar(formData)
        onClose()
      }
    } catch (error) {
      console.error('Error uploading avatar:', error)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth='md'
      scroll='body'
      sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
    >
      <DialogContent
        sx={{
          pb: theme => `${theme.spacing(8)} !important`,
          px: theme => [`${theme.spacing(5)} !important`, `${theme.spacing(15)} !important`],
          pt: theme => [`${theme.spacing(8)} !important`, `${theme.spacing(12.5)} !important`]
        }}
      >
        <form
          noValidate
          autoComplete='off'
          content='multipart/form-data'
          onSubmit={e => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <Grid container spacing={2} direction='column' alignItems='center' justifyContent='center'>
            <Grid item xs={6}>
              {selectedImage ? (
                <div>
                  <div id='image-container'>
                    <img
                      ref={imageRef}
                      src={
                        selectedImage
                          ? URL.createObjectURL(selectedImage)
                          : avatarUrl
                          ? avatarUrl
                          : '/static/img/avatars/avatar-1.jpg'
                      }
                      alt='Selected Profile Picture'
                      style={{ width: '100%', maxHeight: '50vh' }}
                    />
                  </div>
                  <Button onClick={handleCrop}>Crop</Button>
                </div>
              ) : (
                <img
                  src={avatarUrl}
                  alt='Profile Picture'
                  style={{ width: '100%', maxHeight: '50vh', borderRadius: 8, objectFit: 'contain' }}
                />
              )}
            </Grid>
            <Grid item xs={6}>
              <Button component='label' variant='contained' tabIndex={-1} startIcon={Icon({ icon: 'tabler:upload' })}>
                {t('Upload file')}
                <VisuallyHiddenInput
                  type='file'
                  accept='.jpg, .jpeg, .png'
                  multiple={false}
                  onChange={handleImageChange}
                />
              </Button>
            </Grid>
            <Divider sx={{ marginBottom: '10px' }} />
            <Grid container direction='row' alignItems='center' justifyContent='center' spacing={2}>
              <Grid item>
                <Button type='submit' variant='contained'>
                  {t('Cập nhật')}
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={handleCancel} variant='outlined'>
                  {t('Hủy')}
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ChangeAvatarDialog

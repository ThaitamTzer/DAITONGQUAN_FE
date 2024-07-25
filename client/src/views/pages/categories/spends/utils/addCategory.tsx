import React, { useState } from 'react'
import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Grid,
  TextField,
  Divider,
  Box,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  Fade,
  Button,
  Avatar
} from '@mui/material'
import { Controller } from 'react-hook-form'
import { useForm } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { yupResolver } from '@hookform/resolvers/yup'
import { getCreateCategoryValidationSchema } from 'src/configs/validationSchema'
import { useTranslation } from 'react-i18next'
import categoriesService from 'src/service/categories.service'

// ** Import icon json
import icons from 'src/configs/expense_icons.json'
import toast from 'react-hot-toast'
import { mutate } from 'swr'
import { ColorPicker } from '../../../../categories/colorPicker'

export const presetColors = ['#a2be2b', '#f9a825', '#f44336', '#ff5722', '#e91e63', '#9c27b0', '#673ab7']

const AddCategory = () => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [selectedIcon, setSelectedIcon] = React.useState<string | null>('mdi-cash')
  const [color, setColor] = useState('#a2be2b')
  const [show, setShow] = React.useState<string>('show')
  const { t } = useTranslation()

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setSelectedIcon('mdi-cash')
    setShow('show')
    reset() // reset form
  }
  const handleSelectIcon = (event: React.MouseEvent<HTMLElement>, newIconSelected: string | null) => {
    setSelectedIcon(newIconSelected)
  }

  interface FormData {
    name: string
    icon: string
    description: string
    type: string
    color: string
    status: string
  }

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid }
  } = useForm<FormData>({
    resolver: yupResolver(getCreateCategoryValidationSchema(t)),
    mode: 'onBlur'
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await categoriesService.createCategory({
        name: data.name,
        icon: selectedIcon,
        description: data.description,
        type: 'spend',
        color: color,
        status: show
      })
      setLoading(false)
      handleClose()
      toast.success('Category added successfully')
      mutate('GET_ALL_SPENDS')
    } catch (error: any) {
      toast.error(error.response.data.message || 'Error while adding category')
      setLoading(false)
      handleClose()
    }
  }

  return (
    <>
      <Grid item marginBottom={3}>
        <Tooltip
          title={`Add new category`}
          placement='top'
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 300 }}
          arrow
        >
          <Button
            variant='outlined'
            sx={{
              width: 300,
              height: 85,
              borderWidth: 1,
              display: 'flex',
              alignItems: 'center',
              borderRadius: '10px',
              flexDirection: 'column',
              justifyContent: 'center',
              borderStyle: 'solid'
            }}
            onClick={handleOpen}
          >
            <>
              <Avatar variant='rounded' sx={{ backgroundColor: 'transparent' }}>
                <Icon width={'30px'} icon='mdi:plus-circle' />
              </Avatar>
            </>
          </Button>
        </Tooltip>
      </Grid>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth='md'>
        <DialogTitle textAlign={'center'} marginBottom={3}>
          <Typography variant='h2'>Add new category</Typography>
        </DialogTitle>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <DialogContent
            sx={{
              padding: 5
            }}
          >
            <Grid container display={'flex'} justifyContent={'space-around'} spacing={5}>
              <Grid item xs={4}>
                <Grid container spacing={3}>
                  <Grid item xs={11}>
                    <Box
                      sx={{
                        maxWidth: '100%',
                        width: 350
                      }}
                    >
                      <Controller
                        name='name'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            fullWidth
                            size='small'
                            label='Name Category'
                            error={Boolean(errors.name)}
                            {...(errors.name && { helperText: errors.name.message })}
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={11}>
                    <Box
                      sx={{
                        maxWidth: '100%',
                        width: 350
                      }}
                    >
                      <Controller
                        name='description'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label='Description'
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={Boolean(errors.description)}
                            {...(errors.description && { helperText: errors.description.message })}
                          />
                        )}
                      />
                    </Box>
                  </Grid>
                  {/* add and cancel button */}
                  <Grid item xs={11}>
                    <LoadingButton
                      loading={loading}
                      sx={{ marginRight: 2 }}
                      disabled={!isValid}
                      variant='contained'
                      color='primary'
                      type='submit'
                    >
                      Add
                    </LoadingButton>
                    <Button variant='outlined' onClick={handleClose}>
                      Cancel
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Divider orientation='vertical' flexItem />
              <Grid item xs={7}>
                <Typography variant='h6'>Select Icon</Typography>
                <Box
                  sx={{
                    maxWidth: '100%',
                    width: 500,
                    display: 'flex',
                    justifyContent: 'space-around',
                    flexWrap: 'wrap',
                    overflowX: 'auto'
                  }}
                >
                  {icons.map((icon: any) => (
                    <ToggleButtonGroup key={icon.id} value={selectedIcon} exclusive onChange={handleSelectIcon}>
                      <ToggleButton sx={{ marginBottom: 1 }} value={icon.icon}>
                        <Icon icon={icon.icon} color={color} />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  ))}
                </Box>
                <Grid xs={12}>
                  <Typography variant='h6' sx={{ marginTop: 2 }}>
                    Select Color
                  </Typography>
                  <Box
                    sx={{
                      maxWidth: '100%',
                      width: 1700
                    }}
                  >
                    <ColorPicker color={color} onChange={setColor} presetColors={presetColors} />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
        </form>
      </Dialog>
    </>
  )
}

AddCategory.acl = {
  action: 'read',
  subject: 'member-page'
}

export default AddCategory

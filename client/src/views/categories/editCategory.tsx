import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Grid,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from '@mui/material'
import { useCategoryStore } from 'src/store/categories'
import Icon from 'src/@core/components/icon'
import { Controller, useForm } from 'react-hook-form'
import icons from 'src/configs/expense_icons.json'
import { ColorPicker } from './colorPicker'
import { presetColors } from './addCategory'
import { getCreateCategoryValidationSchema } from 'src/configs/validationSchema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomCloseButton } from '../components/dialog/customDialog'

type EditCategoryProps = {
  type: string
  swr: string
}

const EditCategory = (props: EditCategoryProps) => {
  const { type, swr } = props
  const { handleCloseUpdateCategoryModal, openUpdateCategoryModal, handleUpdateCategory } = useCategoryStore()
  const category = useCategoryStore(state => state.data)
  const [selectedIcon, setSelectedIcon] = useState<string | null>('mdi-cash')
  const [color, setColor] = useState(category?.color)
  const { t } = useTranslation()
  const [scroll] = useState<DialogProps['scroll']>('paper')

  console.log(category)

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

  useEffect(() => {
    reset({
      name: category?.name,
      description: category?.description,
      icon: category?.icon,
      type: category?.type,
      color: category?.color,
      status: category?.status
    })
    setSelectedIcon(category?.icon || 'mdi-cash')
    setColor(category?.color || '#fff')
  }, [category, reset])

  const handleClose = () => {
    handleCloseUpdateCategoryModal()
    setSelectedIcon(category?.icon || null)
    setColor(category?.color)
    reset({
      name: category?.name,
      description: category?.description
    })
  }

  const onSubmit = async (data: FormData) => {
    try {
      await handleUpdateCategory(
        {
          cateId: category?._id,
          name: data.name,
          icon: selectedIcon,
          description: data.description,
          color: color,
          type: type,
          status: 'show'
        },
        swr
      )
      handleClose()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Dialog
        scroll={scroll}
        open={openUpdateCategoryModal}
        onClose={handleClose}
        fullWidth
        maxWidth='lg'
        sx={{
          '& .MuiDialog-paper': { overflow: 'visible' }
        }}
      >
        <DialogTitle>
          <Typography variant='h2'>Add new category</Typography>
        </DialogTitle>
        <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <CustomCloseButton onClick={handleClose}>
              <Icon icon='tabler:x' fontSize='1.25rem' />
            </CustomCloseButton>
            <Grid container spacing={3}>
              <Grid item container spacing={3} lg={4} justifyContent={'flex-start'}>
                <Grid item xs={12}>
                  <Grid item container spacing={3}>
                    <Grid item xs={12}>
                      <Controller
                        name='name'
                        control={control}
                        defaultValue={category?.name}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            value={value}
                            required
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
                    </Grid>
                    <Grid item xs={12}>
                      <Controller
                        name='description'
                        control={control}
                        defaultValue={category?.description}
                        rules={{ required: true }}
                        render={({ field: { value, onChange, onBlur } }) => (
                          <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label='Description'
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            error={Boolean(errors.description)}
                            {...(errors.description && { helperText: errors.description.message })}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item container spacing={3} lg={8}>
                <Grid item container spacing={1} xs={12}>
                  {icons.map(icon => (
                    <Grid item key={icon.id}>
                      <ToggleButtonGroup
                        key={icon.id}
                        defaultValue={category?.icon}
                        value={selectedIcon}
                        exclusive
                        onChange={handleSelectIcon}
                      >
                        <ToggleButton
                          value={icon.icon}
                          sx={{
                            width: 40,
                            height: 40
                          }}
                        >
                          <Icon icon={icon.icon} color={color} fontSize={'25px'} />
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Grid>
                  ))}
                </Grid>
                <Grid item xs={12}>
                  <Box width={'100%'}>
                    <ColorPicker color={color || '#fff'} onChange={setColor} presetColors={presetColors} />
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Grid container justifyContent={'flex-end'}>
              <Grid item mr={2}>
                <Button onClick={() => handleClose}>Cancel</Button>
              </Grid>
              <Grid item>
                <Button type='submit' variant='contained' color='primary' disabled={!isValid}>
                  Update
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default EditCategory

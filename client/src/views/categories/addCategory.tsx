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
import { presetColors } from '../pages/categories/spends/utils/addCategory'
import { getCreateCategoryValidationSchema } from 'src/configs/validationSchema'
import { yupResolver } from '@hookform/resolvers/yup'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { CustomCloseButton } from '../components/dialog/customDialog'

type AddCategoryProps = {
  type: string
  swr: string
}

const AddCategory = (props: AddCategoryProps) => {
  const { type, swr } = props
  const { handleOpenAddCategoryModal, handleCloseAddCategoryModal, openAddCategoryModal, handleAddCategory } =
    useCategoryStore()
  const [selectedIcon, setSelectedIcon] = useState<string | null>('mdi-cash')
  const [color, setColor] = useState('#a2be2b')
  const { t } = useTranslation()
  const [scroll] = useState<DialogProps['scroll']>('paper')

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

  const handleClose = () => {
    handleCloseAddCategoryModal()
    setSelectedIcon('mdi-cash')
    setColor('#a2be2b')
    reset({
      name: '',
      description: ''
    })
  }

  const onSubmit = async (data: FormData) => {
    try {
      await handleAddCategory(
        {
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
      <Grid item container lg={1.8} md={2} sm={3} xs={12}>
        <Grid item xs={12}>
          <Button fullWidth variant='contained' onClick={() => handleOpenAddCategoryModal()}>
            Add Category
          </Button>
        </Grid>
      </Grid>
      <Dialog
        scroll={scroll}
        open={openAddCategoryModal}
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
                      <ToggleButtonGroup value={selectedIcon} exclusive onChange={handleSelectIcon}>
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
                    <ColorPicker color={color} onChange={setColor} presetColors={presetColors} />
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
                  Add
                </Button>
              </Grid>
            </Grid>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}

export default AddCategory

import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Dialog,
  DialogTitle,
  Typography,
  DialogContent,
  Grid,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
  IconButton
} from '@mui/material'
import { Box } from '@mui/system'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { getCreateCategoryValidationSchema } from 'src/configs/validationSchema'
import categoriesService from 'src/service/categories.service'
import { mutate } from 'swr'
import icons from 'src/configs/expense_icons.json'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Icon from 'src/@core/components/icon'
import { ColorPicker } from './colorPicker'
import { presetColors } from './addCategory'

const UpdateCategory = ({ spendCategory }: any) => {
  const [openEdit, setOpenEdit] = useState(false)
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string | null>('mdi-cash')
  const [color, setColor] = useState('#a2be2b')
  const { t } = useTranslation()

  const handleOpenEdit = (category: Category) => {
    setCategory(category)
    setSelectedIcon(category.icon)
    setColor(category.color)
    setOpenEdit(true)
  }

  const handleCloseEdit = () => {
    setOpenEdit(false)
    reset()
  }

  interface FormData {
    name: string
    icon: string
    description: string
    type: string
    color: any
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

  const handleSelectIcon = (event: React.MouseEvent<HTMLElement>, newIconSelected: string | null) => {
    setSelectedIcon(newIconSelected)
  }

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    try {
      await categoriesService.createCategory({
        name: data.name,
        icon: selectedIcon,
        description: data.description,
        type: data.type,
        color: color,
        status: 'show'
      })
      setLoading(false)
      handleCloseEdit()
      toast.success('Category added successfully')
      mutate('GET_ALL_SPENDS')
    } catch (error: any) {
      toast.error(error.response.data.message || 'Error while adding category')
      setLoading(false)
      handleCloseEdit()
    }
  }

  type Category = {
    _id: string
    name: string
    icon: string
    color: any
    type: string
    status: string
    description: string
  }

  return (
    <>
      <IconButton
        onClick={() => {
          handleOpenEdit(spendCategory)
        }}
      >
        <Icon icon='tabler:edit' />
      </IconButton>
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth='md'>
        <DialogTitle textAlign={'center'} marginBottom={3}>
          <Typography variant='h2'>Update Category</Typography>
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
                        defaultValue={category?.name}
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
                        defaultValue={category?.description}
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
                  <Grid item xs={11}>
                    <Controller
                      name='type'
                      control={control}
                      rules={{ required: true }}
                      defaultValue={category?.type}
                      render={({ field: { value, onChange, onBlur } }) => (
                        <FormControl>
                          <FormLabel id='demo-radio-buttons-group-label'>Type</FormLabel>
                          <RadioGroup
                            onChange={onChange}
                            onBlur={onBlur}
                            value={value}
                            row
                            aria-labelledby='demo-radio-buttons-group-label'
                            defaultValue='spend'
                            name='radio-buttons-group'
                          >
                            <FormControlLabel value='spend' control={<Radio />} label='Spend' />
                            <FormControlLabel value='income' control={<Radio />} label='Income' />
                          </RadioGroup>
                        </FormControl>
                      )}
                    />
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
                      Update
                    </LoadingButton>
                    <Button variant='outlined' onClick={() => handleCloseEdit()}>
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
                    <ToggleButtonGroup
                      key={icon.id}
                      defaultValue={category?.icon}
                      value={selectedIcon}
                      exclusive
                      onChange={handleSelectIcon}
                    >
                      <ToggleButton value={icon.icon}>
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

export default UpdateCategory

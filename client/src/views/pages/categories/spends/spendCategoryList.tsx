import React, { useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  Switch,
  DialogContentText,
  DialogActions,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import CustomAvatar from 'src/@core/components/mui/avatar'
import Icon from 'src/@core/components/icon'
import useSWR, { mutate } from 'swr'
import categoriesService from 'src/service/categories.service'
import { useTranslation } from 'react-i18next'
import toast, { Toaster } from 'react-hot-toast'
import { LoadingButton } from '@mui/lab'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { getCreateCategoryValidationSchema } from 'src/configs/validationSchema'
import icons from 'src/configs/expense_icons.json'

const SpendCategoryList = () => {
  const [open, setOpen] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [cateId, setCateId] = useState<string | null>(null)
  const [category, setCategory] = useState<Category | null>(null)
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [orderBy, setOrderBy] = useState<keyof Category>('name')
  const [loading, setLoading] = useState(false)
  const [selectedIcon, setSelectedIcon] = useState<string | null>('mdi-cash')
  const [color, setColor] = useState('#a2be2b')
  const { t } = useTranslation()

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleCloseConfirm = () => setOpenConfirm(false)
  const handleOpenConfirm = (id: string) => {
    setCateId(id)
    setOpenConfirm(true)
  }

  const handleOpenEdit = (category: Category) => {
    setCategory(category)
    setSelectedIcon(category.icon)
    setColor('#a2be2b')
    setOpenEdit(true)
  }

  const { data: spends, mutate: mutateSpends } = useSWR('GET_ALL_SPENDS', categoriesService.getCategoriesSpend)

  const handleRequestSort = (property: keyof Category) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handleStatusChange = async (_id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'show' ? 'hidden' : 'show'

    // Optimistic UI update
    mutateSpends(
      spends.map((item: Category) => (item._id === _id ? { ...item, status: newStatus } : item)),
      false
    )

    try {
      await categoriesService.updateCategory({ CateId: _id, status: newStatus })

      // Revalidate data after successful update
      mutate('GET_ALL_SPENDS')
    } catch (error) {
      // Revert the optimistic update if there's an error
      mutateSpends()
      console.error('Failed to update status:', error)
    }
  }

  const handleDeleteCategory = async (_id: string) => {
    if (!_id) return
    try {
      await categoriesService.deleteCategory(_id)

      // Revalidate data after successful deletion
      mutate('GET_ALL_SPENDS')
      handleCloseConfirm()
      toast.success(t('Xóa danh mục thành công'))
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
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
        color: color
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

  type Category = {
    _id: string
    name: string
    icon: string
    color: any
    type: string
    status: string
    description: string
  }

  const sortedRows =
    spends?.slice().sort((a: Category, b: Category) => {
      if (a[orderBy] < b[orderBy]) return order === 'asc' ? -1 : 1
      if (a[orderBy] > b[orderBy]) return order === 'asc' ? 1 : -1

      return 0
    }) ?? []

  const renderClient = (row: Category) => (
    <CustomAvatar
      sx={{
        mr: 2.5,
        width: 40,
        height: 40,
        fontSize: theme => theme.typography.body1.fontSize,
        bgcolor: `${row.color}1A`
      }}
    >
      <Icon icon={row.icon} color={row.color} />
    </CustomAvatar>
  )

  return (
    <>
      <Button onClick={() => handleOpen()} variant='text'>
        See more {'>>>'}
      </Button>
      <Dialog open={open} fullWidth maxWidth='md' onClose={() => handleClose()}>
        <Toaster
          containerStyle={{
            zIndex: 1400 // Set this to a value higher than the Dialog's z-index
          }}
        />
        <DialogTitle>
          <Typography variant='h3'>List of spend category</Typography>
        </DialogTitle>
        <DialogContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Icon</TableCell>
                  {['name', 'description', 'type', 'status'].map(column => (
                    <TableCell key={column} sortDirection={orderBy === column ? order : false}>
                      <TableSortLabel
                        active={orderBy === column}
                        direction={orderBy === column ? order : 'asc'}
                        onClick={() => handleRequestSort(column as keyof Category)}
                      >
                        {column.charAt(0).toUpperCase() + column.slice(1)}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedRows.map((row: Category) => (
                  <TableRow key={row._id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>{renderClient(row)}</Box>
                    </TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.type}</TableCell>
                    <TableCell>
                      <Switch
                        checked={row.status === 'show'}
                        onChange={() => handleStatusChange(row._id, row.status)}
                        color='primary'
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                          onClick={() =>
                            handleOpenEdit({
                              _id: row._id,
                              name: row.name,
                              icon: row.icon,
                              color: row.color,
                              type: row.type,
                              status: row.status,
                              description: row.description
                            })
                          }
                          variant='contained'
                          color='primary'
                        >
                          Edit
                        </Button>

                        <Button
                          onClick={() => handleOpenConfirm(row._id)}
                          variant='contained'
                          color='error'
                          sx={{ ml: 1 }}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <Dialog open={openConfirm} onClose={handleCloseConfirm}>
                <DialogTitle>{t('Xác nhận xóa')}</DialogTitle>
                <DialogContent>
                  <DialogContentText>{t(`Bạn có chắc chắn muốn xóa danh mục này không?`)}</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleCloseConfirm}>{t('Hủy')}</Button>
                  <Button onClick={() => handleDeleteCategory(cateId as string)} color='error' autoFocus>
                    {t('Xóa')}
                  </Button>
                </DialogActions>
              </Dialog>
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
                            <Button variant='outlined' onClick={() => setOpenEdit(false)}>
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
                          ></Box>
                        </Grid>
                      </Grid>
                    </Grid>
                  </DialogContent>
                </form>
              </Dialog>
            </Table>
          </TableContainer>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default SpendCategoryList

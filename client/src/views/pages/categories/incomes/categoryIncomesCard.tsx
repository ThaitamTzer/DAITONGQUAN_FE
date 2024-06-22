import React, { useState } from 'react'
import { Card, CardContent, CardHeader, Grid, IconButton, Box, useMediaQuery } from '@mui/material'
import { Skeleton } from '@mui/material'
import Icon from 'src/@core/components/icon'
import categoriesService from 'src/service/categories.service'
import useSWR, { mutate } from 'swr'
import toast from 'react-hot-toast'
import UpdateCategory from './utils/updateCategory'
import DeleteCategoryDialog, { ForceDeleteDialog } from './utils/deleteCategoryDialog'
import AddIncomesNote from './utils/addIncomesNote'
import { useTheme } from '@mui/system'
import spendNoteService from 'src/service/spendNote.service'

const CategoryIncomesCard = () => {
  const { data: incomes, error } = useSWR('GET_ALL_INCOMES', categoriesService.getCategoriesIncome)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openForceDelete, setOpenForceDelete] = useState(false)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleOpenDeleteDialog = (id: string) => {
    setCategoryId(id)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false)

  const handleOpenFocreDelete = (id: string) => {
    setCategoryId(id)
    console.log('id', id)

    setOpenForceDelete(true)
  }

  const handleDeleteCategory = async () => {
    if (!categoryId) return
    setLoading(true)
    try {
      await categoriesService.deleteCategory(categoryId)
      setOpenDeleteDialog(false)
      setLoading(false)
      mutate('GET_ALL_INCOMES')
      toast.success('Category deleted successfully')
      setLoading(false)
    } catch (error: any) {
      toast.error(error.response.data.message)
      if (error.response.status === 404) {
        handleOpenFocreDelete(categoryId)
        handleCloseDeleteDialog()
      }
      setLoading(false)
    }
  }

  const handleForceDeleteCategory = async () => {
    if (!categoryId) return
    setLoading(true)
    try {
      await spendNoteService.forceDeleteSpendNote(categoryId)
      setOpenForceDelete(false)
      setLoading(false)
      mutate('GET_ALL_NOTIFICATIONS')
      mutate('GET_ALL_SPENDNOTES')
      toast.success('Note Of Category deleted successfully')
    } catch (error: any) {
      toast.error('Failed to delete')
      setLoading(false)
    }
  }

  const renderSkeleton = () => {
    return (
      <>
        {Array.from(new Array(8)).map((_, index) => (
          <Grid item key={index} marginRight={4} marginBottom={4} sx={{ display: 'flex' }}>
            <Card sx={{ minWidth: 300, borderRadius: '16px', height: 85, padding: '0 !important' }}>
              <CardHeader
                sx={{ padding: '7px 0 0 7px !important' }}
                title={<Skeleton animation='wave' variant='text' width={100} />}
                avatar={<Skeleton animation='wave' variant='circular' width={40} height={40} />}
              />
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  padding: '0px !important'
                }}
              >
                <Skeleton animation='wave' variant='circular' width={38} height={38} />
                <Skeleton animation='wave' variant='circular' width={38} height={38} />
                <Skeleton animation='wave' variant='circular' width={38} height={38} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </>
    )
  }

  return (
    <>
      {incomes &&
        incomes
          .filter((incomeCate: any) => incomeCate.status === 'show')
          .map((incomeCate: any) => (
            <Grid item key={incomeCate._id} marginRight={4} marginBottom={4} sx={{ display: 'flex' }}>
              <Card
                sx={{
                  minWidth: isMobile ? '150px' : '300px',
                  borderRadius: '16px',
                  height: isMobile ? '150px' : '100%',
                  width: isMobile ? '150px' : '150px',
                  padding: '0 !important'
                }}
              >
                <CardHeader
                  sx={{ padding: '7px 0 0 7px !important' }}
                  title={incomeCate.name}
                  avatar={<CustomAvatar incomeCate={incomeCate} />}
                />
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0px !important'
                  }}
                >
                  <Box sx={{ marginLeft: 2, display: 'flex', alignItems: 'center' }}></Box>
                  <Box>
                    <AddIncomesNote incomeCate={incomeCate} />
                    <UpdateCategory incomeCate={incomeCate} />
                    <IconButton onClick={() => handleOpenDeleteDialog(incomeCate._id)}>
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
              <DeleteCategoryDialog
                open={openDeleteDialog && categoryId === incomeCate._id}
                onClose={handleCloseDeleteDialog}
                incomeCate={incomeCate}
                onSubmit={handleDeleteCategory}
                loading={loading}
              />
              <ForceDeleteDialog
                open={openForceDelete}
                onClose={() => setOpenForceDelete(false)}
                incomeCate={incomeCate}
                onSubmit={handleForceDeleteCategory}
                loading={loading}
              />
            </Grid>
          ))}
      {!incomes && !error && renderSkeleton()}
    </>
  )
}

const CustomAvatar = ({ incomeCate }: any) => (
  <Box
    sx={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: `${incomeCate.color}3A`
    }}
  >
    <Icon icon={incomeCate.icon} color={incomeCate.color} width={20} height={20} />
  </Box>
)

export default CategoryIncomesCard

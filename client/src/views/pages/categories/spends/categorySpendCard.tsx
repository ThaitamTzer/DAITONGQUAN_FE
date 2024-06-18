import React, { useState } from 'react'
import { Typography, Button, Card, CardContent, CardHeader, Grid, IconButton, Box } from '@mui/material'
import { Skeleton } from '@mui/material'
import Icon from 'src/@core/components/icon'
import categoriesService from 'src/service/categories.service'
import useSWR, { mutate } from 'swr'
import toast from 'react-hot-toast'
import UpdateCategory from './utils/updateCategory'
import LimitSpend from './utils/limitSpend'
import limitSpendingService from 'src/service/limitSpending.service'
import DeleteCategoryDialog from './utils/deleteCategoryDialog'
import ActionLimitDialog from './utils/actionLimitDialog'
import AddSpendNote from './utils/addSpendNote'

const CategorySpendCard = () => {
  const { data: spends, error } = useSWR('GET_ALL_SPENDS', categoriesService.getCategoriesSpend)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openUpdateLimit, setOpenUpdateLimit] = useState(false)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [limitId, setLimitId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLimitValue, setInitialLimitValue] = useState<number>(0)

  const handleOpenDeleteDialog = (id: string) => {
    setCategoryId(id)
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false)

  const handleOpenUpdateLimit = (limitId: string, id: string, budget: number) => {
    setCategoryId(id)
    setLimitId(limitId)
    setInitialLimitValue(budget)
    setOpenUpdateLimit(true)
  }

  const handleCloseUpdateLimit = () => setOpenUpdateLimit(false)

  const handleDeleteCategory = async () => {
    if (!categoryId) return
    setLoading(true)
    try {
      await categoriesService.deleteCategory(categoryId)
      setOpenDeleteDialog(false)
      setLoading(false)
      mutate('GET_ALL_SPENDS')
      toast.success('Category deleted successfully')
    } catch (error: any) {
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }

  const handleUpdateLimit = async (budget: number) => {
    if (!categoryId) return
    setLoading(true)
    try {
      await limitSpendingService.updateLimit({ spendingLimitId: limitId, budget })
      setOpenUpdateLimit(false)
      setLoading(false)
      mutate('GET_ALL_SPENDS')
      toast.success('Limit updated successfully')
    } catch (error: any) {
      toast.error('Failed to update limit')
      setLoading(false)
    }
  }

  const handleDeleteLimit = async () => {
    setLoading(true)
    try {
      await limitSpendingService.deleteLimit(limitId)
      setOpenUpdateLimit(false)
      setLoading(false)
      mutate('GET_ALL_SPENDS')
      toast.success('Limit deleted successfully')
    } catch (error: any) {
      toast.error('Failed to delete limit')
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
      {spends &&
        spends
          .filter((spendCategory: any) => spendCategory.status === 'show')
          .map((spendCategory: any) => (
            <Grid item key={spendCategory._id} marginRight={4} marginBottom={4} sx={{ display: 'flex' }}>
              <Card sx={{ minWidth: 300, borderRadius: '16px', height: '100', padding: '0 !important' }}>
                <CardHeader
                  sx={{ padding: '7px 0 0 7px !important' }}
                  title={spendCategory.name}
                  avatar={<CustomAvatar spendCategory={spendCategory} />}
                />
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0px !important'
                  }}
                >
                  <Box sx={{ marginLeft: 2, display: 'flex', alignItems: 'center' }}>
                    {spendCategory.spendingLimitId ? (
                      <>
                        <Button
                          variant='text'
                          onClick={() =>
                            handleOpenUpdateLimit(
                              spendCategory.spendingLimitId,
                              spendCategory._id,
                              spendCategory.budget
                            )
                          }
                          sx={{ paddingLeft: '0px !important' }}
                        >
                          limit:{' '}
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                            spendCategory.budget
                          )}
                        </Button>
                      </>
                    ) : (
                      <LimitSpend spendCategory={spendCategory} />
                    )}
                  </Box>
                  <Box>
                    <AddSpendNote spendCate={spendCategory} />
                    <UpdateCategory spendCategory={spendCategory} />
                    <IconButton onClick={() => handleOpenDeleteDialog(spendCategory._id)}>
                      <Icon icon='tabler:trash' />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
              <DeleteCategoryDialog
                open={openDeleteDialog && categoryId === spendCategory._id}
                onClose={handleCloseDeleteDialog}
                spendCategory={spendCategory}
                onSubmit={handleDeleteCategory}
                loading={loading}
              />
              <ActionLimitDialog
                open={openUpdateLimit && categoryId === spendCategory._id}
                onClose={handleCloseUpdateLimit}
                spendCategory={spendCategory}
                onSubmit={handleUpdateLimit}
                loading={loading}
                value={initialLimitValue}
                handleDeleteLimit={handleDeleteLimit}
              />
            </Grid>
          ))}
      {error && <Typography>Error fetching data</Typography>}
      {!spends && !error && renderSkeleton()}
    </>
  )
}

const CustomAvatar = ({ spendCategory }: any) => (
  <Box
    sx={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: `${spendCategory.color}3A`
    }}
  >
    <Icon icon={spendCategory.icon} color={spendCategory.color} width={20} height={20} />
  </Box>
)

export default CategorySpendCard

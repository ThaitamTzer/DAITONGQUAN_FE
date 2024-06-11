import React from 'react'
import {
  Typography,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Tooltip
} from '@mui/material'
import { Box } from '@mui/system'
import { LoadingButton } from '@mui/lab'
import Icon from 'src/@core/components/icon'
import categoriesService from 'src/service/categories.service'
import useSWR, { mutate } from 'swr'
import toast from 'react-hot-toast'
import Skeleton from '@mui/material/Skeleton'
import UpdateCategory from './updateCategory'

interface SquareButtonProps {
  spendCategory: any
  icon: string
  tooltip: string
  style: string
}

export const SquareButton: React.FC<SquareButtonProps> = ({ spendCategory, icon, tooltip, style }) => (
  <Tooltip title={tooltip} placement='top' arrow>
    <Button
      variant='contained'
      sx={{
        padding: '0 !important',
        display: 'flex',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 0,
        borderStyle: 'solid',
        borderTopRightRadius: style || 0,
        borderBottomRightRadius: style || 0,
        backgroundColor: `${spendCategory.color}1A`,
        borderColor: `${spendCategory.color}`,
        ':hover': {
          backgroundColor: `${spendCategory.color}3A`,
          borderColor: `${spendCategory.color}9A`,
          cursor: 'pointer'
        }
      }}
    >
      <Icon icon={icon} />
    </Button>
  </Tooltip>
)

// Custom rounded avatar
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

const DeleteCategoryDialog = ({ open, onClose, spendCategory, onSubmit, loading }: any) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Category</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete {spendCategory.name}?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <LoadingButton loading={loading} variant='contained' color='error' onClick={onSubmit}>
          Delete
        </LoadingButton>
      </DialogActions>
    </Dialog>
  )
}

const CategorySpendCard = () => {
  const { data: spends, error } = useSWR('GET_ALL_SPENDS', categoriesService.getCategoriesSpend)
  const [openDeleteDialog, setOpenDeleteDialog] = React.useState(false)
  const [categoryId, setCategoryId] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  const handleOpenDeleteDialog = (id: string) => {
    setCategoryId(id)
    setOpenDeleteDialog(true)
  }
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false)

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
    }
  }

  if (!spends && !error) {
    return (
      <>
        {Array.from(new Array(6)).map((_, index) => (
          <Grid item key={index} marginRight={4} marginBottom={4} sx={{ display: 'flex' }}>
            <Card
              sx={{
                minWidth: 300,
                borderRadius: '16px',
                height: 85,
                padding: '0 !important'
              }}
            >
              <CardHeader
                sx={{
                  padding: '7px 0 0 7px !important'
                }}
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
      {spends
        ?.filter((spendCategory: any) => spendCategory.status === 'show')
        .map((spendCategory: any) => (
          <Grid item key={spendCategory._id} marginRight={4} marginBottom={4} sx={{ display: 'flex' }}>
            <Card
              sx={{
                minWidth: 300,
                borderRadius: '16px',
                height: 'auto',
                padding: '0 !important'
              }}
            >
              <CardHeader
                sx={{
                  padding: '7px 0 0 7px !important'
                }}
                title={spendCategory.name}
                avatar={<CustomAvatar spendCategory={spendCategory} />}
              />
              <CardContent
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-end',
                  padding: '0px !important'
                }}
              >
                <IconButton>
                  <Icon icon='tabler:plus' />
                </IconButton>
                <UpdateCategory spendCategory={spendCategory} />
                <IconButton onClick={() => handleOpenDeleteDialog(spendCategory._id)}>
                  <Icon icon='tabler:trash' />
                </IconButton>
              </CardContent>
            </Card>
            <DeleteCategoryDialog
              open={openDeleteDialog && categoryId === spendCategory._id}
              onClose={handleCloseDeleteDialog}
              spendCategory={spendCategory}
              onSubmit={handleDeleteCategory}
              loading={loading}
            />
          </Grid>
        ))}
    </>
  )
}

export default CategorySpendCard

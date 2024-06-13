import { Card, Chip, IconButton, Typography, Modal, Box as MuiBox, DialogContent, Dialog, Tooltip } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import spendNoteService from 'src/service/spendNote.service'
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import useSWR from 'swr'
import { useState } from 'react'
import categoriesService from 'src/service/categories.service'
import CustomChip from 'src/@core/components/mui/chip'

type SpendNote = {
  _id: string
  cateId: string
  title: string
  content: string | null
  spendingDate: Date
  paymentMethod: string
  amount: number
  createdAt: Date
  updatedAt: Date
}

type Category = {
  _id: string
  name: string
  icon: string
  color: string
}

interface CellType {
  row: SpendNote
}

const CustomAvatar = ({ category }: any) => (
  <Box
    sx={{
      width: 40,
      height: 40,
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: `${category.color}3A`
    }}
  >
    <Icon icon={category.icon} color={category.color} width={20} height={20} />
  </Box>
)

const ListOfSpendNote = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [open, setOpen] = useState(false)
  const [modalContent, setModalContent] = useState('')

  const { data: cate } = useSWR('GET_ALL_CATEGORIES', categoriesService.getAllCategories)

  const handleDate = (date: Date) => {
    const newDate = new Date(date)

    return newDate.toLocaleDateString('vi', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const HandleCategory = (cateId: string) => {
    const category: Category | undefined = cate?.find((item: Category) => item._id === cateId)

    return category
  }

  const handleOpen = (content: string) => {
    setModalContent(content)
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const columns: GridColDef[] = [
    {
      flex: 0.2,
      minWidth: 100,
      field: 'title',
      headerName: 'Title',
      renderCell({ row }: CellType) {
        return <Typography variant='subtitle1'>{row.title}</Typography>
      }
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'amount',
      headerName: 'Amount',
      renderCell({ row }: CellType) {
        return <Typography variant='subtitle1'>{row.amount}</Typography>
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'content',
      headerName: 'Content',
      renderCell({ row }: CellType) {
        return (
          <Tooltip title={row.content} about={row.content || ''}>
            <Typography sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
              {row.content ? row.content.substring(0, 10) + (row.content.length > 10 ? '...' : '') : ''}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'cateId',
      headerName: 'Category',
      renderCell({ row }: CellType) {
        const category = HandleCategory(row.cateId)

        return category ? (
          <Chip label={category.name} sx={{ backgroundColor: `${category.color}9A`, color: 'white' }} />
        ) : null
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'paymentMethod',
      headerName: 'Method',
      renderCell({ row }: CellType) {
        return <Typography variant='subtitle1'>{row.paymentMethod}</Typography>
      }
    },
    {
      flex: 0.2,
      minWidth: 100,
      field: 'spendingDate',
      headerName: 'Spending Date',
      renderCell({ row }: CellType) {
        return <Typography variant='subtitle1'>{handleDate(row.spendingDate)}</Typography>
      }
    },
    {
      flex: 0.1,
      minWidth: 100,
      field: 'action',
      headerName: 'Action',
      renderCell({ row }: CellType) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton>
              <Icon icon='tabler:edit' />
            </IconButton>
            <IconButton>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  const { data } = useSWR('GET_ALL_SPENDNOTES', spendNoteService.getAllSpendNote)

  return (
    <>
      <Typography variant='h4' sx={{ mb: 4, color: '#3f51b5' }}>
        List Of Spend Note
      </Typography>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <DataGrid
          autoHeight
          rowHeight={62}
          rows={data?.spendingNotes.map((item: { _id: any }) => ({ ...item, id: item._id })) ?? []}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          pageSizeOptions={[10, 25, 50]}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              fontSize: '16px'
            },
            '& .MuiDataGrid-cell': {
              py: 2
            }
          }}
        />
      </Card>
      <Dialog open={open} fullWidth onClose={handleClose}>
        <DialogContent>
          <Typography variant='h6' component='h2'>
            Content
          </Typography>
          <Typography sx={{ mt: 2 }}>{modalContent}</Typography>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ListOfSpendNote

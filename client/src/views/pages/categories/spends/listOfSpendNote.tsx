import { Card, Chip, IconButton, Typography, DialogContent, Dialog, Tooltip, CardHeader, Button } from '@mui/material'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import spendNoteService from 'src/service/spendNote.service'
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import useSWR, { mutate } from 'swr'
import { useState } from 'react'
import categoriesService from 'src/service/categories.service'
import toast from 'react-hot-toast'

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

// const CustomAvatar = ({ category }: any) => (
//   <Box
//     sx={{
//       width: 40,
//       height: 40,
//       borderRadius: '50%',
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       backgroundColor: `${category.color}3A`
//     }}
//   >
//     <Icon icon={category.icon} color={category.color} width={20} height={20} />
//   </Box>
// )

const ListOfSpendNote = () => {
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])
  const [loading, setLoading] = useState(false)

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

  const handleDeleteNote = async (id: string) => {
    setLoading(true)
    try {
      await spendNoteService.deleteSpendNote(id)
      mutate('GET_ALL_SPENDNOTES')
      toast.success('Delete spend note successfully')
      setLoading(false)
    } catch (error: any) {
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }

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
            <IconButton onClick={() => handleDeleteNote(row._id)}>
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
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <CardHeader
          title={
            <Typography variant='h4' sx={{ color: '#3f51b5' }}>
              List Of Spend Note
            </Typography>
          }
          action={
            <Button disabled={rowSelectionModel.length === 0} variant='contained' color='error' sx={{ color: 'white' }}>
              Delete Selected
            </Button>
          }
        />
        <DataGrid
          autoHeight
          rowHeight={62}
          rows={data?.spendingNotes.map((item: { _id: any }) => ({ ...item, id: item._id })).reverse() ?? []}
          columns={columns}
          onRowSelectionModelChange={newSelection => {
            setRowSelectionModel(newSelection)
          }}
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
    </>
  )
}

export default ListOfSpendNote

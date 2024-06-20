import { Card, Chip, IconButton, Typography, Tooltip, CardHeader } from '@mui/material'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import spendNoteService from 'src/service/spendNote.service'
import Icon from 'src/@core/components/icon'
import { Box, flexbox } from '@mui/system'
import useSWR, { mutate } from 'swr'
import { useEffect, useState } from 'react'
import categoriesService from 'src/service/categories.service'
import toast from 'react-hot-toast'
import DeleteManyNotesDialog from './utils/deleteManyNotesDialog'
import React from 'react'
import UpdateSpendNote from './utils/updateSpendNote'
import CustomTextField from 'src/@core/components/mui/text-field'

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
    const category: any | undefined = cate?.find((item: Category) => item._id === cateId)

    return category
  }

  const handleDeleteNote = async (id: string) => {
    setLoading(true)
    try {
      await spendNoteService.deleteSpendNote(id)
      mutate('GET_ALL_SPENDNOTES')
      mutate('GET_ALL_NOTIFICATIONS')
      toast.success('Delete spend note successfully')
      setLoading(false)
    } catch (error: any) {
      toast.error(error.response.data.message)
      setLoading(false)
    }
  }

  const columns: GridColDef[] = [
    {
      flex: 1,
      field: 'title',
      headerName: 'Title',
      renderCell({ row }: CellType) {
        return <Typography variant='subtitle1'>{row.title}</Typography>
      }
    },
    {
      flex: 1,
      field: 'amount',
      headerName: 'Amount',
      renderCell({ row }: CellType) {
        const formattedAmount = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
          row.amount
        )

        return <Typography variant='subtitle1'>{formattedAmount}</Typography>
      }
    },
    {
      flex: 1,
      field: 'content',
      headerName: 'Content',
      renderCell({ row }: CellType) {
        return (
          <Tooltip arrow title={row.content} about={row.content || ''}>
            <Typography sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
              {row.content ? row.content.substring(0, 10) + (row.content.length > 10 ? '...' : '') : ''}
            </Typography>
          </Tooltip>
        )
      }
    },
    {
      flex: 1,
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
      flex: 1,
      field: 'paymentMethod',
      headerName: 'Method',
      renderCell({ row }: CellType) {
        return <Typography variant='subtitle1'>{row.paymentMethod}</Typography>
      }
    },
    {
      flex: 1,
      field: 'spendingDate',
      headerName: 'Date',
      renderCell({ row }: CellType) {
        return <Typography variant='subtitle1'>{handleDate(row.spendingDate)}</Typography>
      }
    },
    {
      flex: 1,
      field: 'action',
      headerName: 'Action',
      renderCell({ row }: CellType) {
        return (
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <UpdateSpendNote spendCate={row} />
            <IconButton onClick={() => handleDeleteNote(row._id)}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </Box>
        )
      }
    }
  ]

  const { data: notes } = useSWR('GET_ALL_SPENDNOTES', spendNoteService.getAllSpendNote)

  // Kiểm tra xem có bất kỳ ghi chú nào có nội dung không
  const hasContent = notes?.spendingNotes.some((note: SpendNote) => note.content)

  // Nếu không có ghi chú nào có nội dung, loại bỏ cột 'Content'
  const finalColumns = hasContent ? columns : columns.filter(column => column.field !== 'content')

  return (
    <>
      <Card sx={{ p: 3, boxShadow: 3 }}>
        <CardHeader
          title={
            <Typography variant='h2' sx={{ color: '#3f51b5' }}>
              List Of Spend Note
            </Typography>
          }
          action={
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginRight: 3 }}>
              {/* add filter by category */}

              <CustomTextField />
              <DeleteManyNotesDialog rowSelectionModel={rowSelectionModel} data={notes?.spendingNotes} />
            </Box>
          }
        />
        <DataGrid
          autoHeight
          rowHeight={62}
          rows={notes?.spendingNotes.map((item: { _id: any }) => ({ ...item, id: item._id })).reverse() ?? []}
          columns={finalColumns}
          disableColumnMenu
          onRowSelectionModelChange={(newSelection: any) => {
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

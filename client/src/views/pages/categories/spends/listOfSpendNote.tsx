import React, { forwardRef, useState, useEffect } from 'react'
import {
  Card,
  Chip,
  IconButton,
  Typography,
  Tooltip,
  CardHeader,
  LinearProgress,
  Divider,
  Grid,
  InputAdornment,
  TextField,
  MenuItem,
  Select
} from '@mui/material'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import spendNoteService from 'src/service/spendNote.service'
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import useSWR, { mutate } from 'swr'
import categoriesService from 'src/service/categories.service'
import toast from 'react-hot-toast'
import DeleteManyNotesDialog from './utils/deleteManyNotesDialog'
import UpdateSpendNote from './utils/updateSpendNote'
import DatePicker from 'react-datepicker'
import { format } from 'date-fns'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { CustomNoRowsOverlay } from 'src/pages/components/datagrid/nodataOverlay'

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
  const [categoryId, setCategoryId] = useState<string>('all')
  const [searchText, setSearchText] = useState<string>('')
  const [notesToDisplay, setNotesToDisplay] = useState<SpendNote[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const { data: cate } = useSWR('GET_ALL_CATEGORIES', categoriesService.getCategoriesSpend)
  const { data: notes } = useSWR('GET_ALL_SPENDNOTES', spendNoteService.getAllSpendNote)

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
      mutate('GET_SPENDNOTE_BY_RANGE_DATE')
      setNotesToDisplay(prevNotes => prevNotes.filter(note => note._id !== id))
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

  const handleOnChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const handleDateGet = (date: Date) => {
    const newDate = new Date(date)
    newDate.toLocaleDateString('vi', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })

    return format(newDate, 'yyyy-MM-dd')
  }

  const { data: spendNoteByRangeDate, error: rangeDateError } = useSWR(
    startDate && endDate ? ['GET_SPENDNOTE_BY_RANGE_DATE', startDate, endDate] : null,
    () =>
      spendNoteService.getSpendNoteByRangeDate({
        startDate: handleDateGet(startDate!),
        endDate: handleDateGet(endDate!)
      }),
    { refreshInterval: 0 }
  )

  useEffect(() => {
    let filteredNotes: any = notes?.spendingNotes || []
    if (rangeDateError?.response?.status === 404) {
      setNotesToDisplay([])

      return
    } else if (spendNoteByRangeDate) {
      filteredNotes = spendNoteByRangeDate
    }

    if (categoryId !== 'all') {
      filteredNotes = filteredNotes.filter((note: any) => note.cateId === categoryId)
    }

    if (searchText) {
      filteredNotes = filteredNotes.filter(
        (note: any) =>
          note.title.toLowerCase().includes(searchText.toLowerCase()) ||
          note.content?.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    setNotesToDisplay(filteredNotes)
  }, [spendNoteByRangeDate, rangeDateError, notes, categoryId, searchText])

  const hasContent = notesToDisplay?.some((note: SpendNote) => note.content)
  const finalColumns = hasContent ? columns : columns.filter(column => column.field !== 'content')

  const CustomInput = forwardRef((props: any, ref) => {
    const startDate = props.start ? format(props.start, 'MM/dd/yy') : ''
    const endDate = props.end ? ` - ${format(props.end, 'MM/dd/yy')}` : ''
    const value = `${startDate}${endDate}`

    return (
      <TextField
        size='small'
        fullWidth
        inputRef={ref}
        label={props.label || ''}
        {...props}
        value={value}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                edge='end'
                onClick={() => {
                  setStartDate(null)
                  setEndDate(null)
                }}
                onMouseDown={e => e.preventDefault()}
                aria-label='toggle password visibility'
              >
                <Icon icon='tabler:x' display={startDate && endDate ? 'block' : 'none'} />
              </IconButton>
            </InputAdornment>
          )
        }}
      />
    )
  })

  return (
    <>
      <Card>
        <CardHeader
          title={<Typography variant='h2'>List Of Spend Note</Typography>}
          sx={{
            borderLeft: '3px solid',
            borderColor: 'primary.main',
            paddingTop: '0 !important',
            paddingBottom: '0 !important',
            marginBottom: 10,
            marginTop: 10
          }}
        />
        <Grid container spacing={3} sx={{ marginLeft: 2, marginRight: 2 }}>
          <Grid item xs={5} md={3} lg={2}>
            <DatePickerWrapper>
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                selected={startDate}
                id='date-range-picker'
                onChange={handleOnChange}
                shouldCloseOnSelect={false}
                customInput={<CustomInput label='Filter by date range' start={startDate} end={endDate} />}
              />
            </DatePickerWrapper>
          </Grid>
          <Grid item xs={5} md={3} lg={2}>
            <Select
              fullWidth
              id='filterByCategory'
              size='small'
              value={categoryId}
              MenuProps={{
                anchorOrigin: {
                  vertical: 'bottom',
                  horizontal: 'left'
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left'
                },
                MenuListProps: {
                  style: {
                    maxHeight: 300
                  }
                }
              }}
              onChange={e => setCategoryId(e.target.value)}
            >
              <MenuItem value='all'>All</MenuItem>
              {cate?.map((category: Category) => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={5} md={3} lg={2}>
            <TextField
              size='small'
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              placeholder='Search by title or content'
              InputProps={{
                startAdornment: (
                  <InputAdornment position='start'>
                    <Icon icon='fluent:search-20-regular' />
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={5} md={3} lg={2}>
            <DeleteManyNotesDialog rowSelectionModel={rowSelectionModel} data={notesToDisplay} />
          </Grid>
        </Grid>
        <Divider sx={{ marginBottom: 4, marginTop: 4 }} />
        <DataGrid
          autoHeight
          loading={!notesToDisplay}
          rowHeight={62}
          rows={notesToDisplay?.map((item: { _id: any }) => ({ ...item, id: item._id })).reverse() ?? []}
          columns={finalColumns}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableColumnMenu
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            loadingOverlay: LinearProgress
          }}
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
            },
            '--DataGrid-overlayHeight': '300px'
          }}
        />
      </Card>
    </>
  )
}

export default ListOfSpendNote

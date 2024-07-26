import React, { useEffect, useState, forwardRef } from 'react'
import {
  Typography,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardHeader,
  Grid,
  Select,
  MenuItem,
  Divider,
  LinearProgress,
  Tooltip
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { Box } from '@mui/system'
import { GridColDef, DataGrid, GridRowSelectionModel } from '@mui/x-data-grid'
import { format } from 'date-fns'
import DatePicker from 'react-datepicker'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import spendNoteService from 'src/service/spendNote.service'
import { NoteTypes } from 'src/types/apps/noteTypes'
import useSWR from 'swr'
import DeleteManyNotesDialog from './deleteManyNotesDialog'
import UpdateSpendNote from './updateSpendNote'
import { CategoryType } from 'src/types/apps/categoryTypes'
import CustomNoRowsOverlay from 'src/pages/components/datagrid/nodataOverlay'

type TableNoteProps = {
  data: NoteTypes[] | undefined
  catedata: CategoryType[] | undefined
}

const TableNote = (props: TableNoteProps) => {
  const { data, catedata } = props

  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])
  const [categoryId, setCategoryId] = useState<string>('all')
  const [searchText, setSearchText] = useState<string>('')
  const [notesToDisplay, setNotesToDisplay] = useState<NoteTypes[]>([])
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  const handleDate = (date: Date) => {
    const newDate = new Date(date)

    return newDate.toLocaleDateString('vi', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const HandleCategory = (cateId: string) => {
    const category: CategoryType | undefined = catedata?.find(item => item._id === cateId)

    return category
  }

  const columns: GridColDef[] = [
    {
      flex: 1,
      field: 'title',
      headerName: 'Title',
      renderCell: ({ row }) => <Typography variant='subtitle1'>{row.title}</Typography>
    },
    {
      flex: 1,
      field: 'amount',
      headerName: 'Amount',
      renderCell: ({ row }) => {
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
      renderCell: ({ row }) => (
        <Tooltip arrow title={row.content} about={row.content || ''}>
          <Typography sx={{ cursor: 'pointer', textDecoration: 'underline' }}>
            {row.content ? row.content.substring(0, 10) + (row.content.length > 10 ? '...' : '') : ''}
          </Typography>
        </Tooltip>
      )
    },
    {
      flex: 1,
      field: 'cateId',
      headerName: 'Category',
      renderCell: ({ row }) => {
        const category = HandleCategory(row.cateId)

        return category ? (
          <Chip
            label={
              <Box display={'flex'} alignItems={'center'}>
                <Typography mr={1}>{category.name}</Typography>
                <Icon icon={category.type === 'spend' ? 'solar:hand-money-linear' : 'tabler:pig-money'} />
              </Box>
            }
            sx={{ backgroundColor: `${category.color}9A`, color: 'white' }}
          />
        ) : null
      }
    },
    {
      flex: 1,
      field: 'paymentMethod',
      headerName: 'Method',
      renderCell: ({ row }) => <Typography variant='subtitle1'>{row.paymentMethod}</Typography>
    },
    {
      flex: 1,
      field: 'spendingDate',
      headerName: 'Date',
      renderCell: ({ row }) => <Typography variant='subtitle1'>{handleDate(row.spendingDate)}</Typography>
    },
    {
      flex: 1,
      field: 'action',
      headerName: 'Action',
      renderCell: ({ row }) => (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <UpdateSpendNote spendCate={row} />
          <IconButton>
            <Icon icon='tabler:trash' />
          </IconButton>
        </Box>
      )
    }
  ]

  const handleOnChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates
    setStartDate(start)
    setEndDate(end)
  }

  const handleDateGet = (date: Date) => {
    const newDate = new Date(date)

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
    let filteredNotes: NoteTypes[] = spendNoteByRangeDate || data || []

    if (rangeDateError?.response?.status === 404) {
      setNotesToDisplay([])

      return
    }

    if (categoryId !== 'all') {
      filteredNotes = filteredNotes.filter(note => note.cateId === categoryId)
    }

    if (searchText) {
      filteredNotes = filteredNotes.filter(
        note =>
          note.title.toLowerCase().includes(searchText.toLowerCase()) ||
          (note.content && note.content.toLowerCase().includes(searchText.toLowerCase()))
      )
    }

    setNotesToDisplay(filteredNotes)
  }, [spendNoteByRangeDate, rangeDateError, data, categoryId, searchText])

  const uniqueCategoryIds = new Set(notesToDisplay.map(note => note.cateId))
  const filteredCategories = catedata?.filter(category => uniqueCategoryIds.has(category._id))

  const hasContent = notesToDisplay.some(note => note.content)
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
        <Box width={'99%'}>
          <Grid container>
            <Grid item container spacing={3}>
              <Grid item container spacing={3} lg={8} md={7} sm={6} xs={12}>
                <Grid item>
                  <DeleteManyNotesDialog
                    rowSelectionModel={rowSelectionModel}
                    data={notesToDisplay}
                    startDate={startDate}
                    endDate={endDate}
                  />
                </Grid>
                <Grid item lg={4} md={4} xs={6}>
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
                <Grid item lg={4} md={4} xs={5}>
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
                    {filteredCategories?.map(category => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.name}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
              </Grid>
              <Grid item lg={3.9} md={4.9} sm={5.9} xs={12}>
                <TextField
                  fullWidth
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
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ marginBottom: 4, marginTop: 4 }} />
        <DataGrid
          autoHeight
          loading={!notesToDisplay}
          rowHeight={62}
          rows={notesToDisplay.map(item => ({ ...item, id: item._id })).reverse() ?? []}
          columns={finalColumns}
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          disableColumnMenu
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            loadingOverlay: LinearProgress
          }}
          onRowSelectionModelChange={(newSelection: any) => setRowSelectionModel(newSelection)}
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

export default TableNote

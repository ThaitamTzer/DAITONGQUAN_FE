import { Button, Dialog, DialogActions, DialogTitle, LinearProgress, Typography } from '@mui/material'
import { Box } from '@mui/system'
import React, { useEffect, useState } from 'react'
import format from 'date-fns/format'
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid'
import { CustomNoRowsOverlay } from 'src/pages/components/datagrid/nodataOverlay'
import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'
import { LoadingButton } from '@mui/lab'
import { useDispatch, useSelector } from 'react-redux'
import { deleteManyEvents, fetchEvents } from 'src/store/apps/calendar'
import { RootState } from 'src/store'

type Event = {
  id: string
  url: string
  title: string
  allDay: boolean
  end: Date | string
  start: Date | string
  extendedProps: {
    location?: string
    calendar?: string
    description?: string
    guests?: string[] | string | undefined
  }
}

interface CellType {
  row: Event
}

const ListOfEvent = () => {
  const [open, setOpen] = useState(false)
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>([])

  const events = useSelector((state: RootState) => state.calendar.events)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleDate = (date: Date | string) => {
    return format(new Date(date), 'dd/MM/yyyy')
  }

  const columns: GridColDef[] = [
    {
      flex: 1,
      field: 'title',
      headerName: 'Title',
      renderCell({ row }: CellType) {
        return <Typography>{row.title}</Typography>
      }
    },
    {
      flex: 1,
      field: 'location',
      headerName: 'Location',
      renderCell({ row }: CellType) {
        return <Typography>{row.extendedProps.location}</Typography>
      }
    },
    {
      flex: 1,
      field: 'startDateTime',
      headerName: 'Start Date',
      renderCell({ row }: CellType) {
        return <Typography>{handleDate(row.start)}</Typography>
      }
    },
    {
      flex: 1,
      field: 'endDateTime',
      headerName: 'End Date',
      renderCell({ row }: CellType) {
        return <Typography>{handleDate(row.end)}</Typography>
      }
    },
    {
      flex: 1,
      field: 'url',
      headerName: 'URL',
      renderCell({ row }: CellType) {
        return row.url ? (
          <Button variant='contained' onClick={() => window.open(row.url, '_blank', 'noopener,noreferrer')}>
            Go to Event
          </Button>
        ) : (
          <Typography>- </Typography>
        )
      }
    },
    {
      flex: 1,
      field: 'note',
      headerName: 'Note',
      renderCell({ row }: CellType) {
        return <Typography>{row.extendedProps.description}</Typography>
      }
    }
  ]

  return (
    <Box sx={{ marginLeft: 5, marginBottom: 10 }}>
      <Button variant='contained' onClick={() => handleOpen()}>
        List of Events
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth='lg'
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle>
          <Typography variant='h1'>List of Events</Typography>
          <DeleteManyNotesDialog rowSelectionModel={rowSelectionModel} data={events} />
        </DialogTitle>
        <DialogWithCustomCloseButton handleClose={handleClose}>
          <Box sx={{ maxHeight: '700px', width: '100%' }}>
            <DataGrid
              rows={events.map((event: Event) => {
                return {
                  ...event,
                  id: event.id
                }
              })}
              columns={columns}
              autoHeight
              checkboxSelection
              pageSizeOptions={[10, 25, 50]}
              paginationModel={paginationModel}
              onPaginationModelChange={setPaginationModel}
              slots={{
                noRowsOverlay: CustomNoRowsOverlay,
                loadingOverlay: LinearProgress
              }}
              onRowSelectionModelChange={(newSelection: any) => {
                setRowSelectionModel(newSelection)
              }}
            />
          </Box>
        </DialogWithCustomCloseButton>
      </Dialog>
    </Box>
  )
}

export default ListOfEvent

const DeleteManyNotesDialog = ({ rowSelectionModel, data }: any) => {
  const [open, setOpen] = React.useState<boolean>(false)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const dispatch = useDispatch()

  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setLoading(false)
  }

  useEffect(() => {
    setSelectedIds(rowSelectionModel)
  }, [rowSelectionModel])

  const handleDeleteManyNotes = async () => {
    setLoading(true)

    // Dispatch the action without await, since dispatching an async thunk does not return a promise.
    dispatch(deleteManyEvents(selectedIds))
      .then(() => {
        // Assuming fetchEvents is also an async thunk, dispatch it after the deleteManyEvents has been dispatched.
        dispatch(fetchEvents(['Work', 'Business', 'Family', 'Holiday', 'ETC']))
      })
      .finally(() => {
        setLoading(false)
        setSelectedIds([])
        handleClose()
      })
  }

  const totalNotes = data?.length

  return (
    <>
      <Button variant='contained' onClick={() => handleOpen()} disabled={rowSelectionModel.length === 0} color='error'>
        Delete Seleted
      </Button>
      <Dialog open={open}>
        <DialogTitle variant='h3'>
          {rowSelectionModel.length === totalNotes ? 'Delete All Notes' : `Delete ${rowSelectionModel.length} Notes`}
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            variant='contained'
            type='submit'
            loading={loading}
            onClick={handleDeleteManyNotes}
            color='error'
            autoFocus
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  )
}

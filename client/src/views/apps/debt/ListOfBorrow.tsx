import React, { Dispatch } from 'react'
import { Card, Typography, CardHeader, IconButton } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import format from 'date-fns/format'
import { GetDebt } from 'src/service/debt.service'
import AddDebt from './AddDebt'
import Icon from 'src/@core/components/icon'
import UpdateDabt from './UpdateDebt'
import ViewDebt from './ViewDebt'

type DebtType = {
  borrow: GetDebt[]
}

type ListOfDebtType = {
  store: DebtType
  dispatch: Dispatch<any>
  addDebt: (debt: AddDebt) => void
  updateDebt: (debt: AddDebt) => void
  deleteDebt: (id: string) => void
  encryptDebt: (id: string) => void
  decryptDebt: (id: string) => void
}

interface CellType {
  row: GetDebt
}

const ListOfBorrow = (props: ListOfDebtType) => {
  const { store, dispatch, addDebt, updateDebt, deleteDebt, encryptDebt, decryptDebt } = props

  const handleDate = (date: Date | string) => {
    return format(new Date(date), 'dd/MM/yyyy')
  }

  const columns: GridColDef[] = [
    {
      flex: 1,
      field: 'creditor',
      headerName: 'Creditor',
      renderCell({ row }: CellType) {
        return <Typography>{row.creditor}</Typography>
      }
    },
    {
      flex: 1,
      field: 'debtor',
      headerName: 'Debtor',
      renderCell({ row }: CellType) {
        return <Typography>{row.debtor}</Typography>
      }
    },
    {
      flex: 1,
      field: 'amount',
      headerName: 'Amount',
      renderCell({ row }: CellType) {
        return <Typography>{row.amount}</Typography>
      }
    },

    // {
    //   flex: 1,
    //   field: 'type',
    //   headerName: 'Type',
    //   renderCell({ row }: CellType) {
    //     return <Typography>{row.type}</Typography>
    //   }
    // },

    // {
    //   flex: 1,
    //   field: 'status',
    //   headerName: 'Status',
    //   renderCell({ row }: CellType) {
    //     return <Typography>{row.status}</Typography>
    //   }
    // },
    {
      flex: 1,
      field: 'dueDate',
      headerName: 'Due Date',
      renderCell({ row }: CellType) {
        return <Typography>{handleDate(row.dueDate)}</Typography>
      }
    },
    {
      flex: 1,
      field: 'action',
      headerName: 'Action',
      renderCell({ row }: CellType) {
        return (
          <>
            <ViewDebt selectedDebt={row} />
            <UpdateDabt
              dispatch={dispatch}
              updateDebt={updateDebt}
              encryptDebt={encryptDebt}
              decryptDebt={decryptDebt}
              selectedDebt={row}
            />
            <IconButton onClick={() => handleDelete(row._id)}>
              <Icon icon='tabler:trash' />
            </IconButton>
          </>
        )
      }
    }
  ]

  const handleDelete = (id: string) => {
    dispatch(deleteDebt(id))
  }

  return (
    <Card>
      <CardHeader
        title={<Typography variant='h2'>List of Borrow</Typography>}
        action={<AddDebt dispatch={dispatch} addDebt={addDebt} type='borrowing_debt' />}
      />
      <DataGrid
        autoHeight
        rows={store.borrow.map(debt => {
          return { ...debt, id: debt._id }
        })}
        columns={columns}
        disableRowSelectionOnClick
      />
    </Card>
  )
}

export default ListOfBorrow

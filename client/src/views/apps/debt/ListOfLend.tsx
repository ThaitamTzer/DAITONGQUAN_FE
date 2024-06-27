import React, { Dispatch, useState } from 'react'
import { Card, Typography, CardHeader, IconButton } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import format from 'date-fns/format'
import { GetDebt } from 'src/service/debt.service'
import AddDebt from './AddDebt'
import Icon from 'src/@core/components/icon'

type DebtType = {
  debts: GetDebt[]
}

type ListOfDebtType = {
  store: DebtType
  dispatch: Dispatch<any>
  addDebt: (debt: AddDebt) => void
}

interface CellType {
  row: GetDebt
}

const ListOfLeding = (props: ListOfDebtType) => {
  const { store, dispatch, addDebt } = props

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
            <IconButton>
              <Icon icon='tabler:eye' />
            </IconButton>
            <IconButton>
              <Icon icon='tabler:edit' />
            </IconButton>
            <IconButton>
              <Icon icon='tabler:trash' />
            </IconButton>
          </>
        )
      }
    }
  ]

  return (
    <Card>
      <CardHeader
        title={<Typography variant='h2'>List of Lend</Typography>}
        action={<AddDebt store={store} dispatch={dispatch} addDebt={addDebt} />}
      />
      <DataGrid
        autoHeight
        rows={store.debts.map(debt => {
          return { ...debt, id: debt._id }
        })}
        columns={columns}
        disableRowSelectionOnClick
      />
    </Card>
  )
}

export default ListOfLeding

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import toast from 'react-hot-toast'
import DebtService from 'src/service/debt.service'

type AddDebt = {
  debtor: string
  creditor: string
  amount: number | null
  type: string
  description: string | ''
  status: string
  dueDate: Date | string
  isEncrypted?: boolean
  _id?: string
}

export const fetchDebts = createAsyncThunk('appDebt/fetchDebts', async () => {
  const response: any = await DebtService.getLend()

  console.log(response)

  return response
})

export const addDebt = createAsyncThunk('appDebt/addDebt', async (data: AddDebt, { dispatch }) => {
  toast.loading('Adding debt...')
  const response = await DebtService.addDebt(data)
  await dispatch(fetchDebts())
  if (response) {
    toast.dismiss()
    toast.success('Debt added successfully')
  } else {
    toast.dismiss()
    toast.error('Error adding debt')
  }

  return response
})

export const updateDebt = createAsyncThunk('appDebt/updateDebt', async (data: Partial<AddDebt>, { dispatch }) => {
  toast.loading('Updating debt...')
  const response = await DebtService.updateDebt(data._id as string, data)
  await dispatch(fetchDebts())
  if (response) {
    toast.dismiss()
    toast.success('Debt updated successfully')
  } else {
    toast.dismiss()
    toast.error('Error updating debt')
  }

  return response
})

export const deleteDebt = createAsyncThunk('appDebt/deleteDebt', async (_id: string, { dispatch }) => {
  toast.loading('Deleting debt...')
  const response = await DebtService.deleteDebt(_id)
  await dispatch(fetchDebts())
  if (response) {
    toast.dismiss()
    toast.success('Debt deleted successfully')
  } else {
    toast.dismiss()
    toast.error('Error deleting debt')
  }

  return response
})

export const encryptDebt = createAsyncThunk('appDebt/encryptDebt', async (_id: string) => {
  const response = await DebtService.encryptDebt(_id)

  return response
})

export const decryptDebt = createAsyncThunk('appDebt/decryptDebt', async (_id: string) => {
  const response = await DebtService.decryptDebt(_id)

  return response
})

const debtSlice = createSlice({
  name: 'appDebt',
  initialState: {
    debts: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDebts.fulfilled, (state, action) => {
      state.debts = action.payload
    })
  }
})

export default debtSlice.reducer

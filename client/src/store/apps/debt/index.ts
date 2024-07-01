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

  return response
})

export const fetchBorrow = createAsyncThunk('appDebt/fetchBorrow', async () => {
  const response: any = await DebtService.getBorrow()

  return response
})

export const addDebt = createAsyncThunk('appDebt/addDebt', async (data: AddDebt, { dispatch }) => {
  try {
    toast.loading('Adding debt...')
    const response = await DebtService.addDebt(data)
    await dispatch(fetchDebts())
    await dispatch(fetchBorrow())
    toast.dismiss()
    toast.success('Debt added successfully')

    return response
  } catch (error: any) {
    toast.dismiss()
    toast.error(error.response.data.message)
  }
})

export const updateDebt = createAsyncThunk('appDebt/updateDebt', async (data: Partial<AddDebt>, { dispatch }) => {
  try {
    toast.loading('Updating debt...')
    const response = await DebtService.updateDebt(data._id as string, data)
    await dispatch(fetchDebts())
    await dispatch(fetchBorrow())
    toast.dismiss()
    toast.success('Debt updated successfully')

    return response
  } catch (error: any) {
    toast.dismiss()
    toast.error(error.response.data.message)
  }
})

export const deleteDebt = createAsyncThunk('appDebt/deleteDebt', async (_id: string, { dispatch }) => {
  try {
    toast.loading('Deleting debt...')
    const response = await DebtService.deleteDebt(_id)
    await dispatch(fetchDebts())
    await dispatch(fetchBorrow())
    toast.dismiss()
    toast.success('Debt deleted successfully')

    return response
  } catch (error: any) {
    toast.dismiss()
    toast.error('Error deleting debt')
  }
})

export const encryptDebt = createAsyncThunk('appDebt/encryptDebt', async (_id: string, { dispatch }) => {
  const response = await DebtService.encryptDebt(_id)
  await dispatch(fetchBorrow())

  return response
})

export const decryptDebt = createAsyncThunk('appDebt/decryptDebt', async (_id: string, { dispatch }) => {
  const response = await DebtService.decryptDebt(_id)
  await dispatch(fetchBorrow())

  return response
})

const debtSlice = createSlice({
  name: 'appDebt',
  initialState: {
    debts: [],
    borrow: []
  },
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchDebts.fulfilled, (state, action) => {
      state.debts = action.payload
    })

    builder.addCase(fetchBorrow.fulfilled, (state, action) => {
      state.borrow = action.payload
    })
  }
})

export default debtSlice.reducer

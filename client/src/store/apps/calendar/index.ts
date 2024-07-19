// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import toast from 'react-hot-toast'
import axiosClient from 'src/lib/axios'

// ** Types
import { CalendarFiltersType, EventTypes } from 'src/types/apps/calendarTypes'

type CalendarState = {
  _id: string
  userId: string
  title: string
  location: string
  isAllDay: boolean
  startDateTime: Date
  endDateTime: Date
  note: string
  isLoop: boolean
  calendars: string
  url: string
  isEncrypted: boolean
}

type AddEvent = {
  title: string
  location: string
  isAllDay: boolean
  startDateTime: Date | string
  endDateTime: Date | string
  note: string
  isLoop: boolean
  calendars: string
  url: string
}

export const fetchEvents = createAsyncThunk('appCalendar/fetchEvents', async (calendars: CalendarFiltersType[]) => {
  try {
    const response: any = await axiosClient.get('/schedule', {
      params: {
        calendars: calendars || ['']
      }
    })

    return response.map((event: CalendarState) => {
      return {
        id: event._id,
        title: event.title,
        start: event.startDateTime,
        end: event.endDateTime,
        allDay: event.isAllDay,
        url: event.url,
        extendedProps: {
          calendar: event.calendars,
          guests: [],
          location: event.location,
          description: event.note,
          isEncrypted: event.isEncrypted
        }
      }
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      return []
    }
    throw error // Re-throw the error if it's not a 400 status
  }
})

// ** Add Event
export const addEvent = createAsyncThunk('appCalendar/addEvent', async (event: AddEvent, { dispatch }) => {
  try {
    toast.loading('Adding Event...') // Start loading toast
    const response = await axiosClient.post('/schedule', event)
    await dispatch(fetchEvents(['Work', 'Business', 'Family', 'Holiday', 'ETC']))
    toast.dismiss() // Dismiss the loading toast
    toast.success('Event Added Successfully') // Show success toast

    return response
  } catch (error) {
    toast.dismiss() // Dismiss the loading toast
    toast.error('Error Adding Event') // Show error toast
  }
})

// ** Update Event
export const updateEvent = createAsyncThunk('appCalendar/updateEvent', async (event: EventTypes, { dispatch }) => {
  try {
    toast.loading('Updating Event...') // Start loading toast
    const response = await axiosClient.put(`/schedule/${event.id}`, event)
    toast.dismiss() // Dismiss the loading toast
    toast.success('Event Updated Successfully') // Show success toast
    await dispatch(fetchEvents(['Work', 'Business', 'Family', 'Holiday', 'ETC']))

    return response
  } catch (error) {
    toast.dismiss() // Dismiss the loading toast
    toast.error('Error Updating Event') // Show error toast
  }
})

// ** Delete Event
export const deleteEvent = createAsyncThunk('appCalendar/deleteEvent', async (_id: string | string, { dispatch }) => {
  try {
    toast.loading('Deleting Event...') // Start loading toast
    const response: any = await axiosClient.delete(`/schedule/${_id}`)
    await dispatch(fetchEvents(['Work', 'Business', 'Family', 'Holiday', 'ETC']))

    if (response.message === 'Delete schedule successfully') {
      toast.dismiss() // Dismiss the loading toast
      toast.success('Event Deleted Successfully') // Show success toast
    } else {
      toast.dismiss() // Dismiss the loading toast
      toast.error('Error Deleting Event') // Show error toast
    }

    return response.data
  } catch (error: any) {
    toast.dismiss() // Ensure loading toast is dismissed on error
    toast.error(error.response.data.message) // Show error toast
    throw error // Rethrow the error to ensure it's handled by Redux Toolkit's rejected action
  }
})

// ** Delete Many Events
export const deleteManyEvents = createAsyncThunk(
  'appCalendar/deleteManyEvents',
  async (scheduleIds: string[], { dispatch }) => {
    toast.loading('Deleting Events...') // Start loading toast
    const response = await axiosClient.delete('/schedule/delete-many', {
      data: { scheduleIds } // Changed from params to data
    })
    await dispatch(fetchEvents(['Work', 'Business', 'Family', 'Holiday', 'ETC']))
    if (response.status === 200) {
      toast.dismiss() // Dismiss the loading toast
      toast.success('Events Deleted Successfully') // Show success toast
    } else {
      toast.dismiss() // Dismiss the loading toast
      toast.error('Error Deleting Events') // Show error toast
    }

    return response.data
  }
)

// ** Encrypt Event
export const encryptEvent = createAsyncThunk('appCalendar/encryptEvent', async (scheduleId: string) => {
  try {
    const response = await axiosClient.put(`/schedule/enable-encrypt/${scheduleId}`)
    fetchEvents(['Work', 'Business', 'Family', 'Holiday', 'ETC'])

    return response.data
  } catch (error) {}
})

// ** Decrypt Event
export const decryptEvent = createAsyncThunk('appCalendar/decryptEvent', async (scheduleId: string) => {
  const response = await axiosClient.put(`/schedule/disable-encrypt/${scheduleId}`)

  await fetchEvents(['Work', 'Business', 'Family', 'Holiday', 'ETC'])

  return response.data
})

export const appCalendarSlice = createSlice({
  name: 'appCalendar',
  initialState: {
    events: [],
    selectedEvent: null,
    selectedCalendars: ['Work', 'Business', 'Family', 'Holiday', 'ETC']
  },
  reducers: {
    handleSelectEvent: (state, action) => {
      state.selectedEvent = action.payload
    },
    handleCalendarsUpdate: (state, action) => {
      const filterIndex = state.selectedCalendars.findIndex(i => i === action.payload)
      if (state.selectedCalendars.includes(action.payload)) {
        state.selectedCalendars.splice(filterIndex, 1)
      } else {
        state.selectedCalendars.push(action.payload)
      }
      if (state.selectedCalendars.length === 0) {
        state.events.length = 0
      }
    },
    handleAllCalendars: (state, action) => {
      const value = action.payload
      if (value === true) {
        state.selectedCalendars = ['Work', 'Business', 'Family', 'Holiday', 'ETC']
      } else {
        state.selectedCalendars = []
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchEvents.fulfilled, (state, action) => {
      state.events = action.payload
    })
  }
})
export const { handleSelectEvent, handleCalendarsUpdate, handleAllCalendars } = appCalendarSlice.actions

export default appCalendarSlice.reducer

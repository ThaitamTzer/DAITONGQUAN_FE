// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import axiosClient from 'src/lib/axios'

// ** Types
import { CalendarFiltersType, AddEventType, EventTypes } from 'src/types/apps/calendarTypes'

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
}

type AddEvent = {
  title: string
  location: string
  isAllDay: boolean
  startDateTime: Date
  endDateTime: Date
  note: string
  isLoop: boolean
  calendars: string
  url: string
}

// ** Fetch Events
// export const fetchEvents = createAsyncThunk('appCalendar/fetchEvents', async (calendars: CalendarFiltersType[]) => {
//   const response = await axios.get('/apps/calendar/events', {
//     params: {
//       calendars
//     }
//   })

//   return response.data
// })

export const fetchEvents = createAsyncThunk('appCalendar/fetchEvents', async (calendars: CalendarFiltersType[]) => {
  try {
    const response = await axiosClient.get('/schedule', {
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
          description: event.note
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
  const response = await axiosClient.post('/schedule', event)

  await dispatch(fetchEvents(['Work', 'Business', 'Family', 'Holiday', 'ETC']))

  return response
})

// ** Update Event
export const updateEvent = createAsyncThunk('appCalendar/updateEvent', async (event: EventTypes, { dispatch }) => {
  const response = await axiosClient.put(`/schedule/${event._id}`, event)

  await dispatch(fetchEvents(['Work', 'Business', 'Family', 'Holiday', 'ETC']))

  return response.data.event
})

// ** Delete Event
export const deleteEvent = createAsyncThunk('appCalendar/deleteEvent', async (_id: string | string, { dispatch }) => {
  const response = await axiosClient.delete(`/schedule/${_id}`)
  await dispatch(fetchEvents(['Work', 'Business', 'Family', 'Holiday', 'ETC']))

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

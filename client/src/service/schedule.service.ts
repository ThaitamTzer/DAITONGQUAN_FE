import axiosClient from 'src/lib/axios'

export type Schedule = {
  userId: string
  title: string
  location: string
  isAllDay: boolean
  startDateTime: Date
  endDateTime: Date
  note: string
  isLoop: boolean
  _id: string
}

export type ActionSchedule = {
  title: string
  location: string
  isAllDay: boolean
  startDateTime: string
  endDateTime: string
  note: string
  isLoop: boolean
}

const ScheduleService = {
  // Get all schedules
  getAllSchedule: async (calendars: string[]): Promise<Schedule[]> =>
    axiosClient.get('/schedule', {
      params: {
        calendars
      }
    }),

  // Create a schedule
  createSchedule: async (schedule: ActionSchedule): Promise<ActionSchedule[]> =>
    axiosClient.post('/schedule', schedule),

  // Update a schedule
  updateSchedule: async (scheduleId: string, schedule: ActionSchedule): Promise<ActionSchedule[]> =>
    axiosClient.put(`/schedule/${scheduleId}`, schedule),

  // Delete a schedule
  deleteSchedule: async (scheduleId: string) => axiosClient.delete(`/schedule/${scheduleId}`),

  // Delete many schedules
  deleteManySchedule: async (data: string[]) => axiosClient.delete('/schedule/delete-many', { data }),

  // Notify a schedule
  notifySchedule: async (): Promise<Schedule[]> => axiosClient.get('/schedule/notify-schedule'),

  // Enable encryption
  enableEncryption: async (scheduleId: string) => axiosClient.get(`/schedule/enable-encrypt/${scheduleId}`),

  // Disable encryption
  disableEncryption: async (scheduleId: string) => axiosClient.get(`/schedule/disable-encrypt/${scheduleId}`)
}

export default ScheduleService

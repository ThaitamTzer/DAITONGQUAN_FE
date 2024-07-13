import axiosClient from 'src/lib/axios'
import { ReportListType, ReportType } from 'src/types/apps/reportTypes'

const reportService = {
  // Get all reports
  getReportList: async (): Promise<ReportType[]> => {
    const response: ReportListType = await axiosClient.get('/report/list-report')

    return response.reports
  },

  // Block a post
  blockPost: async (reportId: string): Promise<void> => {
    await axiosClient.patch(`/report/block-post/${reportId}`)
  },

  // Block a user
  blockUser: async (reportId: string): Promise<void> => {
    await axiosClient.patch(`/report/block-user/${reportId}`)
  },

  // Delete a report
  deleteReport: async (reportId: string): Promise<void> => {
    await axiosClient.delete(`/report/delete-report/${reportId}`)
  }
}

export default reportService

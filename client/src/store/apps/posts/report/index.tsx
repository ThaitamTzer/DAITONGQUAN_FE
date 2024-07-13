import postService from 'src/service/post.service'
import reportService from 'src/service/report.service'
import { ReportType } from 'src/types/apps/reportTypes'
import { create } from 'zustand'

export type ReportState = {
  reportList: ReportType[]
  postId: string
  openReportModal: boolean
  handleCloseReportModal: () => void
  handleOpenReportModal: (postId: string) => void
  handleReportPost: (postId: string, reportType: string, reportContent: string) => Promise<void>
  getAllReports: () => Promise<void>
  handleDeleteReport: (reportId: string) => Promise<void>
  handleBlockPost: (reportId: string) => Promise<void>
  handleBlockUser: (reportId: string) => Promise<void>
}

export const useReportStore = create<ReportState>(set => ({
  postId: '',
  reportList: [],
  openReportModal: false,
  handleCloseReportModal: () => set({ openReportModal: false }),
  handleOpenReportModal: postId => set({ postId, openReportModal: true }),
  handleReportPost: async (postId, reportType, reportContent) => {
    await postService.reportPost(postId, reportType, reportContent)
  },
  getAllReports: async () => {
    const reports = await reportService.getReportList()
    set({ reportList: reports })
  },
  handleDeleteReport: async reportId => {
    await reportService.deleteReport(reportId)
    set({ reportList: [] })
  },
  handleBlockPost: async reportId => {
    await reportService.blockPost(reportId)
    set({ reportList: [] })
  },
  handleBlockUser: async reportId => {
    await reportService.blockUser(reportId)
    set({ reportList: [] })
  }
}))

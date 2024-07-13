import { User } from './userTypes'

export type ReportType = {
  _id: string
  userId: User
  reportType: string
  reportContent: string
  postId: string
  status: ['pending', 'Processed', 'rejected']
  createdAt: Date | string
  updatedAt: Date | string
}

export type ReportListType = {
  reports: ReportType[]
}

export type ReportState = {
  reportList: ReportType[]
  postId: string
  openReportModal: boolean
  handleCloseReportModal: () => void
  handleOpenReportModal: (postId: string) => void
  handleReportPost: (postId: string, reportType: string, reportContent: string) => Promise<void>
}

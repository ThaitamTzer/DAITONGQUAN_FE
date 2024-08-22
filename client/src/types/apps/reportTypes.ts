import { User } from './userTypes'
import { GetPostType } from './postTypes'

export type StatusType = 'pending' | 'Processed' | 'rejected'

export type Report = {
  _id: string
  userId: User
  reportType: string
  reportContent: string
  status: string
  createdAt: Date | string
  updatedAt: Date | string
}

export type ReportType = {
  post: GetPostType
  report: Report[]
}

export type ReportPostType = {
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

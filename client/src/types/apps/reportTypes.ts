import { GetPostType } from './postTypes'
import { User } from './userTypes'

export type StatusType = 'pending' | 'Processed' | 'rejected'

export type ReportType = {
  _id: string
  userId: User
  reportType: string
  reportContent: string
  postId: GetPostType
  status: StatusType
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

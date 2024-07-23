import toast from 'react-hot-toast'
import postService from 'src/service/post.service'
import reportService from 'src/service/report.service'
import { ReportType } from 'src/types/apps/reportTypes'
import { mutate } from 'swr'
import { create } from 'zustand'

export type ReportState = {
  reportList: ReportType[]
  postId: string
  reportId: string
  report: ReportType
  openReportModal: boolean
  openBlockPostModal: boolean
  openBlockUserModal: boolean
  openAlreadyBlockedPostModal: boolean
  openAlreadyBlockedUserModal: boolean
  openRejectModal: boolean
  noData: boolean
  selectedStatus: string
  selectedType: string
  loading: boolean
}

export type ReportHandler = {
  handleCloseReportModal: () => void
  handleCloseBlockPostModal: () => void
  handleCloseBlockUserModal: () => void
  handleOpenReportModal: (reportId: string | undefined) => void
  handleOpenBlockPostModal: (reportId: string) => void
  handleOpenBlockUserModal: (reportId: string) => void
  handleReportPost: (postId: string, reportType: string, reportContent: string) => Promise<void>
  getAllReports: () => Promise<void>
  handleDeleteReport: (reportId: string) => Promise<void>
  handleBlockPost: (reportId: string) => Promise<void>
  handleBlockUser: (reportId: string) => Promise<void>
  handleFilterReportStatus: (status: string) => void
  handleFilterReportType: (type: string) => void
  handleOpenAlreadyBlockedPostModal: () => void
  handleCloseAlreadyBlockedPostModal: () => void
  handleOpenAlreadyBlockedUserModal: () => void
  handleCloseAlreadyBlockedUserModal: () => void
  handleOpenRejectModal: (reportId: string) => void
  handleCloseRejectModal: () => void
  handleRejectReport: (reportId: string) => Promise<void>
  applyFilters: () => Promise<void>
  setReportId: (reportId: string) => void
  setReportList: (reportList: ReportType[] | undefined) => void
}

export const useReportStore = create<ReportState & ReportHandler>(set => ({
  postId: '',
  reportId: '',
  report: {} as ReportType,
  reportList: [],
  openReportModal: false,
  openAlreadyBlockedPostModal: false,
  openAlreadyBlockedUserModal: false,
  openBlockPostModal: false,
  openBlockUserModal: false,
  openRejectModal: false,
  noData: false,
  selectedStatus: 'all',
  selectedType: 'all',
  loading: false,

  setReportList: reportList => set({ reportList }),
  handleOpenAlreadyBlockedPostModal: () => set({ openAlreadyBlockedPostModal: true }),
  handleCloseReportModal: () => set({ openReportModal: false }),
  handleOpenReportModal: postId => set({ openReportModal: true, postId, reportId: postId }),
  handleCloseBlockPostModal: () => set({ openBlockPostModal: false }),
  handleOpenRejectModal: reportId => set({ openRejectModal: true, reportId }),
  handleCloseRejectModal: () => set({ openRejectModal: false }),
  handleOpenBlockPostModal: reportId => set({ openBlockPostModal: true, reportId }),
  handleCloseBlockUserModal: () => set({ openBlockUserModal: false }),
  handleOpenBlockUserModal: reportId => set({ openBlockUserModal: true, reportId }),
  handleCloseAlreadyBlockedPostModal: () => set({ openAlreadyBlockedPostModal: false }),
  handleOpenAlreadyBlockedUserModal: () => set({ openAlreadyBlockedUserModal: true }),
  handleCloseAlreadyBlockedUserModal: () => set({ openAlreadyBlockedUserModal: false }),

  handleReportPost: async (postId, reportType, reportContent) => {
    await postService.reportPost(postId, reportType, reportContent)
  },
  getAllReports: async () => {
    set({ loading: true })
    const reports = await reportService.getReportList()
    set({ reportList: reports.reverse(), noData: reports.length === 0 })
    set({ loading: false })
  },
  handleDeleteReport: async reportId => {
    set({ loading: true })
    set({ openReportModal: false })
    toast.promise(reportService.deleteReport(reportId), {
      loading: 'Deleting report...',
      success: () => {
        mutate('GetAllReports')

        return 'Report deleted successfully'
      },
      error: 'Error deleting report'
    })
    set({ loading: false })
  },
  handleBlockPost: async reportId => {
    set({ loading: true })
    set({ openBlockPostModal: false })
    toast.promise(reportService.blockPost(reportId), {
      loading: 'Blocking post...',
      success: () => {
        mutate('GetAllReports')

        return 'Post blocked successfully'
      },
      error: 'Error blocking post'
    })
    set({ loading: false })
  },
  handleBlockUser: async reportId => {
    set({ loading: true })
    set({ openBlockPostModal: false })
    toast.promise(reportService.blockUser(reportId), {
      loading: 'Blocking user...',
      success: () => {
        mutate('GetAllReports')

        return 'User blocked successfully'
      },
      error: 'Error blocking user'
    })
    set({ loading: false })
  },
  handleRejectReport: async reportId => {
    set({ loading: true })
    set({ openRejectModal: false })
    toast.promise(reportService.rejectReport(reportId), {
      loading: 'Rejecting report...',
      success: () => {
        mutate('GetAllReports')

        return 'Report rejected successfully'
      },
      error: 'Error rejecting report'
    })
    set({ loading: false })
  },
  applyFilters: async () => {
    const { selectedStatus, selectedType } = useReportStore.getState()
    const reportList = await reportService.getReportList()
    const filteredByStatus =
      selectedStatus === 'all' ? reportList : reportList.filter(report => report.status === selectedStatus)
    const filteredByType =
      selectedType === 'all' ? filteredByStatus : filteredByStatus.filter(report => report.reportType === selectedType)
    set({
      reportList: filteredByType,
      noData: filteredByType.length === 0 && reportList.length === 0
    })
  },
  handleFilterReportStatus: async status => {
    set({ selectedStatus: status })
    useReportStore.getState().applyFilters()
  },
  handleFilterReportType: async type => {
    set({ selectedType: type })
    useReportStore.getState().applyFilters()
  },
  setReportId: reportId => set({ reportId })
}))

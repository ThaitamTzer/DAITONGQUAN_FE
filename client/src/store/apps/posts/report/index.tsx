import toast from 'react-hot-toast'
import postService from 'src/service/post.service'
import reportService from 'src/service/report.service'
import { ReportType } from 'src/types/apps/reportTypes'
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
  noData: boolean
  selectedStatus: string
  selectedType: string
  handleCloseReportModal: () => void
  handleCloseBlockPostModal: () => void
  handleCloseBlockUserModal: () => void
  handleOpenReportModal: (reportId: string) => void
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
  applyFilters: () => Promise<void>
  setReportId: (reportId: string) => void
}

export const useReportStore = create<ReportState>(set => ({
  postId: '',
  reportId: '',
  report: {} as ReportType,
  reportList: [],
  openReportModal: false,
  openAlreadyBlockedPostModal: false,
  openAlreadyBlockedUserModal: false,
  openBlockPostModal: false,
  openBlockUserModal: false,
  noData: false,
  selectedStatus: 'all',
  selectedType: 'all',
  handleOpenAlreadyBlockedPostModal: () => set({ openAlreadyBlockedPostModal: true }),
  handleCloseReportModal: () => set({ openReportModal: false }),
  handleOpenReportModal: postId => set({ openReportModal: true, postId, reportId: postId }),
  handleCloseBlockPostModal: () => set({ openBlockPostModal: false }),
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
    const reports = await reportService.getReportList()
    set({ reportList: reports.reverse() })
  },
  handleDeleteReport: async reportId => {
    set({ openReportModal: false })
    toast.promise(reportService.deleteReport(reportId), {
      loading: 'Deleting report...',
      success: () => {
        useReportStore.getState().getAllReports()

        return 'Report deleted successfully'
      },
      error: 'Error deleting report'
    })
  },
  handleBlockPost: async reportId => {
    set({ openBlockPostModal: false })
    toast.promise(reportService.blockPost(reportId), {
      loading: 'Blocking post...',
      success: () => {
        useReportStore.getState().getAllReports()

        return 'Post blocked successfully'
      },
      error: 'Error blocking post'
    })
  },
  handleBlockUser: async reportId => {
    set({ openBlockPostModal: false })
    toast.promise(reportService.blockUser(reportId), {
      loading: 'Blocking user...',
      success: () => {
        useReportStore.getState().getAllReports()

        return 'User blocked successfully'
      },
      error: 'Error blocking user'
    })
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
      noData: filteredByType.length === 0
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

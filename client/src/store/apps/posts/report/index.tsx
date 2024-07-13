import postService from 'src/service/post.service'
import { create } from 'zustand'

type ReportState = {
  postId: string
  openReportModal: boolean
  handleCloseReportModal: () => void
  handleOpenReportModal: (postId: string) => void
  handleReportPost: (postId: string, reportType: string, reportContent: string) => Promise<void>
}

export const useReportStore = create<ReportState>(set => ({
  postId: '',
  openReportModal: false,
  handleCloseReportModal: () => set({ openReportModal: false }),
  handleOpenReportModal: postId => set({ postId, openReportModal: true }),
  handleReportPost: async (postId, reportType, reportContent) => {
    await postService.reportPost(postId, reportType, reportContent)
  }
}))

import { useReportStore } from 'src/store/apps/posts/report'
import DialogConfirm from 'src/views/report-list/dialog'
import useSWR from 'swr'
import reportService from 'src/service/report.service'
import ViewReports from 'src/views/report-list/reports'
import PreviewReport from 'src/views/report-list/viewPostAndReport'

export default function ReportListPage() {
  const { data: reportListData, isLoading } = useSWR('GetAllReports', () => reportService.getReportList(), {
    revalidateOnFocus: true,
    revalidateIfStale: true,
    refreshInterval: 5000,
    errorRetryCount: 3
  })

  const {
    openReportModal,
    openBlockPostModal,
    openAlreadyBlockedPostModal,
    openAlreadyBlockedUserModal,
    openBlockUserModal,
    openRejectModal,
    handleCloseRejectModal,
    handleCloseReportModal,
    handleCloseBlockPostModal,
    handleCloseBlockUserModal,
    handleCloseAlreadyBlockedPostModal,
    handleCloseAlreadyBlockedUserModal,
    handleDeleteReport,
    handleBlockUser,
    handleBlockPost,
    handleRejectReport,
    reportId
  } = useReportStore()

  return (
    <>
      <ViewReports reports={reportListData} /> <PreviewReport />
      <DialogConfirm
        open={openReportModal}
        onClose={handleCloseReportModal}
        title='Are you sure to delete'
        onSubmit={() => {
          handleDeleteReport(reportId)
        }}
      />
      <DialogConfirm
        open={openBlockPostModal}
        onClose={handleCloseBlockPostModal}
        title='Are you sure to block that user post'
        onSubmit={() => {
          handleBlockPost(reportId)
        }}
      />
      <DialogConfirm
        open={openBlockUserModal}
        onClose={handleCloseBlockUserModal}
        title='Are you sure to block that user'
        onSubmit={() => {
          handleBlockUser(reportId)
        }}
      />
      <DialogConfirm
        open={openAlreadyBlockedPostModal}
        onClose={handleCloseAlreadyBlockedPostModal}
        title='This post is already blocked'
      />
      <DialogConfirm
        open={openAlreadyBlockedUserModal}
        onClose={handleCloseAlreadyBlockedUserModal}
        title='This user is already blocked'
      />
      <DialogConfirm
        open={openRejectModal}
        onClose={handleCloseRejectModal}
        title='Are you sure to reject this report'
        onSubmit={() => {
          handleRejectReport(reportId)
        }}
      />
    </>
  )
}

ReportListPage.acl = {
  action: 'read',
  subject: 'report'
}

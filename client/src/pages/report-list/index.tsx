import { useReportStore } from 'src/store/apps/posts/report'
import DialogConfirm from 'src/views/report-list/dialog'
import TabelReportList from 'src/views/report-list/table'

export default function ReportListPage() {
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
      <TabelReportList />{' '}
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

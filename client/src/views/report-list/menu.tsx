import styled from '@emotion/styled'
import { Menu, MenuItem, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useReportStore } from 'src/store/apps/posts/report'
import { useRouter } from 'next/router'

const MenuOptions = () => {
  const { anchorEl, handleCloseOptionMenu, report, handleBlockUser, handleBlockPost, handleRejectReport } =
    useReportStore(state => state)
  const router = useRouter()

  const CustomMenuItem = styled(MenuItem)`
    width: 170px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `

  const handleNavigate = (url: string) => {
    router.push(url)
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl) && report === report}
      onClose={handleCloseOptionMenu}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right'
      }}
    >
      {report.post?.userId?.isBlock ? (
        <CustomMenuItem
          onClick={() => {
            handleNavigate('/apps/user/list/')
            handleCloseOptionMenu()
          }}
        >
          <Icon icon='tabler:lock-open' />
          <Typography variant='inherit'>UnBlock User ?</Typography>
        </CustomMenuItem>
      ) : (
        <CustomMenuItem
          onClick={() => {
            handleBlockUser(report.report[0]._id)
            handleCloseOptionMenu()
          }}
        >
          <Icon icon='solar:user-block-rounded-bold' />
          <Typography variant='inherit'>Block User</Typography>
        </CustomMenuItem>
      )}
      {report?.post?.status !== 'blocked' && (
        <CustomMenuItem
          onClick={() => {
            handleBlockPost(report.report[0]._id)
            handleCloseOptionMenu()
          }}
        >
          <Icon icon='streamline:browser-block' />
          <Typography variant='inherit'>Block Post</Typography>
        </CustomMenuItem>
      )}
      <CustomMenuItem
        onClick={() => {
          handleRejectReport(report.report[0]._id)
          handleCloseOptionMenu()
        }}
      >
        <Icon icon='icon-park-outline:reject' />
        <Typography variant='inherit'>Reject</Typography>
      </CustomMenuItem>
    </Menu>
  )
}

export default MenuOptions

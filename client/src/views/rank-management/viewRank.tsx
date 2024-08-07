import useSWR from 'swr'
import rankService from 'src/service/rank.service'
import { CardMedia, Grid, IconButton, Menu, MenuItem, Paper, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useRankStore } from 'src/store/rank'
import { useTheme, useMediaQuery } from '@mui/material'
import { RankSkeleton } from '../skeleton'
import styled from '@emotion/styled'

const ViewRankList = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const { anchorEl, handleOpenOptionMenu, selectedRank, handleCloseOptionMenu, handleOpenEditModal, handleDeleteRank } =
    useRankStore(state => state)

  const {
    data: rankList,
    isLoading,
    error
  } = useSWR('GetListRank', rankService.getListRank, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    errorRetryCount: 2
  })

  const MenuItemCustom = styled(MenuItem)`
    display: flex;
    justify-content: space-between;
    align-items: center;
  `

  console.log(rankList)

  return (
    <>
      {isLoading && <RankSkeleton />}
      {error && <Typography variant='h6'>Error</Typography>}
      {rankList
        ? rankList.map(rank => (
            <Grid item container lg={4} md={4} sm={6} xs={12} key={rank._id}>
              <Paper component={Grid} container item xs={12}>
                <Grid item lg={6} md={6} sm={5} xs={6}>
                  <CardMedia component={'img'} image={rank.rankIcon} alt='rank image' loading='lazy' />
                </Grid>
                <Grid item container alignItems={'center'} lg={5} md={4.6} sm={5.3} xs={6}>
                  {rank.action.length > 0 && (
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                      <Typography variant='h6'>Action: {rank.action.join(', ')}</Typography>
                    </Grid>
                  )}
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Typography variant='h6'>Name: {rank.rankName}</Typography>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={7}>
                    <Typography variant='h6'>Attendance: {rank.score.attendanceScore}</Typography>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={5}>
                    <Typography variant='h6'>Blog: {rank.score.numberOfBlog}</Typography>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={5}>
                    <Typography variant='h6'>Like: {rank.score.numberOfLike}</Typography>
                  </Grid>
                  <Grid item lg={12} md={12} sm={12} xs={7}>
                    <Typography variant='h6'>Comment: {rank.score.numberOfComment}</Typography>
                  </Grid>
                </Grid>
                {!isMobile && (
                  <Grid item lg={0.5} md={0.5} sm={1}>
                    <IconButton onClick={e => handleOpenOptionMenu(rank._id, e)}>
                      <Icon icon='ri:more-2-fill' />
                    </IconButton>
                    <Menu
                      PaperProps={{
                        sx: {
                          width: '200px'
                        }
                      }}
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedRank === rank._id}
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
                      <MenuItemCustom onClick={() => handleOpenEditModal(rank._id, rank)}>
                        <Icon icon='nimbus:edit' />
                        <Typography variant='inherit'>Edit</Typography>
                      </MenuItemCustom>
                      <MenuItemCustom onClick={() => handleDeleteRank(rank._id)}>
                        <Icon icon='ri:delete-bin-6-line' />
                        <Typography variant='inherit'>Delete</Typography>
                      </MenuItemCustom>
                    </Menu>
                  </Grid>
                )}
              </Paper>
            </Grid>
          ))
        : null}
    </>
  )
}

export default ViewRankList

import { Button, Grid } from '@mui/material'
import Icon from 'src/@core/components/icon'
import ViewRankList from 'src/views/rank-management/viewRank'
import { useRankStore } from 'src/store/rank'
import AddRank from 'src/views/rank-management/addRank'
import EditRank from 'src/views/rank-management/editRank'

const RankManagement = () => {
  const handleOpenAddModal = useRankStore(state => state.handleOpenAddModal)

  return (
    <>
      <AddRank />
      <EditRank />
      <Grid container spacing={3}>
        <Grid item lg={2} md={12} sm={12} xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleOpenAddModal} fullWidth variant='contained' startIcon={<Icon icon='icons8:plus' />}>
            Add Rank
          </Button>
        </Grid>
        <Grid item container spacing={3} lg={12}>
          <ViewRankList />
        </Grid>
      </Grid>
    </>
  )
}

RankManagement.acl = {
  action: 'read',
  subject: 'rank'
}
export default RankManagement

import * as UI from '@mui/material'

const NotesSkeleton = () => {
  return (
    <UI.Grid container spacing={2}>
      {[1, 2, 3, 4].map(index => (
        <UI.Grid item container lg={4} md={4} sm={6} xs={12} key={index}>
          <UI.Paper component={UI.Grid} container item xs={12}>
            <UI.Grid item lg={6} md={6} sm={5} xs={6}>
              <UI.Skeleton variant='rectangular' width='100%' height={150} />
            </UI.Grid>
            <UI.Grid item container alignItems={'center'} lg={5} md={4.6} sm={5.3} xs={6}>
              <UI.Grid item lg={12} md={12} sm={12} xs={12}>
                <UI.Skeleton variant='text' width='80%' />
              </UI.Grid>
              <UI.Grid item lg={12} md={12} sm={12} xs={7}>
                <UI.Skeleton variant='text' width='60%' />
              </UI.Grid>
              <UI.Grid item lg={12} md={12} sm={12} xs={5}>
                <UI.Skeleton variant='text' width='40%' />
              </UI.Grid>
              <UI.Grid item lg={12} md={12} sm={12} xs={5}>
                <UI.Skeleton variant='text' width='40%' />
              </UI.Grid>
              <UI.Grid item lg={12} md={12} sm={12} xs={7}>
                <UI.Skeleton variant='text' width='60%' />
              </UI.Grid>
            </UI.Grid>
          </UI.Paper>
        </UI.Grid>
      ))}
    </UI.Grid>
  )
}

export default NotesSkeleton

import * as UI from '@mui/material'
import { Fragment } from 'react'

export const PostSkeleton = () => {
  return (
    <UI.Grid container spacing={2}>
      {[...Array(5)].map((_, index) => (
        <Fragment key={index}>
          <UI.Grid container sx={{ padding: 3 }}>
            <UI.Grid item container lg={1} md={1} xs={2} sm={1} justifyContent={'center'}>
              <UI.Skeleton variant='circular' width={40} height={40} />
            </UI.Grid>
            <UI.Grid item lg={11} md={11} xs={10} sm={11}>
              <UI.Grid container spacing={2}>
                <UI.Grid item xs={12}>
                  <UI.Skeleton variant='text' width={200} />
                  <UI.Skeleton variant='text' width={150} />
                </UI.Grid>
                <UI.Grid item xs={12}>
                  <UI.Skeleton variant='rectangular' height={200} />
                </UI.Grid>
                <UI.Grid item xs={12}>
                  <UI.Skeleton variant='text' width={80} />
                  <UI.Skeleton variant='text' width={80} />
                </UI.Grid>
              </UI.Grid>
            </UI.Grid>
          </UI.Grid>
          <UI.Divider />
        </Fragment>
      ))}
    </UI.Grid>
  )
}

export const APostSkeleton = () => {
  return (
    <UI.Card>
      <UI.Grid container sx={{ padding: 3 }}>
        <UI.Grid item lg={1} md={1} xs={2} sm={1}>
          <UI.Skeleton
            variant='circular'
            width={40}
            height={40}
            sx={{
              ml: 1
            }}
          />
        </UI.Grid>
        <UI.Grid item lg={11} md={11} xs={10} sm={11}>
          <UI.Grid container spacing={2}>
            <UI.Grid item xs={12}>
              <UI.Skeleton variant='text' width={200} />
              <UI.Skeleton variant='text' width={150} />
            </UI.Grid>
            <UI.Grid item xs={12}>
              <UI.Skeleton variant='rectangular' height={300} />
            </UI.Grid>
          </UI.Grid>
        </UI.Grid>
      </UI.Grid>
    </UI.Card>
  )
}

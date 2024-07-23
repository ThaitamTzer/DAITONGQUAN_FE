import * as UI from '@mui/material'

export const SkeletonReportList = () => {
  return (
    <UI.Grid container spacing={2}>
      {[...Array(5)].map((_, index) => (
        <UI.Grid item xs={12} key={index}>
          <UI.Card>
            <UI.CardContent>
              <UI.Typography variant="h6" gutterBottom>
                <UI.Skeleton />
              </UI.Typography>
              <UI.Typography variant="body2">
                <UI.Skeleton />
              </UI.Typography>
            </UI.CardContent>
          </UI.Card>
        </UI.Grid>
      ))}
    </UI.Grid>
  )

}
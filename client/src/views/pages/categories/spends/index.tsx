import React from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'

import 'react-color-palette/css'

// ** Import Custom Components
import CategorySpendCard from './categorySpendCard'
import AddCategory from './addCategory'
import TableHeader from './tableHeader'
import { Card, CardContent, CardHeader } from '@mui/material'

const Spends = () => {
  return (
    <Grid container spacing={3}>
      <Card>
        <CardHeader title='Spends' action={<TableHeader />} />
        <CardContent sx={{ display: 'flex', flexWrap: 'wrap' }}>
          <CategorySpendCard status={'show'} />
          <AddCategory />
        </CardContent>
      </Card>
      {/* <Grid item>
        <Tooltip
          title={`Add new category`}
          placement='top'
          TransitionComponent={Fade}
          TransitionProps={{ timeout: 300 }}
          arrow
        >
          <Button
            variant='outlined'
            sx={{
              width: 110,
              height: 94,
              borderWidth: 1,
              display: 'flex',
              alignItems: 'center',
              borderRadius: '10px',
              flexDirection: 'column',
              justifyContent: 'center',
              borderStyle: 'solid'
            }}
            onClick={handleOpen}
          >
            <>
              <Avatar variant='rounded' sx={{ backgroundColor: 'transparent' }}>
                <Icon width={'30px'} icon='mdi:plus-circle' />
              </Avatar>
            </>
          </Button>
        </Tooltip>
      </Grid> */}
    </Grid>
  )
}

export default Spends

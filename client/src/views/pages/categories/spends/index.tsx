import React from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Import Custom Components
import CategorySpendCard from './categorySpendCard'
import AddCategory from './utils/addCategory'
import ListOfSpendNote from './listOfSpendNote'
import { Divider } from '@mui/material'

const Spends = () => {
  return (
    <Grid container spacing={2}>
      <CategorySpendCard />
      <AddCategory />
      <Divider orientation='vertical' />
      <Grid item xs={12}>
        <ListOfSpendNote />
      </Grid>
    </Grid>
  )
}

export default Spends

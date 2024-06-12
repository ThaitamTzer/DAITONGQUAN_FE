import React from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Import Custom Components
import CategorySpendCard from './categorySpendCard'
import AddCategory from './utils/addCategory'

const Spends = () => {
  return (
    <Grid container spacing={2}>
      <CategorySpendCard />
      <AddCategory />
    </Grid>
  )
}

export default Spends

import React from 'react'

// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Import Custom Components
import CategoryIncomesCard from './categoryIncomesCard'
import AddCategory from './addCategory'

const Incomes = () => {
  return (
    <Grid container spacing={2}>
      <CategoryIncomesCard />
      <AddCategory />
    </Grid>
  )
}

export default Incomes

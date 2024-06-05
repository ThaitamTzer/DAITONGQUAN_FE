import { Grid, Button, Avatar, Typography, Tooltip, Fade } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { CategoryCard } from 'src/types/user/categories'

// import { useState } from 'react'

const CategoryCards = ({ categories, children }: { categories: CategoryCard[]; children: React.ReactNode }) => {
  // Use an object to track hovered state for each category
  // const [hoveredCategory, setHoveredCategory] = useState<Record<string, boolean>>({})

  // const handleMouseEnter = (categoryId: string) => {
  //   setHoveredCategory(prev => ({ ...prev, [categoryId]: true }))
  // }

  // const handleMouseLeave = (categoryId: string) => {
  //   setHoveredCategory(prev => ({ ...prev, [categoryId]: false }))
  // }

  return (
    <Grid container spacing={3} marginBottom={3}>
      {categories?.map((category: CategoryCard) => (
        <Grid item key={category._id}>
          <Tooltip
            title={`add ${category.name}`}
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
            >
              <>
                <Avatar variant='rounded' sx={{ mb: 2, width: 34, height: 34, backgroundColor: 'transparent' }}>
                  <Icon icon={category.icon} />
                </Avatar>
                <Typography sx={{ fontWeight: 500, color: 'text.secondary', textTransform: 'capitalize' }}>
                  {category.name}
                </Typography>
              </>
            </Button>
          </Tooltip>
        </Grid>
      ))}
      {children}
    </Grid>
  )
}

export default CategoryCards

import Card from '@mui/material/Card'
import useSWR from 'swr'
import categoriesService from 'src/service/categories.service'
import CategoryCards from 'src/views/categories/categoryCard'
import { Grid, Button, Avatar, Tooltip } from '@mui/material'
import Icon from 'src/@core/components/icon'

const Categories = () => {
  const { data: categories } = useSWR('GET_ALL_CATEGORIES', categoriesService.getAllCategories)

  return (
    <>
      <h1>Categories</h1>
      <CategoryCards categories={categories || []}>
        <Grid item xs={10} sm={2}>
          <Tooltip title='Thêm danh mục'>
            <Button
              sx={{
                width: 110,
                height: 94,
                borderWidth: 1,
                display: 'flex',
                alignItems: 'center',
                borderRadius: '10px',
                justifyContent: 'center',
                borderStyle: 'solid'
              }}
            >
              <Avatar
                variant='rounded'
                sx={{ width: 34, height: 34, backgroundColor: 'transparent', color: 'text.secondary' }}
              >
                <Icon width={40} icon='carbon:add-filled' />
              </Avatar>
            </Button>
          </Tooltip>
        </Grid>
      </CategoryCards>
      <Card>
        <h2>Category 1</h2>
        <p>Category 1 description</p>
      </Card>
    </>
  )
}

Categories.acl = {
  action: 'read',
  subject: 'member-page'
}
export default Categories

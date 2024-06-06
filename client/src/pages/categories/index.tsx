import React from 'react'
import Card from '@mui/material/Card'
import useSWR from 'swr'
import categoriesService from 'src/service/categories.service'
import CategoryCards from 'src/views/categories/categoryCard'
import { Grid, Button, Avatar, Tooltip, Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material'
import Icon from 'src/@core/components/icon'
import CustomTextField from 'src/@core/components/mui/text-field'

const Categories = () => {
  const [open, setOpen] = React.useState(false)

  const { data: categories } = useSWR('GET_ALL_CATEGORIES', categoriesService.getAllCategories)

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <>
      <h1>Categories</h1>
      <CategoryCards categories={categories || []}>
        <Grid item xs={10} sm={2}>
          <Tooltip title='Thêm danh mục'>
            <Button
              onClick={handleOpen}
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
      {/* Dialog form add new category */}
      <Dialog open={open} fullWidth onClose={handleClose}>
        <DialogTitle variant='h3' align='center'>
          Thêm danh mục
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <CustomTextField fullWidth label='Tên danh mục' variant='outlined' margin='normal' name='name' required />
              <CustomTextField fullWidth label='Mô tả' variant='outlined' margin='normal' name='description' required />
            </Grid>
            <Grid item xs={6}>
              {/* Hoặc nếu bạn có một danh sách các icon và muốn cho người dùng chọn */}
              {/* <Grid container spacing={1}>
              {icons.map((icon) => (
                <Grid item key={icon.name}>
                  <IconButton onClick={() => handleIconSelect(icon)}>
                    {icon.component}
                  </IconButton>
                </Grid>
              ))}
            </Grid> */}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant='outlined' onClick={handleClose} color='primary'>
            Hủy
          </Button>
          <Button variant='contained' type='submit'>
            Thêm
          </Button>
        </DialogActions>
      </Dialog>
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

import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Button,
  IconButton,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material'
import Icon from 'src/@core/components/icon'
import { CategoryType } from 'src/types/apps/categoryTypes'
import { useCategoryStore } from 'src/store/categories'
import { useSpendLimitStore } from 'src/store/categories/limit.store'
import { useSpendNoteStore } from 'src/store/categories/note.store'

type CategoryCardProps = {
  data: CategoryType[] | undefined
  [key: string]: any
}

const CategoryCard = (props: CategoryCardProps) => {
  const { data, ...rest } = props
  const { handleOpenUpdateCategoryModal, handleOpenDeleteCategoryModal } = useCategoryStore()
  const { handleOpenAddSpendLimitModal, handleOpenUpdateSpendLimitModal } = useSpendLimitStore()
  const { handleOpenAddSpendNoteModal } = useSpendNoteStore()
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Grid item container xs={12} spacing={3}>
      {data &&
        data.map(category => (
          <Grid item container lg={4} md={6} sm={6} xs={6} key={category._id} sx={{ display: 'flex' }}>
            <Grid item xs={12}>
              <Card>
                <CardHeader
                  sx={{ padding: '7px 0 0 7px !important' }}
                  title={<Typography fontSize={isMobile ? '12px' : '15px'}>{category.name}</Typography>}
                  avatar={
                    <Box
                      sx={{
                        width: {
                          xs: 30,
                          sm: 40
                        },
                        height: {
                          xs: 30,
                          sm: 40
                        },
                        borderRadius: '50%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: `${category.color}3A`
                      }}
                    >
                      <Icon
                        icon={category.icon}
                        color={category.color}
                        width={isMobile ? 15 : 20}
                        height={isMobile ? 15 : 20}
                      />
                    </Box>
                  }
                />
                <CardContent
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0px !important'
                  }}
                >
                  {category.type === 'spend' && (
                    <Box sx={{ marginLeft: 2, display: 'flex', alignItems: 'center' }}>
                      {category.spendingLimitId ? (
                        <>
                          <Button
                            variant='text'
                            sx={{
                              xs: { fontSize: '10px' },
                              sm: { fontSize: '12px' },
                              md: { fontSize: '15px' }
                            }}
                            onClick={() => handleOpenUpdateSpendLimitModal(category)}
                          >
                            <Typography fontSize={isMobile ? '10px' : '15px'}>
                              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                category.budget
                              )}
                            </Typography>
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant='text'
                          sx={{
                            xs: { fontSize: '10px' },
                            sm: { fontSize: '12px' },
                            md: { fontSize: '15px' }
                          }}
                          startIcon={<Icon icon='tabler:plus' />}
                          onClick={() => handleOpenAddSpendLimitModal(category)}
                        >
                          <Typography fontSize={isMobile ? '10px' : '15px'}>Set limit</Typography>
                        </Button>
                      )}
                    </Box>
                  )}

                  <Box>
                    <IconButton
                      onClick={() => {
                        handleOpenAddSpendNoteModal(category)
                      }}
                    >
                      <Icon icon='tabler:plus' width={isMobile ? 15 : 25} height={isMobile ? 15 : 25} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleOpenUpdateCategoryModal(category)
                      }}
                    >
                      <Icon icon='tabler:edit' width={isMobile ? 15 : 25} height={isMobile ? 15 : 25} />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        handleOpenDeleteCategoryModal(category)
                      }}
                    >
                      <Icon icon='tabler:trash' width={isMobile ? 15 : 25} height={isMobile ? 15 : 25} />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ))}
    </Grid>
  )
}

export default CategoryCard

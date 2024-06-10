import Typography from '@mui/material/Typography'
import Icon from 'src/@core/components/icon'
import categoriesService from 'src/service/categories.service'
import useSWR from 'swr'
import { Avatar, Button, Fade, Grid, Tooltip } from '@mui/material'

const CategorySpendCard = () => {
  const { data: spends } = useSWR('GET_ALL_SPENDS', categoriesService.getCategoriesSpend)

  return (
    <>
      {spends
        ?.filter((spendCategory: any) => spendCategory.status === 'show')
        .map((spendCategory: any) => (
          <Grid item key={spendCategory.id} marginLeft={2} marginBottom={2}>
            <Tooltip
              title={`Spend for ${spendCategory.name}`}
              placement='top'
              TransitionComponent={Fade}
              TransitionProps={{ timeout: 300 }}
              arrow
            >
              <Button
                variant='contained'
                sx={{
                  width: 95,
                  height: 95,
                  borderWidth: 1,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '10px',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  borderStyle: 'solid',
                  backgroundColor: `${spendCategory.color}1A`,
                  borderColor: `${spendCategory.color}`,
                  ':hover': {
                    backgroundColor: `${spendCategory.color}3A`,
                    borderColor: `${spendCategory.color}9A`
                  }
                }}
              >
                <>
                  <Avatar variant='rounded' sx={{ mb: 2, width: 34, height: 34, backgroundColor: 'transparent' }}>
                    <Icon icon={spendCategory.icon} color={`${spendCategory.color}`} />
                  </Avatar>
                  <Typography sx={{ fontWeight: 500, color: `${spendCategory.color}`, textTransform: 'capitalize' }}>
                    {spendCategory.name}
                  </Typography>
                </>
              </Button>
            </Tooltip>
          </Grid>
        ))}
    </>
  )
}

export default CategorySpendCard

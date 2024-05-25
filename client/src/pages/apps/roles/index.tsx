// ** MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// ** Custom Components Imports
import PageHeader from 'src/@core/components/page-header'

// ** Demo Components Imports
import Table from 'src/views/apps/roles/Table'
import RoleCards from 'src/views/apps/roles/RoleCards'

// ** Import Third Party
import { useTranslation } from 'react-i18next'

const RolesComponent = () => {
  const { t } = useTranslation()

  return (
    <Grid container spacing={6}>
      <PageHeader
        title={
          <Typography variant='h4' sx={{ mb: 6 }}>
            {t('Danh sách vai trò')}
          </Typography>
        }
      />
      <Grid item xs={12}>
        <RoleCards />
      </Grid>
      <Grid item xs={12}>
        <Table />
      </Grid>
    </Grid>
  )
}

export default RolesComponent

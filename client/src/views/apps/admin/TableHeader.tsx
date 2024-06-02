// ** MUI Imports
import { Button } from '@mui/material'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { SelectChangeEvent } from '@mui/material/Select'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'
import CreateAdminForm from './CreateAdmin'
import { useTranslation } from 'react-i18next'

interface TableHeaderProps {
  plan: string
  value: string
  handleFilter: (val: string) => void
  handlePlanChange: (e: SelectChangeEvent<unknown>) => void
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { plan, handlePlanChange, handleFilter, value } = props

  const { t } = useTranslation()

  return (
    <Box
      sx={{
        p: 5,
        pb: 3,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        flexDirection: 'row-reverse',
        justifyContent: 'space-between'
      }}
    >
      <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <CustomTextField
          value={value}
          sx={{ mr: 4 }}
          placeholder={t('Search User') || ''}
          onChange={e => handleFilter(e.target.value)}
        />
        <CreateAdminForm />
        {/* <CustomTextField
          select
          value={plan}
          sx={{ mb: 2 }}
          defaultValue='Select Plan'
          SelectProps={{ displayEmpty: true, value: plan, onChange: e => handlePlanChange(e) }}
        >
          <MenuItem value=''>Select Plan</MenuItem>
          <MenuItem value='basic'>Basic</MenuItem>
          <MenuItem value='company'>Company</MenuItem>
          <MenuItem value='enterprise'>Enterprise</MenuItem>
          <MenuItem value='team'>Team</MenuItem>
        </CustomTextField> */}
      </Box>
    </Box>
  )
}

export default TableHeader

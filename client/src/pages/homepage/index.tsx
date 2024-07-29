import { Grid } from '@mui/material'
import useSWR from 'swr'
import spendNoteService from 'src/service/spendNote.service'
import { useTheme } from '@mui/material/styles'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import StatisticNoteChart from 'src/views/homepage/spendNoteChart'

const HomePage = () => {
  const theme = useTheme()

  // Vars
  const whiteColor = '#fff'
  const yellowColor = '#ffe802'
  const primaryColor = '#836af9'
  const areaChartBlue = '#2c9aff'
  const barChartYellow = '#ffcf5c'
  const polarChartGrey = '#4f5d70'
  const polarChartInfo = '#299aff'
  const lineChartYellow = '#d4e157'
  const polarChartGreen = '#28dac6'
  const lineChartPrimary = '#8479F2'
  const lineChartWarning = '#ff9800'
  const horizontalBarInfo = '#26c6da'
  const polarChartWarning = '#ff8131'
  const scatterChartGreen = '#28c76f'
  const warningColorShade = '#ffbd1f'
  const areaChartBlueLight = '#84d0ff'
  const areaChartGreyLight = '#edf1f4'
  const scatterChartWarning = '#ff9f43'
  const borderColor = theme.palette.divider
  const labelColor = theme.palette.text.disabled
  const legendColor = theme.palette.text.secondary

  return (
    <DatePickerWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <StatisticNoteChart
            white={whiteColor}
            warning={warningColorShade}
            primary={primaryColor}
            success={yellowColor}
            labelColor={labelColor}
            borderColor={borderColor}
            legendColor={legendColor}
          />
        </Grid>
      </Grid>
    </DatePickerWrapper>
  )
}

HomePage.acl = {
  action: 'read',
  subject: 'member-page'
}
export default HomePage

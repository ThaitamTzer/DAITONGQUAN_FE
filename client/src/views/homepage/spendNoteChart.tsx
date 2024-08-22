// ** MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import { StatisticSpendMonth } from 'src/types/statistic/spend'
import { StatisticIncomeMonth } from 'src/types/statistic/income'
import useSWR from 'swr'
import categoriesService from 'src/service/categories.service'

// ** Third Party Imports
import { Line } from 'react-chartjs-2'
import { defaults, ChartData, ChartOptions } from 'chart.js'
import { MenuItem, TextField, Typography } from '@mui/material'
import { useStatisticStore } from 'src/store/statistic'

defaults.maintainAspectRatio = false
defaults.responsive = true

interface LineProps {
  statisticSpend: StatisticSpendMonth | undefined
  statisticIncome: StatisticIncomeMonth | undefined
  white: string
  warning: string
  primary: string
  success: string
  labelColor: string
  borderColor: string
  legendColor: string
}

const StatisticNoteChart = (props: LineProps) => {
  const { filter, number, cateId, setNumber, setFilter, setCateId } = useStatisticStore(state => state)
  const { data: categories } = useSWR('GET_CATEGORIES', categoriesService.getAllCategories)

  // ** Props
  const { white, primary, warning, labelColor, borderColor, legendColor, statisticSpend, statisticIncome } = props

  const roundedTotalCosts = (costs: number | undefined) => {
    if (costs === 0) return (costs = 200000)

    if (costs) {
      const totalCostsString = costs.toString()
      const totalCostsLength = totalCostsString.length
      const totalCostsFirstDigit = totalCostsString.charAt(0)
      const totalCostsSecondDigit = totalCostsString.charAt(1) || '0'

      if (totalCostsLength > 1 && totalCostsSecondDigit >= '5') {
        const roundedTotalCosts = `${Number(totalCostsFirstDigit) + 1}${'0'.repeat(totalCostsLength - 1)}`

        return Number(roundedTotalCosts)
      } else if (totalCostsLength > 1 && totalCostsSecondDigit < '5') {
        const roundedTotalCosts = `${totalCostsFirstDigit}5${'0'.repeat(totalCostsLength - 2)}`

        return Number(roundedTotalCosts)
      } else if (totalCostsLength === 1) {
        return Number(totalCostsFirstDigit) >= 5 ? 10 : 5
      }
    }

    return 200000
  }

  const handleMaxCosts = () => {
    if (statisticIncome?.highestAmount && statisticSpend?.highestCosts) {
      return statisticIncome?.highestAmount > statisticSpend?.highestCosts
        ? statisticIncome?.highestAmount
        : statisticSpend?.highestCosts
    }
  }

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        ticks: { color: labelColor },
        grid: {
          color: borderColor
        }
      },
      y: {
        min: 0,
        max: handleMaxCosts(),
        ticks: {
          stepSize: roundedTotalCosts(statisticIncome?.highestAmount) / 10,
          color: labelColor
        },
        grid: {
          color: borderColor
        }
      }
    },
    plugins: {
      legend: {
        align: 'end',
        position: 'top',
        labels: {
          padding: 25,
          boxWidth: 10,
          color: legendColor,
          usePointStyle: true
        }
      }
    }
  }

  const getTotalCostsInMonth = () => {
    const totalCostsInMonth: number[] = []
    for (const key in statisticSpend?.groupedSpendingDetails) {
      totalCostsInMonth.push(statisticSpend?.groupedSpendingDetails[key].totalCost)
    }

    return totalCostsInMonth.reverse()
  }

  const getTotalAmountsInMonth = () => {
    const totalAmountsInMonth: number[] = []
    for (const key in statisticIncome?.groupedIncomeDetails) {
      totalAmountsInMonth.push(statisticIncome?.groupedIncomeDetails[key].totalAmount)
    }

    return totalAmountsInMonth.reverse()
  }

  const data: ChartData<'line'> = {
    labels: Object.keys(statisticSpend?.groupedSpendingDetails ?? {}).reverse(),
    datasets: [
      {
        tension: 0.5,
        label: 'Spend',
        pointHoverRadius: 5,
        pointRadius: 1,
        pointStyle: 'circle',
        borderColor: primary,
        backgroundColor: primary,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: primary,
        data: getTotalCostsInMonth()
      },
      {
        tension: 0.5,
        label: 'Income',
        pointRadius: 1,
        pointHoverRadius: 5,
        pointStyle: 'circle',
        borderColor: warning,
        backgroundColor: warning,
        pointHoverBorderWidth: 5,
        pointHoverBorderColor: white,
        pointBorderColor: 'transparent',
        pointHoverBackgroundColor: warning,
        data: getTotalAmountsInMonth()
      }
    ]
  }

  return (
    <Card>
      <CardHeader
        title={<Typography variant='h3'>Statistic Spending</Typography>}
        subheader={<Typography variant='h5'></Typography>}
        action={
          <>
            <TextField
              sx={{
                mr: 2
              }}
              select
              label='Filter By'
              size='small'
              value={filter}
              onChange={e => {
                setFilter(e.target.value)
              }}
            >
              <MenuItem value='month'>Month</MenuItem>
              <MenuItem value='year'>Year</MenuItem>
            </TextField>
            <TextField
              sx={{
                mr: 2
              }}
              select
              label='Number of Item'
              size='small'
              value={number}
              onChange={e => {
                setNumber(Number(e.target.value))
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i} value={i + 1}>
                  {i + 1}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              size='small'
              sx={{
                mr: 2
              }}
              select
              defaultValue='All'
              value={cateId}
              label='Category'
              onChange={e => {
                setCateId(e.target.value)
              }}
            >
              <MenuItem value='All'>All</MenuItem>
              {categories?.map(category => (
                <MenuItem key={category._id} value={category._id}>
                  {category.name}
                </MenuItem>
              ))}
            </TextField>
          </>
        }
      />
      <CardContent>
        <Line data={data} height={300} options={options} />
      </CardContent>
    </Card>
  )
}

export default StatisticNoteChart

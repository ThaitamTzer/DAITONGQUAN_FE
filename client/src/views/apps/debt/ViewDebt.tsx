import { useState } from 'react'
import Icon from 'src/@core/components/icon'
import { IconButton, Dialog, DialogActions, DialogTitle, Typography, Button, Grid } from '@mui/material'
import DialogWithCustomCloseButton from 'src/views/components/dialog/customDialog'
import { GetDebt } from 'src/service/debt.service'
import CustomTextField from 'src/@core/components/mui/text-field'
import { format } from 'date-fns'

type ViewDebtType = {
  selectedDebt: GetDebt
}

const ViewDebt = (props: ViewDebtType) => {
  const { selectedDebt } = props
  const [openViewDebtDialog, setOpenViewDebtDialog] = useState<boolean>(false)
  const handleOpenViewDebtDialog = () => setOpenViewDebtDialog(true)
  const handleCloseViewDebtDialog = () => setOpenViewDebtDialog(false)

  const CustomGrid = ({ children }: { children: React.ReactNode }) => {
    return (
      <Grid item xs={12} md={6} lg={6}>
        {children}
      </Grid>
    )
  }

  const handleDate = (date: Date | string) => {
    return format(new Date(date), 'dd/MM/yyyy')
  }

  const handleEncrypted = (isEncrypted: boolean | undefined) => {
    if (isEncrypted) return isEncrypted ? 'Yes' : 'No'
    else return 'No'
  }

  return (
    <>
      <IconButton onClick={() => handleOpenViewDebtDialog()}>
        <Icon icon='tabler:eye' />
      </IconButton>

      <Dialog
        fullWidth
        maxWidth='md'
        open={openViewDebtDialog}
        onClose={handleCloseViewDebtDialog}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogTitle>
          <Typography variant='h4'>View Debt</Typography>
        </DialogTitle>
        <DialogWithCustomCloseButton handleClose={handleCloseViewDebtDialog}>
          <Grid container spacing={3}>
            <CustomGrid>
              <CustomTextField fullWidth label='Creditor' value={selectedDebt.creditor} disabled />
            </CustomGrid>
            <CustomGrid>
              <CustomTextField fullWidth label='Debtor' value={selectedDebt.debtor} disabled />
            </CustomGrid>
            <CustomGrid>
              <CustomTextField fullWidth label='Amount' value={selectedDebt.amount} disabled />
            </CustomGrid>
            <CustomGrid>
              <CustomTextField fullWidth label='Type' value={selectedDebt.type} disabled />
            </CustomGrid>
            <CustomGrid>
              <CustomTextField fullWidth label='Status' value={selectedDebt.status} disabled />
            </CustomGrid>
            <CustomGrid>
              <CustomTextField fullWidth label='Date' value={handleDate(selectedDebt.dueDate)} disabled />
            </CustomGrid>
            <Grid item xs={12} md={12} lg={12}>
              <CustomTextField
                multiline
                rows={3}
                fullWidth
                label='Description'
                value={selectedDebt.description}
                disabled
              />
            </Grid>
            <CustomGrid>
              <Typography variant='h6'>Created At: {handleDate(selectedDebt.createdAt)}</Typography>
            </CustomGrid>
            <CustomGrid>
              <Typography variant='h6'>Updated At: {handleDate(selectedDebt.updatedAt)}</Typography>
            </CustomGrid>
            <CustomGrid>
              <Typography variant='h6'>Encrypt: {handleEncrypted(selectedDebt.isEncrypted)}</Typography>
            </CustomGrid>
          </Grid>
        </DialogWithCustomCloseButton>
        <DialogActions>
          <Button>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ViewDebt

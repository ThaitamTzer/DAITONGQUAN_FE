import { Dialog, DialogTitle, Grid, TextField, Chip, Typography, Box } from '@mui/material'
import { useSpendNoteStore } from 'src/store/categories/note.store'
import DialogWithCustomCloseButton from '../components/dialog/customDialog'
import { CategoryType } from 'src/types/apps/categoryTypes'
import Icon from 'src/@core/components/icon'

type ViewNoteProps = {
  category: CategoryType[] | undefined
}

const ViewNote = (props: ViewNoteProps) => {
  const { category } = props
  const { openViewNoteModal, handleCloseViewNoteModal, note } = useSpendNoteStore(state => state)
  const handleDate = (date: Date | undefined) => {
    const newDate = new Date(date || new Date())

    return newDate.toLocaleDateString('vi', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <Dialog
      open={openViewNoteModal}
      onClose={handleCloseViewNoteModal}
      maxWidth='sm'
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          overflow: 'visible'
        }
      }}
    >
      <DialogTitle>
        <Typography variant='h4'>View Note</Typography>
      </DialogTitle>
      <DialogWithCustomCloseButton handleClose={handleCloseViewNoteModal}>
        <Grid container spacing={3} xs={12}>
          <Grid item xs={12}>
            <TextField label='Title' value={note?.title} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label='Amount' value={note?.amount} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <TextField label='Date' value={handleDate(note?.incomeDate || note?.spendingDate)} fullWidth disabled />
          </Grid>
          <Grid item xs={12}>
            <Chip
              label={
                <Box display={'flex'} alignItems={'center'}>
                  <Typography mr={1}>{category?.find(cat => cat._id === note?.cateId)?.name}</Typography>
                  <Icon icon={category?.find(cat => cat._id === note?.cateId)?.icon || ''} />
                </Box>
              }
              sx={{
                backgroundColor: `${category?.find(cat => cat._id === note?.cateId)?.color || ''}9A`,
                color: 'white'
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography>Method: {note?.paymentMethod || note?.method}</Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField multiline rows={4} label='Note' value={note?.content} fullWidth disabled />
          </Grid>
          <Grid item xs={12}></Grid>
        </Grid>
      </DialogWithCustomCloseButton>
    </Dialog>
  )
}

export default ViewNote

import styled from '@emotion/styled'
import { DialogContent, IconButton, IconButtonProps } from '@mui/material'
import Icon from 'src/@core/components/icon'

export const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'white',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `red !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}))

const DialogWithCustomCloseButton = ({ children, handleClose, style }: any) => {
  return (
    <DialogContent sx={style}>
      <CustomCloseButton onClick={handleClose}>
        <Icon icon='tabler:x' fontSize='1.25rem' />
      </CustomCloseButton>
      {children}
    </DialogContent>
  )
}

export default DialogWithCustomCloseButton

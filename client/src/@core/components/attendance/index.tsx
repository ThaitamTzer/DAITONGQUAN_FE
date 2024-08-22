import React, { useEffect, useState } from 'react'
import { Badge, Box, BoxProps, CardMedia, styled } from '@mui/material'
import toast from 'react-hot-toast'
import { useAuth } from 'src/hooks/useAuth'
import userProfileService from 'src/service/userProfileService.service'
import { mutate } from 'swr'
import Swal from 'sweetalert2'
import confetti from 'canvas-confetti'

const Toggler = styled(Box)<BoxProps>(({ theme }) => ({
  right: 0,
  top: '20%',
  display: 'flex',
  cursor: 'pointer',
  position: 'fixed',
  padding: theme.spacing(2),
  zIndex: theme.zIndex.modal,
  transform: 'translateY(-50%)',
  borderTopLeftRadius: theme.shape.borderRadius,
  borderBottomLeftRadius: theme.shape.borderRadius
}))

const Attendance = () => {
  const { user, setUser } = useAuth()
  const [attendanceDateFormatted, setAttendanceDateFormatted] = useState('')
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    const attendanceDate = user?.rankScore?.attendance.dateAttendance || user?.dateAttendance
    const formattedAttendanceDate = attendanceDate
      ? new Date(attendanceDate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' })
      : ''
    setAttendanceDateFormatted(formattedAttendanceDate)

    const formattedCurrentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
    setCurrentDate(formattedCurrentDate)
  }, [user])

  const handleAttendance = async () => {
    try {
      Swal.fire({
        title: 'Confirm Attendance',
        text: `You are going to mark attendance for ${currentDate}.`,
        icon: 'question',
        showLoaderOnConfirm: true,
        confirmButtonText: 'Sure!',
        preConfirm: async () => {
          try {
            await userProfileService.attendanceUser()
            await mutate('GET_PROFILE_DATA', async () => {
              const updatedData = await userProfileService.getUserProfile()
              setUser(updatedData.data)

              return updatedData
            })
          } catch (error: any) {
            Swal.showValidationMessage(error.response?.data?.message || 'An error occurred.')
          }
        },
        allowOutsideClick: () => !Swal.isLoading()
      }).then(result => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Attendance Successful!',
            text: 'You have marked your attendance.',
            icon: 'success',
            showConfirmButton: false,
            showLoaderOnConfirm: true,
            timer: 2000,
            didOpen: () => {
              const count = 300
              const defaults = {
                origin: { y: 0.7 }
              }

              function fire(particleRatio: any, opts: any) {
                confetti({
                  ...defaults,
                  ...opts,
                  particleCount: Math.floor(count * particleRatio),
                  zIndex: 99999
                })
              }

              fire(0.25, { spread: 26, startVelocity: 55 })
              fire(0.2, { spread: 60 })
              fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 })
              fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 })
              fire(0.1, { spread: 120, startVelocity: 45 })
            }
          })
        }
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'An error occurred.')
    }
  }

  return (
    <div className='daily-attendance'>
      {attendanceDateFormatted !== currentDate && (
        <Toggler onClick={handleAttendance}>
          <Badge badgeContent='1' color='error' />
          <CardMedia
            component={'img'}
            src='https://res.cloudinary.com/dtvhqvucg/image/upload/v1721727647/_Pngtree_daily_sign_in_gradient_icon_5460158-removebg-preview_qvv1vk.png'
            alt='attendance'
            loading='lazy'
            sx={{ width: '50px', height: '50px', objectFit: 'contain' }}
          />
        </Toggler>
      )}
    </div>
  )
}

Attendance.acl = {
  action: 'read',
  subject: 'member-page'
}
export default Attendance

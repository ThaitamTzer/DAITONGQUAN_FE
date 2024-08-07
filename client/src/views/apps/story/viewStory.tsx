import { CardMedia, Dialog, DialogContent, Box } from '@mui/material'
import { useStoryStore } from 'src/store/apps/story'
import { useState, useRef } from 'react'
import Icon from 'src/@core/components/icon'
import { useEffect } from 'react'
import LinearProgress from '@mui/material/LinearProgress'

const ViewStoryModal = () => {
  const { openViewStoryModal, story, toggleViewStoryModal } = useStoryStore(state => state)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isPlaying) {
      timer = setInterval(() => {
        if (videoRef.current) {
          const duration = videoRef.current.duration
          const currentTime = videoRef.current.currentTime
          setProgress((currentTime / duration) * 100)
        }
      }, 470)
    }

    return () => {
      clearInterval(timer)
    }
  }, [isPlaying])

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setProgress((videoRef.current.currentTime / videoRef.current.duration) * 100)
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleClose = () => {
    toggleViewStoryModal(story)
    setIsHovered(false)
    setIsPlaying(true)
    setProgress(0)
  }

  return (
    <Dialog open={openViewStoryModal} onClose={handleClose} fullScreen>
      <DialogContent>
        <Box
          sx={{
            position: 'absolute',
            right: '30px',
            ':hover': {
              cursor: 'pointer'
            }
          }}
        >
          <Icon icon='carbon:close-filled' onClick={handleClose} width={50} />
        </Box>
        <Box
          sx={{
            width: 'fit-content',
            height: '100vh',
            position: 'relative',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              left: '12px',
              right: '12px',
              top: '12px'
            }}
          >
            <Box>
              {story.userId?.firstname} {story.userId?.lastname}
            </Box>
            <Box>
              <LinearProgress
                variant='determinate'
                value={progress}
                sx={{
                  width: '100%',
                  height: '4px',
                  borderRadius: '0px'
                }}
              />
            </Box>
          </Box>
          <Box
            onClick={handlePlayPause}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            sx={{
              position: 'absolute',
              right: '0',
              left: '0',
              top: '0',
              bottom: '0',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ':hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)'
              }
            }}
          >
            {isHovered && <Icon icon={isPlaying ? 'ph:pause-fill' : ''} width={80} />}
            <Box
              onClick={handlePlayPause}
              sx={{
                position: 'absolute',
                right: '0',
                left: '0',
                top: '0',
                bottom: '0',
                display: isPlaying ? 'none' : 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 9999,
                ':hover': {
                  cursor: 'pointer'
                }
              }}
            >
              <Icon icon={isPlaying ? 'ph:pause-fill' : 'ph:play-fill'} width={80} />
            </Box>
          </Box>
          <CardMedia
            component='video'
            src={story.mediaUrl}
            autoPlay
            onEnded={() => setIsPlaying(false)}
            loop={false}
            ref={videoRef}
            sx={{
              height: '100%',
              objectFit: 'contain'
            }}
          />
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ViewStoryModal

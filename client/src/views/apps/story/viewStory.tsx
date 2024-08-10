import {
  CardMedia,
  Dialog,
  DialogContent,
  Box,
  IconButton,
  CircularProgress,
  LinearProgress,
  useMediaQuery,
  Menu,
  MenuItem
} from '@mui/material'
import { useStoryStore } from 'src/store/apps/story'
import { useState, useRef, useEffect } from 'react'
import Icon from 'src/@core/components/icon'
import { useTheme } from '@mui/system'
import ActionStory from './actionStory'
import { Toaster } from 'react-hot-toast'

const ViewStoryModal = () => {
  const {
    openViewStoryModal,
    story,
    toggleViewStoryModal,
    allStories,
    setStory,
    handleOpenActionStoryModal,
    anchorEl,
    setAnchorEl
  } = useStoryStore(state => state)
  const [isHovered, setIsHovered] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [displayNextButton, setDisplayNextButton] = useState<boolean>(false)
  const [displayPrevButton, setDisplayPrevButton] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [time, setTime] = useState<number>(0)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [progress, setProgress] = useState<number>(0)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const user = JSON.parse(window.localStorage.getItem('userData') || '{}')
  const isImage = story.mediaUrl?.match(/\.(jpeg|jpg|gif|png|webp)$/i)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isPlaying && !isImage) {
      timer = setInterval(() => {
        if (videoRef.current) {
          const duration = videoRef.current.duration
          const currentTime = videoRef.current.currentTime
          setProgress((currentTime / duration) * 100)
        }
      }, 100)
    }

    return () => {
      clearInterval(timer)
    }
  }, [isPlaying, isImage])

  useEffect(() => {
    if (videoRef.current && !isImage) {
      videoRef.current.pause()
      setIsPlaying(false)
      setProgress(0)
      setIsLoading(true)
    }
  }, [story])

  useEffect(() => {
    let imageTimer: NodeJS.Timeout
    let progressInterval: NodeJS.Timeout

    if (isImage) {
      setProgress(0) // Khởi tạo giá trị progress
      setTime(10000) // Khởi tạo giá trị time

      progressInterval = setInterval(() => {
        setProgress(prev => prev + 1)
      }, 100) // Cập nhật progress mỗi 100ms

      imageTimer = setTimeout(() => {
        clearInterval(progressInterval)
      }, time) // Dừng lại sau 10 giây

      return () => {
        clearInterval(progressInterval)
        clearTimeout(imageTimer)
      }
    }
  }, [story, isImage])

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

  const handleMuteUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleClose = () => {
    if (isImage) {
      toggleViewStoryModal(story)
      setProgress(0)
      setTime(10000)
    } else {
      if (videoRef.current) {
        videoRef.current.pause()
      }
      toggleViewStoryModal(story)
      setIsHovered(false)
      setIsPlaying(true)
      setProgress(0)
    }
  }

  const handleVideoLoadedData = () => {
    setIsLoading(false)
    if (videoRef.current) {
      videoRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleNextStory = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }

    const currentStoryIndex = allStories.findIndex(storyItem => storyItem._id === story._id)
    const nextStory = allStories[currentStoryIndex + 1]

    if (nextStory) {
      setStory(nextStory)
    } else {
      handleClose()
    }
  }

  const handlePrevStory = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      setIsPlaying(false)
    }

    const currentStoryIndex = allStories.findIndex(storyItem => storyItem._id === story._id)
    const prevStory = allStories[currentStoryIndex - 1]

    if (prevStory) {
      setStory(prevStory)
    } else {
      handleClose()
    }
  }

  useEffect(() => {
    const currentStoryIndex = allStories.findIndex(storyItem => storyItem._id === story._id)

    setDisplayPrevButton(currentStoryIndex > 0)
    setDisplayNextButton(currentStoryIndex < allStories.length - 1)
  }, [story, allStories])

  return (
    <Dialog open={openViewStoryModal} onClose={handleClose} fullScreen>
      <ActionStory />
      <Toaster />
      <DialogContent
        sx={{
          padding: { xs: '0 !important', sm: '10px !important' }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {displayPrevButton && (
            <IconButton onClick={handlePrevStory}>
              <Icon icon='fluent:chevron-left-24-filled' width={50} />
            </IconButton>
          )}
        </Box>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            right: '0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          {displayNextButton && (
            <IconButton onClick={handleNextStory}>
              <Icon icon='fluent:chevron-right-24-filled' width={50} />
            </IconButton>
          )}
        </Box>
        <Box
          sx={{
            width: { xs: '100%', sm: '80%', md: '500px', lg: '500px' },
            height: '100%',
            position: 'relative',
            marginLeft: 'auto',
            marginRight: 'auto',
            backgroundColor: 'black'
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
            <Box
              sx={{
                position: 'absolute',
                zIndex: 9999,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 2
              }}
            >
              <Box>
                {story.userId?.firstname} {story.userId?.lastname}
              </Box>
              <Box>
                {user._id === story.userId?._id && (
                  <>
                    <IconButton
                      onClick={e => {
                        setAnchorEl(e.currentTarget)
                        setOpen(true)
                      }}
                    >
                      <Icon icon='ri:more-fill' />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClick={() => {
                        handleOpenActionStoryModal(story._id)
                        setAnchorEl(null)
                      }}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                      onClose={() => {
                        setAnchorEl(null)
                        setOpen(false)
                      }}
                    >
                      <MenuItem>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center'
                          }}
                        >
                          <Icon icon='fluent:delete-24-filled' />
                          <Box ml={1}>Delete</Box>
                        </Box>
                      </MenuItem>
                    </Menu>
                  </>
                )}
                <IconButton onClick={handleClose}>
                  <Icon icon='mingcute:close-fill' />
                </IconButton>
              </Box>
            </Box>
            <Box
              onClick={handleMuteUnmute}
              sx={{
                position: 'absolute',
                mt: 10,
                zIndex: 9999
              }}
            >
              <Icon icon={isMuted ? 'iconoir:sound-off-solid' : 'iconoir:sound-min-solid'} />
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
              zIndex: 9998,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ':hover': {
                backgroundColor: isMobile ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0.5)'
              }
            }}
          >
            {isHovered && !isMobile && !isImage && <Icon icon={isPlaying ? 'ph:pause-fill' : ''} width={80} />}
            <Box
              className='play-pause'
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
                zIndex: 9998,
                ':hover': {
                  cursor: 'pointer'
                }
              }}
            >
              {!isImage ? <Icon icon={isPlaying ? 'ph:pause-fill' : 'ph:play-fill'} width={80} /> : null}
            </Box>
          </Box>
          {isLoading && !isImage && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10000
              }}
            >
              <CircularProgress />
            </Box>
          )}
          {isImage ? (
            <CardMedia
              component={'img'}
              src={story.mediaUrl}
              sx={{
                height: '100%',
                objectFit: 'contain'
              }}
            />
          ) : (
            <CardMedia
              component={'video'}
              src={story.mediaUrl}
              poster={story.thumbnailUrl}
              autoPlay
              onEnded={() => setIsPlaying(false)}
              onLoadedData={handleVideoLoadedData}
              loop={false}
              ref={videoRef}
              sx={{
                height: '100%',
                objectFit: 'contain',
                display: isLoading ? 'none' : 'block'
              }}
            />
          )}
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default ViewStoryModal

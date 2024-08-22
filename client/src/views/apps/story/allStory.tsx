import Box from '@mui/material/Box'
import { Avatar, Card, CardHeader, CardMedia, Grid, IconButton } from '@mui/material'
import { useKeenSlider } from 'keen-slider/react'
import useSWR, { mutate } from 'swr'
import StoryService, { Story } from 'src/service/story.service'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useStoryStore } from 'src/store/apps/story'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import Icon from 'src/@core/components/icon'
import { useState, useEffect } from 'react'
import 'keen-slider/keen-slider.min.css'
import { useUserProfileStore } from 'src/store/user'

const ViewAllStory = ({ stories }: { stories: Story[] | undefined }) => {
  const { toggleViewStoryModal, handleOpenAddStoryModal } = useStoryStore(state => state)
  const { user } = useUserProfileStore(state => state)

  const {
    settings: { direction }
  } = useSettings()

  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [loaded, setLoaded] = useState<boolean>(false)

  const [ref, instanceRef] = useKeenSlider<HTMLDivElement>({
    rtl: direction === 'rtl',
    slides: {
      perView: 4.5,
      spacing: 16
    },
    loop: false,
    renderMode: 'performance',
    slideChanged(slider) {
      const { rel } = slider.track.details
      setCurrentSlide(rel)
    },
    created() {
      setLoaded(true)
    }
  })

  // Khởi tạo lại slider khi dữ liệu stories thay đổi
  useEffect(() => {
    if (instanceRef.current) {
      instanceRef.current.update({
        rtl: direction === 'rtl',
        slides: {
          perView: 4.5,
          spacing: 16
        }
      })
    }
  }, [stories, direction])

  return (
    <>
      {stories && (
        <KeenSliderWrapper>
          <Grid item xs={12}>
            <Card
              sx={{
                position: 'relative',
                backgroundColor: 'transparent'
              }}
            >
              {loaded && instanceRef.current && (
                <>
                  <Box
                    sx={{
                      position: 'absolute',
                      top: '0',
                      bottom: '0',
                      left: '0',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 99
                    }}
                  >
                    <IconButton
                      sx={{ padding: '0 !important' }}
                      onClick={e => {
                        e.stopPropagation()
                        instanceRef.current?.prev()

                        return false
                      }}
                    >
                      <Icon icon='carbon:previous-filled' width={40} color='#fff' />
                    </IconButton>
                  </Box>
                  <Box
                    sx={{
                      position: 'absolute',
                      right: '0',
                      top: '0',
                      bottom: '0',
                      display: 'flex',
                      alignItems: 'center',
                      zIndex: 99
                    }}
                  >
                    <IconButton
                      sx={{ padding: '0 !important' }}
                      onClick={e => {
                        e.stopPropagation()
                        instanceRef.current?.next()
                      }}
                    >
                      <Icon icon='carbon:next-filled' width={40} color='#fff' />
                    </IconButton>
                  </Box>
                </>
              )}
              <Box ref={ref} className='keen-slider'>
                <Box
                  onClick={handleOpenAddStoryModal}
                  className='keen-slider__slide'
                  sx={{
                    backgroundColor: 'black',
                    width: '140px',
                    height: '250px',
                    borderRadius: '8px',
                    ':hover': {
                      cursor: 'pointer'
                    }
                  }}
                >
                  <Box
                    sx={{
                      height: '75%'
                    }}
                  >
                    <img
                      src={user.data?.avatar}
                      alt={user.data?.firstname}
                      loading='lazy'
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '100%'
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      height: '25%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      color: 'white',
                      backgroundColor: theme => theme.palette.primary.main
                    }}
                  >
                    <Icon icon='carbon:add-filled' width={40} />
                  </Box>
                </Box>
                {stories &&
                  stories.map(story => (
                    <Box
                      key={story._id}
                      className='keen-slider__slide'
                      sx={{
                        backgroundColor: 'black',
                        width: '140px',
                        height: '250px',
                        borderRadius: '8px'
                      }}
                    >
                      <Box
                        sx={{
                          padding: '8px',
                          position: 'absolute',
                          top: '0',
                          left: '0'
                        }}
                      >
                        {story.userId.firstname} {story.userId.lastname}
                      </Box>
                      <img
                        src={story.thumbnailUrl || story.mediaUrl}
                        alt={story.title}
                        loading='lazy'
                        onClick={() => toggleViewStoryModal(story)}
                        style={{
                          objectFit: 'contain',
                          width: '100%',
                          height: '100%'
                        }}
                      />
                    </Box>
                  ))}
              </Box>
            </Card>
          </Grid>
        </KeenSliderWrapper>
      )}
    </>
  )
}

export default ViewAllStory

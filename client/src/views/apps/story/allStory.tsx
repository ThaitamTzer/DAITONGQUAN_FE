// ** MUI Imports
import Box from '@mui/material/Box'
import { Card, CardMedia, Direction, Grid } from '@mui/material'

// ** Third Party Components
import { useKeenSlider } from 'keen-slider/react'
import useSWR from 'swr'
import StoryService from 'src/service/story.service'
import { useSettings } from 'src/@core/hooks/useSettings'
import { useStoryStore } from 'src/store/apps/story'
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import { width } from '@mui/system'

const ViewAllStory = () => {
  const { toggleViewStoryModal } = useStoryStore(state => state)
  const { data: stories } = useSWR('/story/list-story', StoryService.getAllStories)

  console.log(stories)

  // ** Hook
  const {
    settings: { direction }
  } = useSettings()

  const [ref] = useKeenSlider<HTMLDivElement>({
    rtl: direction === 'rtl',
    slides: {
      perView: 4,
      spacing: 16
    },
    loop: true
  })

  return (
    <KeenSliderWrapper>
      <Grid item xs={12}>
        <Card>
          <Box ref={ref} className='keen-slider'>
            {stories &&
              stories.map(story => (
                <Box key={story._id} className='keen-slider__slide'>
                  <Box
                    sx={{
                      padding: '8px',
                      position: 'absolute'
                    }}
                  >
                    {story.userId.firstname} {story.userId.lastname}
                  </Box>
                  <CardMedia
                    component='img'
                    height='100%'
                    width='100%'
                    image={story.thumbnailUrl}
                    alt={story.title}
                    loading='lazy'
                    onClick={() => toggleViewStoryModal(story)}
                    sx={{
                      cursor: 'pointer'
                    }}
                  />
                </Box>
              ))}
          </Box>
        </Card>
      </Grid>
    </KeenSliderWrapper>
  )
}

export default ViewAllStory

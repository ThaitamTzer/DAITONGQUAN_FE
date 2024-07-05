// ** MUI Components
import Grid from '@mui/material/Grid'

// ** Demo Components
import AboutOverivew from 'src/views/pages/user-profile/profile/AboutOverivew'
import Icon from 'src/@core/components/icon'

// import ProjectsTable from 'src/views/pages/user-profile/profile/ProjectsTable'

// import ActivityTimeline from 'src/views/pages/user-profile/profile/ActivityTimeline'

// import ConnectionsTeams from 'src/views/pages/user-profile/profile/ConnectionsTeams'

// ** Types
import { ProfileTabType } from 'src/types/apps/profileType'
import Posts from 'src/views/apps/post/posts'

import { usePostStore } from 'src/store/apps/posts' // Adjust the path to your store file
import { useEffect } from 'react'

const ProfileTab = ({ data }: { data: ProfileTabType }) => {
  const getAllUserPosts = usePostStore(state => state.getAllUserPosts)
  const posts = usePostStore(state => state.posts)
  const reactionPost = usePostStore(state => state.reactionPost)
  const deleteReactionPost = usePostStore(state => state.deleteReactionPost)

  useEffect(() => {
    getAllUserPosts()
  }, [])

  return data && Object.values(data).length ? (
    <Grid container spacing={6}>
      <Grid item lg={4} md={5} xs={12}>
        <AboutOverivew />
      </Grid>
      <Grid item lg={8} md={7} xs={12}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Posts posts={posts} reactionPost={reactionPost} deleteReactionPost={deleteReactionPost} />
          </Grid>
          {/* <ConnectionsTeams connections={data.connections} teams={data.teamsTech} /> */}
          <Grid item xs={12}>
            {/* <ProjectsTable /> */}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  ) : null
}

export default ProfileTab

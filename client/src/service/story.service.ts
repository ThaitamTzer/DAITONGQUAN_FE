import axiosClient from 'src/lib/axios'

export type Story = {
  _id: string
  title: string
  userId: {
    _id: string
    firstname: string
    lastname: string
  }
  thumbnailUrl: string
  mediaUrl: string
  status: string
  createdAt: string
  updatedAt: string
}

const StoryService = {
  // Get all stories
  getAllStories: async (): Promise<Story[]> => axiosClient.get('/story/list-story'),

  //Get personal stories
  getPersonalStories: async (): Promise<Story[]> => axiosClient.get('/story/my-story'),

  //Create a story
  createStory: async (data: FormData): Promise<Story> =>
    axiosClient.post('/story ', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }),

  //Delete a story
  deleteStory: async (id: string): Promise<Story> => axiosClient.delete(`/story/${id}`)
}

export default StoryService

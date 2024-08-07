import { create } from 'zustand'
import StoryService, { Story } from 'src/service/story.service'

type StoryState = {
  openViewStoryModal: boolean
  story: Story
}

type StoryActions = {
  toggleViewStoryModal: (story: Story) => void
  
}

export const useStoryStore = create<StoryState & StoryActions>(set => ({
  openViewStoryModal: false,
  story: {} as Story,
  toggleViewStoryModal: story => {
    set(state => ({ openViewStoryModal: !state.openViewStoryModal, story }))
  }
}))

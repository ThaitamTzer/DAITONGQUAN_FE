import { create } from 'zustand'
import StoryService, { Story } from 'src/service/story.service'

type StoryState = {
  openViewStoryModal: boolean
  story: Story
  allStories: Story[]
  openAddStoryModal: boolean
  openActionStoryModal: boolean
  id: string
  anchorEl: null | HTMLElement
}

type StoryActions = {
  toggleViewStoryModal: (story: Story) => void
  setAllStories: (stories: Story[]) => void
  setStory: (story: Story) => void
  handleOpenAddStoryModal: () => void
  handleCloseAddStoryModal: () => void
  addStory: (title: string, file: File | null) => Promise<void>
  handleOpenActionStoryModal: (id: string) => void
  handleCloseActionStoryModal: () => void
  deleteStory: (id: string) => Promise<void>
  setAnchorEl: (anchorEl: null | HTMLElement) => void
}

export const useStoryStore = create<StoryState & StoryActions>(set => ({
  openViewStoryModal: false,
  openActionStoryModal: false,
  story: {} as Story,
  anchorEl: null,
  id: '',
  allStories: [],
  openAddStoryModal: false,
  toggleViewStoryModal: story => {
    set(state => ({ openViewStoryModal: !state.openViewStoryModal, story }))
  },
  setAllStories: stories => {
    set({ allStories: stories })
  },
  setStory: story => {
    set({ story })
  },
  handleOpenAddStoryModal: () => {
    set({ openAddStoryModal: true })
  },
  handleCloseAddStoryModal: () => {
    set({ openAddStoryModal: false })
  },
  addStory: async (title, file) => {
    const formData = new FormData()
    if (file) {
      formData.append('title', title)
      formData.append('file', file)
      await StoryService.createStory(formData)
    }
  },
  handleOpenActionStoryModal: id => {
    set({ openActionStoryModal: true, id })
  },
  handleCloseActionStoryModal: () => {
    set({ openActionStoryModal: false, id: '' })
  },
  deleteStory: async id => {
    await StoryService.deleteStory(id)
  },
  setAnchorEl: anchorEl => {
    set({ anchorEl })
  }
}))

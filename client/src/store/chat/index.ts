import { GetAllChats } from 'src/types/chat'
import { userById } from 'src/types/user'
import { create } from 'zustand'

type SideBarState = {
  showSidebar: boolean
}

type SideBarActions = {
  handleOpenSidebar: () => void
  handleCloseSidebar: () => void
}

type SideBarStore = SideBarState & SideBarActions

export const useSideBarStore = create<SideBarStore>(set => ({
  showSidebar: false,
  handleOpenSidebar: () => set({ showSidebar: true }),
  handleCloseSidebar: () => set({ showSidebar: false })
}))

type ChatState = {
  chats: GetAllChats[] | undefined
  userById: userById[]
  reciverId: string
  openChat: boolean
  userChatData: userById[]
}

type ChatActions = {
  setChats: (chats: GetAllChats[]) => void
  setUserById: (user: userById[]) => void
  handleOpenChat: (id: string) => void
  handleCloseChat: () => void
  setUserChatData: (user: userById[]) => void
}

type ChatStore = ChatState & ChatActions

export const useChatStore = create<ChatStore>(set => ({
  chats: [],
  userChatData: [],
  reciverId: '',
  openChat: false,
  setChats: chats => set({ chats }),
  userById: [],
  handleOpenChat: id => set({ reciverId: id, openChat: true }),
  handleCloseChat: () => set({ openChat: false, reciverId: '' }),
  setUserChatData: user => set({ userChatData: user }),
  setUserById: user =>
    set({
      userById: user
    })
}))

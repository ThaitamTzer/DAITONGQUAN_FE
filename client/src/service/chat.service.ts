import axiosClient from 'src/lib/axios'
import { GetAllChats } from 'src/types/chat'

const ChatService = {
  getAllChats: async (): Promise<GetAllChats[]> => axiosClient.get('/message/get-messages'),

  deleteChat: async (id: string): Promise<void> => axiosClient.delete(`/message/${id}`)
}

export default ChatService

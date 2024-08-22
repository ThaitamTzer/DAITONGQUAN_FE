export type GetAllChats = {
  _id: string
  senderId: string
  receiverId: {
    _id: string
    email: string
  }
  content: string
  createdAt: Date | string
}

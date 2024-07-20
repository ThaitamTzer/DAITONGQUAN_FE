import useSWR from 'swr'
import { create } from 'zustand'
import userAdminService from 'src/service/userAdmin.service'

type UserListType = {
  _id: string
  firstname: string
  lastname: string
  email: string
  hyperlink: []
  avatar: string
  status: string
  isBlock: boolean
  createdAt: string | Date
  address: string
  dateOfBirth: string | Date
  description: string
  gender: string
  nickname: string
  phone: number
}

type UserListState = {
  userList: UserListType[]
  loading: boolean
  setUserList: (userList: UserListType[]) => void
}

export const userListStore = create<UserListState>(set => ({
  userList: [],
  loading: false,
  setUserList: userList => set({ userList })
}))

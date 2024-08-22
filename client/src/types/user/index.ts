type User = {
  _id: string
  firstname: string
  lastname: string
  email: string
  hyperlink: any[]
  role: string
  avatar: string
  rankID: {
    _id: string
    rankName: string
    rankIcon: string
    __v: number
  }
  createdAt: string
  address: string
  dateOfBirth: string
  description: string
  gender: string
  nickname: string
  phone: string
  rankScore: {
    attendance: {
      attendanceScore: number
      dateAttendance: string
    }
    numberOfComment: number
    numberOfBlog: number
    numberOfLike: number
    _id: string
  }
}

export type userProfile = {
  data: User
}

export type userById = {
  data: {
    _id: string
    firstname: string
    lastname: string
    email: string
    hyperlink: any[]
    role: string
    avatar: string
    rankID: null | string
    createdAt: string
    rankScore: {
      attendance: {
        attendanceScore: number
        dateAttendance: string
      }
      numberOfComment: number
      numberOfBlog: number
      numberOfLike: number
      _id: string
    }
  }
}

import * as yup from 'yup'

const MAX_EMAIL_LENGTH = 100
const MAX_PASSWORD_LENGTH = 50
const MAX_USERNAME_LENGTH = 50
const MIN_PASSWORD_LENGTH = 5
const MIN_FIRSTNAME_LENGTH = 2 // Họ và tên đệm
const MAX_FIRSTNAME_LENGTH = 20
const MIN_LASTNAME_LENGTH = 1 // Tên
const MAX_ADDRESS_LENGTH = 100
const MIN_ADDRESS_LENGTH = 5
const MAX_NICKNAME_LENGTH = 10
const MAX_PHONE_LENGTH = 11
const CODE_LENGTH = 6
const MAX_DESCRIPTINO_LENGTH = 100
const MAX_CATE_NAME_LENGTH = 20
const MIN_CATE_NAME_LENGTH = 1
const MIN_NUMBER_LENGTH = 1
const MAX_NUMBER_LENGTH = 1000

export const getValidationMessages = (t: (arg0: string) => any) => ({
  email: {
    email: t('Email không hợp lệ'),
    required: t('Email không được để trống'),
    max: t(`Email không được quá ${MAX_EMAIL_LENGTH} ký tự`),
    exists: t('Email đã tồn tại'),
    notfound: t('Email không tồn tại')
  },
  password: {
    required: t('Mật khẩu không được để trống'),
    requiredComfirm: t('Xác nhận mật khẩu không được để trống'),
    min: t(`Mật khẩu phải có ít nhất ${MIN_PASSWORD_LENGTH} ký tự`),
    max: t(`Mật khẩu không được quá ${MAX_PASSWORD_LENGTH} ký tự`),
    matches: t('Mật khẩu không khớp'),
    uppercase: t('Mật khẩu phải chứa ít nhất một ký tự in hoa'),
    special: t('Mật khẩu phải chứa ít nhất một ký tự đặc biệt'),
    number: t('Mật khẩu phải chứa ít nhất một số')
  },
  username: {
    required: t('Tên tài khoản không được để trống'),
    max: t(`Tên tài khoản không được quá ${MAX_USERNAME_LENGTH} ký tự`),
    exists: t('Tên tài khoản đã tồn tại')
  },
  firstname: {
    required: t('Họ không được để trống'),
    min: t(`Họ phải có ít nhất ${MIN_FIRSTNAME_LENGTH} ký tự`),
    max: t(`Họ không được quá ${MAX_FIRSTNAME_LENGTH} ký tự`)
  },
  lastname: {
    required: t('Tên không được để trống'),
    max: t(`Tên không được quá ${MAX_FIRSTNAME_LENGTH} ký tự`),
    min: t(`Tên phải có ít nhất ${MIN_LASTNAME_LENGTH} ký tự`)
  },
  dateOfBirth: {
    required: t('Ngày sinh không được để trống')
  },
  gender: {
    required: t('Giới tính không được để trống')
  },
  address: {
    max: t(`Địa chỉ không được quá ${MAX_ADDRESS_LENGTH} ký tự`),
    min: t(`Địa chỉ phải có ít nhất ${MIN_ADDRESS_LENGTH} ký tự`)
  },
  nickname: {
    max: t(`Biệt danh không được quá ${MAX_NICKNAME_LENGTH} ký tự`)
  },
  phone: {
    max: t(`Số điện thoại không được quá ${MAX_PHONE_LENGTH} ký tự`),
    min: t(`Số điện thoại phải có ít nhất 10 ký tự`),
    number: t('Số điện thoại không hợp lệ')
  },
  agreement: {
    required: t('*Bạn phải đồng ý với điều khoản và dịch vụ')
  },
  noWhitespace: t('Không được chứa khoảng trắng'),
  server: t('Đã xảy ra lỗi, vui lòng thử lại sau'),
  invalidCredentials: t('Email hoặc mật khẩu không chính xác'),
  account: {
    required: t('Tên người dùng hoặc email không được để trống'),
    max: t(`Tên người dùng hoặc email không được quá ${MAX_EMAIL_LENGTH} ký tự`)
  },
  code: {
    exp: t('Mã đặt lại không đúng hoặc đã hết hạn'),
    wrongcode: t('Mã không đúng'),
    max: t('Mã đặt lại không quá 6 số'),
    min: t('Mã đặt lại phải có ít nhất 6 số'),
    required: t('Cần phải nhập vào Mã đặt lại')
  },
  province: {
    required: t('Tỉnh/Thành phố không được để trống')
  },
  district: {
    required: t('Quận/Huyện không được để trống')
  },
  ward: {
    required: t('Phường/Xã không được để trống')
  },
  name: {
    required: t('Tên vai trò không được để trống'),
    max: t(`Tên vai trò không được quá ${MAX_FIRSTNAME_LENGTH} ký tự`)
  },
  fullname: {
    required: t('Tên Admin không được để trống'),
    max: t(`Tên Admin không được quá ${MAX_FIRSTNAME_LENGTH} ký tự `)
  },
  category: {
    required: t('Tên danh mục không được để trống'),
    max: t(`Tên danh mục không được quá ${MAX_CATE_NAME_LENGTH} ký tự`),
    min: t(`Tên danh mục phải có ít nhất ${MIN_CATE_NAME_LENGTH} ký tự`)
  },
  type: {
    required: t('Loại danh mục không được để trống')
  },
  icon: {
    required: t('Cần chọn icon cho danh mục')
  },
  budget: {
    number: t('Số tiền không hợp lệ')
  },
  title: {
    required: t('Tiêu đề không được để trống')
  },
  amount: {
    required: t('Số tiền không được để trống'),
    number: t('Số tiền không hợp lệ')
  },
  reportType: {
    required: t('Loại báo cáo không được để trống')
  },
  reportContent: {
    max: t(`Nội dung báo cáo không được quá 200 ký tự`)
  },
  rankName: {
    required: t('Tên hạng không được để trống')
  },
  attendanceScore: {
    required: t('Điểm không được để trống'),
    min: t(`Điểm không được nhỏ hơn ${MIN_NUMBER_LENGTH}`),
    max: t(`Điểm không được lớn hơn ${MAX_NUMBER_LENGTH}`)
  },
  numberOfComment: {
    required: t('Số lượng bình luận không được để trống'),
    min: t(`Số lượng bình luận không được nhỏ hơn ${MIN_NUMBER_LENGTH}`),
    max: t(`Số lượng bình luận không được lớn hơn ${MAX_NUMBER_LENGTH}`)
  },
  numberOfBlog: {
    required: t('Số lượng blog không được để trống'),
    min: t(`Số lượng blog không được nhỏ hơn ${MIN_NUMBER_LENGTH}`),
    max: t(`Số lượng blog không được lớn hơn ${MAX_NUMBER_LENGTH}`)
  },
  numberOfLike: {
    required: t('Số lượng like không được để trống'),
    min: t(`Số lượng like không được nhỏ hơn ${MIN_NUMBER_LENGTH}`),
    max: t(`Số lượng like không được lớn hơn ${MAX_NUMBER_LENGTH}`)
  }
})

export const getLoginValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    account: yup
      .string()
      .required(messages.account.required)
      .max(MAX_EMAIL_LENGTH, messages.account.max)
      .matches(/^\S*$/, messages.noWhitespace),
    password: yup
      .string()
      .min(MIN_PASSWORD_LENGTH, messages.password.min)
      .max(MAX_PASSWORD_LENGTH, messages.password.max)
      .required(messages.password.required)
  })
}

export const getRegisterValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    firstname: yup
      .string()
      .required(messages.firstname.required)
      .min(MIN_FIRSTNAME_LENGTH, messages.firstname.min)
      .max(MAX_FIRSTNAME_LENGTH, messages.firstname.max),
    lastname: yup
      .string()
      .required(messages.lastname.required)
      .max(MAX_FIRSTNAME_LENGTH, messages.lastname.max)
      .min(MIN_LASTNAME_LENGTH, messages.lastname.min),
    email: yup
      .string()
      .email(messages.email.email)
      .required(messages.email.required)
      .max(MAX_EMAIL_LENGTH, messages.email.max)
      .matches(/^\S*$/, messages.noWhitespace),
    password: yup
      .string()
      .min(MIN_PASSWORD_LENGTH, messages.password.min)
      .max(MAX_PASSWORD_LENGTH, messages.password.max)
      .matches(/[A-Z]/, messages.password.uppercase)
      .matches(/[!@#$%^&*]/, messages.password.special)
      .matches(/[0-9]/, messages.password.number)
      .matches(/^\S*$/, messages.noWhitespace)
      .required(messages.password.required),
    comfirmPassword: yup
      .string()
      .oneOf([yup.ref('password')], messages.password.matches)
      .matches(/^\S*$/, messages.noWhitespace)
      .required(messages.password.requiredComfirm),
    agree: yup.boolean().oneOf([true], messages.agreement.required),
    username: yup
      .string()
      .required(messages.username.required)
      .max(MAX_USERNAME_LENGTH, messages.username.max)
      .matches(/^\S*$/, messages.noWhitespace)
  })
}

export const getForgotPasswordValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    email: yup
      .string()
      .email(messages.email.email)
      .required(messages.email.required)
      .max(MAX_EMAIL_LENGTH, messages.email.max)
      .matches(/^\S*$/, messages.noWhitespace)
  })
}

export const getResetPasswordValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    newPassword: yup
      .string()
      .min(MIN_PASSWORD_LENGTH, messages.password.min)
      .max(MAX_PASSWORD_LENGTH, messages.password.max)
      .matches(/[A-Z]/, messages.password.uppercase)
      .matches(/[!@#$%^&*]/, messages.password.special)
      .matches(/[0-9]/, messages.password.number)
      .matches(/^\S*$/, messages.noWhitespace)
      .required(messages.password.required),
    confirmNewPassword: yup
      .string()
      .oneOf([yup.ref('newPassword')], messages.password.matches)
      .matches(/^\S*$/, messages.noWhitespace)
      .required(messages.password.requiredComfirm),
    code: yup
      .string()
      .max(CODE_LENGTH, messages.code.max)
      .min(CODE_LENGTH, messages.code.min)
      .required(messages.code.required)
  })
}

export const getProfileValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    firstname: yup
      .string()
      .required(messages.firstname.required)
      .min(MIN_FIRSTNAME_LENGTH, messages.firstname.min)
      .max(MAX_FIRSTNAME_LENGTH, messages.firstname.max),
    lastname: yup
      .string()
      .required(messages.lastname.required)
      .max(MAX_FIRSTNAME_LENGTH, messages.lastname.max)
      .min(MIN_LASTNAME_LENGTH, messages.lastname.min),
    email: yup
      .string()
      .email(messages.email.email)
      .required(messages.email.required)
      .max(MAX_EMAIL_LENGTH, messages.email.max)
      .matches(/^\S*$/, messages.noWhitespace),
    dateOfBirth: yup.string().required(messages.dateOfBirth.required),
    streetName: yup.string().max(MAX_ADDRESS_LENGTH, messages.address.max),
    phone: yup
      .string()
      .max(MAX_PHONE_LENGTH, messages.phone.max)
      .matches(/^[0-9]*$/, messages.phone.number),
    nickname: yup.string().max(MAX_NICKNAME_LENGTH, messages.nickname.max),
    gender: yup.string().required(messages.gender.required),
    desciption: yup.string().max(MAX_DESCRIPTINO_LENGTH)
  })
}

export const getRoleValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    name: yup.string().required(messages.name.required).max(MAX_FIRSTNAME_LENGTH, messages.name.max)
  })
}

export const getCreateAdminValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    // email: yup
    //   .string()
    //   .email(messages.email.email)
    //   .required(messages.email.required)
    //   .max(MAX_EMAIL_LENGTH, messages.email.max)
    //   .matches(/^\S*$/, messages.noWhitespace),
    // password: yup
    //   .string()
    //   .min(MIN_PASSWORD_LENGTH, messages.password.min)
    //   .max(MAX_PASSWORD_LENGTH, messages.password.max)
    //   .matches(/^\S*$/, messages.noWhitespace)
    //   .required(messages.password.required),
    // comfirmPassword: yup
    //   .string()
    //   .oneOf([yup.ref('password')], messages.password.matches)
    //   .matches(/^\S*$/, messages.noWhitespace)
    //   .required(messages.password.requiredComfirm),
    fullname: yup.string().required(messages.fullname.required).max(MAX_FIRSTNAME_LENGTH, messages.fullname.max),
    roleId: yup.array().required(messages.name.required).min(1, messages.name.required)
  })
}

export const getUpdateAdminValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    email: yup
      .string()
      .email(messages.email.email)
      .required(messages.email.required)
      .max(MAX_EMAIL_LENGTH, messages.email.max)
      .matches(/^\S*$/, messages.noWhitespace),
    fullname: yup.string().required(messages.fullname.required).max(MAX_FIRSTNAME_LENGTH, messages.fullname.max),
    roleId: yup.array().required(messages.name.required).min(1, messages.name.required),
    password: yup
      .string()
      .max(MAX_PASSWORD_LENGTH, messages.password.max)
      .matches(/[A-Z]/, messages.password.uppercase)
      .matches(/[!@#$%^&*]/, messages.password.special)
      .matches(/[0-9]/, messages.password.number)
      .matches(/^\S*$/, messages.noWhitespace)
  })
}

export const getCreateCategoryValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    name: yup
      .string()
      .required(messages.category.required)
      .max(MAX_CATE_NAME_LENGTH, messages.category.max)
      .min(MIN_CATE_NAME_LENGTH, messages.category.min),
    description: yup.string().max(MAX_DESCRIPTINO_LENGTH)
  })
}

export const getCreateLimitSpendingValidationSchema = () => {
  return yup.object().shape({
    budget: yup.number().min(0).required()
  })
}

export const getCreateSpendNoteValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    title: yup.string().required(messages.title.required),
    amount: yup.number().required(messages.amount.required)
  })
}

export const getCreateReportPostValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    reportType: yup.string().required(messages.reportType.required),
    reportContent: yup.string().max(200, messages.reportContent.max)
  })
}

export const getCreateRankValidationSchema = (t: (arg0: string) => any) => {
  const messages = getValidationMessages(t)

  return yup.object().shape({
    rankName: yup.string().required(messages.rankName.required),
    attendanceScore: yup
      .number()
      .required(messages.attendanceScore.required)
      .min(MIN_NUMBER_LENGTH, messages.attendanceScore.min)
      .max(MAX_NUMBER_LENGTH, messages.attendanceScore.max),
    numberOfComment: yup
      .number()
      .required(messages.numberOfComment.required)
      .min(MIN_NUMBER_LENGTH, messages.numberOfComment.min)
      .max(MAX_NUMBER_LENGTH, messages.numberOfComment.max),
    numberOfBlog: yup
      .number()
      .required(messages.numberOfBlog.required)
      .min(MIN_NUMBER_LENGTH, messages.numberOfBlog.min)
      .max(MAX_NUMBER_LENGTH, messages.numberOfBlog.max),
    numberOfLike: yup
      .number()
      .required(messages.numberOfLike.required)
      .min(MIN_NUMBER_LENGTH, messages.numberOfLike.min)
      .max(MAX_NUMBER_LENGTH, messages.numberOfLike.max)
  })
}

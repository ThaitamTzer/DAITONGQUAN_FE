import * as yup from 'yup'

const MAX_EMAIL_LENGTH = 100
const MAX_PASSWORD_LENGTH = 50
const MAX_USERNAME_LENGTH = 50
const MIN_PASSWORD_LENGTH = 5
const CODE_LENGTH = 6

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
    required: t('Tên người dùng không được để trống'),
    max: t(`Tên người dùng không được quá ${MAX_USERNAME_LENGTH} ký tự`)
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

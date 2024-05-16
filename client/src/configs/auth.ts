export default {
  meEndpoint: '/auth/me',
  loginEndpoint: '/auth/login',
  registerEndpoint: '/jwt/register',
  resetPasswordEndpoint: '/jwt/reset-password',
  forgotPasswordEndpoint: '/jwt/forgot-password',
  storageTokenKeyName: 'access_token',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

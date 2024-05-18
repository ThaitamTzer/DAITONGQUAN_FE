export default {
  TOKEN_TYPE: 'Bearer',
  loginEndpoint: '/auth/login',
  logoutEndpoint: '/auth/logout',
  registerEndpoint: '/auth/register',
  resetPasswordEndpoint: '/auth/reset-password',
  forgotPasswordEndpoint: '/auth/forgot-password',
  refreshTokenEndpoint: '/auth/refresh-token',
  getUserInfoEndpoint: '/users/view-profile',
  storageTokenKeyName: 'access_token',
  onTokenExpiration: 'refreshToken' // logout | refreshToken
}

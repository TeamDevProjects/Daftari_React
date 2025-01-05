import axios from 'axios'
import { URL } from '../Constants/Variables'

const authService = {
  saveTokens: (accessToken, refreshToken, IsLogin = true) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    localStorage.setItem('IsLogin', IsLogin)
  },

  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),
  getIsLogin: () => localStorage.getItem('IsLogin'),

  clearTokens: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('IsLogin')
  },

  refreshAccessToken: async () => {
    const refreshToken = authService.getRefreshToken()
    const response = await axios.post(`${URL}/api/Users/refresh-token`, {
      refreshToken,
    })

    const { accessToken, refreshToken: newRefreshToken } = response.data

    authService.saveTokens(accessToken, newRefreshToken)

    return accessToken
  },
}

export default authService

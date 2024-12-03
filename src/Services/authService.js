import axios from 'axios'

import { URL } from './constants'

const authService = {
  saveTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
  },

  getAccessToken: () => localStorage.getItem('accessToken'),
  getRefreshToken: () => localStorage.getItem('refreshToken'),

  clearTokens: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  },

  refreshAccessToken: async () => {
    const refreshToken = authService.getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token available')

    const response = await axios.post(`${URL}/auth/refresh-token`, {
      refreshToken,
    })

    const { accessToken, refreshToken: newRefreshToken } = response.data

    authService.saveTokens(accessToken, newRefreshToken)

    return accessToken
  },
}

export default authService

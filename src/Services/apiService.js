import axios from 'axios'
import authService from './authService'
import { URL } from './constants'

const apiService = axios.create({
  baseURL: URL,
})

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newAccessToken = await authService.refreshAccessToken()
        apiService.defaults.headers[
          'Authorization'
        ] = `Bearer ${newAccessToken}`

        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
        return apiService(originalRequest)
      } catch (refreshError) {
        console.log(refreshError)
        authService.clearTokens()
        window.location.href = '/SignIn'
      }
    }

    return Promise.reject(error)
  }
)

export default apiService

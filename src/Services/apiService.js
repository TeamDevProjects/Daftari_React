import axios from 'axios'
import authService from './authService'
import { URL } from './constants'
import { toast } from 'react-toastify'
import { STATUS_CODES, STATUS_MESSAGES } from '../Constants/statusCodes'

const apiService = axios.create({
  baseURL: URL,
})

apiService.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // Handle 401 Unauthorized: attempt to refresh the access token
    if (
      error.response?.status === STATUS_CODES.UNAUTHORIZED &&
      !originalRequest._retry
    ) {
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
        window.location.href = '/' // Redirect to login page
      }
    }

    // Handle other errors based on status codes
    const status = error.response?.status
    let errorMessage = 'An error occurred'

    // Using switch-case to handle different status codes
    switch (status) {
      case STATUS_CODES.BAD_REQUEST:
        errorMessage = STATUS_MESSAGES[STATUS_CODES.BAD_REQUEST]
        break
      case STATUS_CODES.UNAUTHORIZED:
        errorMessage = STATUS_MESSAGES[STATUS_CODES.UNAUTHORIZED]
        break
      case STATUS_CODES.FORBIDDEN:
        errorMessage = STATUS_MESSAGES[STATUS_CODES.FORBIDDEN]
        break
      case STATUS_CODES.NOT_FOUND:
        errorMessage = STATUS_MESSAGES[STATUS_CODES.NOT_FOUND]
        break
      case STATUS_CODES.INTERNAL_SERVER_ERROR:
        errorMessage = STATUS_MESSAGES[STATUS_CODES.INTERNAL_SERVER_ERROR]
        break
      case STATUS_CODES.SERVICE_UNAVAILABLE:
        errorMessage = STATUS_MESSAGES[STATUS_CODES.SERVICE_UNAVAILABLE]
        break
      default:
        errorMessage = 'Something went wrong. Please try again later.'
        break
    }

    // Show a toast error message
    toast.error(errorMessage)

    return Promise.reject(error)
  }
)

export default apiService

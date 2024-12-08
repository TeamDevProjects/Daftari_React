/* eslint-disable no-useless-catch */

import apiService from './apiService'
import authService from './authService'

const clientServices = {

  GetUserInfo: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(`/api/Users/UserView`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
}
export default clientServices

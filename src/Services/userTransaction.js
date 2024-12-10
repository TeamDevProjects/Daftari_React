// /api/UserTransactions/{userTransactionId}

/* eslint-disable no-useless-catch */
import apiService from './apiService'
import authService from './authService'

const userTransactionServices = {
 
  GetAll: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(`/api/UserTransactions`, {
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
export default userTransactionServices

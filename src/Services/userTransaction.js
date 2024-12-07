// /api/UserTransactions/{userTransactionId}

/* eslint-disable no-useless-catch */
import axios from 'axios'
import { URL } from './constants'
import apiService from './apiService'
import authService from './authService'

const userTransactionServices = {
  UserSignUp2: async (userData) => {
    try {
      const response = await axios.post(`${URL}/api/Users/signup`, userData)
      return response.data
    } catch (error) {
      //
      throw error
    }
  },
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

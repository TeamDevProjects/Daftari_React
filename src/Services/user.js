/* eslint-disable no-useless-catch */
import axios from 'axios'
import { URL } from './constants'
import apiService from './apiService'
import authService from './authService'

const userServices = {
  UserSignUp: async (userData) => {
    try {
      const response = await axios.post(`${URL}/api/Users/signup`, userData)
      return response.data
    } catch (error) {
      //
      throw error
    }
  },
  UserSignIN: async (userData) => {
    try {
      const response = await axios.post(`${URL}/api/Users/login`, userData)
      return response.data
    } catch (error) {
      //
      throw error
    }
  },


  GetClients: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(`/api/Clients`, {
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
export default userServices

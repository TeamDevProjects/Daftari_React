/* eslint-disable no-useless-catch */
import axios from 'axios'
import { URL } from './constants'

const userServices = {
  UserSignUp: async (userData) => {
    try {
      const response = await axios.post(`${URL}/api/Users/signup`, userData)
      return response.data
    } catch (error) {
      throw error
    }
  },
}
export default userServices

/* eslint-disable no-useless-catch */
import apiService from './apiService'
import authService from './authService'

const clientTransactionService = {
  GetAll: async (clientId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/ClientTransactions/clientId/${clientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  GetById: async (clientTransactionId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/ClientTransactions/${clientTransactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  Add: async (clientTransactionData) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.post(
        `/api/ClientTransactions`,
        clientTransactionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  Update: async (clientTransactionData) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.put(
        `/api/ClientTransactions`,
        clientTransactionData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  Delete: async (clientTransactionId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.delete(
        `/api/ClientTransactions/${clientTransactionId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },
}
export default clientTransactionService

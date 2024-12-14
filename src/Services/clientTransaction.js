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

  Add: async ({ amount, notes, ClientId, TransactionTypeId, file }) => {
    try {
      const token = authService.getAccessToken()
      const formData = new FormData()

      formData.append('amount', amount)
      formData.append('notes', notes)
      formData.append('ClientId', ClientId)
      formData.append('TransactionTypeId', TransactionTypeId)

      if (file) {
        formData.append('FormImage', file)
      } else {
        formData.append('ImageType', 'None')
      }

      const response = await apiService.post(
        `/api/ClientTransactions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      return response.data
    } catch (error) {
      throw error
    }
  },

  Update: async ({ amount, notes, TransactionTypeId, file }) => {
    try {
      const token = authService.getAccessToken()
      const formData = new FormData()

      formData.append('amount', amount)
      formData.append('notes', notes)
      formData.append('TransactionTypeId', TransactionTypeId)

      if (file) {
        formData.append('FormImage', file)
      } else {
        formData.append('ImageType', 'None')
      }

      const response = await apiService.put(
        `/api/ClientTransactions`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
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

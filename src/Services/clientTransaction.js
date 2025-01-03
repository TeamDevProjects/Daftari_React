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

  Add: async ({ amount, notes, clientId, transactionTypeId, file }) => {
    try {
      const token = authService.getAccessToken()
      const formData = new FormData()

      formData.append('amount', amount)
      formData.append('notes', notes)
      formData.append('clientId', clientId)
      formData.append('transactionTypeId', transactionTypeId)

      if (file) {
        formData.append('formImage', file)
      } else {
        formData.append('imageType', null)
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

  Update: async (
    { amount, notes, file },
    clientTransactionId
  ) => {
    try {
      const token = authService.getAccessToken()
      const formData = new FormData()

      formData.append('amount', amount)
      formData.append('notes', notes)
      formData.append('clientTransactionId', clientTransactionId)

      formData.append('FormImage', file)

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

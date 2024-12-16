/* eslint-disable no-useless-catch */
import apiService from './apiService'
import authService from './authService'

const SupplierTransactionService = {
  GetAll: async (SupplierId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/SupplierTransactions/SupplierId/${SupplierId}`,
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

  GetById: async (SupplierTransactionId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/SupplierTransactions/${SupplierTransactionId}`,
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
        `/api/SupplierTransactions`,
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
        `/api/SupplierTransactions`,
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

  Delete: async (SupplierTransactionId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.delete(
        `/api/SupplierTransactions/${SupplierTransactionId}`,
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
export default SupplierTransactionService
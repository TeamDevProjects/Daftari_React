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

  Add: async (SupplierTransactionData) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.post(
        `/api/SupplierTransactions`,
        SupplierTransactionData,
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

  Update: async (SupplierTransactionData) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.put(
        `/api/SupplierTransactions`,
        SupplierTransactionData,
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

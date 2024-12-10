/* eslint-disable no-useless-catch */
import apiService from './apiService'
import authService from './authService'

const supplierPaymentDateService = {
  Add: async (supplierPaymentDateData) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.post(
        `/api/SupplierPaymentDates`,
        supplierPaymentDateData,
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
  Update: async (supplierPaymentDateData, supplierPaymentDateId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.put(
        `/api/SupplierPaymentDates/${supplierPaymentDateId}`,
        supplierPaymentDateData,
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

  Delete: async (supplierPaymentDateId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.delete(
        `/api/SupplierPaymentDates/${supplierPaymentDateId}`,
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

  GetBySupplierId: async (supplierId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/SupplierPaymentDates/View/SupplierId/${supplierId}`,
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
  GetById: async (supplierPaymentDateId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/SupplierPaymentDates/${supplierPaymentDateId}`,
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
  GetToDay: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(`/api/SupplierPaymentDates/today`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  GetCloser: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(`/api/SupplierPaymentDates/closer`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  GetOld: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(`/api/SupplierPaymentDates/old`, {
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
export default supplierPaymentDateService

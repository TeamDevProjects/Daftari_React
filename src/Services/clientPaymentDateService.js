/* eslint-disable no-useless-catch */
import apiService from './apiService'
import authService from './authService'

const clientPaymentDateService = {
  Add: async (clientPaymentDateData) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.post(
        `/api/ClientPaymentDates`,
        clientPaymentDateData,
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
  Update: async (clientPaymentDateData, clientPaymentDateId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.put(
        `/api/ClientPaymentDates/${clientPaymentDateId}`,
        clientPaymentDateData,
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

  Delete: async (clientPaymentDateId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.delete(
        `/api/ClientPaymentDates/${clientPaymentDateId}`,
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

  GetByClientId: async (clientId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/ClientPaymentDates/View/clientId/${clientId}`,
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
  GetById: async (clientPaymentDateId) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/ClientPaymentDates/${clientPaymentDateId}`,
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
      const response = await apiService.get(`/api/ClientPaymentDates/today`, {
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
      const response = await apiService.get(`/api/ClientPaymentDates/closer`, {
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
      const response = await apiService.get(`/api/ClientPaymentDates/old`, {
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
export default clientPaymentDateService

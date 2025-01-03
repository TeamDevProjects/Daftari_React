/* eslint-disable no-useless-catch */

import apiService from './apiService'
import authService from './authService'

const clientServices = {
  GetAll: async () => {
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
  GetAllOrderByName: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(`/api/Clients/orderBy/Name`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  GetAllOrderByOldPaymentDates: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/Clients/orderBy/OlderPaymentDates`,
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
  GetAllOrderByCloserPaymentDates: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/Clients/orderBy/CloserPaymentDates`,
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
  GetAllOrderByLargestTotalAmount: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/Clients/orderBy/LargestTotalAmount`,
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
  GetAllOrderBySmallestTotalAmount: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(
        `/api/Clients/orderBy/SmallestTotalAmount`,
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
  SearchByName: async (temp) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(`/api/Clients/search/${temp}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  Add: async (clientData) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.post(`/api/Clients`, clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  Update: async (clientData, id) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.put(`/api/Clients/${id}`, clientData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  Delete: async (id) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.delete(`/api/Clients/${id}`, {
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
export default clientServices

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
      const response = await apiService.get(`/api/Clients/orderByName`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
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

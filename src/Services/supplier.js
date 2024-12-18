/* eslint-disable no-useless-catch */
import apiService from './apiService'
import authService from './authService'

const SupplierServices = {
  GetAll: async () => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.get(`/api/Suppliers`, {
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
      const response = await apiService.get(`/api/Suppliers/orderByName`, {
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
      const response = await apiService.get(`/api/Suppliers/search/${temp}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  Add: async (SupplierData) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.post(`/api/Suppliers`, SupplierData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  Update: async (SupplierData, id) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.put(
        `/api/Suppliers/${id}`,
        SupplierData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      return response.data
    } catch (error) {
      console.log(error)
      throw error
    }
  },
  Delete: async (id) => {
    try {
      const token = authService.getAccessToken()
      const response = await apiService.delete(`/api/Suppliers/${id}`, {
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
export default SupplierServices

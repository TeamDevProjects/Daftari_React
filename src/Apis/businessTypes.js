import axios from 'axios'

const URL = 'https://localhost:7264'

export const GetBusinessTypes = async () => {
  try {
    const response = await axios.get(`${URL}/api/BusinessTypes`)
    return response.data
  } catch (error) {
    //throw error;
  }
}

export const GetSectors = async () => {
  try {
    const response = await axios.get(`${URL}/api/Sectors`)
    return response.data
  } catch (error) {
    //throw error;
  }
}

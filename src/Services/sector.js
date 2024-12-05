import axios from 'axios'

import { URL } from './constants'

export const GetSectors = async () => {
  try {
    const response = await axios.get(`${URL}/api/Sectors`)
    return response.data
  } catch (error) {
    //throw error;
  }
}

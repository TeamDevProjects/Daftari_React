import axios from 'axios'

import { URL } from '../Constants/Variables'

export const GetBusinessTypes = async () => {
  try {
    const response = await axios.get(`${URL}/api/BusinessTypes`)
    return response.data
  } catch {
    // throw error;
  }
}


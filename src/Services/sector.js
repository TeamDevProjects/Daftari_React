import axios from 'axios'

import { URL } from '../Constants/Variables'

export const GetSectors = async () => {
  try {
    const response = await axios.get(`${URL}/api/Sectors`)
    return response.data
  } catch  {
    //throw error;
  }
}

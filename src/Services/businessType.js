import axios from 'axios'

import {URL} from "./constants"

export const GetBusinessTypes = async () => {
  try {
    const response = await axios.get(`${URL}/api/BusinessTypes`)
    return response.data
  } catch (error) {
    //throw error;
  }
}


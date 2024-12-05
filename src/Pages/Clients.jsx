import axios from 'axios'
import { useLoaderData } from 'react-router-dom'

// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    throw new Response('Unauthorized', { status: 401 })
  }

  try {
    const response = await axios.get('https://localhost:7264/api/Clients', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    return { Clients: response.data } // Returning Clients data from API
  } catch {
    throw new Response('Failed to fetch Clients')
  }
}

const Clients = () => {
  const { Clients } = useLoaderData()

  // Render suppliers if data is available
  return <div>{Clients.map((supplier) => console.log(supplier))}</div>
}

export default Clients

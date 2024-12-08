import axios from 'axios'
import { useLoaderData } from 'react-router-dom'
import { SearchForm } from '../components'
import { useUser } from '../Context/userContext'
import { handelDateTimeFormate } from '../assets/Utilities/date'
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
  const { OpenModal } = useUser()

  const columns = [
    'ClientId',
    'Name',
    'Country',
    'City',
    'Address',
    'Phone',
    'Date of payment',
    'Total amount',
    'Payment Method Name',
    'Actions',
  ]

  // Render suppliers if data is available
  return (
    <>
      <SearchForm />
      <div className="table-wrapper">
        {Clients && Clients.length > 0 ? (
          <table border="1" style={{ width: '100%', textAlign: 'left' }}>
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Clients.map((client) => (
                <tr key={client.clientId || '-'}>
                  <td>{client.clientId || '-'}</td>
                  <td>{client.name || '-'}</td>
                  <td>{client.country || '-'}</td>
                  <td>{client.city || '-'}</td>
                  <td>{client.address || '-'}</td>
                  <td>{client.phone || '-'}</td>
                  <td>{handelDateTimeFormate(client.dateOfPayment) || '-'}</td>
                  <td>{client.totalAmount || '-'}</td>
                  <td>{client.paymentMethodName || '-'}</td>
                  <td>
                    <button
                      /* onClick={} */
                      style={{
                        marginRight: '5px',
                        backgroundColor: '#00b894',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                      }}
                    >
                      Update
                    </button>
                    <button
                      /*  onClick={} */
                      style={{
                        backgroundColor: '#d63031',
                        color: 'white',
                        border: 'none',
                        padding: '5px 10px',
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No Clients found.</p>
        )}
      </div>
      <div className="center">
        <button className="btn clear-btn" onClick={() => OpenModal()}>
          Add Client
        </button>
      </div>
    </>
  )
}

export default Clients

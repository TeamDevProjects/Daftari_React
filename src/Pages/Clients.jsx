import { useLoaderData } from 'react-router-dom'
import { Modal, SearchForm } from '../components'
import { handelDateTimeFormate } from '../assets/Utilities/date'
import clientServices from '../Services/client.js'
import { useState } from 'react'
import AddEditPaymentDateForm from '../components/Forms/AddEditPaymentDateForm'
import { toast } from 'react-toastify'
// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    throw new Response('Unauthorized', { status: 401 })
  }

  try {
    const results = await clientServices.GetAll()

    return { Clients: results } // Returning Clients data from API
  } catch {
    throw new Response('Failed to fetch Clients')
  }
}

const Clients = () => {
  const { Clients } = useLoaderData()
  const [isModalOpen, setModalOpen] = useState(false)

  const [mode, setMode] = useState('Add')

  const handelAddClientModal = () => {
    setMode('Add')
    handleOpenModal()
  }

  const handelUpdateClientModal = () => {
    setMode('Update')
    handleOpenModal()
  }
  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleSubmit = (client) => {
    if (mode == 'Add') {
      console.log('Add Client', client)
      toast.success('Client Added Successfully')
      return
    }
    // Update
    console.log('Edit Client', client)
    toast.success('Client Updated Successfully')
    setModalOpen(false)
  }

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
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditPaymentDateForm
          onSubmit={handleSubmit}
          title={'client'}
          buttonText={'Client'}
          mode={mode} // 'Add' 'Update'
        />
      </Modal>

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
                      onClick={handelUpdateClientModal}
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
        <button className="btn " onClick={handelAddClientModal}>
          Add Client
        </button>
      </div>
    </>
  )
}

export default Clients

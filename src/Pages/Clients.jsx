import { Link, useLoaderData } from 'react-router-dom'
import { Modal, SearchForm } from '../components'
import {
  handelDateFormate,
  handelDateTimeFormate,
} from '../assets/Utilities/date'
import { MdDelete, MdOutlineSettingsInputComponent } from 'react-icons/md'
import { FaUserEdit } from 'react-icons/fa'
import clientServices from '../Services/client.js'
import { useEffect, useState } from 'react'
import AddEditPersonForm from '../components/Forms/AddEditPersonForm'
import { toast } from 'react-toastify'
import PdfReportGenerator from '../components/Reports/PdfReportGenerator.jsx'
import { CiCalendarDate } from 'react-icons/ci'
import { IoIosAdd } from 'react-icons/io'
import { ReportPeopleColumns } from '../Constants/ReportColumns.js'
import { PeopleColumns } from '../Constants/TablesColumns.js'
import PdfFilteredReportGenerator from '../components/Reports/pdfFilteredReportGenerator.jsx'
import { LuDollarSign } from 'react-icons/lu'
import FilterPersonForm from '../components/Forms/FilterPersonForm.jsx'
import NoContent from '../components/NoContent.jsx'
// eslint-disable-next-line react-refresh/only-export-components
export const loader = async () => {
  const accessToken = localStorage.getItem('accessToken')
  if (!accessToken) {
    throw new Response('Unauthorized', { status: 401 })
  }

  try {
    const results = await clientServices.GetAll()
    console.log('results', results)
    return { Clients: results }
  } catch {
    return { Clients: [] }
  }
}

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }) => {
  try {
    const formData = await request.formData()
    const data = Object.fromEntries(formData)

    // Determine the method (supports PUT override via _method)
    const method = formData.get('_method') || request.method.toLowerCase()

    if (method === 'post') {
      // Handle the 'add' operation
      const createdItem = await clientServices.Add(data)
      return { status: 201, message: 'Item added successfully', createdItem }
    } else if (method === 'put') {
      // Handle the 'update' operation
      const id = data.id // Dynamically get ID
      const updatedItem = await clientServices.Update(data, id)
      return { status: 200, message: 'Item updated successfully', updatedItem }
    } else {
      return { status: 405, message: 'Method not allowed' }
    }
  } catch (error) {
    console.error('Error in action function:', error)
    return { status: 500, message: 'An error occurred', error: error.message }
  }
}

const Clients = () => {
  const { Clients } = useLoaderData()

  const [clientsState, setClients] = useState(Clients || [])
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalWithdraw, setTotalWithdraw] = useState(0)
  const [mode, setMode] = useState('Add')
  const [method, setMethod] = useState('post')
  const [isModalOpen, setModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleSearch = async (query) => {
    if (!query) {
      setClients(Clients) // Reset to the original list when the query is empty
      return
    }

    try {
      setIsLoading(true)
      const results = await clientServices.SearchByName(query) // Call API to search by name
      setClients(results)
      setIsLoading(false)
    } catch (error) {
      console.error('Error searching suppliers:', error)
      toast.error('Failed to search suppliers.')
      setIsLoading(false)
    }
  }

  const handelAddClientModal = () => {
    setMode('Add')
    setMethod('post')
    handleOpenModal()
  }

  const handelUpdateClientModal = () => {
    setMode('Update')
    setMethod('put')
    handleOpenModal()
  }
  const handleOpenModal = () => {
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  const handleSubmit = async (client) => {
    try {
      if (mode === 'Add') {
        const newClient = await clientServices.Add(client)
        setClients((prevClients) => [...prevClients, newClient])
        toast.success('Client Added Successfully')
      } else if (mode === 'Update') {
        const updatedClient = await clientServices.Update(client)
        setClients((prevClients) =>
          prevClients.map((c) =>
            c.clientId === updatedClient.clientId ? updatedClient : c
          )
        )
        toast.success('Client Updated Successfully')
      }
      setModalOpen(false)
    } catch (error) {
      console.error('Error saving client:', error)
      toast.error('Failed to save client.')
    }
  }

  const handelOpenFilterModel = () => {
    setIsFilterModalOpen(true)
  }

  const handelCloseFilterModel = () => {
    setIsFilterModalOpen(false)
  }

  const handelSubmitFilter = async (filterBy) => {
    console.log(filterBy)

    if (filterBy === 'orderByName') {
      const results = await clientServices.GetAllOrderByName()
      console.log(results)
      if (Array.isArray(results) && results.length > 0) {
        setClients(results)
        console.log('filtering')
      }
    } else if (filterBy === 'default') {
      setClients(Clients)
    }
  }

  const formatReportRows = (data) =>
    data?.map((r) => [
      r?.clientId || '-',
      r?.name || '-',
      r?.country || '-',
      r?.city || '-',
      r?.address || '-',
      r?.phone || '-',
      handelDateFormate(r?.dateOfPayment) || '-',
      r?.totalAmount ? `$${r?.totalAmount.toFixed(2)}` : '-',
      r?.paymentMethodName || '-',
    ])

  const ReportRows = formatReportRows(Clients)
  const ReportFilterRows = formatReportRows(clientsState)

  useEffect(() => {
    const calculateTotals = () => {
      if (!Clients) return

      const totalPaymentResult = Clients.reduce(
        (total, client) =>
          client.totalAmount >= 0 ? total + client.totalAmount : total,
        0
      )

      const totalWithdrawResult = Clients.reduce(
        (total, client) =>
          client.totalAmount < 0 ? total + client.totalAmount : total,
        0
      )

      setTotalPayment(totalPaymentResult)
      setTotalWithdraw(totalWithdrawResult)
    }

    calculateTotals()
    setIsLoading(false)
  }, [Clients])

  const handleDeleteClient = async (clientId) => {
    try {
      await clientServices.Delete(clientId)
      setClients((prevClients) =>
        prevClients.filter((client) => client.clientId !== clientId)
      )
      toast.success('Client deleted successfully.')
    } catch (error) {
      console.error('Error deleting client:', error)
      toast.error('Failed to delete client.')
    }
  }

  if (isLoading) {
    return <p>Loading...</p>
  }

  return (
    <>
      {/* ==[ Add / Edit Clients]== */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditPersonForm
          onSubmit={handleSubmit}
          title={'client'}
          buttonText={'Client'}
          mode={mode}
          method={method}
        />
      </Modal>

      {/* == [ Filter Clients]== */}
      <Modal isOpen={isFilterModalOpen} onClose={handelCloseFilterModel}>
        <FilterPersonForm
          title={'Clients Ordering'}
          onSubmit={handelSubmitFilter}
        />
      </Modal>
      <div className="page-section">
        <div className="flex center amount-container">
          <div className="red-box">
            <span className="amount-message">To Me</span>
            <div className="amount red">
              <LuDollarSign />
              <span className="red">{totalWithdraw || '00'}</span>
            </div>
          </div>
          <div className="line"></div>
          <div className="green-box">
            <span className="amount-message">For Me</span>
            <div className="amount green">
              <LuDollarSign />
              <span className="">{totalPayment || '00'}</span>
            </div>
          </div>
        </div>
        <div className="flex center mb-1">
          <PdfReportGenerator
            title={`Client Report`}
            subtitle={`Generated on: ${handelDateTimeFormate(new Date())}`}
            columns={ReportPeopleColumns}
            rows={ReportRows}
            footer={'Generated by Daftari Management System'}
          />
          <Link to="ClientsPaymentDates">
            <button className="btn btn-paymentdate">
              <CiCalendarDate />
              <span>Payment Dates</span>
            </button>
          </Link>
        </div>
      </div>
      <div className="page-section">
        <div className="flex">
          <PdfFilteredReportGenerator
            title={`Client Report`}
            subtitle={`Generated on: ${handelDateTimeFormate(new Date())}`}
            columns={ReportPeopleColumns}
            rows={ReportFilterRows}
            footer={'Generated by Daftari Management System'}
          />
          <div className="btn btn-add" onClick={handelOpenFilterModel}>
            <MdOutlineSettingsInputComponent />
          </div>
          <button className="btn btn-add" onClick={handelAddClientModal}>
            <IoIosAdd />
            <span>Add Client</span>
          </button>
          <div className="" style={{ flex: 4 }}>
            <SearchForm onSubmit={handleSearch} />
          </div>
        </div>

        <div className="table-wrapper">
          {clientsState && clientsState.length > 0 && (
            <table border="1" style={{ width: '100%', textAlign: 'left' }}>
              <thead>
                <tr>
                  {PeopleColumns.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clientsState?.map((client) => (
                  <tr key={client?.clientId || '-'}>
                    <td>{client?.clientId || '-'}</td>
                    <td>
                      <Link to={`ClientsTransactions/${client?.clientId}`}>
                        {client?.name || '-'}
                      </Link>
                    </td>
                    <td>{client?.country || '-'}</td>
                    <td>{client?.city || '-'}</td>
                    <td>{client?.address || '-'}</td>
                    <td>{client?.phone || '-'}</td>
                    <td>{handelDateFormate(client?.dateOfPayment) || '-'}</td>
                    <td>{client?.totalAmount || '-'}</td>
                    <td>{client?.paymentMethodName || '-'}</td>
                    <td>
                      <div className="flex">
                        <button
                          style={{
                            marginRight: '5px',
                            backgroundColor: '#00b894',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                          }}
                          onClick={handelUpdateClientModal}
                        >
                          <FaUserEdit />
                        </button>
                        <button
                          style={{
                            backgroundColor: '#d63031',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                          }}
                          onClick={() => handleDeleteClient(client?.clientId)}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {clientsState.length == 0 && <NoContent text="No Clients found." />}
      </div>
    </>
  )
}

export default Clients

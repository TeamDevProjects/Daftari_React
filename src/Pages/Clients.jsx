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

// eslint-disable-next-line react-refresh/only-export-components
export const action = async ({ request }) => {
  const formData = await request.formData()
  const data = Object.fromEntries(formData)
}

const Clients = () => {
  const { Clients } = useLoaderData()
  const [isModalOpen, setModalOpen] = useState(false)
  const [totalPayment, setTotalPayment] = useState(0)
  const [totalWidthdrol, setTotalWidthdrol] = useState(0)

  const [mode, setMode] = useState('Add')
  const [method, setMethod] = useState('post')

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

  const ReportRows = Clients.map((r) => [
    r.clientId || '-', // ID
    r.name || '-', // Name
    r.country || '-', // Country
    r.city || '-', // City
    r.address || '-', // Address
    r.phone || '-', // Phone
    handelDateFormate(r.dateOfPayment) || '-', // Payment Date
    r.totalAmount ? `$${r.totalAmount.toFixed(2)}` : '-', // Amount, formatted as currency
    r.paymentMethodName || '-', // Payment Method
  ])

  useEffect(() => {
    if (!Clients) return
    let totalwidthdrolResult = 0
    let totalPaymentResult = 0
    const totalPaymentArr = Clients.filter((c) => c.totalAmount >= 0)

    if (totalPaymentArr.length > 0) {
      totalPaymentResult = totalPaymentArr.reduce(
        (prev, curr) => prev.totalAmount + curr.totalAmount
      )
    }

    setTotalPayment(totalPaymentResult)

    const TotalWidthdrolArr = Clients.filter((c) => c.totalAmount < 0)

    if (TotalWidthdrolArr.length > 0) {
      totalwidthdrolResult = TotalWidthdrolArr.reduce(
        (prev, curr) => prev.totalAmount + curr.totalAmount
      )
      setTotalWidthdrol(totalwidthdrolResult)
    }
  }, [])

  console.log('totalPayment', totalPayment)
  console.log('totalWidthdrol', totalWidthdrol)

  // Render suppliers if data is available
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddEditPersonForm
          onSubmit={handleSubmit}
          title={'client'}
          buttonText={'Client'}
          mode={mode} // 'Add' 'Update'
          method={method}
        />
      </Modal>
      <div className="page-section">
        <div className="flex center amount-container">
          <div className="red-box">
            <span className="amount-message">To Me</span>
            <div className="amount red">
              <LuDollarSign />
              <span className="red">{totalWidthdrol || '00'}</span>
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
          <button className="btn btn-paymentdate">
            <CiCalendarDate />
            <Link to="ClientsPaymentDates">Payment Dates</Link>
          </button>
        </div>
      </div>
      <div className="page-section">
        <div className="flex">
          <PdfFilteredReportGenerator
            title={`Client Report`}
            subtitle={`Generated on: ${handelDateTimeFormate(new Date())}`}
            columns={ReportPeopleColumns}
            rows={ReportRows}
            footer={'Generated by Daftari Management System'}
          />
          <div className="btn btn-add">
            <MdOutlineSettingsInputComponent />
          </div>
          <button className="btn btn-add" onClick={handelAddClientModal}>
            <IoIosAdd />
            <span>Add Client</span>
          </button>
          <div className="" style={{ flex: 4 }}>
            <SearchForm />
          </div>
        </div>

        <div className="table-wrapper">
          {Clients && Clients.length > 0 ? (
            <table border="1" style={{ width: '100%', textAlign: 'left' }}>
              <thead>
                <tr>
                  {PeopleColumns.map((col, index) => (
                    <th key={index}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Clients.map((client) => (
                  <tr key={client.clientId || '-'}>
                    <td>{client.clientId || '-'}</td>
                    <td>
                      <Link to={`ClientsTransactions/${client.clientId}`}>
                        {client.name || '-'}
                      </Link>
                    </td>
                    <td>{client.country || '-'}</td>
                    <td>{client.city || '-'}</td>
                    <td>{client.address || '-'}</td>
                    <td>{client.phone || '-'}</td>
                    <td>{handelDateFormate(client.dateOfPayment) || '-'}</td>
                    <td>{client.totalAmount || '-'}</td>
                    <td>{client.paymentMethodName || '-'}</td>
                    <td>
                      <div className="flex">
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
                          <FaUserEdit />
                        </button>
                        <button
                          onClick={clientServices.Delete(client.clientId)}
                          style={{
                            backgroundColor: '#d63031',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                          }}
                        >
                          <MdDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No Clients found.</p>
          )}
        </div>
      </div>
    </>
  )
}

export default Clients
